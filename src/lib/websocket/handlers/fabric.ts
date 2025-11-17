/**
 * Fabric WebSocket Handler
 * Handles real-time collaboration for ProseMirror documents
 */

import type { IncomingMessage } from 'http';
import type { ExtendedWebSocket, WebSocketHandler } from '../types';

// Store for document connections
const documentConnections = new Map<string, Set<ExtendedWebSocket>>();

/**
 * Register a connection for a document
 */
function registerConnection(documentId: string, ws: ExtendedWebSocket): void {
  if (!documentConnections.has(documentId)) {
    documentConnections.set(documentId, new Set());
  }
  documentConnections.get(documentId)!.add(ws);
}

/**
 * Unregister a connection
 */
function unregisterConnection(documentId: string, ws: ExtendedWebSocket): void {
  const connections = documentConnections.get(documentId);
  if (connections) {
    connections.delete(ws);
    if (connections.size === 0) {
      documentConnections.delete(documentId);
    }
  }
}

/**
 * Broadcast message to all clients except sender
 */
function broadcastExcept(
  documentId: string,
  sender: ExtendedWebSocket,
  message: string
): void {
  const connections = documentConnections.get(documentId);
  if (!connections) return;

  connections.forEach((ws) => {
    if (ws !== sender && ws.readyState === 1) {
      ws.send(message);
    }
  });
}

/**
 * Broadcast message to all clients including sender
 */
function broadcastAll(documentId: string, message: string): void {
  const connections = documentConnections.get(documentId);
  if (!connections) return;

  connections.forEach((ws) => {
    if (ws.readyState === 1) {
      ws.send(message);
    }
  });
}

/**
 * Fabric WebSocket Handler
 */
export const fabricHandler: WebSocketHandler = {
  path: '/ws/fabric',

  async onConnect(ws: ExtendedWebSocket, req: IncomingMessage) {
    try {
      const url = new URL(req.url!, 'ws://localhost');
      const documentId = url.searchParams.get('documentId');
      const clientID = url.searchParams.get('clientID');

      if (!documentId || !clientID) {
        ws.close(1003, 'Missing documentId or clientID');
        return;
      }

      // TODO: Verify user has access to document
      // const session = await verifySession(req);
      // if (!session) {
      //   ws.close(4401, 'Unauthorized');
      //   return;
      // }

      ws.clientID = clientID;
      ws.documentId = documentId;

      registerConnection(documentId, ws);

      // Send connected message
      ws.send(
        JSON.stringify({
          type: 'connected',
          clientID,
          documentId,
        })
      );

      console.log(`[Fabric] Client ${clientID} connected to document ${documentId}`);
    } catch (error) {
      console.error('[Fabric] Connection error:', error);
      ws.close(1011, 'Internal error');
    }
  },

  async onMessage(ws: ExtendedWebSocket, rawMessage: string | Buffer) {
    try {
      const message = JSON.parse(rawMessage.toString());
      const { type, documentId } = message;

      if (!documentId || documentId !== ws.documentId) {
        console.warn('[Fabric] Document ID mismatch');
        return;
      }

      switch (type) {
        case 'sync':
          // Handle sync request (Y.js state vector)
          // For now, just acknowledge
          ws.send(
            JSON.stringify({
              type: 'synced',
              documentId,
            })
          );
          break;

        case 'update':
          // Broadcast Y.js update to other clients
          broadcastExcept(
            documentId,
            ws,
            JSON.stringify({
              type: 'update',
              documentId,
              update: message.update,
              clientID: ws.clientID,
            })
          );
          break;

        case 'awareness':
          // Broadcast awareness update (cursor position, selection, etc.)
          broadcastExcept(
            documentId,
            ws,
            JSON.stringify({
              type: 'awareness',
              documentId,
              awareness: message.awareness,
              clientID: ws.clientID,
            })
          );
          break;

        case 'selection':
          // Broadcast selection changes
          broadcastExcept(
            documentId,
            ws,
            JSON.stringify({
              type: 'selection',
              documentId,
              selection: message.selection,
              clientID: ws.clientID,
            })
          );
          break;

        case 'steps':
          // ProseMirror steps (for collab plugin)
          broadcastExcept(
            documentId,
            ws,
            JSON.stringify({
              type: 'steps',
              documentId,
              steps: message.steps,
              version: message.version,
              clientID: ws.clientID,
            })
          );
          break;

        default:
          console.warn('[Fabric] Unknown message type:', type);
      }
    } catch (error) {
      console.error('[Fabric] Message error:', error);
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
        })
      );
    }
  },

  async onClose(ws: ExtendedWebSocket) {
    if (ws.documentId) {
      unregisterConnection(ws.documentId, ws);
      console.log(
        `[Fabric] Client ${ws.clientID} disconnected from document ${ws.documentId}`
      );
    }
  },

  async onError(ws: ExtendedWebSocket, error: Error) {
    console.error(`[Fabric] WebSocket error for client ${ws.clientID}:`, error);
  },
};

/**
 * Exported utilities for API routes
 */

/**
 * Broadcast steps to specific client
 */
export async function broadcastStepsToClient(
  documentId: string,
  clientID: string,
  steps: any[],
  changeId: string
): Promise<void> {
  const connections = documentConnections.get(documentId);
  if (!connections) {
    console.log(`[Fabric] No clients connected to ${documentId}`);
    return;
  }

  const message = JSON.stringify({
    type: 'steps',
    steps,
    clientIDs: steps.map(() => 'agent'),
    changeId,
  });

  let found = false;
  connections.forEach((ws) => {
    if (ws.clientID === clientID && ws.readyState === 1) {
      ws.send(message);
      found = true;
    }
  });

  if (!found) {
    console.warn(`[Fabric] Client ${clientID} not found`);
  }
}

/**
 * Broadcast steps to all clients
 */
export async function broadcastSteps(
  documentId: string,
  steps: any[],
  changeId: string
): Promise<void> {
  const message = JSON.stringify({
    type: 'steps',
    steps,
    clientIDs: steps.map(() => 'agent'),
    changeId,
  });

  broadcastAll(documentId, message);
}

/**
 * Get connection count for a document
 */
export function getConnectionCount(documentId: string): number {
  return documentConnections.get(documentId)?.size || 0;
}

/**
 * Get all connected documents
 */
export function getConnectedDocuments(): string[] {
  return Array.from(documentConnections.keys());
}
