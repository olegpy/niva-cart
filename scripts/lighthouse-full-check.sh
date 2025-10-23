#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Lighthouse Performance Check${NC}"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Build the application
echo -e "${YELLOW}📦 Building the application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please fix build errors before running Lighthouse.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Start the production server in the background
echo -e "${YELLOW}🌐 Starting production server...${NC}"
npm start &
SERVER_PID=$!

# Wait for server to start
echo -e "${YELLOW}⏳ Waiting for server to start...${NC}"
sleep 10

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${RED}❌ Server failed to start. Please check for errors.${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✅ Server is running${NC}"

# Run Lighthouse CI
echo -e "${YELLOW}🔍 Running Lighthouse performance audit...${NC}"
npm run lighthouse:ci

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Lighthouse audit failed${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Check the scores
echo -e "${YELLOW}📊 Checking performance scores...${NC}"
npm run lighthouse:check
CHECK_RESULT=$?

# Stop the server
echo -e "${YELLOW}🛑 Stopping server...${NC}"
kill $SERVER_PID 2>/dev/null

# Exit with the same code as the check
if [ $CHECK_RESULT -eq 0 ]; then
    echo -e "${GREEN}🎉 All performance checks passed!${NC}"
else
    echo -e "${RED}❌ Performance checks failed. Please optimize your application.${NC}"
fi

exit $CHECK_RESULT
