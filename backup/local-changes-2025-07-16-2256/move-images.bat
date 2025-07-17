@echo off
echo 🖼️ Image Organization Helper
echo ============================
echo.
echo This script will help you move and rename your project images.
echo.
echo Before running this script:
echo 1. Make sure your images are in a known location
echo 2. Review the image-mapping.json file
echo 3. Update the paths below to match your image locations
echo.
pause

echo.
echo 📁 Creating project directories...
if not exist "images\projects" mkdir "images\projects"

echo.
echo 🔄 Moving images to project folders...
echo (You'll need to manually move files based on the mapping below)
echo.

echo Example commands you can run:
echo.
echo For Nova Writers Conspiracy:
echo copy "your-source-path\nova-logo.jpg" "images\projects\nova-writers-conspiracy\nova-logo-main.jpg"
echo copy "your-source-path\nova-architecture.jpg" "images\projects\nova-writers-conspiracy\nova-architecture-system.jpg"
echo.
echo For Graphic Novel:
echo copy "your-source-path\graphic-novel-cover.jpg" "images\projects\graphic-novel\graphic-novel-cover-art.jpg"
echo copy "your-source-path\graphic-novel-underground.jpg" "images\projects\graphic-novel\graphic-novel-underground-sequence.jpg"
echo.
echo For Character Design:
echo copy "your-source-path\character-design-process.jpg" "images\projects\character-design\character-design-process-overview.jpg"
echo copy "your-source-path\character-sketches.jpg" "images\projects\character-design\character-design-sketches.jpg"
echo.

echo 📋 Next steps:
echo 1. Open image-mapping.json to see all the suggested filenames
echo 2. Open image-organizer.html in your browser for a visual guide
echo 3. Manually move and rename your images using the suggested names
echo 4. Test your portfolio to make sure images load correctly
echo.

pause 