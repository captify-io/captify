/**
 * Start Node Executor
 * Initializes workflow variables from input parameters
 */

import type { WorkflowNode, WorkflowContext, WorkflowExecutionResult, WorkflowDefinition } from '@/types/workflow/workflow';

export async function executeStartNode(
  node: WorkflowNode,
  context: WorkflowContext,
  workflow: WorkflowDefinition
): Promise<WorkflowExecutionResult> {
  // Initialize variables from input parameters
  const inputParams = node.data.config.variables || [];
  for (const param of inputParams) {
    if (context.inputs[param.name] !== undefined) {
      context.variables[param.name] = context.inputs[param.name];
    } else if (param.defaultValue !== undefined) {
      context.variables[param.name] = param.defaultValue;
    }
  }

  // Find next node
  const outgoingEdges = workflow.edges.filter((e) => e.source === node.id);
  if (outgoingEdges.length === 0) {
    return {
      success: false,
      error: 'Start node has no outgoing edges',
      context,
    };
  }

  return {
    success: true,
    context,
  };
}
