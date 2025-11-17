/**
 * Transform Node Executor
 * Transforms data using JavaScript expressions
 */

import type { WorkflowNode, WorkflowContext, WorkflowExecutionResult } from '@/types/workflow/workflow';
import { resolveVariables } from '@/lib/workflow/executor/variable-resolver';

export async function executeTransformNode(
  node: WorkflowNode,
  context: WorkflowContext
): Promise<WorkflowExecutionResult> {
  const config = node.data.config;

  try {
    const inputVariable = config.inputVariable || 'data';
    const outputVariable = config.outputVariable || 'result';
    const operation = config.operation || 'map';
    const expression = config.expression || '';

    const inputData = context.variables[inputVariable];

    let result: any;

    switch (operation) {
      case 'map':
        if (Array.isArray(inputData)) {
          // Safe eval with limited scope
          const mapFn = new Function('item', 'index', 'context', `return ${expression}`);
          result = inputData.map((item, index) => mapFn(item, index, context.variables));
        } else {
          result = inputData;
        }
        break;

      case 'filter':
        if (Array.isArray(inputData)) {
          const filterFn = new Function('item', 'index', 'context', `return ${expression}`);
          result = inputData.filter((item, index) => filterFn(item, index, context.variables));
        } else {
          result = inputData;
        }
        break;

      case 'reduce':
        if (Array.isArray(inputData)) {
          const reduceFn = new Function('acc', 'item', 'index', 'context', `return ${expression}`);
          result = inputData.reduce((acc, item, index) => reduceFn(acc, item, index, context.variables), {});
        } else {
          result = inputData;
        }
        break;

      case 'custom':
        // Custom expression with full data access
        const customFn = new Function('data', 'context', `return ${expression}`);
        result = customFn(inputData, context.variables);
        break;

      default:
        result = inputData;
    }

    context.variables[outputVariable] = result;

    return {
      success: true,
      context,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Transform failed: ${error.message}`,
      context,
    };
  }
}
