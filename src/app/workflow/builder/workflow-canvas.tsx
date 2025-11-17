/**
 * Workflow Canvas Component
 * Wraps @captify-io/flow with workflow-specific configuration
 */

'use client';

import { Flow, type FlowProps } from '@captify-io/flow/client';
import type { WorkflowNode, WorkflowEdge } from '@/types/workflow/workflow';

export interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange?: (nodes: WorkflowNode[]) => void;
  onEdgesChange?: (edges: WorkflowEdge[]) => void;
  onNodeClick?: (node: WorkflowNode) => void;
  onEdgeClick?: (edge: WorkflowEdge) => void;
  readOnly?: boolean;
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onEdgeClick,
  readOnly = false,
}: WorkflowCanvasProps) {
  return (
    <Flow
      nodes={nodes}
      edges={edges}
      mode="workflow"
      config={{
        toolbar: {
          enabled: !readOnly,
          buttons: ['save', 'undo', 'clear', 'autoLayout'],
        },
        palette: {
          enabled: !readOnly,
        },
        sidebar: {
          enabled: !readOnly,
          tabs: ['node', 'edge'],
        },
        canvas: {
          snapToGrid: true,
          gridSize: 20,
        },
      }}
    />
  );
}
