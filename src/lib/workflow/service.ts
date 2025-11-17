/**
 * Workflow Service
 * DynamoDB CRUD operations for workflows and executions
 */

import { apiClient } from '@captify-io/base/lib/api';
import type {
  Workflow,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  ListWorkflowsRequest
} from '@/types/workflow/workflow';
import type {
  WorkflowExecution,
  CreateExecutionRequest,
  UpdateExecutionRequest,
  ListExecutionsRequest
} from '@/types/workflow/execution';

// ============================================================================
// WORKFLOW CRUD
// ============================================================================

export async function createWorkflow(data: CreateWorkflowRequest): Promise<{ success: boolean; data?: Workflow; error?: string }> {
  try {
    const result = await apiClient.run({
      service: 'platform.dynamodb',
      operation: 'put',
      table: 'workflow',
      data: {
        id: `workflow-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        active: true,
      },
    });

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getWorkflow(workflowId: string): Promise<{ success: boolean; data?: Workflow; error?: string }> {
  try {
    const result = await apiClient.run({
      service: 'platform.dynamodb',
      operation: 'get',
      table: 'workflow',
      data: { id: workflowId },
    });

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateWorkflow(
  workflowId: string,
  updates: UpdateWorkflowRequest
): Promise<{ success: boolean; data?: Workflow; error?: string }> {
  try {
    const result = await apiClient.run({
      service: 'platform.dynamodb',
      operation: 'update',
      table: 'workflow',
      data: {
        id: workflowId,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    });

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteWorkflow(workflowId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await apiClient.run({
      service: 'platform.dynamodb',
      operation: 'delete',
      table: 'workflow',
      data: { id: workflowId },
    });

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function listWorkflows(params?: ListWorkflowsRequest): Promise<{ success: boolean; data?: Workflow[]; error?: string }> {
  try {
    const result = await apiClient.run({
      service: 'platform.dynamodb',
      operation: 'query',
      table: 'workflow',
      data: {
        IndexName: 'createdBy-createdAt-index',
        KeyConditionExpression: 'createdBy = :userId',
        ExpressionAttributeValues: {
          ':userId': params?.createdBy || 'current-user',
        },
        Limit: params?.limit || 50,
      },
    });

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// EXECUTION CRUD
// ============================================================================

export async function createExecution(data: CreateExecutionRequest): Promise<{ success: boolean; data?: WorkflowExecution; error?: string }> {
  try {
    const result = await apiClient.run({
      service: 'platform.dynamodb',
      operation: 'put',
      table: 'workflow-execution',
      data: {
        id: `exec-${Date.now()}`,
        ...data,
        status: 'running',
        steps: [],
        context: { variables: {}, nodeResults: {}, errors: [] },
        startTime: Date.now(),
        triggeredBy: 'current-user',
      },
    });

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getExecution(executionId: string): Promise<{ success: boolean; data?: WorkflowExecution; error?: string }> {
  try {
    const result = await apiClient.run({
      service: 'platform.dynamodb',
      operation: 'get',
      table: 'workflow-execution',
      data: { id: executionId },
    });

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateExecution(
  executionId: string,
  updates: UpdateExecutionRequest
): Promise<{ success: boolean; data?: WorkflowExecution; error?: string }> {
  try {
    const result = await apiClient.run({
      service: 'platform.dynamodb',
      operation: 'update',
      table: 'workflow-execution',
      data: {
        id: executionId,
        ...updates,
        endTime: updates.status === 'completed' || updates.status === 'failed' ? Date.now() : undefined,
      },
    });

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function listExecutions(params?: ListExecutionsRequest): Promise<{ success: boolean; data?: WorkflowExecution[]; error?: string }> {
  try {
    const result = await apiClient.run({
      service: 'platform.dynamodb',
      operation: 'query',
      table: 'workflow-execution',
      data: {
        IndexName: params?.workflowId ? 'workflowId-startTime-index' : 'threadId-startTime-index',
        KeyConditionExpression: params?.workflowId
          ? 'workflowId = :workflowId'
          : 'threadId = :threadId',
        ExpressionAttributeValues: params?.workflowId
          ? { ':workflowId': params.workflowId }
          : { ':threadId': params?.threadId || 'current-thread' },
        Limit: params?.limit || 50,
      },
    });

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
