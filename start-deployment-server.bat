@echo off
echo 🚀 Starting PPMS Portfolio Deployment Server
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.7+ and try again
    pause
    exit /b 1
)

REM Get the current directory (portfolio root)
set PORTFOLIO_PATH=%CD%

echo 📁 Portfolio Path: %PORTFOLIO_PATH%
echo 🌐 Server will start on http://localhost:8080
echo.

REM Start the deployment server
python ppms/deploy-server.py "%PORTFOLIO_PATH%"

pause 