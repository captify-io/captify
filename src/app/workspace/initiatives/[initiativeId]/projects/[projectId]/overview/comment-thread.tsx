"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useCaptify } from "@captify-io/base/layout";
import { Button, Avatar, AvatarFallback } from "@captify-io/base/ui";
import { Loader2, MessageSquare } from "lucide-react";
import dynamic from "next/dynamic";
import type { IssueComment } from "@captify-io/workspace/types";
import { createComment, listComments } from "@captify-io/workspace/server";

// Dynamically import Fabric editor
const ProseMirrorEditor = dynamic(
  () => import("@captify-io/fabric/client").then((mod) => ({ default: mod.ProseMirrorEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    ),
  }
);

interface CommentThreadProps {
  entityId: string;
  entityType: string;
  workspaceId: string;
}

export function CommentThread({ entityId, entityType, workspaceId }: CommentThreadProps) {
  const { session } = useCaptify();
  const [comments, setComments] = useState<IssueComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCommentEditor, setShowCommentEditor] = useState(false);

  // Load comments
  useEffect(() => {
    loadComments();
  }, [entityId]);

  async function loadComments() {
    setLoading(true);
    try {
      const data = await listComments(entityId);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveComment = useCallback(
    async (doc: any) => {
      if (!session?.user?.id) return;

      setSubmitting(true);
      try {
        await createComment({
          issueId: entityId, // Works for any entity type
          userId: session.user.id,
          doc,
          isInternal: false,
        });

        // Reload comments
        await loadComments();
        setShowCommentEditor(false);
      } catch (err) {
        console.error("Failed to create comment:", err);
      } finally {
        setSubmitting(false);
      }
    },
    [entityId, session?.user?.id]
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
    // TODO: Fetch actual user name from workspace members
    return userId.slice(0, 2).toUpperCase();
  };

  return (
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
      {loading ? (
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

                {/* Render comment doc */}
                <div className="prose prose-sm max-w-none">
                  {comment.content && <p>{comment.content}</p>}
                  {/* TODO: Render actual ProseMirror doc properly */}
                </div>

                {/* Mentions */}
                {comment.mentions && comment.mentions.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Mentioned: {comment.mentions.join(", ")}
                  </div>
                )}

                {/* Attachments */}
                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="space-y-1">
                    {comment.attachments.map((attachment, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span>📎</span>
                        <span>{attachment.fileName}</span>
                        <span className="text-xs">
                          ({Math.round(attachment.fileSize / 1024)}KB)
                        </span>
                      </div>
                    ))}
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
                noteId={`comment-new-${entityId}-${Date.now()}`}
                spaceId={workspaceId}
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
  );
}
