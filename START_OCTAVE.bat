@echo off
setlocal enabledelayedexpansion

REM Octave Platform - Quick Launcher
REM This script starts the development server and opens the app in your browser

title Octave Platform - Dev Server

echo.
echo ========================================
echo   OCTAVE ENTERPRISE PLATFORM
echo   Starting Development Server...
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Navigate to project directory
cd /d "%~dp0"

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Start the dev server
echo.
echo Starting server on http://localhost:3000
echo.
echo Launching browser in 3 seconds...
timeout /t 3 /nobreak

REM Open browser
start http://localhost:3000

REM Run dev server
npm run dev
