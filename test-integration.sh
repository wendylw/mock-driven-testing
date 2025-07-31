#!/bin/bash

echo "=== Testing MDT Backend-Frontend Integration ==="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend URL
BACKEND_URL="http://localhost:3000"

# Test 1: Check backend health
echo -e "\n${YELLOW}Test 1: Checking backend health...${NC}"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" $BACKEND_URL/health | tail -1)
if [ "$HEALTH_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}✗ Backend health check failed (HTTP $HEALTH_RESPONSE)${NC}"
    exit 1
fi

# Test 2: Get baselines list
echo -e "\n${YELLOW}Test 2: Getting baselines list...${NC}"
BASELINES_RESPONSE=$(curl -s -w "\n%{http_code}" $BACKEND_URL/api/baselines | tail -1)
if [ "$BASELINES_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ Successfully retrieved baselines${NC}"
    curl -s $BACKEND_URL/api/baselines | jq '.data[] | {id, component, status}'
else
    echo -e "${RED}✗ Failed to get baselines (HTTP $BASELINES_RESPONSE)${NC}"
fi

# Test 3: Get specific baseline status
echo -e "\n${YELLOW}Test 3: Getting baseline status for Button component...${NC}"
STATUS_RESPONSE=$(curl -s -w "\n%{http_code}" $BACKEND_URL/api/baselines/baseline-button-001/status | tail -1)
if [ "$STATUS_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ Successfully retrieved baseline status${NC}"
    curl -s $BACKEND_URL/api/baselines/baseline-button-001/status | jq '.data | {component, status, statusLabel, metrics}'
else
    echo -e "${RED}✗ Failed to get baseline status (HTTP $STATUS_RESPONSE)${NC}"
fi

# Test 4: Trigger analysis
echo -e "\n${YELLOW}Test 4: Triggering analysis for Button component...${NC}"
ANALYSIS_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"force": false}' -w "\n%{http_code}" $BACKEND_URL/api/baselines/baseline-button-001/analyze | tail -1)
if [ "$ANALYSIS_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ Successfully triggered analysis${NC}"
    echo "Analysis completed. Check detailed results in the frontend."
else
    echo -e "${RED}✗ Failed to trigger analysis (HTTP $ANALYSIS_RESPONSE)${NC}"
fi

echo -e "\n${GREEN}=== Integration test completed ===${NC}"
echo -e "\nTo view the full integration:"
echo "1. Ensure backend is running: cd backend && npm run dev"
echo "2. Ensure frontend is running: cd mdt-web && npm run dev"
echo "3. Open http://localhost:3001 in your browser"
echo "4. Navigate to Components Testing > Pure Components > Baselines"