#!/bin/bash

# Test the API locally
echo "Testing local dev server API..."
echo ""

# Start dev server in background
npm run dev &
DEV_PID=$!

# Wait for dev server to start
sleep 3

# Test the API endpoint
echo "Calling http://localhost:5173/api/weather?lat=-1.2921&lon=36.8219"
echo ""

curl -s "http://localhost:5173/api/weather?lat=-1.2921&lon=36.8219&units=metric&days=7" | head -100

echo ""
echo ""
echo "API test complete"

# Kill the dev server
kill $DEV_PID 2>/dev/null

exit 0
