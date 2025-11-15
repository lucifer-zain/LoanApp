# Loan Management System - Startup Script
# This script starts both backend and frontend servers

Write-Host "Starting Loan Management System..." -ForegroundColor Green
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB status..." -ForegroundColor Cyan
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoService -and $mongoService.Status -eq 'Running') {
    Write-Host "MongoDB is running" -ForegroundColor Green
} elseif ($mongoService) {
    Write-Host "MongoDB service found but not running. Starting..." -ForegroundColor Yellow
    Start-Service -Name MongoDB -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "MongoDB started" -ForegroundColor Green
} else {
    Write-Host "MongoDB service not found. Please ensure MongoDB is installed or use MongoDB Compass." -ForegroundColor Yellow
    Write-Host "   You can continue if using MongoDB Compass with local connection." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$PSScriptRoot\backend'; Write-Host 'Backend Server' -ForegroundColor Blue; npm run dev"
)

Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Starting Frontend Server (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$PSScriptRoot\frontend'; Write-Host 'Frontend Server' -ForegroundColor Blue; npm start"
)

Write-Host ""
Write-Host "Both servers are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "Access the application:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Tip: Check the new PowerShell windows for server logs" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop: Close the PowerShell windows or press Ctrl+C in each" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
