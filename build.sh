#!/bin/bash

# Build script for static website deployment
echo "Building production version..."

# Create a dist directory for production build
mkdir -p dist

# Copy all static files to dist directory
cp index.html dist/
cp -r js/ dist/ 2>/dev/null || true
cp -r styles/ dist/ 2>/dev/null || true
cp -r images/ dist/ 2>/dev/null || true
cp script.js dist/ 2>/dev/null || true
cp styles.css dist/ 2>/dev/null || true

# Copy any other HTML files that might be needed
cp *.html dist/ 2>/dev/null || true

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "Installing dependencies..."
    npm install --production
fi

echo "Build completed successfully!"
echo "Static files are ready in the dist directory"