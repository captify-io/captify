/**
 * Workflow Execution Types
 * Defines execution state, steps, and history
 */

// ===============================================================
// EXECUTION STATE
// ===============================================================

export interface WorkflowExecutionContext {
  variables: Record<string, any>; // Runtime variables
  nodeResults: Record<string, any>; // Results from each node
  errors: Array<{
    nodeId: string;
    error: string;
    timestamp: number;
  }>;
}

export interface WorkflowExecutionStep {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  startTime?: number;
  endTime?: number;
  input?: any;
  output?: any;
  error?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  agentId?: string;
  threadId?: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled' | 'pending_approval';
  steps: WorkflowExecutionStep[];
  context: WorkflowExecutionContext;
  startTime: number;
  endTime?: number;
  triggeredBy: string; // userId
  error?: string;
  metadata?: Record<string, any>;
}

// ===============================================================
// EXECUTION CRUD TYPES
// ===============================================================

export interface CreateExecutionRequest {
  workflowId: string;
  inputs?: Record<string, any>;
  threadId?: string;
  agentId?: string;
}

export interface UpdateExecutionRequest {
  status?: WorkflowExecution['status'];
  steps?: WorkflowExecutionStep[];
  context?: WorkflowExecutionContext;
  error?: string;
  metadata?: Record<string, any>;
}

export interface ListExecutionsRequest {
  workflowId?: string;
  threadId?: string;
  status?: WorkflowExecution['status'];
  triggeredBy?: string;
  limit?: number;
  nextToken?: string;
}

export interface ResumeExecutionRequest {
  executionId: string;
  approved?: boolean;
  inputs?: Record<string, any>;
}
