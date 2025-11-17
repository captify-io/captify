"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCaptify } from "@captify-io/base";
import { apiClient } from "@captify-io/base";
import { Button, Badge, DataTable } from "@captify-io/base/ui";
import { Users, Plus, Loader2 } from "lucide-react";
import type { ColumnDef } from "@captify-io/base/ui";
import type { Team } from "@captify-io/base/types/workspace";

export default function TeamsPage() {
  const router = useRouter();
  const { workspace } = useCaptify();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspace?.id) return;

    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await apiClient.run({
          app: 'ontology',
          operation: 'queryItems',
          data: {
            type: 'workspace-team',
            keyCondition: {
              workspaceId: workspace.id,
            },
            index: 'workspaceId-status-index',
          },
        });

        if (response.success && response.data?.items) {
          setTeams(response.data.items as Team[]);
        }
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [workspace?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'archived':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const columns: ColumnDef<Team>[] = [
    {
      accessorKey: 'name',
      header: 'Team',
      cell: (team) => (
        <div className="flex items-center gap-3">
          {team.icon && (
            <span className="text-2xl" style={{ color: team.color }}>
              {team.icon}
            </span>
          )}
          <div>
            <div className="font-semibold">{team.name}</div>
            {team.description && (
              <div className="text-sm text-muted-foreground truncate max-w-md">
                {team.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'identifier',
      header: 'Identifier',
      className: 'w-32',
      cell: (team) => (
        <Badge variant="outline" className="font-mono">
          {team.identifier}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      className: 'w-32',
      cell: (team) => (
        <Badge variant="outline" className={`capitalize ${getStatusColor(team.status)}`}>
          {team.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'settings',
      header: 'Cycles',
      className: 'w-32',
      cell: (team) => (
        team.settings?.cycleEnabled ? (
          <span className="text-sm text-muted-foreground">
            {team.settings.cycleDuration || 2}w cycles
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">Disabled</span>
        )
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      className: 'w-40',
      cell: (team) => (
        <span className="text-sm text-muted-foreground">
          {new Date(team.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Teams</h1>
            <p className="text-muted-foreground">
              Organize your workspace into teams
            </p>
          </div>
        </div>
        <Button onClick={() => {
          // TODO: Open create team dialog
          console.log('Create team');
        }}>
          <Plus className="h-4 w-4 mr-2" />
          New Team
        </Button>
      </div>

      {/* Teams List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No teams yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first team to organize work and track progress
          </p>
          <Button onClick={() => {
            // TODO: Open create team dialog
            console.log('Create team');
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={teams}
          onRowClick={(team) => {
            // TODO: Navigate to team detail page
            console.log('View team:', team.id);
          }}
        />
      )}
    </div>
  );
}
