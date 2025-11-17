/**
 * End Node Executor
 * Returns final workflow output
 */

import type { WorkflowNode, WorkflowContext, WorkflowExecutionResult } from '@/types/workflow/workflow';

export async function executeEndNode(
  node: WorkflowNode,
  context: WorkflowContext
): Promise<WorkflowExecutionResult> {
  const config = node.data.config;

  // Collect output
  if (config.output) {
    context.outputs.result = context.variables[config.output];
  } else {
    context.outputs.result = context.variables;
  }

  return {
    success: true,
    output: context.outputs.result,
    context,
  };
}
