@echo off
echo Starting Content Audit Dashboard Server...
echo.
echo This will start a server on http://localhost:3001
echo The dashboard will be available at that URL
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
node scripts/audit-server.js

pause 