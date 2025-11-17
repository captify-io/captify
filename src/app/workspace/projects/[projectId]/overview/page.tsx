"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCaptify } from "@captify-io/base";
import { usePageContext } from "@captify-io/base";
import { Input, Button, Avatar, AvatarFallback } from "@captify-io/base/ui";
import { Loader2, ClipboardList, MessageSquare, CheckSquare2, Users } from "lucide-react";
import dynamic from "next/dynamic";
import type { WorkspaceProject, IssueComment } from "@captify-io/workspace/types";
import { ProjectProperties, ActivityFeed } from "@captify-io/workspace/client";
import { apiClient } from "@captify-io/base";

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

// ============================================================================
// ProjectHeader Component (inline to avoid circular dependency with Fabric)
// ============================================================================

interface ProjectHeaderProps {
  project: WorkspaceProject;
  onUpdate: (updates: Partial<WorkspaceProject>) => void;
}

function ProjectHeader({ project, onUpdate }: ProjectHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(project.name);

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (name !== project.name && name.trim()) {
      onUpdate({ name: name.trim() });
    } else {
      setName(project.name);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNameBlur();
    } else if (e.key === "Escape") {
      setName(project.name);
      setIsEditingName(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Title */}
      {isEditingName ? (
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameBlur}
          onKeyDown={handleNameKeyDown}
          className="text-4xl font-bold border-none px-0 focus-visible:ring-0"
          autoFocus
        />
      ) : (
        <h1
          className="text-4xl font-bold cursor-pointer hover:text-primary transition-colors"
          onClick={() => setIsEditingName(true)}
        >
          {project.name}
        </h1>
      )}

      {/* Subtitle - Editable description summary */}
      <p className="text-lg text-muted-foreground">
        {project.description
          ? project.description.slice(0, 150) + (project.description.length > 150 ? "..." : "")
          : "Add a description below to get started"}
      </p>
    </div>
  );
}

// ============================================================================
// CommentThread Component (inline to avoid circular dependency with Fabric)
// ============================================================================

interface CommentThreadProps {
  entityId: string;
  entityType: string;
  workspaceId: string;
}

function CommentThread({ entityId, entityType, workspaceId }: CommentThreadProps) {
  const { session } = useCaptify();
  const [comments, setComments] = useState<IssueComment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showCommentEditor, setShowCommentEditor] = useState(false);

  // Load comments
  useEffect(() => {
    loadComments();
  }, [entityId]);

  async function loadComments() {
    try {
      const response = await apiClient.run({
        app: 'ontology',
        operation: 'queryItems',
        data: {
          type: 'workspace-issue-comment',
          keyCondition: {
            issueId: entityId,
          },
          index: 'issueId-createdAt-index',
          limit: 100,
          sortAscending: true,
        },
      });

      if (response.success && response.data?.items) {
        setComments(response.data.items as IssueComment[]);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  }

  const handleSaveComment = useCallback(
    async (doc: any) => {
      if (!session?.user?.id) return;

      setSubmitting(true);
      try {
        const comment = {
          issueId: entityId,
          userId: session.user.id,
          doc,
          content: extractTextFromDoc(doc),
          isInternal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const response = await apiClient.run({
          app: 'ontology',
          operation: 'createItem',
          data: {
            type: 'workspace-issue-comment',
            item: comment,
          },
        });

        if (response.success) {
          await loadComments();
          setShowCommentEditor(false);
        }
      } catch (err) {
        console.error("Failed to create comment:", err);
      } finally {
        setSubmitting(false);
      }
    },
    [entityId, session?.user?.id]
  );

  // Helper to extract text from ProseMirror doc
  function extractTextFromDoc(doc: any): string {
    let text = '';
    const traverse = (node: any) => {
      if (node.type === 'text') {
        text += node.text || '';
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };
    if (doc?.content) {
      traverse(doc);
    }
    return text.trim();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getUserInitials = (userId: string) => {
    return userId.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Comments
          {comments.length > 0 && (
            <span className="text-muted-foreground text-lg">({comments.length})</span>
          )}
        </h2>

        {!showCommentEditor && (
          <Button onClick={() => setShowCommentEditor(true)}>
            Add Comment
          </Button>
        )}
      </div>

      {/* Comment List */}
      {comments.length === 0 && !showCommentEditor ? (
        <div className="text-center p-8 bg-muted/30 rounded-lg">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No comments yet</p>
          <Button onClick={() => setShowCommentEditor(true)}>
            Add the first comment
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarFallback>{getUserInitials(comment.userId)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{comment.userId}</span>
                  <span className="text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                  {comment.isInternal && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Internal
                    </span>
                  )}
                </div>

                {/* Render comment doc */}
                <div className="prose prose-sm max-w-none">
                  {comment.content && <p>{comment.content}</p>}
                </div>

                {/* Mentions */}
                {comment.mentions && comment.mentions.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Mentioned: {comment.mentions.join(", ")}
                  </div>
                )}

                {/* Attachments */}
                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="space-y-1">
                    {comment.attachments.map((attachment, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span>📎</span>
                        <span>{attachment.fileName}</span>
                        <span className="text-xs">
                          ({Math.round(attachment.fileSize / 1024)}KB)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Comment Editor */}
      {showCommentEditor && (
        <div className="border rounded-lg p-4 bg-card space-y-4">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback>
                {session?.user?.name?.slice(0, 2).toUpperCase() || "ME"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <ProseMirrorEditor
                noteId={`comment-new-${entityId}-${Date.now()}`}
                spaceId={workspaceId}
                onSave={handleSaveComment}
                placeholder="Add a comment... Use @ to mention people, ![[entity]] to link to other items"
                enableComments={false}
                enableOntologyRefs={true}
                enableMentions={true}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowCommentEditor(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const { workspace, session } = useCaptify();

  const [project, setProject] = useState<WorkspaceProject | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { setPageContext } = usePageContext();

  // Set navigation buttons, title, and hide main menu
  useEffect(() => {
    setPageContext({
      title: project?.name || 'Loading...',
      hideMainMenu: true,
      onClose: () => router.push('/workspace/projects'),
      navButtons: [
        {
          id: 'overview',
          label: 'Overview',
          icon: ClipboardList,
          isActive: true,
          onClick: () => router.push(`/workspace/projects/${projectId}/overview`),
        },
        {
          id: 'activity',
          label: 'Activity',
          icon: MessageSquare,
          isActive: false,
          onClick: () => router.push(`/workspace/projects/${projectId}/activity`),
        },
        {
          id: 'issues',
          label: 'Issues',
          icon: CheckSquare2,
          isActive: false,
          onClick: () => router.push(`/workspace/projects/${projectId}/issues`),
        },
      ],
    });

    // Clean up when component unmounts
    return () => {
      setPageContext({ navButtons: [], hideMainMenu: false, title: '', onClose: undefined });
    };
  }, [projectId, router, setPageContext, project?.name]);

  // Load project data
  useEffect(() => {
    if (projectId && workspace?.id) {
      loadProject();
    }
  }, [projectId, workspace?.id]);

  async function loadProject() {
    setError(null);

    try {
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        {error}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full">
        {/* Main Content Skeleton */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-8 space-y-8">
            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-12 w-2/3 bg-muted animate-pulse rounded" />
              <div className="h-6 w-full bg-muted animate-pulse rounded" />
            </div>

            {/* Properties Skeleton */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-24 bg-muted animate-pulse rounded" />
              ))}
            </div>

            <div className="border-t" />

            {/* Description Skeleton */}
            <div className="space-y-4">
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="w-80 border-l bg-muted/10 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              <div className="h-2 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-full bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        </div>
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
            data={{
              status: project.status,
              priority: project.priority,
              health: project.health,
              projectType: project.type,
              lead: project.leadId,
              members: project.teamIds,
              startDate: project.startDate,
              targetDate: project.targetDate,
              tags: project.tags,
              dependencies: project.dependencies,
            }}
            onChange={(updates) => {
              const projectUpdates: Partial<WorkspaceProject> = {};
              if (updates.status !== undefined) projectUpdates.status = updates.status;
              if (updates.priority !== undefined) projectUpdates.priority = updates.priority;
              if (updates.health !== undefined) projectUpdates.health = updates.health;
              if (updates.projectType !== undefined) projectUpdates.type = updates.projectType;
              if (updates.lead !== undefined) projectUpdates.leadId = updates.lead;
              if (updates.members !== undefined) projectUpdates.teamIds = updates.members;
              if (updates.startDate !== undefined) projectUpdates.startDate = updates.startDate;
              if (updates.targetDate !== undefined) projectUpdates.targetDate = updates.targetDate;
              if (updates.tags !== undefined) projectUpdates.tags = updates.tags;
              if (updates.dependencies !== undefined) projectUpdates.dependencies = updates.dependencies;
              handleUpdateProject(projectUpdates);
            }}
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
