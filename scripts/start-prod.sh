#!/bin/bash

echo "=========================================="
echo "Starting Production Services"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Get configuration from environment or use defaults
CONTAINER_PORT=${CONTAINER_PORT:-3000}
MATHS_SCIENCE_PORT=${MATHS_SCIENCE_PORT:-3001}
EXAM_PORT=${EXAM_PORT:-3002}
STUDENT_RECORDS_PORT=${STUDENT_RECORDS_PORT:-3003}

# Get URLs from environment or construct from localhost
MATHS_SCIENCE_HOST=${MATHS_SCIENCE_HOST:-localhost}
EXAM_HOST=${EXAM_HOST:-localhost}
STUDENT_RECORDS_HOST=${STUDENT_RECORDS_HOST:-localhost}

MATHS_SCIENCE_URL="http://${MATHS_SCIENCE_HOST}:${MATHS_SCIENCE_PORT}/remoteEntry.js"
EXAM_URL="http://${EXAM_HOST}:${EXAM_PORT}/remoteEntry.js"
STUDENT_RECORDS_URL="http://${STUDENT_RECORDS_HOST}:${STUDENT_RECORDS_PORT}/remoteEntry.js"

echo -e "${YELLOW}Configuration:${NC}"
echo "CONTAINER_PORT: $CONTAINER_PORT"
echo "MATHS_SCIENCE_URL: $MATHS_SCIENCE_URL"
echo "EXAM_URL: $EXAM_URL"
echo "STUDENT_RECORDS_URL: $STUDENT_RECORDS_URL"
echo ""

# Start Maths-Science module
echo -e "${BLUE}Starting Maths-Science module on port ${MATHS_SCIENCE_PORT}...${NC}"
cd "${ROOT_DIR}/maths-science"
NODE_ENV=production npm run serve &
MATHS_PID=$!
sleep 2

# Start Exam module
echo -e "${BLUE}Starting Exam module on port ${EXAM_PORT}...${NC}"
cd "${ROOT_DIR}/exam"
NODE_ENV=production npm run serve &
EXAM_PID=$!
sleep 2

# Start Student Records module
echo -e "${BLUE}Starting Student Records module on port ${STUDENT_RECORDS_PORT}...${NC}"
cd "${ROOT_DIR}/student-records"
NODE_ENV=production npm run serve &
RECORDS_PID=$!
sleep 2

# Start Container with environment variables
echo -e "${BLUE}Starting Container on port ${CONTAINER_PORT}...${NC}"
cd "${ROOT_DIR}/container"
MATHS_SCIENCE_URL=$MATHS_SCIENCE_URL \
EXAM_URL=$EXAM_URL \
STUDENT_RECORDS_URL=$STUDENT_RECORDS_URL \
NODE_ENV=production npm run serve &
CONTAINER_PID=$!

echo ""
echo "=========================================="
echo -e "${GREEN}All services started!${NC}"
echo ""
echo "Service PIDs:"
echo "  Container (PID: $CONTAINER_PID): http://localhost:$CONTAINER_PORT"
echo "  Maths-Science (PID: $MATHS_PID): http://localhost:$MATHS_SCIENCE_PORT"
echo "  Exam (PID: $EXAM_PID): http://localhost:$EXAM_PORT"
echo "  Student Records (PID: $RECORDS_PID): http://localhost:$STUDENT_RECORDS_PORT"
echo ""
echo "To stop services, run: bash scripts/stop-prod.sh"
echo "Or press Ctrl+C"
echo "=========================================="

# Wait for all background processes
wait

