"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCaptify } from "@captify-io/base";
import { apiClient } from "@captify-io/base";
import { Badge, DataTable, PageLayout, DetailPanel } from "@captify-io/base/ui";
import { Plus, Loader2 } from "lucide-react";
import type { ColumnDef } from "@captify-io/base/ui";

interface Project {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  status: string;
  progress?: number;
  health?: string;
  leadId?: string;
  initiativeId?: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { workspace } = useCaptify();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!workspace?.id) return;

    const fetchProjects = async () => {
      setLoading(true);
      try {
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
          setProjects(response.data.items as Project[]);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [workspace?.id]);

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

  const getHealthColor = (health?: string) => {
    switch (health) {
      case 'on-track':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'at-risk':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'off-track':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: 'name',
      header: 'Project',
      cell: (project) => (
        <div className="flex items-center gap-3">
          {project.icon && (
            <span className="text-2xl" style={{ color: project.color }}>
              {project.icon}
            </span>
          )}
          <div>
            <div className="font-semibold">{project.name}</div>
            {project.description && (
              <div className="text-sm text-muted-foreground truncate max-w-md">
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
      accessorKey: 'health',
      header: 'Health',
      className: 'w-32',
      cell: (project) => (
        project.health ? (
          <Badge variant="outline" className={`capitalize ${getHealthColor(project.health)}`}>
            {project.health.replace('-', ' ')}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      ),
    },
    {
      accessorKey: 'progress',
      header: 'Progress',
      className: 'w-40',
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

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Workspace", href: "/workspace" },
        { label: "Projects" }
      ]}
      actions={[
        {
          label: "New Project",
          icon: Plus,
          variant: "default",
          onClick: () => {
            // TODO: Open create project dialog
            console.log('Create project');
          }
        }
      ]}
      detailPanel={
        selectedProject ? (
          <DetailPanel
            title="Project Details"
            onClose={() => setSelectedProject(null)}
          >
            <div className="space-y-6">
              {/* Project Icon & Name */}
              <div className="flex items-center gap-3">
                {selectedProject.icon && (
                  <span className="text-4xl" style={{ color: selectedProject.color }}>
                    {selectedProject.icon}
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{selectedProject.name}</h3>
                  {selectedProject.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedProject.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Status & Health */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className={`capitalize ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </Badge>
                </div>
                {selectedProject.health && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Health</span>
                    <Badge variant="outline" className={`capitalize ${getHealthColor(selectedProject.health)}`}>
                      {selectedProject.health.replace('-', ' ')}
                    </Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{selectedProject.progress || 0}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${selectedProject.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Target Date */}
              {selectedProject.targetDate && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Target Date</span>
                  <p className="text-sm font-medium">
                    {new Date(selectedProject.targetDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Created/Updated */}
              <div className="pt-6 border-t space-y-2 text-xs text-muted-foreground">
                <div>Created {new Date(selectedProject.createdAt).toLocaleDateString()}</div>
                <div>Updated {new Date(selectedProject.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>
          </DetailPanel>
        ) : undefined
      }
      noPadding
    >
      {/* Projects List */}
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first project to start tracking work and deliverables
            </p>
          </div>
        </div>
      ) : (
        <div className="h-full">
          <DataTable
            columns={columns}
            data={projects}
            onRowClick={(project) => {
              setSelectedProject(project);
            }}
          />
        </div>
      )}
    </PageLayout>
  );
}
