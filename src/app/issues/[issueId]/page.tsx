"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCaptify } from "@captify-io/base";
import { Input, Button, Badge, Avatar, AvatarFallback } from "@captify-io/base/ui";
import { Loader2, Link2, MessageSquare } from "lucide-react";
import dynamic from "next/dynamic";
import type { WorkspaceIssue, IssueComment, WorkspaceProject } from "@captify-io/workspace/types";
import { ActivityFeed } from "@captify-io/workspace/client";
import { createComment, listComments } from "@captify-io/workspace/server";

// Dynamically import Fabric to avoid SSR issues
const ProseMirrorEditor = dynamic(
  () => import("@captify-io/fabric/client").then((mod) => ({ default: mod.ProseMirrorEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    ),
  }
);

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.issueId as string;
  const { workspace, session } = useCaptify();

  const [issue, setIssue] = useState<WorkspaceIssue | null>(null);
  const [project, setProject] = useState<WorkspaceProject | null>(null);
  const [comments, setComments] = useState<IssueComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCommentEditor, setShowCommentEditor] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("");

  // Load issue data
  useEffect(() => {
    if (issueId && workspace?.id) {
      loadIssue();
    }
  }, [issueId, workspace?.id]);

  // Load comments
  useEffect(() => {
    if (issueId) {
      loadComments();
    }
  }, [issueId]);

  // Load project when issue is loaded
  useEffect(() => {
    if (issue?.projectId) {
      loadProject();
    }
  }, [issue?.projectId]);

  async function loadIssue() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/captify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          app: "ontology",
          operation: "getItem",
          data: {
            type: "workspace-issue",
            id: issueId,
          },
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setIssue(result.data);
        setTitle(result.data.title);
      } else {
        setError("Failed to load issue");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load issue");
    } finally {
      setLoading(false);
    }
  }

  async function loadProject() {
    if (!issue?.projectId) return;

    try {
      const response = await fetch("/api/captify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          app: "ontology",
          operation: "getItem",
          data: {
            type: "workspace-project",
            id: issue.projectId,
          },
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setProject(result.data);
      }
    } catch (err) {
      console.error("Failed to load project:", err);
    }
  }

  async function loadComments() {
    setCommentsLoading(true);
    try {
      const data = await listComments(issueId);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  }

  // Handle issue property updates
  const handleUpdateIssue = useCallback(
    async (updates: Partial<WorkspaceIssue>) => {
      if (!issue) return;

      try {
        const response = await fetch("/api/captify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            app: "ontology",
            operation: "updateItem",
            data: {
              type: "workspace-issue",
              id: issueId,
              item: {
                ...updates,
                updatedAt: new Date().toISOString(),
                updatedBy: session?.user?.id,
              },
            },
          }),
        });

        const result = await response.json();

        if (result.success && result.data) {
          setIssue(result.data);
        }
      } catch (err: any) {
        console.error("Failed to update issue:", err);
      }
    },
    [issue, issueId, session?.user?.id]
  );

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title !== issue?.title && title.trim()) {
      handleUpdateIssue({ title: title.trim() });
    } else {
      setTitle(issue?.title || "");
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTitleBlur();
    } else if (e.key === "Escape") {
      setTitle(issue?.title || "");
      setIsEditingTitle(false);
    }
  };

  const handleSaveComment = useCallback(
    async (doc: any) => {
      if (!session?.user?.id) return;

      setSubmitting(true);
      try {
        await createComment({
          issueId,
          userId: session.user.id,
          doc,
          isInternal: false,
        });

        await loadComments();
        setShowCommentEditor(false);
      } catch (err) {
        console.error("Failed to create comment:", err);
      } finally {
        setSubmitting(false);
      }
    },
    [issueId, session?.user?.id]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getUserInitials = (userId: string) => {
    return userId.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading issue...</span>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        {error || "Issue not found"}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8 space-y-8">
          {/* Issue Header (Title & Identifier) */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-mono">
              {issue.identifier}
            </div>

            {isEditingTitle ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="text-4xl font-bold border-none px-0 focus-visible:ring-0"
                autoFocus
              />
            ) : (
              <h1
                className="text-4xl font-bold cursor-pointer hover:text-primary transition-colors"
                onClick={() => setIsEditingTitle(true)}
              >
                {issue.title}
              </h1>
            )}
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Description Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Description</h2>

            <ProseMirrorEditor
              noteId={`issue-${issueId}`}
              spaceId={workspace?.id || ""}
              initialDoc={issue.doc || {
                type: "doc",
                content: [
                  {
                    type: "paragraph",
                    content: issue.description
                      ? [{ type: "text", text: issue.description }]
                      : [],
                  },
                ],
              }}
              initialVersion={issue.docVersion || 0}
              onSave={async (doc, version) => {
                // Extract plain text for search
                let description = "";
                const traverse = (node: any) => {
                  if (node.type === "text") {
                    description += node.text || "";
                  }
                  if (node.content && Array.isArray(node.content)) {
                    node.content.forEach(traverse);
                  }
                };
                if (doc?.content) {
                  traverse(doc);
                }

                await handleUpdateIssue({
                  doc,
                  docVersion: version,
                  description: description.trim(),
                });
              }}
              placeholder="Add a description... Use @ to mention people, ![[entity]] to link to other entities"
              enableComments={false}
              enableOntologyRefs={true}
              enableMentions={true}
            />
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Related Issues Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Link2 className="h-6 w-6" />
              Related Issues
            </h2>
            <div className="text-sm text-muted-foreground">
              {issue.blockedBy && issue.blockedBy.length > 0 && (
                <div className="mb-2">
                  <span className="font-medium">Blocked by:</span>{" "}
                  {issue.blockedBy.map((id, idx) => (
                    <span key={id}>
                      {idx > 0 && ", "}
                      <button
                        onClick={() => router.push(`/issues/${id}`)}
                        className="text-primary hover:underline"
                      >
                        {id.slice(0, 8)}
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {issue.blocking && issue.blocking.length > 0 && (
                <div>
                  <span className="font-medium">Blocking:</span>{" "}
                  {issue.blocking.map((id, idx) => (
                    <span key={id}>
                      {idx > 0 && ", "}
                      <button
                        onClick={() => router.push(`/issues/${id}`)}
                        className="text-primary hover:underline"
                      >
                        {id.slice(0, 8)}
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {(!issue.blockedBy || issue.blockedBy.length === 0) &&
                (!issue.blocking || issue.blocking.length === 0) && (
                  <p>No related issues</p>
                )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Activity Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Activity</h2>
            <ActivityFeed
              entityId={issueId}
              limit={20}
              className="text-sm"
            />
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Comments Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Comments
                {comments.length > 0 && (
                  <span className="text-muted-foreground text-lg">({comments.length})</span>
                )}
              </h2>

              {!showCommentEditor && (
                <Button onClick={() => setShowCommentEditor(true)}>
                  Add Comment
                </Button>
              )}
            </div>

            {/* Comment List */}
            {commentsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : comments.length === 0 && !showCommentEditor ? (
              <div className="text-center p-8 bg-muted/30 rounded-lg">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No comments yet</p>
                <Button onClick={() => setShowCommentEditor(true)}>
                  Add the first comment
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback>{getUserInitials(comment.userId)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{comment.userId}</span>
                        <span className="text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                        {comment.isInternal && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                            Internal
                          </span>
                        )}
                      </div>

                      <div className="prose prose-sm max-w-none">
                        {comment.content && <p>{comment.content}</p>}
                      </div>

                      {comment.mentions && comment.mentions.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Mentioned: {comment.mentions.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New Comment Editor */}
            {showCommentEditor && (
              <div className="border rounded-lg p-4 bg-card space-y-4">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback>
                      {session?.user?.name?.slice(0, 2).toUpperCase() || "ME"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <ProseMirrorEditor
                      noteId={`comment-new-${issueId}-${Date.now()}`}
                      spaceId={workspace?.id || ""}
                      onSave={handleSaveComment}
                      placeholder="Add a comment... Use @ to mention people, ![[entity]] to link to other items"
                      enableComments={false}
                      enableOntologyRefs={true}
                      enableMentions={true}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowCommentEditor(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button disabled={submitting}>
                    {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {submitting ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l bg-muted/10 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">Priority</h3>
            <Badge
              variant="outline"
              className="capitalize cursor-pointer"
              onClick={() => {
                // TODO: Open priority popover
              }}
            >
              {issue.priority || "None"}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Assignee</h3>
            {issue.assigneeId ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getUserInitials(issue.assigneeId)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{issue.assigneeId}</span>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Open assignee selector
                }}
              >
                Assign
              </Button>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Tags</h3>
            {issue.labels && issue.labels.length > 0 ? (
              <div className="flex gap-1 flex-wrap">
                {issue.labels.map((label, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Open tag selector
                }}
              >
                Add Tags
              </Button>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Project</h3>
            {project ? (
              <button
                onClick={() => router.push(`/project/${project.id}/issues`)}
                className="text-sm text-primary hover:underline"
              >
                {project.name}
              </button>
            ) : issue.projectId ? (
              <span className="text-sm text-muted-foreground">{issue.projectId}</span>
            ) : (
              <span className="text-sm text-muted-foreground">No project</span>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Details</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium capitalize">{issue.status.replace('-', ' ')}</dd>
              </div>
              {issue.dueDate && (
                <div>
                  <dt className="text-muted-foreground">Due Date</dt>
                  <dd className="font-medium">
                    {new Date(issue.dueDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {issue.estimate && (
                <div>
                  <dt className="text-muted-foreground">Estimate</dt>
                  <dd className="font-medium">{issue.estimate} points</dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Timestamps</h3>
            <dl className="space-y-2 text-xs text-muted-foreground">
              <div>
                <dt>Created</dt>
                <dd>{new Date(issue.createdAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{new Date(issue.updatedAt).toLocaleString()}</dd>
              </div>
              {issue.completedAt && (
                <div>
                  <dt>Completed</dt>
                  <dd>{new Date(issue.completedAt).toLocaleString()}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
