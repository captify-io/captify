"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCaptify } from "@captify-io/base/layout";
import { usePageContext } from "@captify-io/base/context/page-context";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { ProjectHeader } from "./project-header";
import { ProjectProperties } from "./project-properties";
import { CommentThread } from "./comment-thread";
import { ActivityFeed } from "@/components/activity-feed";
import type { WorkspaceProject } from "@captify-io/workspace/types";

// Dynamically import Fabric to avoid SSR issues
const ProseMirrorEditor = dynamic(
  () => import("@captify-io/fabric/client").then((mod) => ({ default: mod.ProseMirrorEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    ),
  }
);

interface Initiative {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export default function ProjectOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const initiativeId = params.initiativeId as string;
  const projectId = params.projectId as string;
  const { workspace, session } = useCaptify();
  const { setPageContext } = usePageContext();

  const [initiative, setInitiative] = useState<Initiative | null>(null);
  const [project, setProject] = useState<WorkspaceProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initiative and project data
  useEffect(() => {
    if (initiativeId && projectId && workspace?.id) {
      loadData();
    }
  }, [initiativeId, projectId, workspace?.id]);

  // Set page context when initiative and project are loaded
  useEffect(() => {
    if (initiative && project) {
      setPageContext({
        title: initiative.name,
        projectIcon: initiative.icon,
        projectColor: initiative.color,
        hideMainMenu: true,
        onClose: () => router.push(`/workspace/initiatives/${initiativeId}/projects`),
        navButtons: [
          {
            id: "overview",
            label: "Overview",
            onClick: () => router.push(`/workspace/initiatives/${initiativeId}/projects/${projectId}/overview`),
            isActive: true,
          },
          {
            id: "issues",
            label: "Issues",
            onClick: () => router.push(`/workspace/initiatives/${initiativeId}/projects/${projectId}/issues`),
            isActive: false,
          },
          {
            id: "updates",
            label: "Updates",
            onClick: () => router.push(`/workspace/initiatives/${initiativeId}/projects/${projectId}/updates`),
            isActive: false,
          },
        ],
      });
    }
  }, [initiative, project, initiativeId, projectId]);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      // Load initiative
      const initResponse = await fetch("/api/captify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          app: "ontology",
          operation: "getItem",
          data: {
            type: "workspace-initiative",
            id: initiativeId,
          },
        }),
      });

      const initResult = await initResponse.json();
      if (initResult.success && initResult.data) {
        setInitiative(initResult.data);
      }

      // Load project
      const response = await fetch("/api/captify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          app: "ontology",
          operation: "getItem",
          data: {
            type: "workspace-project",
            id: projectId,
          },
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setProject(result.data);
      } else {
        setError("Failed to load project");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  // Handle project property updates
  const handleUpdateProject = useCallback(
    async (updates: Partial<WorkspaceProject>) => {
      if (!project) return;

      try {
        const response = await fetch("/api/captify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            app: "ontology",
            operation: "updateItem",
            data: {
              type: "workspace-project",
              id: projectId,
              item: {
                ...updates,
                updatedAt: new Date().toISOString(),
                updatedBy: session?.user?.id,
              },
            },
          }),
        });

        const result = await response.json();

        if (result.success && result.data) {
          setProject(result.data);
        }
      } catch (err: any) {
        console.error("Failed to update project:", err);
      }
    },
    [project, projectId, session?.user?.id]
  );

  // Handle Fabric editor save
  const handleSaveDescription = useCallback(
    async (doc: any, version: number) => {
      if (!project) return;

      // Extract plain text for search
      let description = "";
      const traverse = (node: any) => {
        if (node.type === "text") {
          description += node.text || "";
        }
        if (node.content && Array.isArray(node.content)) {
          node.content.forEach(traverse);
        }
      };
      if (doc?.content) {
        traverse(doc);
      }

      await handleUpdateProject({
        doc,
        docVersion: version,
        description: description.trim(),
      });
    },
    [handleUpdateProject, project]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading project...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        {error || "Project not found"}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8 space-y-8">
          {/* Project Header (Title & Subtitle) */}
          <ProjectHeader
            project={project}
            onUpdate={handleUpdateProject}
          />

          {/* Property Buttons */}
          <ProjectProperties
            project={project}
            onUpdate={handleUpdateProject}
          />

          {/* Divider */}
          <div className="border-t" />

          {/* Description Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Description</h2>

            <ProseMirrorEditor
              noteId={`project-${projectId}`}
              spaceId={workspace?.id || ""}
              initialDoc={project.doc || {
                type: "doc",
                content: [
                  {
                    type: "paragraph",
                    content: project.description
                      ? [{ type: "text", text: project.description }]
                      : [],
                  },
                ],
              }}
              initialVersion={project.docVersion || 0}
              onSave={handleSaveDescription}
              placeholder="Add a project description... Use @ to mention people, ![[entity]] to link to other entities"
              enableComments={false}
              enableOntologyRefs={true}
              enableMentions={true}
            />
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Comments Section */}
          <CommentThread
            entityId={projectId}
            entityType="workspace-project"
            workspaceId={workspace?.id || ""}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l bg-muted/10 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">Progress</h3>
            <div className="text-2xl font-bold">{project.progress || 0}%</div>
            <div className="h-2 bg-muted rounded-full mt-2">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Details</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium capitalize">{project.status}</dd>
              </div>
              {project.startDate && (
                <div>
                  <dt className="text-muted-foreground">Start Date</dt>
                  <dd className="font-medium">
                    {new Date(project.startDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {project.targetDate && (
                <div>
                  <dt className="text-muted-foreground">Target Date</dt>
                  <dd className="font-medium">
                    {new Date(project.targetDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {project.leadId && (
                <div>
                  <dt className="text-muted-foreground">Lead</dt>
                  <dd className="font-medium">{project.leadId}</dd>
                </div>
              )}
            </dl>
          </div>

          {project.teamIds && project.teamIds.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Teams</h3>
              <div className="space-y-1">
                {project.teamIds.map((teamId) => (
                  <div key={teamId} className="text-sm">
                    {teamId}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-2">Timestamps</h3>
            <dl className="space-y-2 text-xs text-muted-foreground">
              <div>
                <dt>Created</dt>
                <dd>{new Date(project.createdAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{new Date(project.updatedAt).toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Activity</h3>
            <ActivityFeed
              entityId={projectId}
              limit={20}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
