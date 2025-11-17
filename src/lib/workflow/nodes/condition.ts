/**
 * Condition Node Executor
 * Executes if/else branching based on conditions
 */

import type { WorkflowNode, WorkflowContext, WorkflowExecutionResult, WorkflowDefinition } from '@/types/workflow/workflow';

export async function executeConditionNode(
  node: WorkflowNode,
  context: WorkflowContext,
  workflow: WorkflowDefinition
): Promise<WorkflowExecutionResult> {
  const config = node.data.config;
  const variable = context.variables[config.variable];
  const value = config.compareValue;
  const operator = config.operator || '==';

  // Evaluate condition
  let result = false;
  switch (operator) {
    case '==':
      result = variable == value;
      break;
    case '!=':
      result = variable != value;
      break;
    case '>':
      result = variable > value;
      break;
    case '<':
      result = variable < value;
      break;
    case '>=':
      result = variable >= value;
      break;
    case '<=':
      result = variable <= value;
      break;
    case 'contains':
      result = String(variable).includes(String(value));
      break;
    case 'startsWith':
      result = String(variable).startsWith(String(value));
      break;
    case 'endsWith':
      result = String(variable).endsWith(String(value));
      break;
    default:
      result = false;
  }

  // Store result in context for next node
  context.variables['_conditionResult'] = result;

  return {
    success: true,
    context,
  };
}
