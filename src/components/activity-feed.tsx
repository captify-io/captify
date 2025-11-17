"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@captify-io/base/lib/utils";

interface ActivityFeedProps {
  entityId: string;
  limit?: number;
  className?: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  actorId?: string;
  actorName?: string;
}

export function ActivityFeed({ entityId, limit = 20, className }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, [entityId, limit]);

  async function loadActivities() {
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
            type: "activity",
            indexName: "entityId-timestamp-index",
            keyConditionExpression: "entityId = :entityId",
            expressionAttributeValues: {
              ":entityId": entityId,
            },
            scanIndexForward: false, // Most recent first
            limit: limit,
          },
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setActivities(result.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-sm text-destructive p-4", className)}>
        {error}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground p-4", className)}>
        No activity yet
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {activities.map((activity) => (
        <div key={activity.id} className="text-xs">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-foreground">{activity.description}</p>
              <p className="text-muted-foreground mt-0.5">
                {new Date(activity.timestamp).toLocaleString()}
                {activity.actorName && ` • ${activity.actorName}`}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
