"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCaptify } from "@captify-io/base/layout";
import { Loader2, Plus, FolderKanban } from "lucide-react";
import { Button } from "@captify-io/base/ui";
import { usePageContext } from "@captify-io/base/context/page-context";

interface Initiative {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  status: string;
  priority?: string;
  health?: string;
  progress?: number;
  leadId?: string;
  targetDate?: string;
}

export default function InitiativeProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const initiativeId = params.initiativeId as string;
  const { workspace } = useCaptify();
  const { setPageContext } = usePageContext();

  const [initiative, setInitiative] = useState<Initiative | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (initiativeId && workspace?.id) {
      loadData();
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
            isActive: false,
          },
          {
            id: "projects",
            label: "Projects",
            onClick: () => router.push(`/workspace/initiatives/${initiativeId}/projects`),
            isActive: true,
          },
        ],
      });
    }
  }, [initiative, initiativeId]);

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

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""} in this
            initiative
          </p>
        </div>
        <Button onClick={() => router.push(`/workspace/initiatives/${initiativeId}/projects/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Status</option>
          <option value="planned">Planned</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Get started by creating your first project"}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Button onClick={() => router.push(`/workspace/initiatives/${initiativeId}/projects/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
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
                {project.icon && <span className="text-xl">{project.icon}</span>}
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
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
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
                  <span
                    className={`capitalize ${
                      project.health === "on-track"
                        ? "text-green-600"
                        : project.health === "at-risk"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {project.health}
                  </span>
                )}
                {project.targetDate && (
                  <span>
                    Due {new Date(project.targetDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
