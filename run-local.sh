#!/bin/bash

echo "========================================"
echo "Residential Apartment Rental Portal"
echo "STARTING LOCAL DEVELOPMENT SERVERS"
echo "========================================"
echo ""

# Check if dependencies are installed
if [ ! -d "backend/venv" ]; then
    echo "ERROR: Backend dependencies not installed"
    echo "Please run ./setup-local.sh first"
    exit 1
fi

if [ ! -d "frontend/user-portal/node_modules" ]; then
    echo "ERROR: User Portal dependencies not installed"
    echo "Please run ./setup-local.sh first"
    exit 1
fi

if [ ! -d "frontend/admin-portal/node_modules" ]; then
    echo "ERROR: Admin Portal dependencies not installed"
    echo "Please run ./setup-local.sh first"
    exit 1
fi

echo "Starting all services..."
echo ""
echo "Services will be available at:"
echo "- Backend API:    http://localhost:5000"
echo "- User Portal:    http://localhost:4200"
echo "- Admin Portal:   http://localhost:4201"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""
echo "========================================"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Start Backend
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start User Portal
cd frontend/user-portal
npm start &
USER_PORTAL_PID=$!
cd ../..

# Wait a moment
sleep 2

# Start Admin Portal
cd frontend/admin-portal
npm start &
ADMIN_PORTAL_PID=$!
cd ../..

echo ""
echo "========================================"
echo "All services started!"
echo "========================================"
echo ""
echo "Backend API:     http://localhost:5000"
echo "User Portal:     http://localhost:4200"
echo "Admin Portal:    http://localhost:4201"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "========================================"
echo ""

# Wait for all background processes
wait
