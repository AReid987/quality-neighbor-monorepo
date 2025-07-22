#!/bin/bash

# QN Platform Deployment Script
# This script builds and deploys the qn-platform to Vercel

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${YELLOW}Starting QN Platform deployment...${NC}"

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

# Step 2: Build the platform
echo -e "${YELLOW}Building platform...${NC}"
pnpm build --filter=qn-platform

# Step 3: Check if build was successful
if [ ! -d "apps/qn-platform/.next" ]; then
    echo -e "${RED}Error: Build failed. Output directory not found.${NC}"
    exit 1
fi

# Step 4: Deploy to Vercel from the platform directory
echo -e "${YELLOW}Deploying to Vercel...${NC}"
cd apps/qn-platform
vercel --scope=aigency0 --prod --yes

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Your platform is available at the URL shown above${NC}"