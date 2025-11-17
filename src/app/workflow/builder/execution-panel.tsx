/**
 * Execution Panel Component
 * Displays workflow execution status and logs
 */

'use client';

import React from 'react';
import { Card } from '@captify-io/base/ui';
import type { WorkflowExecution, WorkflowExecutionStep } from '@/types/workflow/execution';

export interface ExecutionPanelProps {
  execution?: WorkflowExecution;
  onCancel?: () => void;
}

export function ExecutionPanel({ execution, onCancel }: ExecutionPanelProps) {
  if (!execution) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">No execution in progress</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Execution Status</h3>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              execution.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : execution.status === 'failed'
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {execution.status}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Workflow ID:</span>
            <span className="font-mono">{execution.workflowId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Started:</span>
            <span>{new Date(execution.startTime).toLocaleString()}</span>
          </div>
          {execution.endTime && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span>{Math.round((execution.endTime - execution.startTime) / 1000)}s</span>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="text-sm font-semibold mb-3">Execution Steps</h4>
        <div className="space-y-2">
          {execution.steps.map((step, index) => (
            <ExecutionStepItem key={index} step={step} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function ExecutionStepItem({ step }: { step: WorkflowExecutionStep }) {
  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{step.nodeName}</span>
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            step.status === 'completed'
              ? 'bg-green-100 text-green-700'
              : step.status === 'error'
              ? 'bg-red-100 text-red-700'
              : step.status === 'running'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {step.status}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">
        <span className="font-mono">{step.nodeType}</span>
        {step.endTime && step.startTime && (
          <span className="ml-2">
            ({Math.round((step.endTime - step.startTime) / 1000)}s)
          </span>
        )}
      </div>
      {step.error && (
        <div className="mt-2 p-2 bg-red-50 text-red-700 text-xs rounded">
          {step.error}
        </div>
      )}
    </div>
  );
}
