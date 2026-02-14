#!/bin/bash

echo "=========================================="
echo "Cleaning Primary School Microfrontend"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Clean Container
echo -e "${BLUE}Cleaning Container...${NC}"
cd "${ROOT_DIR}/container" && npm run clean 2>/dev/null

# Clean Maths-Science module
echo -e "${BLUE}Cleaning Maths-Science module...${NC}"
cd "${ROOT_DIR}/maths-science" && npm run clean 2>/dev/null

# Clean Exam module
echo -e "${BLUE}Cleaning Exam module...${NC}"
cd "${ROOT_DIR}/exam" && npm run clean 2>/dev/null

# Clean Student Records module
echo -e "${BLUE}Cleaning Student Records module...${NC}"
cd "${ROOT_DIR}/student-records" && npm run clean 2>/dev/null

echo ""
echo "=========================================="
echo -e "${GREEN}Cleanup completed!${NC}"
echo "=========================================="
