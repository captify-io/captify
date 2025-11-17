#!/bin/bash
#
# Captify Deployment Script
# Automatically deploys both HTTP and WebSocket servers
#
# Usage:
#   ./deploy.sh          # Deploy to current environment
#   ./deploy.sh dev      # Deploy development mode
#   ./deploy.sh prod     # Deploy production mode
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse environment
ENV=${1:-prod}

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           Captify Deployment Script                       ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║  Environment: ${ENV}${NC}"
echo -e "${BLUE}║  HTTP Server: ✓                                            ║${NC}"
echo -e "${BLUE}║  WebSocket Server: ✓                                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Pull latest code
echo -e "${YELLOW}[1/6]${NC} Pulling latest code..."
git pull origin master || echo -e "${RED}Warning: git pull failed${NC}"

# Step 2: Install dependencies
echo -e "${YELLOW}[2/6]${NC} Installing dependencies..."
npm install --legacy-peer-deps

# Step 3: Build application
echo -e "${YELLOW}[3/6]${NC} Building Next.js application..."
npm run build

# Step 4: Stop PM2 process
echo -e "${YELLOW}[4/6]${NC} Stopping existing PM2 process..."
pm2 stop captify || echo -e "${YELLOW}No existing process to stop${NC}"

# Step 5: Start PM2 process
echo -e "${YELLOW}[5/6]${NC} Starting PM2 process..."
if [ "$ENV" = "dev" ]; then
  pm2 start ecosystem.config.cjs --env development
else
  pm2 start ecosystem.config.cjs --env production
fi

# Step 6: Save PM2 configuration
echo -e "${YELLOW}[6/6]${NC} Saving PM2 configuration..."
pm2 save

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ Deployment Complete!                                    ║${NC}"
echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  HTTP:      http://localhost:3000                          ║${NC}"
echo -e "${GREEN}║  WebSocket: ws://localhost:3000/ws                         ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║  WebSocket Endpoints:                                      ║${NC}"
echo -e "${GREEN}║    • /ws/fabric - Document collaboration                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}View logs:${NC}    pm2 logs captify"
echo -e "${BLUE}Monitor:${NC}      pm2 monit"
echo -e "${BLUE}Status:${NC}       pm2 status"
echo -e "${BLUE}Restart:${NC}      pm2 restart captify"
echo ""
