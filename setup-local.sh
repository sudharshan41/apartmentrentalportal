#!/bin/bash

echo "========================================"
echo "Residential Apartment Rental Portal"
echo "LOCAL DEVELOPMENT SETUP"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.11 or higher"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js 20 or higher from https://nodejs.org/"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "WARNING: PostgreSQL is not running on localhost:5432"
    echo "You need to start PostgreSQL or use Docker for the database"
    echo ""
    echo "To use Docker for database only:"
    echo "  docker run -d --name rental_db -e POSTGRES_DB=rental_portal -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin123 -p 5432:5432 postgres:15-alpine"
    echo ""
    read -p "Press Enter to continue..."
fi

echo ""
echo "========================================"
echo "STEP 1: Installing Backend Dependencies"
echo "========================================"
echo ""

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Installing Python packages..."
source venv/bin/activate
pip install -r requirements.txt

cd ..

echo ""
echo "========================================"
echo "STEP 2: Installing User Portal Dependencies"
echo "========================================"
echo ""

cd frontend/user-portal

if [ ! -d "node_modules" ]; then
    echo "Installing User Portal npm packages..."
    npm install
else
    echo "User Portal dependencies already installed"
fi

cd ../..

echo ""
echo "========================================"
echo "STEP 3: Installing Admin Portal Dependencies"
echo "========================================"
echo ""

cd frontend/admin-portal

if [ ! -d "node_modules" ]; then
    echo "Installing Admin Portal npm packages..."
    npm install
else
    echo "Admin Portal dependencies already installed"
fi

cd ../..

echo ""
echo "========================================"
echo "SETUP COMPLETE!"
echo "========================================"
echo ""
echo "All dependencies have been installed successfully."
echo ""
echo "To start the application, run:"
echo "  ./run-local.sh"
echo ""
