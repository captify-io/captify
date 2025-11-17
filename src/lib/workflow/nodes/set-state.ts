/**
 * Set State Node Executor
 * Stores data in workflow state
 */

import type { WorkflowNode, WorkflowContext, WorkflowExecutionResult } from '@/types/workflow/workflow';
import { resolveVariables } from '@/lib/workflow/executor/variable-resolver';

export async function executeSetStateNode(
  node: WorkflowNode,
  context: WorkflowContext
): Promise<WorkflowExecutionResult> {
  const config = node.data.config;

  // Resolve key and value
  const key = typeof config.key === 'string' ? config.key : String(config.key);
  const value = resolveVariables({ value: config.value }, context).value;

  // Set variable
  context.variables[key] = value;

  return {
    success: true,
    context,
  };
}
