#!/bin/bash

echo "=========================================="
echo "Building Primary School Microfrontend"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Build Maths-Science module first
echo -e "${BLUE}Building Maths-Science module...${NC}"
cd "${ROOT_DIR}/maths-science" && npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Maths-Science module built${NC}"
else
    echo "✗ Failed to build Maths-Science module"
    exit 1
fi

# Build Exam module
echo ""
echo -e "${BLUE}Building Exam module...${NC}"
cd "${ROOT_DIR}/exam" && npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Exam module built${NC}"
else
    echo "✗ Failed to build Exam module"
    exit 1
fi

# Build Student Records module
echo ""
echo -e "${BLUE}Building Student Records module...${NC}"
cd "${ROOT_DIR}/student-records" && npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Student Records module built${NC}"
else
    echo "✗ Failed to build Student Records module"
    exit 1
fi

# Build Container last
echo ""
echo -e "${BLUE}Building Container...${NC}"
cd "${ROOT_DIR}/container" && npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Container built${NC}"
else
    echo "✗ Failed to build Container"
    exit 1
fi

echo ""
echo "=========================================="
echo -e "${GREEN}All modules built successfully!${NC}"
echo "=========================================="
echo ""
echo "Build artifacts are in the 'dist' directories"
echo "of each module."
