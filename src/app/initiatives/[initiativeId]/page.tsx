"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCaptify } from "@captify-io/base";
import { apiClient } from "@captify-io/base";
import { Button, Badge, Input, DataTable } from "@captify-io/base/ui";
import { Target, Loader2, Calendar, User, Activity, FolderKanban } from "lucide-react";
import type { ColumnDef } from "@captify-io/base/ui";
import type { WorkspaceInitiative, WorkspaceProject } from "@captify-io/workspace/types";
import { ActivityFeed } from "@captify-io/workspace/client";

export default function InitiativeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const initiativeId = params.initiativeId as string;
  const { workspace } = useCaptify();

  const [initiative, setInitiative] = useState<WorkspaceInitiative | null>(null);
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Fetch initiative data
  useEffect(() => {
    if (!initiativeId || !workspace?.id) return;

    const fetchInitiative = async () => {
      setLoading(true);
      try {
        const response = await apiClient.run({
          app: 'ontology',
          operation: 'getItem',
          data: {
            type: 'workspace-initiative',
            id: initiativeId,
          },
        });

        if (response.success && response.data) {
          setInitiative(response.data as WorkspaceInitiative);
        }
      } catch (error) {
        console.error('Failed to fetch initiative:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitiative();
  }, [initiativeId, workspace?.id]);

  // Fetch related projects
  useEffect(() => {
    if (!initiativeId || !workspace?.id) return;

    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        // Query all projects in workspace and filter by initiativeId
        const response = await apiClient.run({
          app: 'ontology',
          operation: 'queryItems',
          data: {
            type: 'workspace-project',
            keyCondition: {
              workspaceId: workspace.id,
            },
            index: 'workspaceId-status-index',
          },
        });

        if (response.success && response.data?.items) {
          // Filter projects that belong to this initiative
          const allProjects = response.data.items as WorkspaceProject[];
          const filteredProjects = allProjects.filter(
            (p) => p.initiativeId === initiativeId
          );
          setProjects(filteredProjects);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, [initiativeId, workspace?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'planned':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'completed':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  // Define project columns
  const projectColumns: ColumnDef<WorkspaceProject>[] = [
    {
      accessorKey: 'name',
      header: 'Project',
      cell: (project) => (
        <div className="flex items-center gap-2">
          {project.icon && (
            <span className="text-lg" style={{ color: project.color }}>
              {project.icon}
            </span>
          )}
          <div>
            <div className="font-medium">{project.name}</div>
            {project.description && (
              <div className="text-xs text-muted-foreground truncate max-w-xs">
                {project.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      className: 'w-32',
      cell: (project) => (
        <Badge variant="outline" className={`capitalize ${getStatusColor(project.status)}`}>
          {project.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'progress',
      header: 'Progress',
      className: 'w-32',
      cell: (project) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-10 text-right">
            {project.progress || 0}%
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'leadId',
      header: 'Lead',
      className: 'w-32',
      cell: (project) => (
        project.leadId ? (
          <span className="text-sm">{project.leadId.slice(0, 8)}...</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      ),
    },
    {
      accessorKey: 'targetDate',
      header: 'Target Date',
      className: 'w-32',
      cell: (project) => (
        project.targetDate ? (
          <span className="text-sm">
            {new Date(project.targetDate).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!initiative) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Initiative not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{initiative.name}</h1>
              {initiative.description && (
                <p className="text-sm text-muted-foreground mt-1">{initiative.description}</p>
              )}
            </div>
            <Button size="sm" variant="outline">
              Add Project
            </Button>
          </div>
        </div>

        {/* Related Projects */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">
              Related Projects ({projects.length})
            </h2>
          </div>

          {projectsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <FolderKanban className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No projects linked to this initiative</p>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <DataTable
                columns={projectColumns}
                data={projects}
                onRowClick={(project) => router.push(`/project/${project.id}/overview`)}
                className="h-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l bg-muted/10 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Attributes */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Attributes</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Status
                </dt>
                <dd className="mt-1">
                  <Badge variant="outline" className={`capitalize ${getStatusColor(initiative.status)}`}>
                    {initiative.status}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Progress</dt>
                <dd className="mt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${initiative.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{initiative.progress || 0}%</span>
                  </div>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Owner
                </dt>
                <dd className="mt-1 font-medium">
                  {initiative.ownerId ? initiative.ownerId.slice(0, 8) + '...' : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Target Date
                </dt>
                <dd className="mt-1 font-medium">
                  {initiative.targetDate
                    ? new Date(initiative.targetDate).toLocaleDateString()
                    : '—'}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Details</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Created</dt>
                <dd className="font-medium">
                  {new Date(initiative.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Last Updated</dt>
                <dd className="font-medium">
                  {new Date(initiative.updatedAt).toLocaleDateString()}
                </dd>
              </div>
              {initiative.completedAt && (
                <div>
                  <dt className="text-muted-foreground">Completed</dt>
                  <dd className="font-medium">
                    {new Date(initiative.completedAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Activity</h3>
            <ActivityFeed
              entityId={initiativeId}
              limit={20}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
