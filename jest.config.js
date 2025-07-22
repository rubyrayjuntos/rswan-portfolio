module.exports = {
  // Indicates that the test environment is a browser-like environment
  testEnvironment: 'jest-environment-jsdom',

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/js'],

  // The pattern or patterns Jest uses to detect test files
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js$',

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['/node_modules/'],

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // A map from regular expressions to paths to transformers
  // We don't need a transformer for now as we are using plain JavaScript
  transform: {},
}; 