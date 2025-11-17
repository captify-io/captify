"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCaptify } from "@captify-io/base/layout";
import { Loader2, Rocket, Plus } from "lucide-react";
import { Button } from "@captify-io/base/ui";

interface Initiative {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  status: string;
  progress?: number;
  startDate?: string;
  targetDate?: string;
}

export default function InitiativesPage() {
  const router = useRouter();
  const { workspace } = useCaptify();
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (workspace?.id) {
      loadInitiatives();
    }
  }, [workspace?.id]);

  async function loadInitiatives() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/captify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          app: "ontology",
          operation: "queryItems",
          data: {
            type: "workspace-initiative",
            indexName: "workspaceId-index",
            keyConditionExpression: "workspaceId = :workspaceId",
            expressionAttributeValues: {
              ":workspaceId": workspace?.id,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setInitiatives(result.data);
      } else {
        setError("Failed to load initiatives");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load initiatives");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading initiatives...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Initiatives</h1>
          <p className="text-muted-foreground mt-1">
            Strategic initiatives and their projects
          </p>
        </div>
        <Button onClick={() => router.push("/workspace/initiatives/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Initiative
        </Button>
      </div>

      {initiatives.length === 0 ? (
        <div className="text-center py-12">
          <Rocket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No initiatives yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first initiative
          </p>
          <Button onClick={() => router.push("/workspace/initiatives/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Initiative
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {initiatives.map((initiative) => (
            <button
              key={initiative.id}
              onClick={() => router.push(`/workspace/initiatives/${initiative.id}`)}
              className="text-left p-6 border rounded-lg hover:border-primary transition-all hover:shadow-md"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: initiative.color || "#6b7280",
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                {initiative.icon && (
                  <span className="text-2xl">{initiative.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">
                    {initiative.name}
                  </h3>
                  {initiative.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {initiative.description}
                    </p>
                  )}
                </div>
              </div>

              {initiative.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{initiative.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${initiative.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded capitalize">
                  {initiative.status}
                </span>
                {initiative.targetDate && (
                  <span>
                    Due {new Date(initiative.targetDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
