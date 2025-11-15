@echo off
echo ========================================
echo   Loan Management System - Startup
echo ========================================
echo.

echo Checking MongoDB status...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% == 0 (
    echo [OK] MongoDB is running
) else (
    echo [WARNING] MongoDB is not running
    echo Starting MongoDB...
    net start MongoDB
)

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press any key to exit this window...
pause >nul
