/**
 * AI SDK Workflow Pattern Types
 * Based on Vercel AI SDK patterns: sequential, parallel, routing, orchestrator, evaluator
 */

// ===============================================================
// AI WORKFLOW PATTERNS
// ===============================================================

export type AIWorkflowPattern =
  | 'sequential'    // Linear chain of steps
  | 'parallel'      // Concurrent execution
  | 'routing'       // LLM-based routing
  | 'orchestrator'  // Master + worker agents
  | 'evaluator'     // Iterative improvement with quality checks
  | 'custom';       // User-defined pattern

// ===============================================================
// SEQUENTIAL PATTERN
// ===============================================================

export interface SequentialStep {
  id: string;
  type: 'llm' | 'agent' | 'transform' | 'aws_service';
  config: Record<string, any>;
  inputVariable?: string;
  outputVariable: string;
}

export interface SequentialWorkflow {
  pattern: 'sequential';
  steps: SequentialStep[];
  finalOutput: string; // Variable name to return
}

// ===============================================================
// PARALLEL PATTERN
// ===============================================================

export interface ParallelTask {
  id: string;
  type: 'llm' | 'agent' | 'aws_service';
  config: Record<string, any>;
  inputVariable?: string;
  outputVariable: string;
}

export interface ParallelWorkflow {
  pattern: 'parallel';
  tasks: ParallelTask[];
  aggregation: 'merge' | 'array' | 'custom';
  aggregationExpression?: string; // JavaScript expression for custom aggregation
  finalOutput: string;
}

// ===============================================================
// ROUTING PATTERN
// ===============================================================

export interface RoutingBranch {
  id: string;
  condition: string; // LLM classification result
  workflow: SequentialWorkflow | ParallelWorkflow;
}

export interface RoutingWorkflow {
  pattern: 'routing';
  classifier: {
    type: 'llm' | 'agent';
    config: Record<string, any>;
    inputVariable: string;
    outputVariable: string; // Classification result
  };
  branches: RoutingBranch[];
  defaultBranch?: string; // Branch ID for unmatched classifications
  finalOutput: string;
}

// ===============================================================
// ORCHESTRATOR PATTERN
// ===============================================================

export interface WorkerAgent {
  id: string;
  role: string; // e.g., "security_reviewer", "performance_optimizer"
  type: 'agent' | 'llm';
  config: Record<string, any>;
  inputVariable?: string;
  outputVariable: string;
}

export interface OrchestratorWorkflow {
  pattern: 'orchestrator';
  orchestrator: {
    type: 'agent';
    config: Record<string, any>;
    systemPrompt: string; // Instructions for coordinating workers
  };
  workers: WorkerAgent[];
  coordination: 'sequential' | 'parallel'; // How workers are invoked
  finalOutput: string;
}

// ===============================================================
// EVALUATOR PATTERN
// ===============================================================

export interface EvaluationCriteria {
  name: string;
  description: string;
  threshold: number; // 0-1 score threshold
  weight?: number; // For weighted scoring
}

export interface EvaluatorWorkflow {
  pattern: 'evaluator';
  generator: {
    type: 'llm' | 'agent';
    config: Record<string, any>;
    inputVariable: string;
    outputVariable: string;
  };
  evaluator: {
    type: 'llm' | 'agent';
    config: Record<string, any>;
    criteria: EvaluationCriteria[];
    outputVariable: string; // Evaluation scores
  };
  maxIterations: number;
  improvementPrompt?: string; // Instructions for improvement
  finalOutput: string;
}

// ===============================================================
// PATTERN UNION TYPE
// ===============================================================

export type AIWorkflow =
  | SequentialWorkflow
  | ParallelWorkflow
  | RoutingWorkflow
  | OrchestratorWorkflow
  | EvaluatorWorkflow;

// ===============================================================
// PATTERN CONVERSION
// ===============================================================

export interface PatternToGraphOptions {
  pattern: AIWorkflow;
  name?: string;
  description?: string;
}

// ===============================================================
// PATTERN TEMPLATES
// ===============================================================

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  pattern: AIWorkflowPattern;
  category: 'content' | 'analysis' | 'automation' | 'custom';
  graph: AIWorkflow;
  tags: string[];
  previewImage?: string;
}
