#!/bin/bash

echo "=========================================="
echo "Building Primary School Microfrontend"
echo "for Production"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Function to build a module
build_module() {
  local module_name=$1
  local module_path="${ROOT_DIR}/${module_name}"

  echo -e "${BLUE}Building ${module_name}...${NC}"
  cd "${module_path}"

  if npm run build; then
    echo -e "${GREEN}✓ ${module_name} built successfully${NC}"
    return 0
  else
    echo -e "${RED}✗ Failed to build ${module_name}${NC}"
    return 1
  fi
}

# Track if any build fails
FAILED=0

# Build all modules
build_module "maths-science" || FAILED=1
echo ""
build_module "exam" || FAILED=1
echo ""
build_module "student-records" || FAILED=1
echo ""
build_module "container" || FAILED=1

echo ""
echo "=========================================="
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}All modules built successfully!${NC}"
  echo ""
  echo "Build artifacts are in each module's dist/ folder:"
  echo "  - container/dist/"
  echo "  - maths-science/dist/"
  echo "  - exam/dist/"
  echo "  - student-records/dist/"
  echo ""
  echo "Next steps:"
  echo "1. Copy dist folders to your production server"
  echo "2. Set up a reverse proxy (nginx/Apache) to serve the modules"
  echo "3. Set MATHS_SCIENCE_URL, EXAM_URL, STUDENT_RECORDS_URL env vars"
  echo "=========================================="
  exit 0
else
  echo -e "${RED}Build failed! Check errors above.${NC}"
  echo "=========================================="
  exit 1
fi

