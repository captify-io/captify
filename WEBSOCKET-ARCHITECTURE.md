# WebSocket Server Architecture

## Overview

Centralized WebSocket server at `/ws` with pluggable handlers for different features.

## Architecture

```
WebSocket Server (/ws)
├── /ws/fabric        # Fabric real-time collaboration
├── /ws/agent         # Agent streaming responses
├── /ws/workflow      # Workflow execution updates
└── /ws/notifications # Real-time notifications
```

## Implementation Approach

### Option 1: Custom Server (Recommended for Production)

Use a custom Node.js server with Next.js:

**Pros:**
- Full WebSocket support
- Can use `ws` library
- Production-ready
- Works with PM2

**Cons:**
- Requires custom server setup
- Slightly more complex deployment

### Option 2: API Routes with Upgrade (Not Recommended)

Use Next.js API routes with HTTP upgrade:

**Pros:**
- No custom server needed
- Simpler initial setup

**Cons:**
- Limited WebSocket support in Vercel/serverless
- Edge runtime doesn't support WebSocket
- Not recommended by Next.js team

## Recommended Setup

### 1. Custom Server Structure

```
captify/
├── server.mjs                    # Custom Node.js server
├── src/
│   └── lib/
│       └── websocket/
│           ├── index.ts          # WebSocket manager
│           ├── handlers/
│           │   ├── fabric.ts     # Fabric collaboration handler
│           │   ├── agent.ts      # Agent streaming handler
│           │   └── index.ts      # Handler registry
│           └── types.ts          # Shared types
```

### 2. Handler Interface

Each handler implements:

```typescript
export interface WebSocketHandler {
  path: string;                    // e.g., '/ws/fabric'
  onConnect: (ws: WebSocket, req: Request) => void;
  onMessage: (ws: WebSocket, message: any) => void;
  onClose: (ws: WebSocket) => void;
  onError: (ws: WebSocket, error: Error) => void;
}
```

### 3. Server Implementation

```typescript
// server.mjs
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer } from 'ws';
import { createWebSocketManager } from './src/lib/websocket/index.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // WebSocket server
  const wss = new WebSocketServer({
    server,
    path: '/ws'
  });

  const wsManager = createWebSocketManager();

  wss.on('connection', (ws, req) => {
    const pathname = parse(req.url).pathname;
    wsManager.handleConnection(ws, req, pathname);
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
    console.log('> WebSocket server ready on ws://localhost:3000/ws');
  });
});
```

## Fabric WebSocket Handler

### Message Protocol

```typescript
// Client → Server
{
  type: 'sync' | 'update' | 'awareness' | 'selection',
  documentId: string,
  clientID: string,
  data: any
}

// Server → Client
{
  type: 'sync' | 'update' | 'awareness' | 'steps' | 'agent-change-*',
  documentId: string,
  data: any
}
```

### Handler Implementation

```typescript
// src/lib/websocket/handlers/fabric.ts
import { WebSocket } from 'ws';
import { WebSocketHandler } from '../types';

export const fabricHandler: WebSocketHandler = {
  path: '/ws/fabric',

  onConnect(ws, req) {
    const url = new URL(req.url, 'ws://localhost');
    const documentId = url.searchParams.get('documentId');
    const clientID = url.searchParams.get('clientID');

    ws.clientID = clientID;
    ws.documentId = documentId;

    registerConnection(documentId, ws);

    ws.send(JSON.stringify({
      type: 'connected',
      clientID
    }));
  },

  onMessage(ws, message) {
    const { type, documentId, data } = JSON.parse(message);

    switch (type) {
      case 'sync':
        handleSync(ws, documentId, data);
        break;
      case 'update':
        broadcastUpdate(documentId, ws, data);
        break;
      case 'awareness':
        broadcastAwareness(documentId, ws, data);
        break;
      case 'selection':
        broadcastSelection(documentId, ws, data);
        break;
    }
  },

  onClose(ws) {
    if (ws.documentId) {
      unregisterConnection(ws.documentId, ws);
    }
  },

  onError(ws, error) {
    console.error('[Fabric WS]', error);
  }
};
```

## Deployment

### PM2 Configuration

```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'captify',
      script: 'server.mjs',
      instances: 1,  // WebSocket servers need sticky sessions
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

### Nginx Configuration

```nginx
# Nginx handles the upgrade for WebSocket
location /ws/ {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # WebSocket timeouts
    proxy_read_timeout 86400;
    proxy_send_timeout 86400;
}
```

## Scaling Considerations

### Multi-Instance Setup

For multiple server instances, use Redis Pub/Sub:

```typescript
// src/lib/websocket/pubsub.ts
import { Redis } from 'ioredis';

const pub = new Redis();
const sub = new Redis();

// Publish updates to all instances
export function publishUpdate(channel: string, data: any) {
  pub.publish(channel, JSON.stringify(data));
}

// Subscribe to updates from other instances
sub.subscribe('fabric:updates', 'agent:updates');

sub.on('message', (channel, message) => {
  const data = JSON.parse(message);
  broadcastToLocalConnections(data);
});
```

## Security

### Authentication

```typescript
import { auth } from '@/lib/auth';

onConnect(ws, req) {
  // Verify session from cookie
  const session = await verifySession(req);

  if (!session) {
    ws.close(4401, 'Unauthorized');
    return;
  }

  ws.userId = session.user.id;
  ws.userClearance = session.user.clearanceLevel;
}
```

### Authorization

```typescript
onMessage(ws, message) {
  const { documentId } = message;

  // Check if user has access to document
  const hasAccess = await checkDocumentAccess(
    ws.userId,
    documentId,
    ws.userClearance
  );

  if (!hasAccess) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Access denied'
    }));
    return;
  }

  // Process message...
}
```

## Migration Path

1. **Phase 1**: Create WebSocket manager and fabric handler
2. **Phase 2**: Migrate existing fabric-websocket.ts utilities
3. **Phase 3**: Add agent streaming handler
4. **Phase 4**: Add workflow execution updates
5. **Phase 5**: Add real-time notifications

## Next Steps

1. Create `server.mjs` custom server
2. Implement WebSocket manager
3. Create fabric handler
4. Update package.json scripts
5. Test with fabric editor
6. Deploy to production
