@echo off
echo 🖼️ Starting Image Organizer Server
echo ===================================
echo.
echo This will start a server that can handle drag-and-drop image organization.
echo.
echo Features:
echo - Drag & drop image files
echo - Automatic renaming and moving
echo - Project selection dropdowns
echo - Real-time preview
echo.
pause

echo.
echo 🚀 Starting server...
python scripts/image-server.py

pause 