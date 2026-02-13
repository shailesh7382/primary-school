#!/bin/bash

echo "=========================================="
echo "Installing Primary School Microfrontend"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Install dependencies for Container
echo -e "${BLUE}Installing Container dependencies...${NC}"
cd container && npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Container dependencies installed${NC}"
else
    echo "✗ Failed to install Container dependencies"
    exit 1
fi
cd ..

# Install dependencies for Maths-Science module
echo ""
echo -e "${BLUE}Installing Maths-Science module dependencies...${NC}"
cd maths-science && npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Maths-Science dependencies installed${NC}"
else
    echo "✗ Failed to install Maths-Science dependencies"
    exit 1
fi
cd ..

# Install dependencies for Exam module
echo ""
echo -e "${BLUE}Installing Exam module dependencies...${NC}"
cd exam && npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Exam dependencies installed${NC}"
else
    echo "✗ Failed to install Exam dependencies"
    exit 1
fi
cd ..

# Install dependencies for Student Records module
echo ""
echo -e "${BLUE}Installing Student Records module dependencies...${NC}"
cd student-records && npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Student Records dependencies installed${NC}"
else
    echo "✗ Failed to install Student Records dependencies"
    exit 1
fi
cd ..

echo ""
echo "=========================================="
echo -e "${GREEN}All dependencies installed successfully!${NC}"
echo "=========================================="
