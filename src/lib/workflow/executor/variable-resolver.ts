/**
 * Variable Resolver
 * Resolves template variables in workflow parameters
 */

import type { WorkflowContext } from '@/types/workflow/workflow';

/**
 * Resolve variables in parameters (replace {{variable}} with actual values)
 */
export function resolveVariables(
  params: Record<string, any>,
  context: WorkflowContext
): Record<string, any> {
  const resolved: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    resolved[key] = resolveValue(value, context);
  }

  return resolved;
}

/**
 * Resolve a single value (recursive)
 */
function resolveValue(value: any, context: WorkflowContext): any {
  if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
    // Extract variable name: {{variableName}} -> variableName
    const varName = value.slice(2, -2).trim();
    return context.variables[varName] !== undefined
      ? context.variables[varName]
      : value; // Return original if not found
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveValue(item, context));
  }

  if (value && typeof value === 'object') {
    const resolved: any = {};
    for (const [key, val] of Object.entries(value)) {
      resolved[key] = resolveValue(val, context);
    }
    return resolved;
  }

  return value;
}

/**
 * Replace template variables in a string
 * Supports {{variableName}} syntax
 */
export function replaceVariables(text: string, context: WorkflowContext): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    return context.variables[varName] !== undefined
      ? String(context.variables[varName])
      : match;
  });
}
