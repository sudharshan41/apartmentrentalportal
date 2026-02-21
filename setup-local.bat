@echo off
echo ========================================
echo Residential Apartment Rental Portal
echo LOCAL DEVELOPMENT SETUP
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11 or higher from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 20 or higher from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if PostgreSQL is running
pg_isready -h localhost -p 5432 >nul 2>&1
if errorlevel 1 (
    echo WARNING: PostgreSQL is not running on localhost:5432
    echo You need to start PostgreSQL or use Docker for the database
    echo.
    echo To use Docker for database only:
    echo   docker run -d --name rental_db -e POSTGRES_DB=rental_portal -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin123 -p 5432:5432 postgres:15-alpine
    echo.
    pause
)

echo.
echo ========================================
echo STEP 1: Installing Backend Dependencies
echo ========================================
echo.

cd backend

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
echo Installing Python packages...
call venv\Scripts\activate.bat
pip install -r requirements.txt

cd ..

echo.
echo ========================================
echo STEP 2: Installing User Portal Dependencies
echo ========================================
echo.

cd frontend\user-portal

if not exist node_modules (
    echo Installing User Portal npm packages...
    call npm install
) else (
    echo User Portal dependencies already installed
)

cd ..\..

echo.
echo ========================================
echo STEP 3: Installing Admin Portal Dependencies
echo ========================================
echo.

cd frontend\admin-portal

if not exist node_modules (
    echo Installing Admin Portal npm packages...
    call npm install
) else (
    echo Admin Portal dependencies already installed
)

cd ..\..

echo.
echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo All dependencies have been installed successfully.
echo.
echo To start the application, run:
echo   run-local.bat
echo.
pause
