#!/bin/bash

# QN Dashboard Deployment Script
# This script builds and deploys the qn-dashboard to Vercel

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${YELLOW}Starting QN Dashboard deployment...${NC}"

# Change to root directory
cd "$ROOT_DIR"

# Check if pnpm is installed
if ! command -v pnpm &>/dev/null; then
    echo -e "${RED}Error: pnpm is not installed. Please install pnpm first.${NC}"
    exit 1
fi

# Check if vercel is installed
if ! command -v vercel &>/dev/null; then
    echo -e "${RED}Error: Vercel CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Step 1: Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pnpm install --frozen-lockfile

# Step 2: Build the dashboard
echo -e "${YELLOW}Building dashboard...${NC}"
pnpm build --filter=@qn/dashboard

# Step 3: Check if build was successful
if [ ! -d "apps/qn-dashboard/out" ]; then
    echo -e "${RED}Error: Build failed. Output directory not found.${NC}"
    exit 1
fi

# Step 4: Prepare deployment directory
echo -e "${YELLOW}Preparing deployment directory...${NC}"
rm -rf qn-dashboard-static
mkdir -p qn-dashboard-static

# Step 5: Copy built files
echo -e "${YELLOW}Copying built files...${NC}"
node -e "const fs = require('fs'); fs.rmSync('qn-dashboard-static', { recursive: true, force: true }); fs.mkdirSync('qn-dashboard-static', { recursive: true }); fs.cpSync('apps/qn-dashboard/out', 'qn-dashboard-static', { recursive: true });"

# Step 6: Create vercel.json if it doesn't exist
if [ ! -f "qn-dashboard-static/vercel.json" ]; then
    echo -e "${YELLOW}Creating vercel.json...${NC}"
    cat >qn-dashboard-static/vercel.json <<'EOF'
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF
fi

# Step 7: Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
cd qn-dashboard-static
vercel --scope=aigency0 --prod --yes

# Step 8: Set alias (optional)
echo -e "${YELLOW}Setting up alias...${NC}"
vercel alias set $(vercel ls --json | jq -r '.[0].url') qn-dashboard

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Your dashboard is available at: https://qn-dashboard.vercel.app${NC}"
