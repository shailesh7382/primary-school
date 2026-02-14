#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Primary School Application Status Check"
echo "=========================================="
echo ""

# Check if ports are in use
echo -e "${BLUE}Checking if services are running...${NC}"
echo ""

check_port() {
    local port=$1
    local name=$2
    if lsof -ti:$port > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Port $port ($name): RUNNING"
        return 0
    else
        echo -e "${RED}✗${NC} Port $port ($name): NOT RUNNING"
        return 1
    fi
}

check_port 3000 "Container"
check_port 3001 "Maths-Science"
check_port 3002 "Exam"
check_port 3003 "Student Records"

echo ""
echo -e "${BLUE}Checking HTTP responses...${NC}"
echo ""

check_http() {
    local url=$1
    local name=$2
    local status=$(curl -s -o /dev/null -w "%{http_code}" $url)
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✓${NC} $name: HTTP $status"
        return 0
    else
        echo -e "${RED}✗${NC} $name: HTTP $status"
        return 1
    fi
}

check_http "http://localhost:3000" "Container (Main App)"
check_http "http://localhost:3001" "Maths-Science Module"
check_http "http://localhost:3002" "Exam Module"
check_http "http://localhost:3003" "Student Records Module"

echo ""
echo -e "${BLUE}Checking Module Federation remote entries...${NC}"
echo ""

check_http "http://localhost:3001/remoteEntry.js" "MathsScience remoteEntry.js"
check_http "http://localhost:3002/remoteEntry.js" "Exam remoteEntry.js"
check_http "http://localhost:3003/remoteEntry.js" "StudentRecords remoteEntry.js"

echo ""
echo "=========================================="
echo -e "${GREEN}Application is ready!${NC}"
echo "=========================================="
echo ""
echo "Open your browser and navigate to:"
echo -e "${YELLOW}http://localhost:3000${NC}"
echo ""

