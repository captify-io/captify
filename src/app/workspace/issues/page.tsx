"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCaptify } from "@captify-io/base";
import { apiClient } from "@captify-io/base";
import {
  Button,
  Badge,
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@captify-io/base/ui";
import {
  CheckSquare2,
  Plus,
  Loader2,
  Filter,
  X,
  ListTodo,
  LayoutGrid,
} from "lucide-react";
import type { ColumnDef } from "@captify-io/base/ui";

interface WorkspaceIssue {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assigneeId?: string;
  projectId?: string;
  projectName?: string;
  labels?: string[];
  dueDate?: string;
  estimate?: number;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
}

type ViewMode = 'list' | 'board';
type StatusFilter = 'all' | 'backlog' | 'todo' | 'in-progress' | 'in-review' | 'done';
type PriorityFilter = 'all' | 'urgent' | 'high' | 'medium' | 'low';

export default function IssuesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workspace } = useCaptify();

  const [issues, setIssues] = useState<WorkspaceIssue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    (searchParams.get('status') as StatusFilter) || 'all'
  );
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>(
    (searchParams.get('priority') as PriorityFilter) || 'all'
  );
  const [projectFilter, setProjectFilter] = useState<string>(
    searchParams.get('project') || 'all'
  );
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  useEffect(() => {
    if (!workspace?.id) return;
    loadData();
  }, [workspace?.id]);

  async function loadData() {
    setLoading(true);
    try {
      // Load all projects first
      const projectsResponse = await apiClient.run({
        app: 'ontology',
        operation: 'queryItems',
        data: {
          type: 'workspace-project',
          keyCondition: {
            workspaceId: workspace?.id,
          },
          index: 'workspaceId-status-index',
        },
      });

      if (projectsResponse.success && projectsResponse.data?.items) {
        setProjects(projectsResponse.data.items as Project[]);
      }

      // Load all issues
      const issuesResponse = await apiClient.run({
        app: 'ontology',
        operation: 'queryItems',
        data: {
          type: 'workspace-issue',
          keyCondition: {
            workspaceId: workspace?.id,
          },
          index: 'workspaceId-status-index',
        },
      });

      if (issuesResponse.success && issuesResponse.data?.items) {
        const issuesData = issuesResponse.data.items as WorkspaceIssue[];

        // Enrich issues with project names
        const enrichedIssues = issuesData.map(issue => ({
          ...issue,
          projectName: projects.find(p => p.id === issue.projectId)?.name || 'No Project',
        }));

        setIssues(enrichedIssues);
      }
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filter issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch =
        searchQuery === '' ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.identifier.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || issue.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'all' || issue.priority === priorityFilter;

      const matchesProject =
        projectFilter === 'all' || issue.projectId === projectFilter;

      const matchesAssignee =
        assigneeFilter === 'all' || issue.assigneeId === assigneeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesProject &&
        matchesAssignee
      );
    });
  }, [issues, searchQuery, statusFilter, priorityFilter, projectFilter, assigneeFilter]);

  // Group issues by status for board view
  const issuesByStatus = useMemo(() => {
    const statuses = ['backlog', 'todo', 'in-progress', 'in-review', 'done'];
    return statuses.reduce((acc, status) => {
      acc[status] = filteredIssues.filter(issue => issue.status === status);
      return acc;
    }, {} as Record<string, WorkspaceIssue[]>);
  }, [filteredIssues]);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'in-progress':
      case 'in-review':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'todo':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'backlog':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const columns: ColumnDef<WorkspaceIssue>[] = [
    {
      accessorKey: 'identifier',
      header: 'ID',
      className: 'w-32',
      cell: (issue) => (
        <span className="font-mono text-sm text-muted-foreground">
          {issue.identifier}
        </span>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: (issue) => (
        <div>
          <div className="font-semibold">{issue.title}</div>
          {issue.description && (
            <div className="text-sm text-muted-foreground truncate max-w-md">
              {issue.description}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      className: 'w-32',
      cell: (issue) => (
        <Badge variant="outline" className={`capitalize ${getStatusColor(issue.status)}`}>
          {issue.status.replace('-', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      className: 'w-32',
      cell: (issue) => (
        issue.priority ? (
          <Badge variant="outline" className={`capitalize ${getPriorityColor(issue.priority)}`}>
            {issue.priority}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )
      ),
    },
    {
      accessorKey: 'projectName',
      header: 'Project',
      className: 'w-48',
      cell: (issue) => (
        <span className="text-sm">{issue.projectName || 'No Project'}</span>
      ),
    },
    {
      accessorKey: 'assigneeId',
      header: 'Assignee',
      className: 'w-32',
      cell: (issue) => (
        issue.assigneeId ? (
          <span className="text-sm">{issue.assigneeId}</span>
        ) : (
          <span className="text-muted-foreground text-sm">Unassigned</span>
        )
      ),
    },
  ];

  const activeFiltersCount =
    (statusFilter !== 'all' ? 1 : 0) +
    (priorityFilter !== 'all' ? 1 : 0) +
    (projectFilter !== 'all' ? 1 : 0) +
    (assigneeFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setProjectFilter('all');
    setAssigneeFilter('all');
  };

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <CheckSquare2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Issues</h1>
            <p className="text-muted-foreground">
              {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              } rounded-l-lg transition-colors`}
            >
              <ListTodo className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-2 ${
                viewMode === 'board'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              } rounded-r-lg transition-colors`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={() => console.log('Create issue')}>
            <Plus className="h-4 w-4 mr-2" />
            New Issue
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as PriorityFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        filteredIssues.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <CheckSquare2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No issues found</h2>
            <p className="text-muted-foreground mb-4">
              {activeFiltersCount > 0
                ? 'Try adjusting your filters'
                : 'Create your first issue to get started'}
            </p>
            {activeFiltersCount === 0 && (
              <Button onClick={() => console.log('Create issue')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Issue
              </Button>
            )}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredIssues}
            onRowClick={(issue) => router.push(`/workspace/issues/${issue.id}`)}
          />
        )
      ) : (
        /* Board View */
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(issuesByStatus).map(([status, statusIssues]) => (
            <div key={status} className="flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold capitalize text-sm">
                  {status.replace('-', ' ')}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {statusIssues.length}
                </Badge>
              </div>
              <div className="flex-1 space-y-2 min-h-[200px] p-2 bg-muted/20 rounded-lg">
                {statusIssues.map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => router.push(`/workspace/issues/${issue.id}`)}
                    className="w-full text-left p-3 bg-card border rounded-lg hover:border-primary transition-all hover:shadow-md"
                  >
                    <div className="font-mono text-xs text-muted-foreground mb-1">
                      {issue.identifier}
                    </div>
                    <div className="font-medium text-sm mb-2 line-clamp-2">
                      {issue.title}
                    </div>
                    {issue.priority && (
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
