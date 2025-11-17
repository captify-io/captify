# WebSocket Server Deployment Guide

## ✅ Implementation Complete

The centralized WebSocket server is now fully implemented and ready for deployment.

## What Was Built

### 1. Custom Next.js Server with WebSocket Support

**File**: [server.mjs](server.mjs)

- Custom HTTP server that runs Next.js
- WebSocket server listening on `/ws` path
- Automatic handler registration
- Graceful shutdown handling
- Beautiful startup banner showing all endpoints

### 2. WebSocket Manager

**File**: [src/lib/websocket/index.ts](src/lib/websocket/index.ts)

- Centralized connection management
- Pluggable handler system
- Connection tracking per path
- Broadcast utilities
- Heartbeat support

### 3. Fabric Collaboration Handler

**File**: [src/lib/websocket/handlers/fabric.ts](src/lib/websocket/handlers/fabric.ts)

**Features**:
- Real-time document collaboration
- Y.js update broadcasting
- Awareness (cursor/selection) broadcasting
- ProseMirror step synchronization
- Per-document connection tracking

**Endpoints**:
- `ws://localhost:3000/ws/fabric?documentId=<id>&clientID=<id>`

**Utilities Exported**:
```typescript
import {
  broadcastSteps,
  broadcastStepsToClient,
  getConnectionCount,
  getConnectedDocuments,
} from '@/lib/websocket/handlers';
```

### 4. TypeScript Types

**File**: [src/lib/websocket/types.ts](src/lib/websocket/types.ts)

- `ExtendedWebSocket` - WebSocket with custom properties
- `WebSocketHandler` - Handler interface
- `WebSocketManager` - Manager interface

### 5. Handler Registry

**File**: [src/lib/websocket/handlers/index.ts](src/lib/websocket/handlers/index.ts)

Easy to add new handlers:
```typescript
export const handlers: WebSocketHandler[] = [
  fabricHandler,
  // Add new handlers here
];
```

## Directory Structure

```
captify/
├── server.mjs                          # ✅ Custom server with WebSocket
├── ecosystem.config.cjs                # ✅ Updated for custom server
├── package.json                        # ✅ Updated scripts & dependencies
├── WEBSOCKET-ARCHITECTURE.md           # ✅ Architecture documentation
├── WEBSOCKET-DEPLOYMENT.md             # ✅ This file
└── src/
    └── lib/
        └── websocket/
            ├── index.ts                # ✅ WebSocket manager
            ├── types.ts                # ✅ TypeScript types
            ├── README.md               # ✅ Usage documentation
            └── handlers/
                ├── index.ts            # ✅ Handler registry
                └── fabric.ts           # ✅ Fabric collaboration
```

## Package Updates

### Dependencies Added

```json
{
  "dependencies": {
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@types/ws": "^8.5.13"
  }
}
```

### Scripts Updated

```json
{
  "scripts": {
    "dev": "node server.mjs",
    "start": "NODE_ENV=production node server.mjs"
  }
}
```

## Development

### Start the Server

```bash
cd /opt/captify-apps/captify
npm run dev
```

You'll see:
```
╔════════════════════════════════════════════════════════════╗
║  Captify Server Started                                    ║
╠════════════════════════════════════════════════════════════╣
║  HTTP Server:       http://localhost:3000                  ║
║  WebSocket Server:  ws://localhost:3000/ws                 ║
║                                                            ║
║  WebSocket Endpoints:                                      ║
║    - /ws/fabric                                            ║
║                                                            ║
║  Environment:       development                            ║
╚════════════════════════════════════════════════════════════╝
```

### Test WebSocket Connection

```bash
# Install wscat (WebSocket CLI tool)
npm install -g wscat

# Connect to fabric endpoint
wscat -c "ws://localhost:3000/ws/fabric?documentId=test-doc&clientID=test-client"

# You'll receive connection message
< {"type":"connected","clientID":"test-client","documentId":"test-doc"}

# Send test message
> {"type":"sync","documentId":"test-doc"}

# Receive response
< {"type":"synced","documentId":"test-doc"}
```

## Production Deployment

### 1. Build the Application

```bash
npm run build
```

### 2. Start with PM2

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 3. Verify WebSocket Server

```bash
pm2 logs captify
```

Look for the startup banner showing WebSocket endpoints.

### 4. Update Nginx Configuration

Add WebSocket upgrade support to your nginx config:

```nginx
# /etc/nginx/sites-available/captify.io

server {
    listen 80;
    server_name captify.io;

    # WebSocket endpoint
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

    # Regular HTTP traffic
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    server_name captify.io;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # WebSocket endpoint
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

    # Regular HTTPS traffic
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5. Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Test Production WebSocket

```bash
# HTTP
wscat -c "ws://captify.io/ws/fabric?documentId=test&clientID=test"

# HTTPS
wscat -c "wss://captify.io/ws/fabric?documentId=test&clientID=test"
```

## Using in Fabric Client

The fabric client ([/opt/captify-apps/fabric/src/client/editor/prosemirror-editor.tsx](../fabric/src/client/editor/prosemirror-editor.tsx)) already has WebSocket code:

```typescript
// It will automatically connect to:
const wsUrl = process.env.NODE_ENV === 'production'
  ? `wss://${window.location.host}/ws/fabric?documentId=${documentId}&clientID=${clientID}`
  : `ws://localhost:3000/ws/fabric?documentId=${documentId}&clientID=${clientID}`;

const ws = new WebSocket(wsUrl);
```

## Adding New WebSocket Handlers

### Example: Agent Streaming

**1. Create handler**: `src/lib/websocket/handlers/agent.ts`

```typescript
import type { WebSocketHandler } from '../types';

export const agentHandler: WebSocketHandler = {
  path: '/ws/agent',

  async onConnect(ws, req) {
    const url = new URL(req.url!, 'ws://localhost');
    const threadId = url.searchParams.get('threadId');

    ws.threadId = threadId;

    ws.send(JSON.stringify({
      type: 'connected',
      threadId,
    }));
  },

  async onMessage(ws, message) {
    const { type, threadId, data } = JSON.parse(message.toString());

    if (type === 'stream') {
      // Handle streaming request
      // Broadcast chunks as they arrive
    }
  },

  async onClose(ws) {
    console.log(`[Agent] Client disconnected from thread ${ws.threadId}`);
  },

  async onError(ws, error) {
    console.error('[Agent] Error:', error);
  },
};
```

**2. Register**: `src/lib/websocket/handlers/index.ts`

```typescript
import { agentHandler } from './agent';

export const handlers: WebSocketHandler[] = [
  fabricHandler,
  agentHandler, // Add here
];

export { agentHandler };
```

**3. Restart server** - New handler is automatically available at `/ws/agent`

## Monitoring

### Connection Count

```typescript
import { getConnectionCount } from '@/lib/websocket/handlers';

// In your admin dashboard or API route
export async function GET() {
  const fabricCount = getConnectionCount('fabric');

  return Response.json({
    connections: {
      fabric: fabricCount,
    },
  });
}
```

### PM2 Monitoring

```bash
pm2 monit       # Real-time monitoring
pm2 logs captify # View logs
pm2 status      # Check status
```

## Scaling Considerations

### Single Instance (Current)

- ✅ Works for development and small deployments
- ✅ Simple in-memory connection tracking
- ❌ Limited to one server instance

### Multi-Instance (Future)

For horizontal scaling, implement Redis Pub/Sub:

```typescript
// src/lib/websocket/pubsub.ts
import { Redis } from 'ioredis';

const pub = new Redis(process.env.REDIS_URL);
const sub = new Redis(process.env.REDIS_URL);

export function publishUpdate(channel: string, data: any) {
  pub.publish(channel, JSON.stringify(data));
}

sub.subscribe('fabric:updates');
sub.on('message', (channel, message) => {
  // Broadcast to local connections only
});
```

## Security Checklist

- [ ] Implement session verification in `onConnect`
- [ ] Add document access control checks
- [ ] Rate limit connections per user
- [ ] Validate message formats
- [ ] Sanitize user input
- [ ] Add connection limits per document
- [ ] Implement heartbeat/ping-pong
- [ ] Add reconnection token
- [ ] Log suspicious activity

## Next Steps

1. **Test Fabric Integration**: Use fabric editor and verify real-time collaboration
2. **Add Authentication**: Implement session verification in fabric handler
3. **Add Agent Handler**: Create `/ws/agent` for streaming responses
4. **Add Monitoring**: Create admin dashboard for connection stats
5. **Add Rate Limiting**: Prevent abuse
6. **Add Redis**: Enable multi-instance scaling

## Migration from Platform

The old WebSocket utilities in [/opt/captify-apps/platform/src/app/api/lib/fabric-websocket.ts](../../platform/src/app/api/lib/fabric-websocket.ts) can now be deprecated in favor of this centralized implementation.

The broadcast methods are now available from `@/lib/websocket/handlers`.

## Support

For questions or issues:
1. Check [src/lib/websocket/README.md](src/lib/websocket/README.md)
2. Review [WEBSOCKET-ARCHITECTURE.md](WEBSOCKET-ARCHITECTURE.md)
3. Check server logs: `pm2 logs captify`
4. Test with wscat: `wscat -c "ws://localhost:3000/ws/fabric?documentId=test&clientID=test"`
