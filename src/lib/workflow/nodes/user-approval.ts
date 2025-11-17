/**
 * User Approval Node Executor
 * Pauses workflow and waits for user approval
 */

import type { WorkflowNode, WorkflowContext, WorkflowExecutionResult } from '@/types/workflow/workflow';

export async function executeUserApprovalNode(
  node: WorkflowNode,
  context: WorkflowContext
): Promise<WorkflowExecutionResult> {
  const config = node.data.config;

  // Check if user has confirmed
  if (context.confirmed) {
    // User confirmed, continue
    context.confirmed = false; // Reset for next confirmation
    return {
      success: true,
      context,
    };
  }

  // Need confirmation - pause execution
  context.requiresConfirmation = true;
  context.pendingNode = node.id;

  // Prepare confirmation message
  const message =
    config.message ||
    `Please review the following data and confirm:\n\n${JSON.stringify(context.variables, null, 2)}`;

  return {
    success: true,
    requiresConfirmation: true,
    message,
    context,
    output: {
      pendingData: context.variables,
      confirmationParams: {
        ...context.inputs,
        confirmed: true,
      },
    },
  };
}
