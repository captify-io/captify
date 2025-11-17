/**
 * Workflow Builder Component
 * Main component for building and editing workflows
 */

'use client';

import React, { useState } from 'react';
import { WorkflowCanvas } from './workflow-canvas';
import { NodePalette } from './node-palette';
import { ExecutionPanel } from './execution-panel';
import type { WorkflowNode, WorkflowEdge, WorkflowDefinition } from '@/types/workflow/workflow';
import type { WorkflowExecution } from '@/types/workflow/execution';

export interface WorkflowBuilderProps {
  workflowId?: string;
  initialWorkflow?: WorkflowDefinition;
  onSave?: (workflow: WorkflowDefinition) => void;
  onExecute?: (workflow: WorkflowDefinition) => void;
  execution?: WorkflowExecution;
}

export function WorkflowBuilder({
  workflowId,
  initialWorkflow,
  onSave,
  onExecute,
  execution,
}: WorkflowBuilderProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialWorkflow?.nodes || []);
  const [edges, setEdges] = useState<WorkflowEdge[]>(initialWorkflow?.edges || []);
  const [showPalette, setShowPalette] = useState(true);
  const [showExecution, setShowExecution] = useState(false);

  const handleSave = () => {
    const workflow: WorkflowDefinition = {
      nodes,
      edges,
      metadata: initialWorkflow?.metadata,
    };
    onSave?.(workflow);
  };

  const handleExecute = () => {
    const workflow: WorkflowDefinition = {
      nodes,
      edges,
      metadata: initialWorkflow?.metadata,
    };
    onExecute?.(workflow);
    setShowExecution(true);
  };

  return (
    <div className="flex h-screen">
      {/* Node Palette */}
      {showPalette && (
        <div className="border-r bg-background">
          <NodePalette onNodeSelect={(type) => console.log('Selected:', type)} />
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1">
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
        />
      </div>

      {/* Execution Panel */}
      {showExecution && execution && (
        <div className="w-96 border-l bg-background p-4 overflow-auto">
          <ExecutionPanel execution={execution} />
        </div>
      )}
    </div>
  );
}
