/**
 * Parallel Pattern Executor
 * Executes workflow tasks concurrently
 * Based on AI SDK 6 parallel pattern
 */

import { generateText } from 'ai';
import type { ParallelWorkflow } from '@/types/workflow/ai-patterns';
import type { WorkflowExecutionResult } from '@/types/workflow/workflow';

export async function executeParallelPattern(
  pattern: ParallelWorkflow,
  inputs: Record<string, any>,
  credentials?: any
): Promise<WorkflowExecutionResult> {
  try {
    // Execute all tasks in parallel using Promise.all
    const results = await Promise.all(
      pattern.tasks.map(async (task) => {
        const inputData = task.inputVariable ? inputs[task.inputVariable] : inputs;

        switch (task.type) {
          case 'llm': {
            const { text } = await generateText({
              model: task.config.model || 'gpt-4',
              prompt: typeof inputData === 'string' ? inputData : JSON.stringify(inputData),
              system: task.config.systemPrompt,
              temperature: task.config.temperature || 0.7,
            });
            return { taskId: task.id, output: text };
          }

          case 'agent': {
            // Agent call (would use agent service)
            return { taskId: task.id, output: 'Agent response' };
          }

          default:
            return { taskId: task.id, output: inputData };
        }
      })
    );

    // Aggregate results based on aggregation strategy
    let finalOutput: any;
    const resultMap = Object.fromEntries(results.map((r) => [r.taskId, r.output]));

    switch (pattern.aggregation) {
      case 'array':
        finalOutput = results.map((r) => r.output);
        break;
      case 'merge':
        finalOutput = resultMap;
        break;
      case 'custom':
        // Would execute custom aggregation expression
        finalOutput = resultMap;
        break;
      default:
        finalOutput = resultMap;
    }

    return {
      success: true,
      output: finalOutput,
      context: {
        variables: { ...inputs, ...resultMap, [pattern.finalOutput]: finalOutput },
        inputs,
        outputs: { [pattern.finalOutput]: finalOutput },
        confirmed: false,
        requiresConfirmation: false,
        history: [],
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Parallel execution failed: ${error.message}`,
    };
  }
}
