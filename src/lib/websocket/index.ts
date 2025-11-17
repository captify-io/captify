/**
 * WebSocket Manager
 * Centralized WebSocket server with pluggable handlers
 */

import type { IncomingMessage } from 'http';
import type {
  ExtendedWebSocket,
  WebSocketHandler,
  WebSocketManager,
} from './types';

/**
 * Create WebSocket Manager
 */
export function createWebSocketManager(): WebSocketManager {
  const handlers = new Map<string, WebSocketHandler>();
  const connections = new Map<string, Set<ExtendedWebSocket>>();

  return {
    registerHandler(handler: WebSocketHandler) {
      handlers.set(handler.path, handler);
      connections.set(handler.path, new Set());
      console.log(`[WebSocket] Registered handler for ${handler.path}`);
    },

    handleConnection(ws: ExtendedWebSocket, req: IncomingMessage, pathname: string) {
      // Find matching handler
      const handler = handlers.get(pathname);

      if (!handler) {
        console.warn(`[WebSocket] No handler for ${pathname}`);
        ws.close(1003, `No handler for ${pathname}`);
        return;
      }

      // Add to connections
      const pathConnections = connections.get(pathname)!;
      pathConnections.add(ws);

      console.log(`[WebSocket] Client connected to ${pathname} (${pathConnections.size} total)`);

      // Setup heartbeat
      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      // Call handler methods
      handler.onConnect(ws, req);

      ws.on('message', (message) => {
        handler.onMessage(ws, message);
      });

      ws.on('close', (code, reason) => {
        pathConnections.delete(ws);
        console.log(
          `[WebSocket] Client disconnected from ${pathname} (${pathConnections.size} remaining)`
        );
        handler.onClose(ws, code, reason);
      });

      ws.on('error', (error) => {
        handler.onError(ws, error);
      });
    },

    getConnectionCount(path: string) {
      return connections.get(path)?.size || 0;
    },

    broadcast(path: string, message: string) {
      const pathConnections = connections.get(path);
      if (!pathConnections) return;

      let count = 0;
      pathConnections.forEach((ws) => {
        if (ws.readyState === 1) {
          // WebSocket.OPEN = 1
          ws.send(message);
          count++;
        }
      });

      console.log(`[WebSocket] Broadcast to ${count}/${pathConnections.size} clients on ${path}`);
    },
  };
}

// Setup heartbeat interval (30 seconds)
export function setupHeartbeat(manager: WebSocketManager) {
  const interval = setInterval(() => {
    // This would need access to internal connections
    // For now, handlers should implement their own heartbeat
  }, 30000);

  return () => clearInterval(interval);
}
