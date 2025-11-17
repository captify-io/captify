# WebSocket Server

Centralized WebSocket server for real-time features in Captify.

## Architecture

```
HTTP/WebSocket Server (port 3000)
├── Next.js App (HTTP)
└── WebSocket Server (/ws)
    ├── /ws/fabric       ✅ Implemented
    ├── /ws/agent        🚧 Future
    ├── /ws/workflow     🚧 Future
    └── /ws/notifications 🚧 Future
```

## Files

```
src/lib/websocket/
├── index.ts              # WebSocket manager
├── types.ts              # TypeScript types
├── handlers/
│   ├── index.ts          # Handler registry
│   └── fabric.ts         # Fabric collaboration handler
└── README.md             # This file

server.mjs                # Custom Next.js server with WebSocket support
```

## Usage

### Starting the Server

```bash
# Development
npm run dev

# Production
npm run build
npm run start
```

The server will start both HTTP and WebSocket servers on port 3000.

### Connecting from Client

```typescript
// Example: Fabric editor connection
const ws = new WebSocket('ws://localhost:3000/ws/fabric?documentId=doc-123&clientID=client-456');

ws.onopen = () => {
  console.log('Connected to Fabric WebSocket');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};

ws.send(JSON.stringify({
  type: 'update',
  documentId: 'doc-123',
  update: yjsUpdate
}));
```

## Fabric Handler

### Connection

- **Path**: `/ws/fabric`
- **Query Params**: `documentId`, `clientID`
- **Authentication**: Session cookie (future)

### Message Types

#### Client → Server

```typescript
{
  type: 'sync' | 'update' | 'awareness' | 'selection' | 'steps',
  documentId: string,
  data: any
}
```

#### Server → Client

```typescript
{
  type: 'connected' | 'synced' | 'update' | 'awareness' | 'selection' | 'steps',
  documentId: string,
  clientID?: string,
  data: any
}
```

### Broadcast Methods

From API routes or other server code:

```typescript
import {
  broadcastSteps,
  broadcastStepsToClient,
  getConnectionCount,
} from '@/lib/websocket/handlers';

// Broadcast to all clients
await broadcastSteps(documentId, steps, changeId);

// Broadcast to specific client
await broadcastStepsToClient(documentId, clientID, steps, changeId);

// Get connection count
const count = getConnectionCount(documentId);
```

## Adding New Handlers

1. Create handler file: `handlers/my-feature.ts`

```typescript
import type { WebSocketHandler } from '../types';

export const myFeatureHandler: WebSocketHandler = {
  path: '/ws/my-feature',

  async onConnect(ws, req) {
    // Handle connection
  },

  async onMessage(ws, message) {
    // Handle messages
  },

  async onClose(ws) {
    // Handle disconnection
  },

  async onError(ws, error) {
    // Handle errors
  },
};
```

2. Register in `handlers/index.ts`:

```typescript
import { myFeatureHandler } from './my-feature';

export const handlers = [
  fabricHandler,
  myFeatureHandler, // Add here
];
```

3. Server automatically picks up new handlers on restart

## Production Deployment

### PM2

The `ecosystem.config.cjs` is already configured to use `server.mjs`:

```bash
npm run build
pm2 start ecosystem.config.cjs
pm2 logs captify
```

### Nginx

Add WebSocket upgrade support to nginx config:

```nginx
location /ws/ {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;

    # WebSocket timeouts
    proxy_read_timeout 86400;
    proxy_send_timeout 86400;
}
```

## Scaling

For multi-instance deployments, implement Redis Pub/Sub:

```typescript
import { Redis } from 'ioredis';

const pub = new Redis();
const sub = new Redis();

// Publish updates to all instances
export function publishUpdate(channel: string, data: any) {
  pub.publish(channel, JSON.stringify(data));
}

// Subscribe to updates from other instances
sub.subscribe('fabric:updates');
sub.on('message', (channel, message) => {
  const data = JSON.parse(message);
  // Broadcast to local connections
});
```

## Security

### Authentication (To Implement)

```typescript
import { getSession } from 'next-auth/react';

async onConnect(ws, req) {
  // Verify session from cookie
  const session = await getSessionFromCookie(req);

  if (!session) {
    ws.close(4401, 'Unauthorized');
    return;
  }

  ws.userId = session.user.id;
}
```

### Authorization

```typescript
async onMessage(ws, message) {
  // Check document access
  const hasAccess = await checkDocumentAccess(
    ws.userId,
    message.documentId
  );

  if (!hasAccess) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Access denied'
    }));
    return;
  }
}
```

## Monitoring

```typescript
import { getConnectionCount } from './handlers';

// In your admin dashboard
const fabricConnections = getConnectionCount('fabric');
```

## Testing

```bash
# Test WebSocket connection
npm install -g wscat

wscat -c "ws://localhost:3000/ws/fabric?documentId=test&clientID=test"

# Send test message
> {"type":"sync","documentId":"test"}

# Receive response
< {"type":"synced","documentId":"test"}
```

## Troubleshooting

### Connection Refused

- Check server is running: `npm run dev`
- Check port 3000 is not in use: `lsof -i :3000`

### Messages Not Broadcasting

- Check connection count: `getConnectionCount(documentId)`
- Check client is sending correct documentId
- Check WebSocket readyState is OPEN (1)

### Memory Leaks

- Ensure connections are cleaned up in `onClose`
- Monitor with: `pm2 monit`
