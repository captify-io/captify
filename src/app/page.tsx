"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@captify-io/base/ui";
import { Database, Package, Layers, Network, TrendingUp, Clock } from "lucide-react";
import { useOntologyNodes } from "@captify-io/ontology/client";
import { useMemo } from "react";

export default function InsightsPage() {
  const { nodes, isLoading, error } = useOntologyNodes();

  // Calculate metrics from real ontology data
  const metrics = useMemo(() => {
    const nodesByDomain = nodes.reduce((acc, node) => {
      const domain = node.domain || "Uncategorized";
      if (!acc[domain]) {
        acc[domain] = [];
      }
      acc[domain].push(node);
      return acc;
    }, {} as Record<string, typeof nodes>);

    const nodesByCategory = nodes.reduce((acc, node) => {
      const category = node.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(node);
      return acc;
    }, {} as Record<string, typeof nodes>);

    const activeNodes = nodes.filter((n) => n.active === "true");
    const nodesWithDataSource = nodes.filter((n) => n.properties?.dataSource);

    return {
      totalNodes: nodes.length,
      domains: Object.keys(nodesByDomain).length,
      categories: Object.keys(nodesByCategory).length,
      activeNodes: activeNodes.length,
      nodesByDomain,
      nodesByCategory,
      nodesWithDataSource: nodesWithDataSource.length,
    };
  }, [nodes]);

  // Get recently updated nodes (sorted by updatedAt)
  const recentActivity = useMemo(() => {
    return [...nodes]
      .sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [nodes]);

  // Get top domains by node count
  const topDomains = useMemo(() => {
    return Object.entries(metrics.nodesByDomain)
      .map(([domain, domainNodes]) => ({
        domain,
        count: domainNodes.length,
        percentage: ((domainNodes.length / metrics.totalNodes) * 100).toFixed(0),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [metrics.nodesByDomain, metrics.totalNodes]);

  // Format relative time
  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
          <p className="text-muted-foreground">
            Overview of your ontology and workspace metrics
          </p>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Data</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
          <p className="text-muted-foreground">Loading ontology data...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">
          Overview of your ontology structure and entity definitions
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entities</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalNodes}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.nodesWithDataSource} with data sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Domains</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.domains}</div>
            <p className="text-xs text-muted-foreground">
              Organized by business domain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.categories}</div>
            <p className="text-xs text-muted-foreground">
              Entity, concept, process, etc.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Entities</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeNodes}</div>
            <p className="text-xs text-green-600 dark:text-green-400">
              {((metrics.activeNodes / metrics.totalNodes) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Top Domains */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Recently updated ontology entities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((node) => (
                  <div key={node.id} className="flex items-center gap-4">
                    <div
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: node.color || "#94a3b8" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{node.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {node.domain} • {formatRelativeTime(node.updatedAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <div className="text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Domains</CardTitle>
            <CardDescription>
              Domains with the most entities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDomains.length > 0 ? (
                topDomains.map((item) => (
                  <div key={item.domain} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.domain}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.count} {item.count === 1 ? "entity" : "entities"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {item.percentage}%
                      </div>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <div className="text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No domains found</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
