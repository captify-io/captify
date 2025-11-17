/**
 * WebSocket Handlers Registry
 * Export all WebSocket handlers here
 */

import { fabricHandler } from './fabric';
import type { WebSocketHandler } from '../types';

/**
 * All registered WebSocket handlers
 * Add new handlers here as they're implemented
 */
export const handlers: WebSocketHandler[] = [
  fabricHandler,
  // Future handlers:
  // agentHandler,     // Agent streaming responses
  // workflowHandler,  // Workflow execution updates
  // notificationHandler, // Real-time notifications
];

export { fabricHandler };

// Re-export utilities from fabric handler for backward compatibility
export {
  broadcastStepsToClient,
  broadcastSteps,
  getConnectionCount,
  getConnectedDocuments,
} from './fabric';
