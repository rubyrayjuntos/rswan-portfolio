@echo off
echo Starting batch rename of long filenames...
echo This will rename all DALL-E generated files with extremely long names
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

powershell -ExecutionPolicy Bypass -File "scripts\rename-long-filenames.ps1"

echo.
echo Rename operation completed!
echo You can now commit your changes without filename length issues.
pause 