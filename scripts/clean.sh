#!/bin/bash

echo "=========================================="
echo "Cleaning Primary School Microfrontend"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Clean Container
echo -e "${BLUE}Cleaning Container...${NC}"
cd container && npm run clean 2>/dev/null
cd ..

# Clean Maths-Science module
echo -e "${BLUE}Cleaning Maths-Science module...${NC}"
cd maths-science && npm run clean 2>/dev/null
cd ..

# Clean Exam module
echo -e "${BLUE}Cleaning Exam module...${NC}"
cd exam && npm run clean 2>/dev/null
cd ..

# Clean Student Records module
echo -e "${BLUE}Cleaning Student Records module...${NC}"
cd student-records && npm run clean 2>/dev/null
cd ..

echo ""
echo "=========================================="
echo -e "${GREEN}Cleanup completed!${NC}"
echo "=========================================="
