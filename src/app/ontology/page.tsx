"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@captify-io/base/ui";
import { Badge } from "@captify-io/base/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@captify-io/base/ui";
import { useOntologyNodes } from "@captify-io/ontology/client";
import type { OntologyNode } from "@captify-io/ontology/client";
import { useState } from "react";
import { Database, Network, Layers, ChevronRight, Package } from "lucide-react";

export default function OntologyPage() {
  const { nodes, isLoading, error } = useOntologyNodes();
  const [selectedNode, setSelectedNode] = useState<OntologyNode | null>(null);

  // Group nodes by domain
  const nodesByDomain = nodes.reduce((acc, node) => {
    const domain = node.domain || "Uncategorized";
    if (!acc[domain]) {
      acc[domain] = [];
    }
    acc[domain].push(node);
    return acc;
  }, {} as Record<string, OntologyNode[]>);

  // Group nodes by category
  const nodesByCategory = nodes.reduce((acc, node) => {
    const category = node.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(node);
    return acc;
  }, {} as Record<string, OntologyNode[]>);

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Ontology</h1>
          <p className="text-muted-foreground">
            Complete ontology structure and entity definitions
          </p>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Ontology</CardTitle>
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
          <h1 className="text-3xl font-bold tracking-tight">Ontology</h1>
          <p className="text-muted-foreground">Loading ontology data...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Ontology</h1>
        <p className="text-muted-foreground">
          Complete ontology structure with {nodes.length} entity definitions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nodes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Domains</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(nodesByDomain).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(nodesByCategory).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nodes.filter((n) => n.active === "true").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Left Panel - Node Browser */}
        <div className="md:col-span-2">
          <Tabs defaultValue="domain" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="domain">By Domain</TabsTrigger>
              <TabsTrigger value="category">By Category</TabsTrigger>
            </TabsList>

            {/* By Domain */}
            <TabsContent value="domain" className="space-y-4 mt-4">
              {Object.entries(nodesByDomain)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([domain, domainNodes]) => (
                  <Card key={domain}>
                    <CardHeader>
                      <CardTitle className="text-lg">{domain}</CardTitle>
                      <CardDescription>
                        {domainNodes.length} {domainNodes.length === 1 ? "node" : "nodes"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {domainNodes.map((node) => (
                          <button
                            key={node.id}
                            onClick={() => setSelectedNode(node)}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors text-left hover:bg-accent ${
                              selectedNode?.id === node.id ? "bg-accent border-primary" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: node.color || "#94a3b8" }}
                              />
                              <div className="min-w-0">
                                <div className="font-medium truncate">{node.name}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {node.type}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            {/* By Category */}
            <TabsContent value="category" className="space-y-4 mt-4">
              {Object.entries(nodesByCategory)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([category, categoryNodes]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">{category}</CardTitle>
                      <CardDescription>
                        {categoryNodes.length} {categoryNodes.length === 1 ? "node" : "nodes"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {categoryNodes.map((node) => (
                          <button
                            key={node.id}
                            onClick={() => setSelectedNode(node)}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors text-left hover:bg-accent ${
                              selectedNode?.id === node.id ? "bg-accent border-primary" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: node.color || "#94a3b8" }}
                              />
                              <div className="min-w-0">
                                <div className="font-medium truncate">{node.name}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {node.type}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Node Details */}
        <div className="md:col-span-1">
          {selectedNode ? (
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedNode.color || "#94a3b8" }}
                  />
                  <CardTitle>{selectedNode.name}</CardTitle>
                </div>
                <CardDescription>{selectedNode.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <code className="text-xs bg-muted px-1 rounded">{selectedNode.id}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <code className="text-xs bg-muted px-1 rounded">{selectedNode.type}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domain:</span>
                    <Badge variant="secondary">{selectedNode.domain}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="outline">{selectedNode.category}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={selectedNode.active === "true" ? "default" : "secondary"}>
                      {selectedNode.active === "true" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {selectedNode.properties?.dataSource && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Source:</span>
                      <code className="text-xs bg-muted px-1 rounded">
                        {selectedNode.properties.dataSource}
                      </code>
                    </div>
                  )}
                </div>

                {selectedNode.properties?.schema && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Schema Properties</h4>
                    <div className="space-y-1 text-xs">
                      {Object.entries(selectedNode.properties.schema.properties || {}).map(
                        ([key, prop]) => {
                          const p = prop as { type?: string; description?: string };
                          return (
                            <div key={key} className="flex items-start gap-2">
                              <code className="bg-muted px-1 rounded min-w-[100px]">{key}</code>
                              <span className="text-muted-foreground">
                                {p.type || "unknown"}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {selectedNode.properties?.indexes && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Indexes</h4>
                    <div className="space-y-1 text-xs">
                      {Object.keys(selectedNode.properties.indexes).map((indexName) => (
                        <div key={indexName} className="flex items-center gap-2">
                          <Database className="h-3 w-3 text-muted-foreground" />
                          <code className="bg-muted px-1 rounded">{indexName}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Select a Node</CardTitle>
                <CardDescription>
                  Click on any node to view its details and schema
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Network className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">No node selected</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
