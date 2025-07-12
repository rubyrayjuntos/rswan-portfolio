/**
 * Global teardown for Playwright tests
 * Runs once after all tests
 */

async function globalTeardown() {
  console.log('Cleaning up test environment...');
  
  // Any cleanup tasks can go here
  // For example, cleaning up test data, removing temporary files, etc.
  
  console.log('Test environment cleanup complete.');
}

module.exports = globalTeardown; 