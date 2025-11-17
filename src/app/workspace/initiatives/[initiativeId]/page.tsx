"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCaptify } from "@captify-io/base/layout";
import { Loader2, FolderKanban, ArrowRight } from "lucide-react";
import { Button } from "@captify-io/base/ui";
import { usePageContext } from "@captify-io/base/context/page-context";

interface Initiative {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  status: string;
  progress?: number;
  startDate?: string;
  targetDate?: string;
  goals?: string[];
}

interface Project {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  status: string;
  progress?: number;
  health?: string;
}

export default function InitiativeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const initiativeId = params.initiativeId as string;
  const { workspace } = useCaptify();
  const { setPageContext } = usePageContext();

  const [initiative, setInitiative] = useState<Initiative | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initiativeId && workspace?.id) {
      loadInitiativeAndProjects();
    }
  }, [initiativeId, workspace?.id]);

  useEffect(() => {
    if (initiative) {
      setPageContext({
        title: initiative.name,
        projectIcon: initiative.icon,
        projectColor: initiative.color,
        hideMainMenu: true,
        navButtons: [
          {
            id: "overview",
            label: "Overview",
            onClick: () => router.push(`/workspace/initiatives/${initiativeId}`),
            isActive: true,
          },
          {
            id: "projects",
            label: "Projects",
            onClick: () => router.push(`/workspace/initiatives/${initiativeId}/projects`),
            isActive: false,
          },
        ],
      });
    }
  }, [initiative, initiativeId]);

  async function loadInitiativeAndProjects() {
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
      } else {
        setError("Failed to load initiative");
        setLoading(false);
        return;
      }

      // Load projects
      const projResponse = await fetch("/api/captify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          app: "ontology",
          operation: "queryItems",
          data: {
            type: "workspace-project",
            indexName: "initiativeId-index",
            keyConditionExpression: "initiativeId = :initiativeId",
            expressionAttributeValues: {
              ":initiativeId": initiativeId,
            },
          },
        }),
      });

      const projResult = await projResponse.json();

      if (projResult.success && projResult.data) {
        setProjects(projResult.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading initiative...</span>
      </div>
    );
  }

  if (error || !initiative) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        {error || "Initiative not found"}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      {/* Initiative Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          {initiative.icon && (
            <span className="text-5xl">{initiative.icon}</span>
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{initiative.name}</h1>
            {initiative.description && (
              <p className="text-lg text-muted-foreground">
                {initiative.description}
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {initiative.progress !== undefined && (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-semibold">{initiative.progress}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${initiative.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Goals */}
        {initiative.goals && initiative.goals.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Goals</h2>
            <ul className="space-y-2">
              {initiative.goals.map((goal, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="border-t pt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <Button
            variant="outline"
            onClick={() => router.push(`/workspace/initiatives/${initiativeId}/projects`)}
          >
            View All Projects
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground">
              Projects in this initiative will appear here
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() =>
                  router.push(`/workspace/initiatives/${initiativeId}/projects/${project.id}`)
                }
                className="text-left p-4 border rounded-lg hover:border-primary transition-all hover:shadow-md"
                style={{
                  borderLeftWidth: "4px",
                  borderLeftColor: project.color || "#6b7280",
                }}
              >
                <div className="flex items-start gap-2 mb-2">
                  {project.icon && (
                    <span className="text-xl">{project.icon}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>

                {project.progress !== undefined && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 bg-muted rounded capitalize">
                    {project.status}
                  </span>
                  {project.health && (
                    <span className="capitalize">{project.health}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
