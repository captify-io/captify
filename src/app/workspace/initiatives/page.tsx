"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCaptify } from "@captify-io/base";
import { apiClient } from "@captify-io/base";
import { Button, Badge, DataTable } from "@captify-io/base/ui";
import { Target, Plus, Loader2 } from "lucide-react";
import type { ColumnDef } from "@captify-io/base/ui";

interface Initiative {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  status: string;
  progress?: number;
  ownerId?: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function InitiativesPage() {
  const router = useRouter();
  const { workspace } = useCaptify();

  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspace?.id) return;

    const fetchInitiatives = async () => {
      setLoading(true);
      try {
        const response = await apiClient.run({
          app: 'ontology',
          operation: 'queryItems',
          data: {
            type: 'workspace-initiative',
            keyCondition: {
              workspaceId: workspace.id,
            },
            index: 'workspaceId-status-index',
          },
        });

        if (response.success && response.data?.items) {
          setInitiatives(response.data.items as Initiative[]);
        }
      } catch (error) {
        console.error('Failed to fetch initiatives:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitiatives();
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

  const columns: ColumnDef<Initiative>[] = [
    {
      accessorKey: 'name',
      header: 'Initiative',
      cell: (initiative) => (
        <div className="flex items-center gap-3">
          {initiative.icon && (
            <span className="text-2xl" style={{ color: initiative.color }}>
              {initiative.icon}
            </span>
          )}
          <div>
            <div className="font-semibold">{initiative.name}</div>
            {initiative.description && (
              <div className="text-sm text-muted-foreground truncate max-w-md">
                {initiative.description}
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
      cell: (initiative) => (
        <Badge variant="outline" className={`capitalize ${getStatusColor(initiative.status)}`}>
          {initiative.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'progress',
      header: 'Progress',
      className: 'w-40',
      cell: (initiative) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${initiative.progress || 0}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-10 text-right">
            {initiative.progress || 0}%
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'targetDate',
      header: 'Target Date',
      className: 'w-32',
      cell: (initiative) => (
        initiative.targetDate ? (
          <span className="text-sm">
            {new Date(initiative.targetDate).toLocaleDateString()}
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
          <Target className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Initiatives</h1>
            <p className="text-muted-foreground">
              Strategic objectives and key results for your workspace
            </p>
          </div>
        </div>
        <Button onClick={() => {
          // TODO: Open create initiative dialog
          console.log('Create initiative');
        }}>
          <Plus className="h-4 w-4 mr-2" />
          New Initiative
        </Button>
      </div>

      {/* Initiatives List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : initiatives.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No initiatives yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first initiative to organize projects around strategic goals
          </p>
          <Button onClick={() => {
            // TODO: Open create initiative dialog
            console.log('Create initiative');
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Initiative
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={initiatives}
          onRowClick={(initiative) => router.push(`/workspace/initiatives/${initiative.id}`)}
        />
      )}
    </div>
  );
}
