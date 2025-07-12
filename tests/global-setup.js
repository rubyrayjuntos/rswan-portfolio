/**
 * Global setup for Playwright tests
 * Runs once before all tests
 */

async function globalSetup() {
  console.log('Setting up test environment...');
  
  // Create test results directory if it doesn't exist
  const fs = require('fs');
  const path = require('path');
  
  const testResultsDir = path.join(__dirname, '../test-results');
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
  }
  
  // Create screenshots directory
  const screenshotsDir = path.join(testResultsDir, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  console.log('Test environment setup complete.');
}

module.exports = globalSetup; 