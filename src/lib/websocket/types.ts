/**
 * WebSocket Server Types
 */

import type { IncomingMessage } from 'http';
import type { WebSocket } from 'ws';

/**
 * Extended WebSocket with custom properties
 */
export interface ExtendedWebSocket extends WebSocket {
  clientID?: string;
  documentId?: string;
  userId?: string;
  userClearance?: string;
  isAlive?: boolean;
}

/**
 * WebSocket Handler Interface
 * Each feature (fabric, agent, workflow) implements this interface
 */
export interface WebSocketHandler {
  /** Path this handler responds to (e.g., '/ws/fabric') */
  path: string;

  /** Called when a client connects */
  onConnect: (ws: ExtendedWebSocket, req: IncomingMessage) => Promise<void> | void;

  /** Called when a message is received */
  onMessage: (ws: ExtendedWebSocket, message: string | Buffer) => Promise<void> | void;

  /** Called when client disconnects */
  onClose: (ws: ExtendedWebSocket, code: number, reason: Buffer) => Promise<void> | void;

  /** Called on error */
  onError: (ws: ExtendedWebSocket, error: Error) => Promise<void> | void;
}

/**
 * WebSocket Manager Interface
 */
export interface WebSocketManager {
  /** Register a new handler */
  registerHandler: (handler: WebSocketHandler) => void;

  /** Handle incoming WebSocket connection */
  handleConnection: (ws: ExtendedWebSocket, req: IncomingMessage, pathname: string) => void;

  /** Get connection count for a path */
  getConnectionCount: (path: string) => number;

  /** Broadcast message to all connections on a path */
  broadcast: (path: string, message: string) => void;
}
