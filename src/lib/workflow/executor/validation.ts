/**
 * Workflow Validation
 * Validates workflow structure before execution
 */

import type { WorkflowDefinition, WorkflowNode, WorkflowEdge } from '@/types/workflow/workflow';

export interface ValidationError {
  type: 'error' | 'warning';
  nodeId?: string;
  edgeId?: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate workflow before execution
 */
export function validateWorkflow(workflow: WorkflowDefinition): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check for start node
  const startNodes = workflow.nodes.filter((n) => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push({
      type: 'error',
      message: 'Workflow must have exactly one start node',
    });
  } else if (startNodes.length > 1) {
    errors.push({
      type: 'error',
      message: 'Workflow must have exactly one start node (found multiple)',
    });
  }

  // Check for end node
  const endNodes = workflow.nodes.filter((n) => n.type === 'end');
  if (endNodes.length === 0) {
    warnings.push({
      type: 'warning',
      message: 'Workflow should have at least one end node',
    });
  }

  // Check for disconnected nodes
  const connectedNodeIds = new Set<string>();
  for (const edge of workflow.edges) {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  }

  for (const node of workflow.nodes) {
    if (node.type !== 'start' && node.type !== 'note' && !connectedNodeIds.has(node.id)) {
      warnings.push({
        type: 'warning',
        nodeId: node.id,
        message: `Node "${node.data.label}" is not connected`,
      });
    }
  }

  // Check for cycles (simplified - could be enhanced)
  const hasCycle = detectCycles(workflow.nodes, workflow.edges);
  if (hasCycle) {
    warnings.push({
      type: 'warning',
      message: 'Workflow contains cycles (may cause infinite loops)',
    });
  }

  // Check for nodes with missing configuration
  for (const node of workflow.nodes) {
    if (node.type === 'agent' && !node.data.config.agentId) {
      errors.push({
        type: 'error',
        nodeId: node.id,
        message: `Agent node "${node.data.label}" is missing agentId configuration`,
      });
    }

    if (node.type === 'llm' && (!node.data.config.providerId || !node.data.config.modelId)) {
      errors.push({
        type: 'error',
        nodeId: node.id,
        message: `LLM node "${node.data.label}" is missing providerId or modelId`,
      });
    }

    if (node.type === 'aws_service' && (!node.data.config.service || !node.data.config.operation)) {
      errors.push({
        type: 'error',
        nodeId: node.id,
        message: `AWS Service node "${node.data.label}" is missing service or operation`,
      });
    }
  }

  // Check for edges with missing nodes
  for (const edge of workflow.edges) {
    const sourceNode = workflow.nodes.find((n) => n.id === edge.source);
    const targetNode = workflow.nodes.find((n) => n.id === edge.target);

    if (!sourceNode) {
      errors.push({
        type: 'error',
        edgeId: edge.id,
        message: `Edge references non-existent source node: ${edge.source}`,
      });
    }

    if (!targetNode) {
      errors.push({
        type: 'error',
        edgeId: edge.id,
        message: `Edge references non-existent target node: ${edge.target}`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Simple cycle detection using DFS
 */
function detectCycles(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const adjacencyList = new Map<string, string[]>();
  for (const edge of edges) {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, []);
    }
    adjacencyList.get(edge.source)!.push(edge.target);
  }

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        return true; // Cycle detected
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) {
        return true;
      }
    }
  }

  return false;
}
