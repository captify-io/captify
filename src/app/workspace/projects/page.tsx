"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCaptify } from "@captify-io/base";
import { apiClient } from "@captify-io/base";
import { Button, Badge, DataTable } from "@captify-io/base/ui";
import { FolderKanban, Plus, Loader2 } from "lucide-react";
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
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FolderKanban className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              All projects across your workspace
            </p>
          </div>
        </div>
        <Button onClick={() => {
          // TODO: Open create project dialog
          console.log('Create project');
        }}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <FolderKanban className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first project to start tracking work and deliverables
          </p>
          <Button onClick={() => {
            // TODO: Open create project dialog
            console.log('Create project');
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={projects}
          onRowClick={(project) => router.push(`/workspace/projects/${project.id}`)}
        />
      )}
    </div>
  );
}
