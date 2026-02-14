#!/bin/bash

echo "Stopping production services..."

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Find and kill processes on the specified ports
kill_process_on_port() {
  local port=$1
  local service_name=$2

  # Find PID listening on port
  PID=$(lsof -ti:$port 2>/dev/null)

  if [ -z "$PID" ]; then
    echo -e "${YELLOW}No process found on port $port for $service_name${NC}"
  else
    echo -e "${YELLOW}Stopping $service_name (PID: $PID) on port $port...${NC}"
    kill -TERM $PID 2>/dev/null
    sleep 1

    # Force kill if still running
    if kill -0 $PID 2>/dev/null; then
      kill -9 $PID 2>/dev/null
    fi

    echo -e "${GREEN}✓ $service_name stopped${NC}"
  fi
}

# Stop all services
kill_process_on_port ${CONTAINER_PORT:-3000} "Container"
kill_process_on_port ${MATHS_SCIENCE_PORT:-3001} "Maths-Science"
kill_process_on_port ${EXAM_PORT:-3002} "Exam"
kill_process_on_port ${STUDENT_RECORDS_PORT:-3003} "Student Records"

echo ""
echo -e "${GREEN}All services stopped!${NC}"

