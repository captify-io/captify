/**
 * Custom Next.js Server with WebSocket Support
 *
 * This custom server enables WebSocket support for real-time features:
 * - /ws/fabric - Document collaboration
 * - /ws/agent - Agent streaming
 * - /ws/workflow - Workflow updates
 * - /ws/notifications - Real-time notifications
 */

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer } from 'ws';
import { createWebSocketManager } from './src/lib/websocket/index.js';
import { handlers } from './src/lib/websocket/handlers/index.js';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Prepare Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log('[Server] Preparing Next.js application...');

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('[Server] Error handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Create WebSocket server
  const wss = new WebSocketServer({
    noServer: true, // We handle the upgrade manually
    path: '/ws',
  });

  // Create WebSocket manager
  const wsManager = createWebSocketManager();

  // Register all handlers
  handlers.forEach((handler) => {
    wsManager.registerHandler(handler);
  });

  // Handle WebSocket upgrade
  server.on('upgrade', (req, socket, head) => {
    const { pathname } = parse(req.url, true);

    // Check if path starts with /ws
    if (!pathname?.startsWith('/ws')) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wsManager.handleConnection(ws, req, pathname);
    });
  });

  // Start server
  server.listen(port, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  Captify Server Started                                    ║
╠════════════════════════════════════════════════════════════╣
║  HTTP Server:       http://${hostname}:${port}              ║
║  WebSocket Server:  ws://${hostname}:${port}/ws             ║
║                                                            ║
║  WebSocket Endpoints:                                      ║
${handlers.map((h) => `║    - ${h.path.padEnd(50)} ║`).join('\n')}
║                                                            ║
║  Environment:       ${dev ? 'development' : 'production'}  ║
╚════════════════════════════════════════════════════════════╝
    `);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\n[Server] Shutting down gracefully...');

    // Close WebSocket server
    wss.close(() => {
      console.log('[Server] WebSocket server closed');
    });

    // Close HTTP server
    server.close(() => {
      console.log('[Server] HTTP server closed');
      process.exit(0);
    });

    // Force exit after 10 seconds
    setTimeout(() => {
      console.error('[Server] Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
});
