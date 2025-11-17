/**
 * Workflow Execution Engine
 * Executes workflow graphs with branching, conditions, and loops
 */

import type {
  WorkflowDefinition,
  WorkflowNode,
  WorkflowContext,
  WorkflowExecutionResult,
} from '@/types/workflow/workflow';
import { resolveVariables } from './variable-resolver';
import { validateWorkflow } from './validation';

// Import node executors
import { executeStartNode } from '@/lib/workflow/nodes/start';
import { executeAgentNode } from '@/lib/workflow/nodes/agent';
import { executeLLMNode } from '@/lib/workflow/nodes/llm';
import { executeConditionNode } from '@/lib/workflow/nodes/condition';
import { executeLoopNode } from '@/lib/workflow/nodes/loop';
import { executeTransformNode } from '@/lib/workflow/nodes/transform';
import { executeAWSServiceNode } from '@/lib/workflow/nodes/aws-service';
import { executeHTTPNode } from '@/lib/workflow/nodes/http';
import { executeUserApprovalNode } from '@/lib/workflow/nodes/user-approval';
import { executeSetStateNode } from '@/lib/workflow/nodes/set-state';
import { executeEndNode } from '@/lib/workflow/nodes/end';

export class WorkflowExecutor {
  private workflow: WorkflowDefinition;
  private context: WorkflowContext;
  private credentials?: any;
  private session?: any;
  private visitedNodes: Set<string> = new Set();
  private maxIterations = 100; // Prevent infinite loops

  constructor(
    workflow: WorkflowDefinition,
    inputs: Record<string, any>,
    credentials?: any,
    session?: any,
    previousContext?: WorkflowContext
  ) {
    this.workflow = workflow;
    this.credentials = credentials;
    this.session = session;

    // Initialize or restore context
    this.context = previousContext || {
      variables: {},
      inputs,
      outputs: {},
      confirmed: inputs.confirmed === true,
      requiresConfirmation: false,
      history: [],
    };
  }

  /**
   * Execute the workflow
   */
  async execute(): Promise<WorkflowExecutionResult> {
    try {
      // Validate workflow
      const validation = validateWorkflow(this.workflow);
      if (!validation.valid) {
        return {
          success: false,
          error: `Workflow validation failed: ${validation.errors.map((e) => e.message).join(', ')}`,
        };
      }

      // Find start node
      const startNode = this.workflow.nodes.find((n) => n.type === 'start');
      if (!startNode) {
        return {
          success: false,
          error: 'Workflow must have a start node',
        };
      }

      // If resuming after confirmation, continue from pending node
      if (this.context.pendingNode && this.context.confirmed) {
        const pendingNode = this.workflow.nodes.find((n) => n.id === this.context.pendingNode);
        if (pendingNode) {
          this.context.requiresConfirmation = false;
          this.context.pendingNode = undefined;
          return await this.executeNode(pendingNode);
        }
      }

      // Execute from start
      return await this.executeNode(startNode);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || String(error),
        context: this.context,
      };
    }
  }

  /**
   * Execute a single node
   */
  private async executeNode(node: WorkflowNode): Promise<WorkflowExecutionResult> {
    // Prevent infinite loops
    if (this.visitedNodes.size > this.maxIterations) {
      return {
        success: false,
        error: 'Maximum iteration limit reached (possible infinite loop)',
        context: this.context,
      };
    }

    this.visitedNodes.add(node.id);

    // Log execution
    this.context.history.push({
      nodeId: node.id,
      type: node.type,
      timestamp: Date.now(),
      data: node.data,
    });

    // Execute node based on type
    try {
      let result: WorkflowExecutionResult;

      switch (node.type) {
        case 'start':
          result = await executeStartNode(node, this.context, this.workflow);
          break;
        case 'agent':
          result = await executeAgentNode(node, this.context, this.credentials, this.session);
          break;
        case 'llm':
          result = await executeLLMNode(node, this.context, this.credentials);
          break;
        case 'if_else':
          result = await executeConditionNode(node, this.context, this.workflow);
          break;
        case 'while':
          result = await executeLoopNode(node, this.context, this.workflow, this.executeNode.bind(this));
          break;
        case 'user_approval':
          result = await executeUserApprovalNode(node, this.context);
          break;
        case 'transform':
          result = await executeTransformNode(node, this.context);
          break;
        case 'set_state':
          result = await executeSetStateNode(node, this.context);
          break;
        case 'aws_service':
          result = await executeAWSServiceNode(node, this.context, this.credentials, this.session);
          break;
        case 'end':
          result = await executeEndNode(node, this.context);
          break;
        default:
          result = {
            success: false,
            error: `Unknown node type: ${node.type}`,
            context: this.context,
          };
      }

      // Update context if returned
      if (result.context) {
        this.context = result.context;
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: `Node execution failed: ${error.message}`,
        context: this.context,
      };
    }
  }

  /**
   * Find and execute next node
   */
  async executeNextNode(currentNodeId: string, sourceHandle?: string): Promise<WorkflowExecutionResult> {
    // Find outgoing edges
    const outgoingEdges = this.workflow.edges.filter(
      (e) => e.source === currentNodeId && (!sourceHandle || e.sourceHandle === sourceHandle)
    );

    if (outgoingEdges.length === 0) {
      return {
        success: false,
        error: `No outgoing edge from node ${currentNodeId}`,
        context: this.context,
      };
    }

    // Use first edge (or specific handle)
    const edge = outgoingEdges[0];
    const nextNode = this.workflow.nodes.find((n) => n.id === edge.target);

    if (!nextNode) {
      return {
        success: false,
        error: `Target node not found: ${edge.target}`,
        context: this.context,
      };
    }

    return await this.executeNode(nextNode);
  }
}

/**
 * Execute a workflow (convenience function)
 */
export async function executeWorkflow(
  workflow: WorkflowDefinition,
  inputs: Record<string, any>,
  credentials?: any,
  session?: any,
  previousContext?: WorkflowContext
): Promise<WorkflowExecutionResult> {
  const executor = new WorkflowExecutor(workflow, inputs, credentials, session, previousContext);
  return await executor.execute();
}
