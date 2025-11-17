"use client";

import React, { useState } from "react";
import {
  WorkspaceSwitcher,
  WorkspaceCreateDialog,
  TeamSwitcher,
  TeamCreateDialog,
  ProjectEditor,
} from "@captify-io/workspace/client";
import { useCaptify } from "@captify-io/base/layout";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@captify-io/base/ui";
import { Building2, Users, FolderKanban, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WorkspaceDemoPage() {
  const { workspace, workspaces } = useCaptify();
  const [showWorkspaceDialog, setShowWorkspaceDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showProjectEditor, setShowProjectEditor] = useState(false);

  return (
    <div className="container mx-auto p-8 space-y-8">
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Demo Hub
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Workspace Demo</h1>
        <p className="text-muted-foreground">
          Demonstration of workspace, team, and project management components
        </p>
      </div>

      {/* Current Context */}
      <Card>
        <CardHeader>
          <CardTitle>Current Context</CardTitle>
          <CardDescription>
            Your active workspace and available workspaces
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Active Workspace</label>
              <WorkspaceSwitcher />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Workspaces</label>
              <div className="text-2xl font-bold">{workspaces.length}</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Workspace Type</label>
              <div className="text-lg capitalize">{workspace?.type || "N/A"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Demonstrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Workspace Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Workspaces</CardTitle>
            </div>
            <CardDescription>
              Create and manage workspaces
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Workspaces organize teams, projects, and issues.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => setShowWorkspaceDialog(true)} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workspace
                </Button>
              </div>
            </div>
            {workspace && (
              <div className="p-4 bg-muted rounded-lg space-y-1">
                <div className="font-semibold">{workspace.name}</div>
                <div className="text-sm text-muted-foreground">
                  {workspace.description || "No description"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Teams</CardTitle>
            </div>
            <CardDescription>
              Create and manage teams
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Teams track issues and organize work within a workspace.
              </p>
              <div className="flex gap-2">
                <TeamSwitcher />
                <Button onClick={() => setShowTeamDialog(true)} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Teams use identifiers like "ENG", "DESIGN" for issue numbering (e.g., ENG-123)
            </div>
          </CardContent>
        </Card>

        {/* Project Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              <CardTitle>Projects</CardTitle>
            </div>
            <CardDescription>
              Create and manage projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Projects organize issues around time-bound deliverables.
              </p>
              <Button onClick={() => setShowProjectEditor(true)} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Projects support milestones, progress tracking, and team collaboration
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace Features</CardTitle>
          <CardDescription>
            Complete issue tracking and project management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Issue Tracking</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Auto-numbered issues (ENG-123)</li>
                <li>• Status workflow (backlog → done)</li>
                <li>• Priority levels (urgent → low)</li>
                <li>• Assignees and reporters</li>
                <li>• Labels and estimates</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Project Management</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Time-bound deliverables</li>
                <li>• Milestones and progress tracking</li>
                <li>• Multi-team projects</li>
                <li>• Initiative grouping</li>
                <li>• Auto-save with debounce</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Team Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Custom team identifiers</li>
                <li>• Team-specific settings</li>
                <li>• Cycle-based sprints</li>
                <li>• Triage management</li>
                <li>• Auto-archive options</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Workspace Types</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Personal (individual use)</li>
                <li>• Team (small teams)</li>
                <li>• Organization (large scale)</li>
                <li>• Multi-tenant support</li>
                <li>• Role-based access</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <WorkspaceCreateDialog
        open={showWorkspaceDialog}
        onOpenChange={setShowWorkspaceDialog}
      />

      <TeamCreateDialog
        open={showTeamDialog}
        onOpenChange={setShowTeamDialog}
      />

      {/* Project Editor Modal */}
      {showProjectEditor && workspace && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create Project</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowProjectEditor(false)}>
                ×
              </Button>
            </div>
            <ProjectEditor
              mode="create"
              onSave={(project) => {
                console.log("Project created:", project);
                setShowProjectEditor(false);
              }}
              onCancel={() => setShowProjectEditor(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
