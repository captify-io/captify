# Captify Application

Enterprise-grade platform for AI agents, workflows, and document collaboration.

## Features

- **Agent Hub**: AI agents with streaming responses and tool use
- **Workflow Builder**: Visual workflow editor with execution engine
- **Fabric Editor**: Real-time collaborative document editing with ProseMirror
- **Ontology Explorer**: Browse and manage knowledge graph entities
- **Workspace Management**: Team collaboration and multi-tenancy

## Quick Start

### Development

```bash
npm install --legacy-peer-deps
npm run dev
```

Visit http://localhost:3000

### Production

```bash
./deploy.sh
```

Or manually:

```bash
npm run build
pm2 start ecosystem.config.cjs
```

## Architecture

### Server

- **Custom Next.js Server**: `server.mjs`
- **HTTP Server**: Port 3000
- **WebSocket Server**: `ws://localhost:3000/ws`
  - `/ws/fabric` - Document collaboration
  - More endpoints coming soon

### Package Structure

```
captify/
├── src/
│   ├── app/              # Next.js pages and API routes
│   ├── lib/
│   │   └── websocket/    # WebSocket server
│   └── types/            # TypeScript types
├── server.mjs            # Custom server with WebSocket
├── ecosystem.config.cjs  # PM2 configuration
├── deploy.sh             # Deployment script
└── package.json          # Dependencies and scripts
```

### Dependencies

This app depends on multiple Captify packages:

- `@captify-io/base` - UI components, utilities, AWS services
- `@captify/agent` - AI agent components
- `@captify/fabric` - Document collaboration (ProseMirror)
- `@captify/flow` - Workflow editor (ReactFlow)
- `@captify/ontology` - Ontology browser
- `@captify/workspace` - Team/workspace management

## Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [WEBSOCKET-DEPLOYMENT.md](WEBSOCKET-DEPLOYMENT.md) - WebSocket deployment
- [WEBSOCKET-ARCHITECTURE.md](WEBSOCKET-ARCHITECTURE.md) - WebSocket architecture
- [src/lib/websocket/README.md](src/lib/websocket/README.md) - WebSocket usage

## Scripts

```bash
npm run dev         # Development server
npm run build       # Build for production
npm start           # Production server
npm run type-check  # TypeScript checking
npm run lint        # ESLint
```

## Deployment

### Automated

```bash
./deploy.sh         # Deploy to production
./deploy.sh dev     # Deploy development mode
```

### Manual

```bash
git pull origin master
npm install --legacy-peer-deps
npm run build
pm2 restart captify
```

### First Time

```bash
npm install --legacy-peer-deps
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## Monitoring

```bash
pm2 status          # Check status
pm2 logs captify    # View logs
pm2 monit           # Real-time monitoring
pm2 restart captify # Restart server
```

## WebSocket Endpoints

### Fabric Collaboration

Connect to: `ws://localhost:3000/ws/fabric?documentId=<id>&clientID=<id>`

Features:
- Real-time document collaboration
- Y.js CRDT synchronization
- ProseMirror step broadcasting
- User awareness (cursors, selections)

### Future Endpoints

- `/ws/agent` - Agent streaming responses
- `/ws/workflow` - Workflow execution updates
- `/ws/notifications` - Real-time notifications

## Environment Variables

Required:
```env
NODE_ENV=production
PORT=3000
NEXTAUTH_URL=https://captify.io
NEXTAUTH_SECRET=your-secret
AWS_REGION=us-east-1
```

Optional:
```env
REDIS_URL=redis://localhost:6379  # For multi-instance scaling
```

## Support

- Issues: GitHub Issues
- Logs: `pm2 logs captify`
- Status: `pm2 status`

## License

Proprietary - Captify LLC
