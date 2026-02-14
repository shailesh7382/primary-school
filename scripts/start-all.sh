#!/bin/bash

echo "=========================================="
echo "Starting Primary School Microfrontend"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting all microservices...${NC}"
echo ""

# Start Maths-Science module in background
echo -e "${BLUE}Starting Maths-Science module on port 3001...${NC}"
cd maths-science && npm start &
MATHS_PID=$!
cd ..

# Wait a bit for the first service to initialize
sleep 2

# Start Exam module in background
echo -e "${BLUE}Starting Exam module on port 3002...${NC}"
cd exam && npm start &
EXAM_PID=$!
cd ..

# Wait a bit
sleep 2

# Start Student Records module in background
echo -e "${BLUE}Starting Student Records module on port 3003...${NC}"
cd student-records && npm start &
RECORDS_PID=$!
cd ..

# Wait a bit
sleep 2

# Start Container (main app)
echo -e "${BLUE}Starting Container on port 3000...${NC}"
cd container && npm start &
CONTAINER_PID=$!
cd ..

echo ""
echo "=========================================="
echo -e "${GREEN}All services started!${NC}"
echo "=========================================="
echo ""
echo "Services are running on:"
echo "  - Container (Main App): http://localhost:3000"
echo "  - Maths-Science Module: http://localhost:3001"
echo "  - Exam Module:          http://localhost:3002"
echo "  - Student Records:      http://localhost:3003"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "Stopping all services..."
    kill $MATHS_PID $EXAM_PID $RECORDS_PID $CONTAINER_PID 2>/dev/null
    echo "All services stopped."
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup INT

# Wait for all background processes
wait
