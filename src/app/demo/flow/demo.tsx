'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@captify-io/base/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@captify-io/base/ui';
import { Badge } from '@captify-io/base/ui';
import {
  Flow,
  FlowProvider,
  type FlowNode,
  type FlowEdge,
  type FlowConfig,
} from '@captify-io/flow/client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function Demo() {
  // Sample nodes for demonstrations
  const sampleNodes: FlowNode[] = [
    {
      id: '1',
      type: 'circle',
      position: { x: 250, y: 100 },
      data: {
        label: 'Start',
        icon: 'Play',
        color: '#10b981',
        properties: {},
      },
    },
    {
      id: '2',
      type: 'rounded-rect',
      position: { x: 250, y: 200 },
      data: {
        label: 'Process Data',
        icon: 'Database',
        color: '#3b82f6',
        properties: {},
      },
    },
    {
      id: '3',
      type: 'diamond',
      position: { x: 250, y: 300 },
      data: {
        label: 'Decision',
        icon: 'GitBranch',
        color: '#f59e0b',
        properties: {},
      },
    },
    {
      id: '4',
      type: 'circle',
      position: { x: 100, y: 400 },
      data: {
        label: 'End A',
        icon: 'Check',
        color: '#ef4444',
        properties: {},
      },
    },
    {
      id: '5',
      type: 'circle',
      position: { x: 400, y: 400 },
      data: {
        label: 'End B',
        icon: 'X',
        color: '#ef4444',
        properties: {},
      },
    },
  ];

  const sampleEdges: FlowEdge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'workflow',
      animated: true,
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      type: 'workflow',
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      data: { label: 'Yes' },
    },
    {
      id: 'e3-5',
      source: '3',
      target: '5',
      data: { label: 'No' },
    },
  ];

  return (
    <div className="container mx-auto p-8 space-y-6">
      <Link
        href="/demo"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Demo Hub
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">@captify-io/flow Demo</h1>
        <p className="text-muted-foreground">
          Comprehensive demonstration of ReactFlow-based visualization components
        </p>
      </div>

      {/* Package Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Package Information</CardTitle>
          <CardDescription>
            Flow visualization package built on ReactFlow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Key Features:</h3>
              <ul className="space-y-1 text-sm">
                <li><Badge variant="secondary">Multiple Node Types</Badge> - Circle, Diamond, Rect, etc.</li>
                <li><Badge variant="secondary">Custom Edges</Badge> - Floating, Workflow, Default</li>
                <li><Badge variant="secondary">Interactive Canvas</Badge> - Drag, zoom, pan</li>
                <li><Badge variant="secondary">Toolbar Controls</Badge> - Save, undo, auto-layout</li>
                <li><Badge variant="secondary">Node Palette</Badge> - Drag-and-drop creation</li>
                <li><Badge variant="secondary">Configuration Sidebar</Badge> - Edit node/edge properties</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bundle Info:</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Package:</dt>
                  <dd className="font-mono">@captify-io/flow</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Version:</dt>
                  <dd className="font-mono">1.0.0</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Client Bundle:</dt>
                  <dd className="font-mono">106.29 KB</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Dependencies:</dt>
                  <dd className="font-mono">@xyflow/react ^12.3.5</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demos */}
      <Tabs defaultValue="complete" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="complete">Complete Example</TabsTrigger>
          <TabsTrigger value="nodes">Node Types</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        {/* Tab 1: Complete Workflow Example */}
        <TabsContent value="complete" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Complete Workflow Example</CardTitle>
              <CardDescription>
                Full-featured flow with toolbar, palette, and sidebar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] border rounded-lg overflow-hidden">
                <Flow
                  mode="workflow"
                  initialNodes={sampleNodes}
                  initialEdges={sampleEdges}
                  config={{
                    toolbar: {
                      showSave: true,
                      showUndo: true,
                      showFit: true,
                    },
                    palette: {
                      categories: ['action', 'decision', 'data'],
                      searchable: true,
                    },
                    sidebar: {
                      defaultOpen: true,
                      position: 'right',
                    },
                    canvas: {
                      snapToGrid: true,
                      showMiniMap: true,
                      showControls: true,
                      showBackground: true,
                    },
                  }}
                  onSave={async (graph) => {
                    console.log('Saving graph:', graph);
                  }}
                />
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p><strong>Try:</strong> Drag nodes, connect edges, right-click for context menu, use toolbar buttons</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Node Types */}
        <TabsContent value="nodes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Node Types</CardTitle>
              <CardDescription>
                All node shapes and their variants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { type: 'circle', label: 'Circle Node', description: 'For start/end points' },
                  { type: 'rounded-rect', label: 'Rounded Rectangle', description: 'For processes and actions' },
                  { type: 'diamond', label: 'Diamond Node', description: 'For decisions and branching' },
                  { type: 'parallelogram', label: 'Parallelogram', description: 'For input/output' },
                  { type: 'arrow-rect', label: 'Arrow Rectangle', description: 'For directional flow' },
                  { type: 'ontology-node', label: 'Ontology Node', description: 'For ontology visualization' },
                ].map((nodeInfo) => (
                  <Card key={nodeInfo.type}>
                    <CardHeader>
                      <CardTitle className="text-lg">{nodeInfo.label}</CardTitle>
                      <CardDescription>{nodeInfo.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] border rounded overflow-hidden">
                        <Flow
                          mode="custom"
                          initialNodes={[
                            {
                              id: '1',
                              type: nodeInfo.type,
                              position: { x: 100, y: 80 },
                              data: {
                                label: nodeInfo.label,
                                icon: 'Layers',
                                color: '#3b82f6',
                                properties: {},
                              },
                            },
                          ]}
                          initialEdges={[]}
                          config={{
                            canvas: {
                              showControls: false,
                              showMiniMap: false,
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Features */}
        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Toolbar Features</CardTitle>
                <CardDescription>Control buttons and actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge>Save</Badge>
                  <span>Persist graph state</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Undo/Redo</Badge>
                  <span>History navigation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Fit View</Badge>
                  <span>Auto-zoom to content</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Auto Layout</Badge>
                  <span>Automatic node arrangement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Custom Buttons</Badge>
                  <span>Extensible toolbar</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Canvas Features</CardTitle>
                <CardDescription>Visualization capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge>Snap to Grid</Badge>
                  <span>Aligned positioning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Mini Map</Badge>
                  <span>Overview navigation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Zoom Controls</Badge>
                  <span>+/- zoom buttons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Background Grid</Badge>
                  <span>Visual alignment aid</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Pan & Zoom</Badge>
                  <span>Mouse/touch navigation</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Palette Features</CardTitle>
                <CardDescription>Node creation and discovery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge>Drag & Drop</Badge>
                  <span>Add nodes to canvas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Categorized</Badge>
                  <span>Grouped by type</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Searchable</Badge>
                  <span>Quick node lookup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Custom Nodes</Badge>
                  <span>Add your own types</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sidebar Features</CardTitle>
                <CardDescription>Node and edge configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge>Node Config</Badge>
                  <span>Edit node properties</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Edge Config</Badge>
                  <span>Edit edge properties</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Tabs</Badge>
                  <span>Organized panels</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Collapsible</Badge>
                  <span>Show/hide sidebar</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Configuration */}
        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flow Modes</CardTitle>
              <CardDescription>Different operational modes for various use cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Ontology Mode</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Visualize entity relationships and data models
                  </p>
                  <pre className="text-xs bg-muted p-2 rounded">
{`<Flow mode="ontology" />`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Workflow Mode</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Build process flows and automation workflows
                  </p>
                  <pre className="text-xs bg-muted p-2 rounded">
{`<Flow mode="workflow" />`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Designer Mode</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    General-purpose diagram designer
                  </p>
                  <pre className="text-xs bg-muted p-2 rounded">
{`<Flow mode="designer" />`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Custom Mode</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Fully customizable flow behavior
                  </p>
                  <pre className="text-xs bg-muted p-2 rounded">
{`<Flow mode="custom" 
  config={{...}} />`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Architecture Compliance</CardTitle>
              <CardDescription>Package follows architectural guidelines</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>Client-side components only (ReactFlow is browser-only)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>Uses @captify-io/base for UI components</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>Integrates with @captify-io/ontology for data models</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>Proper client/server code separation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>TypeScript strict mode with zero errors</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50">✓</Badge>
                  <span>External dependencies properly marked (lucide-react, @xyflow/react)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
