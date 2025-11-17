'use client';

import { useState } from 'react';
import { Flow, type FlowNode, type FlowEdge } from '@captify-io/flow/client';
import { Button } from '@captify-io/base/ui';
import { Card } from '@captify-io/base/ui';
import type { WorkflowNode, WorkflowEdge, WorkflowDefinition } from '@/types/workflow';
import { NODE_DEFINITIONS } from '@/types/workflow/nodes';

export function WorkflowBuilderClient() {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<string>('custom');

  const handleSave = () => {
    const workflow: WorkflowDefinition = {
      nodes: nodes as WorkflowNode[],
      edges: edges as WorkflowEdge[],
      metadata: {
        name: 'My Workflow',
        version: '1.0.0',
      },
    };
    console.log('Saving workflow:', workflow);
    // TODO: Save to DynamoDB
  };

  const handleExecute = () => {
    console.log('Executing workflow');
    // TODO: Execute workflow
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Toolbar */}
      <div className="border-b bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Workflow Builder</h1>
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="rounded border px-3 py-1 text-sm"
            >
              <option value="custom">Custom</option>
              <option value="sequential">Sequential</option>
              <option value="parallel">Parallel</option>
              <option value="routing">Routing</option>
              <option value="orchestrator">Orchestrator</option>
              <option value="evaluator">Evaluator</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" onClick={handleExecute}>
              Execute
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Node Palette */}
        <div className="w-64 border-r bg-background p-4 overflow-auto">
          <h3 className="mb-4 text-sm font-semibold">Nodes</h3>
          <div className="space-y-2">
            {Object.values(NODE_DEFINITIONS).map((node) => (
              <Card
                key={node.type}
                className="cursor-pointer p-3 hover:bg-accent"
                onClick={() => console.log('Add node:', node.type)}
              >
                <div className="text-sm font-medium">{node.label}</div>
                <div className="text-xs text-muted-foreground">{node.description}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1">
          <Flow
            nodes={nodes}
            edges={edges}
            mode="workflow"
            config={{
              toolbar: {
                enabled: true,
                buttons: ['save', 'undo', 'clear', 'autoLayout'],
              },
              palette: {
                enabled: false, // Using custom palette
              },
              sidebar: {
                enabled: true,
                tabs: ['node', 'edge'],
              },
              canvas: {
                snapToGrid: true,
                gridSize: 20,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
