#!/bin/bash

echo "========================================"
echo "Residential Apartment Rental Portal"
echo "========================================"
echo ""
echo "Starting all services with Docker Compose..."
echo ""
echo "This will start:"
echo "- PostgreSQL Database (port 5432)"
echo "- Flask Backend API (port 5000)"
echo "- User Portal (port 4200)"
echo "- Admin Portal (port 4201)"
echo ""
echo "Please wait while containers are built and started..."
echo ""

docker-compose up --build

echo ""
echo "========================================"
echo "Services stopped"
echo "========================================"
