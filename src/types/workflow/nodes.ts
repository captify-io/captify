/**
 * Workflow Node Definitions
 * Defines the schema, inputs, outputs, and configuration for each node type
 */

export type NodeCategory = 'core' | 'tools' | 'logic' | 'data';
export type IOType = 'json' | 'text' | 'widget' | 'any';

export interface NodeIO {
  type: IOType;
  schema?: Record<string, any>; // JSON Schema for validation
  description?: string;
  required?: boolean;
}

export interface NodeDefinition {
  type: string;
  label: string;
  description: string;
  category: NodeCategory;
  icon: string;
  inputs: Record<string, NodeIO>;
  outputs: Record<string, NodeIO>;
  config: Record<string, any>;
}

// ===============================================================
// CORE NODES
// ===============================================================

export const START_NODE: NodeDefinition = {
  type: 'start',
  label: 'Start',
  description: 'Starting point of workflow with state variables',
  category: 'core',
  icon: 'Play',
  inputs: {},
  outputs: {
    start: {
      type: 'any',
      description: 'Workflow execution begins',
    },
  },
  config: {
    variables: [] as Array<{
      name: string;
      type: 'string' | 'number' | 'boolean' | 'object' | 'list';
      defaultValue: any;
    }>,
  },
};

export const AGENT_NODE: NodeDefinition = {
  type: 'agent',
  label: 'Agent',
  description: 'LLM agent with system prompt and tool access',
  category: 'core',
  icon: 'Bot',
  inputs: {
    message: {
      type: 'text',
      description: 'User message or prompt to send to agent',
      required: true,
    },
    context: {
      type: 'json',
      description: 'Additional context data (optional)',
    },
  },
  outputs: {
    response: {
      type: 'text',
      description: 'Agent response text',
    },
    tool_calls: {
      type: 'json',
      description: 'Tool calls made by the agent',
    },
  },
  config: {
    agentId: '',
    threadId: '',
    systemPrompt: '',
    tools: [],
  },
};

export const LLM_NODE: NodeDefinition = {
  type: 'llm',
  label: 'LLM',
  description: 'Direct LLM call with provider and model selection',
  category: 'core',
  icon: 'Sparkles',
  inputs: {
    message: {
      type: 'text',
      description: 'Message to send to LLM',
      required: true,
    },
  },
  outputs: {
    response: {
      type: 'text',
      description: 'LLM response text',
    },
  },
  config: {
    providerId: '',
    modelId: '',
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 1000,
    inputVariable: 'message',
    outputVariable: 'response',
  },
};

export const END_NODE: NodeDefinition = {
  type: 'end',
  label: 'End',
  description: 'Terminate workflow and return output',
  category: 'core',
  icon: 'Square',
  inputs: {
    output: {
      type: 'any',
      description: 'Final workflow output',
      required: true,
    },
  },
  outputs: {},
  config: {
    returnFormat: 'json',
  },
};

// ===============================================================
// LOGIC NODES
// ===============================================================

export const IF_ELSE_NODE: NodeDefinition = {
  type: 'if_else',
  label: 'If/Else',
  description: 'Conditional branching based on conditions',
  category: 'logic',
  icon: 'GitBranch',
  inputs: {
    value: {
      type: 'any',
      description: 'Value to evaluate',
      required: true,
    },
  },
  outputs: {
    true: {
      type: 'any',
      description: 'Output if condition is true',
    },
    false: {
      type: 'any',
      description: 'Output if condition is false',
    },
  },
  config: {
    operator: '==',
    compareValue: null,
  },
};

export const WHILE_NODE: NodeDefinition = {
  type: 'while',
  label: 'While',
  description: 'Loop while condition is true',
  category: 'logic',
  icon: 'Repeat',
  inputs: {
    items: {
      type: 'json',
      description: 'Items to iterate',
      required: true,
    },
  },
  outputs: {
    iteration: {
      type: 'json',
      description: 'Current iteration data',
    },
    complete: {
      type: 'json',
      description: 'All iterations complete',
    },
  },
  config: {
    maxIterations: 100,
    itemVariable: 'item',
  },
};

export const USER_APPROVAL_NODE: NodeDefinition = {
  type: 'user_approval',
  label: 'User Approval',
  description: 'Pause workflow and wait for user approval',
  category: 'logic',
  icon: 'UserCheck',
  inputs: {
    request: {
      type: 'json',
      description: 'Approval request data',
      required: true,
    },
  },
  outputs: {
    approved: {
      type: 'json',
      description: 'Whether request was approved',
    },
  },
  config: {
    message: '',
    timeout: 3600000,
  },
};

// ===============================================================
// DATA NODES
// ===============================================================

export const TRANSFORM_NODE: NodeDefinition = {
  type: 'transform',
  label: 'Transform',
  description: 'Transform data using JavaScript expressions',
  category: 'data',
  icon: 'Shuffle',
  inputs: {
    data: {
      type: 'any',
      description: 'Input data to transform',
      required: true,
    },
  },
  outputs: {
    result: {
      type: 'any',
      description: 'Transformed data',
    },
  },
  config: {
    operation: 'map',
    expression: '',
  },
};

export const SET_STATE_NODE: NodeDefinition = {
  type: 'set_state',
  label: 'Set State',
  description: 'Store data in workflow state',
  category: 'data',
  icon: 'Database',
  inputs: {
    key: {
      type: 'text',
      description: 'State variable name',
      required: true,
    },
    value: {
      type: 'any',
      description: 'Value to store',
      required: true,
    },
  },
  outputs: {
    success: {
      type: 'json',
      description: 'Whether state was set successfully',
    },
  },
  config: {
    scope: 'workflow',
  },
};

// ===============================================================
// TOOL NODES
// ===============================================================

export const AWS_SERVICE_NODE: NodeDefinition = {
  type: 'aws_service',
  label: 'AWS Service',
  description: 'Call any AWS service (DynamoDB, S3, Aurora, etc.)',
  category: 'tools',
  icon: 'Cloud',
  inputs: {
    service: {
      type: 'text',
      description: 'AWS service name',
      required: true,
    },
    operation: {
      type: 'text',
      description: 'Service operation',
      required: true,
    },
    parameters: {
      type: 'json',
      description: 'Operation parameters',
      required: true,
    },
  },
  outputs: {
    result: {
      type: 'json',
      description: 'Service response data',
    },
    success: {
      type: 'json',
      description: 'Whether operation succeeded',
    },
  },
  config: {
    service: '',
    operation: '',
    parameters: {},
    table: '',
    outputVariable: 'result',
  },
};

// ===============================================================
// NODE REGISTRY
// ===============================================================

export const NODE_DEFINITIONS: Record<string, NodeDefinition> = {
  start: START_NODE,
  agent: AGENT_NODE,
  llm: LLM_NODE,
  end: END_NODE,
  if_else: IF_ELSE_NODE,
  while: WHILE_NODE,
  user_approval: USER_APPROVAL_NODE,
  transform: TRANSFORM_NODE,
  set_state: SET_STATE_NODE,
  aws_service: AWS_SERVICE_NODE,
};

export const getNodeDefinition = (type: string): NodeDefinition | undefined => {
  return NODE_DEFINITIONS[type];
};

export const getNodesByCategory = (category: NodeCategory): NodeDefinition[] => {
  return Object.values(NODE_DEFINITIONS).filter((node) => node.category === category);
};
