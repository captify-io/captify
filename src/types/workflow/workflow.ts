/**
 * Core Workflow Types
 * Defines the structure of workflows, nodes, edges, and execution context
 */

import type { Node, Edge } from '@xyflow/react';

// ===============================================================
// WORKFLOW NODE & EDGE TYPES
// ===============================================================

export type WorkflowNodeType =
  | 'start'         // Start node with state variables
  | 'agent'         // LLM agent with tools
  | 'llm'           // Direct LLM call (OpenAI, Anthropic, Bedrock)
  | 'end'           // End node
  | 'note'          // Documentation/comment node
  | 'file_search'   // File search tool
  | 'guardrails'    // Content moderation
  | 'aws_service'   // AWS service call
  | 'if_else'       // Conditional logic (if/else)
  | 'while'         // Loop over items
  | 'user_approval' // Wait for user approval
  | 'transform'     // Data transformation
  | 'set_state';    // Set state variable

export type WorkflowNodeStatus = 'idle' | 'running' | 'success' | 'error';

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  icon?: string;
  status?: WorkflowNodeStatus;
  config: Record<string, any>;
}

export interface WorkflowNode extends Node<WorkflowNodeData> {
  type: WorkflowNodeType;
}

export interface WorkflowEdge extends Edge {
  label?: string; // For conditional edges (true/false)
  animated?: boolean; // Show animation for active flow
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata?: {
    name?: string;
    description?: string;
    version?: string;
    tags?: string[];
  };
}

// ===============================================================
// WORKFLOW EXECUTION CONTEXT
// ===============================================================

export interface WorkflowContext {
  variables: Record<string, any>; // Workflow state
  inputs: Record<string, any>; // Initial parameters
  outputs: Record<string, any>; // Results to return
  confirmed: boolean; // User confirmation flag
  requiresConfirmation: boolean; // Waiting for user
  pendingNode?: string; // Node waiting for confirmation
  history: Array<{
    nodeId: string;
    type: string;
    timestamp: number;
    data?: any;
  }>;
}

export interface WorkflowExecutionResult {
  success: boolean;
  requiresConfirmation?: boolean;
  message?: string;
  context?: WorkflowContext;
  output?: any;
  error?: string;
}

// ===============================================================
// WORKFLOW STATE (for thread persistence)
// ===============================================================

export interface WorkflowState {
  currentWorkflow?: string; // Current workflow ID
  variables: Record<string, any>; // Runtime variables
  completedSteps: string[]; // Completed step IDs
  pendingSteps: string[]; // Pending step IDs
  lastStepTimestamp: number;
  history?: Array<{
    stepId: string;
    stepType: string;
    timestamp: number;
    data?: any;
  }>;
}

// ===============================================================
// WORKFLOW CRUD TYPES
// ===============================================================

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  graph: WorkflowDefinition;
  pattern?: 'sequential' | 'parallel' | 'routing' | 'orchestrator' | 'evaluator' | 'custom';
  tags?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version?: string;
  active?: boolean;
}

export interface CreateWorkflowRequest {
  name: string;
  description?: string;
  graph: WorkflowDefinition;
  pattern?: Workflow['pattern'];
  tags?: string[];
}

export interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  graph?: WorkflowDefinition;
  pattern?: Workflow['pattern'];
  tags?: string[];
  active?: boolean;
}

export interface ListWorkflowsRequest {
  pattern?: Workflow['pattern'];
  tags?: string[];
  createdBy?: string;
  limit?: number;
  nextToken?: string;
}
