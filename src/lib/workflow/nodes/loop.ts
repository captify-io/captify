/**
 * Loop Node Executor
 * Executes loop over array items
 */

import type { WorkflowNode, WorkflowContext, WorkflowExecutionResult, WorkflowDefinition } from '@/types/workflow/workflow';

export async function executeLoopNode(
  node: WorkflowNode,
  context: WorkflowContext,
  workflow: WorkflowDefinition,
  executeNodeFn: (node: WorkflowNode) => Promise<WorkflowExecutionResult>
): Promise<WorkflowExecutionResult> {
  const config = node.data.config;
  const variable = config.variable || 'items';
  const array = context.variables[variable];

  if (!Array.isArray(array)) {
    return {
      success: false,
      error: `Loop variable is not an array: ${variable}`,
      context,
    };
  }

  const maxIterations = config.maxIterations || array.length;
  const itemVariable = config.itemVariable || 'item';

  // Store original value to restore later
  const originalItemValue = context.variables[itemVariable];

  // Execute loop body for each item
  for (let i = 0; i < Math.min(array.length, maxIterations); i++) {
    context.variables[itemVariable] = array[i];
    context.variables[`${itemVariable}_index`] = i;

    // For now, we just store the iteration data
    // Actual loop body execution would require finding child nodes
    // This is a simplified implementation
  }

  // Restore original value
  if (originalItemValue !== undefined) {
    context.variables[itemVariable] = originalItemValue;
  } else {
    delete context.variables[itemVariable];
  }

  return {
    success: true,
    context,
  };
}
