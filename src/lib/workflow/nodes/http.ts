/**
 * HTTP Node Executor
 * Makes HTTP requests to external APIs
 */

import type { WorkflowNode, WorkflowContext, WorkflowExecutionResult } from '@/types/workflow/workflow';
import { resolveVariables } from '@/lib/workflow/executor/variable-resolver';

export async function executeHTTPNode(
  node: WorkflowNode,
  context: WorkflowContext,
  credentials?: any,
  session?: any
): Promise<WorkflowExecutionResult> {
  const config = node.data.config;

  try {
    // Resolve variables in URL, headers, and body
    const url = resolveVariables(config.url, context);
    const method = config.method || 'GET';
    const headers = resolveVariables(config.headers || {}, context);
    const body = config.body ? resolveVariables(config.body, context) : undefined;

    // Build fetch options
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    // Add body for POST/PUT/PATCH
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Make HTTP request
    const response = await fetch(url, options);

    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Check for errors
    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        context: {
          ...context,
          variables: {
            ...context.variables,
            [`${config.outputVariable}_error`]: {
              status: response.status,
              statusText: response.statusText,
              data,
            },
          },
        },
      };
    }

    // Store result in variable if specified
    if (config.outputVariable) {
      context.variables[config.outputVariable] = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
      };
    }

    return {
      success: true,
      context,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `HTTP request failed: ${error.message}`,
      context,
    };
  }
}
