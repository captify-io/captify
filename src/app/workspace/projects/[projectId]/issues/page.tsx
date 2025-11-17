"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCaptify } from "@captify-io/base";
import { usePageContext } from "@captify-io/base";
import { apiClient } from "@captify-io/base";
import {
  Button,
  Badge,
  DataTable,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@captify-io/base/ui";
import {
  ClipboardList,
  MessageSquare,
  CheckSquare2,
  Plus,
  Loader2,
  AlertCircle,
  ArrowUp,
  Signal,
} from "lucide-react";
import type { ColumnDef } from "@captify-io/base/ui";
import type { WorkspaceProject, WorkspaceIssue } from "@captify-io/workspace/types";
import { ActivityFeed } from "@captify-io/workspace/client";

type IssueFilter = 'all' | 'open' | 'in-progress' | 'done';

export default function ProjectIssuesPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const { workspace, session } = useCaptify();
  const { setPageContext } = usePageContext();

  const [project, setProject] = useState<WorkspaceProject | null>(null);
  const [issues, setIssues] = useState<WorkspaceIssue[]>([]);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [filter, setFilter] = useState<IssueFilter>('all');
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());

  // Fetch project data
  useEffect(() => {
    if (!projectId || !workspace?.id) return;

    const fetchProject = async () => {
      try {
        const response = await apiClient.run({
          app: 'ontology',
          operation: 'getItem',
          data: {
            type: 'workspace-project',
            id: projectId,
          },
        });

        if (response.success && response.data) {
          setProject(response.data as WorkspaceProject);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      }
    };

    fetchProject();
  }, [projectId, workspace?.id]);

  // Fetch issues for this project
  useEffect(() => {
    if (!projectId || !workspace?.id) return;

    const fetchIssues = async () => {
      setIssuesLoading(true);
      try {
        const response = await apiClient.run({
          app: 'ontology',
          operation: 'queryItems',
          data: {
            type: 'workspace-issue',
            keyCondition: {
              projectId,
            },
            index: 'projectId-index',
          },
        });

        if (response.success && response.data?.items) {
          setIssues(response.data.items as WorkspaceIssue[]);
        }
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      } finally {
        setIssuesLoading(false);
      }
    };

    fetchIssues();
  }, [projectId, workspace?.id]);

  // Set navigation buttons
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
          isActive: false,
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
          isActive: true,
          onClick: () => router.push(`/workspace/projects/${projectId}/issues`),
        },
      ],
    });

    return () => {
      setPageContext({ navButtons: [], hideMainMenu: false, title: '', onClose: undefined });
    };
  }, [projectId, router, setPageContext, project?.name]);

  // Filter issues - only show parent issues (no children)
  const filteredIssues = useMemo(() => {
    const parentIssuesOnly = issues.filter(i => !i.parentIssueId);

    switch (filter) {
      case 'open':
        return parentIssuesOnly.filter(i => ['backlog', 'todo'].includes(i.status));
      case 'in-progress':
        return parentIssuesOnly.filter(i => ['in-progress', 'in-review'].includes(i.status));
      case 'done':
        return parentIssuesOnly.filter(i => i.status === 'done');
      case 'all':
      default:
        return parentIssuesOnly;
    }
  }, [issues, filter]);

  // Update issue priority
  const updatePriority = async (issueId: string, priority: string) => {
    try {
      await apiClient.run({
        app: 'ontology',
        operation: 'updateItem',
        data: {
          type: 'workspace-issue',
          id: issueId,
          updates: { priority },
        },
      });

      // Update local state
      setIssues(prev => prev.map(i =>
        i.id === issueId ? { ...i, priority: priority as any } : i
      ));
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  // Update issue status
  const updateStatus = async (issueId: string, status: string) => {
    try {
      await apiClient.run({
        app: 'ontology',
        operation: 'updateItem',
        data: {
          type: 'workspace-issue',
          id: issueId,
          updates: { status },
        },
      });

      // Update local state
      setIssues(prev => prev.map(i =>
        i.id === issueId ? { ...i, status: status as any } : i
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Define table columns
  const columns: ColumnDef<WorkspaceIssue>[] = [
    {
      accessorKey: 'priority',
      header: 'Priority',
      className: 'w-24',
      cell: (issue) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              {issue.priority === 'urgent' && <AlertCircle className="h-4 w-4 text-red-500" />}
              {issue.priority === 'high' && <ArrowUp className="h-4 w-4 text-orange-500" />}
              {issue.priority === 'medium' && <Signal className="h-4 w-4 text-blue-500" />}
              {!issue.priority || issue.priority === 'low' ? (
                <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-1">
              {['urgent', 'high', 'medium', 'low'].map((p) => (
                <button
                  key={p}
                  onClick={() => updatePriority(issue.id, p)}
                  className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-accent capitalize"
                >
                  {p}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      className: 'w-32',
      cell: (issue) => (
        <Popover>
          <PopoverTrigger asChild>
            <Badge
              variant="outline"
              className="capitalize cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              {issue.status.replace('-', ' ')}
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-1">
              {['backlog', 'todo', 'in-progress', 'in-review', 'done'].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(issue.id, s)}
                  className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-accent capitalize"
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
    {
      accessorKey: 'identifier',
      header: 'ID',
      className: 'w-24',
      cell: (issue) => (
        <span className="text-xs text-muted-foreground font-mono">
          {issue.identifier}
        </span>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: (issue) => (
        <span className="font-medium">{issue.title}</span>
      ),
    },
    {
      accessorKey: 'labels',
      header: 'Tags',
      className: 'w-48',
      sortable: false,
      cell: (issue) => (
        issue.labels && issue.labels.length > 0 ? (
          <div className="flex gap-1 flex-wrap">
            {issue.labels.map((label, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      className: 'w-32',
      cell: (issue) => (
        <span className="text-sm text-muted-foreground">
          {new Date(issue.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const isLoading = !project || issuesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main Content - Issues List */}
      <div className="flex-1 overflow-hidden p-6">
        {/* Issues Table */}
        {filteredIssues.length === 0 ? (
          <div className="text-center p-12 bg-muted/30 rounded-lg">
            <CheckSquare2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No issues found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first issue to get started
            </p>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Issue
            </Button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredIssues}
            onRowClick={(issue) => router.push(`/workspace/issues/${issue.id}`)}
            className="h-full"
          />
        )}
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
