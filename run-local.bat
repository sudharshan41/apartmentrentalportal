@echo off
echo ========================================
echo Residential Apartment Rental Portal
echo STARTING LOCAL DEVELOPMENT SERVERS
echo ========================================
echo.

REM Check if dependencies are installed
if not exist backend\venv (
    echo ERROR: Backend dependencies not installed
    echo Please run setup-local.bat first
    pause
    exit /b 1
)

if not exist frontend\user-portal\node_modules (
    echo ERROR: User Portal dependencies not installed
    echo Please run setup-local.bat first
    pause
    exit /b 1
)

if not exist frontend\admin-portal\node_modules (
    echo ERROR: Admin Portal dependencies not installed
    echo Please run setup-local.bat first
    pause
    exit /b 1
)

echo Starting all services...
echo.
echo Services will be available at:
echo - Backend API:    http://localhost:5000
echo - User Portal:    http://localhost:4200
echo - Admin Portal:   http://localhost:4201
echo.
echo Press Ctrl+C to stop all services
echo.
echo ========================================
echo.

REM Start Backend in a new window
start "Backend API (Flask)" cmd /k "cd backend && venv\Scripts\activate.bat && python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start User Portal in a new window
start "User Portal (Angular)" cmd /k "cd frontend\user-portal && npm start"

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start Admin Portal in a new window
start "Admin Portal (Angular)" cmd /k "cd frontend\admin-portal && npm start"

echo.
echo ========================================
echo All services started in separate windows!
echo ========================================
echo.
echo Backend API:     http://localhost:5000
echo User Portal:     http://localhost:4200
echo Admin Portal:    http://localhost:4201
echo.
echo Close this window or the service windows to stop the servers.
echo.
pause
