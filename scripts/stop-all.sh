#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Stopping Primary School Application"
echo "=========================================="
echo ""

# Kill processes on ports 3000-3003
for port in 3000 3001 3002 3003; do
    pids=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$pids" ]; then
        echo -e "${YELLOW}Stopping service on port $port...${NC}"
        kill $pids 2>/dev/null
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓${NC} Port $port: Service stopped"
        else
            echo -e "${RED}✗${NC} Port $port: Failed to stop service"
        fi
    else
        echo "  Port $port: No service running"
    fi
done

echo ""
echo "=========================================="
echo -e "${GREEN}All services stopped!${NC}"
echo "=========================================="
echo ""

