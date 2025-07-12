# Automated Testing Setup

This document provides a comprehensive guide to the automated testing suite for the portfolio website.

## Overview

The testing suite includes:
- **Unit Tests**: Jest-based tests for individual functions and components
- **Integration Tests**: Tests for component interactions and data flow
- **End-to-End Tests**: Playwright-based tests for complete user journeys
- **Visual Regression Tests**: Screenshot-based tests for UI consistency
- **Performance Tests**: Tests for loading times and responsiveness

## Test Structure

```
tests/
├── setup.js                    # Jest setup and mocks
├── filter-system.test.js       # Filter functionality tests
├── markdown-renderer.test.js   # Markdown rendering tests
├── project-rendering.test.js   # Project card and modal tests
├── e2e/
│   └── portfolio.spec.js       # End-to-end user journey tests
├── visual/
│   └── visual-regression.spec.js # Visual consistency tests
├── global-setup.js             # Playwright global setup
└── global-teardown.js          # Playwright global teardown
```

## Prerequisites

1. **Node.js**: Version 16 or higher
2. **npm**: For package management
3. **Browsers**: Chrome, Firefox, Safari (for E2E tests)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Unit Tests (Jest)

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- filter-system.test.js
```

### End-to-End Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run visual regression tests
npm run test:visual

# Run tests in specific browser
npx playwright test --project=chromium
```

### Performance Tests

```bash
# Run Lighthouse performance audit
npm run test:performance
```

## Test Categories

### 1. Filter System Tests (`filter-system.test.js`)

Tests the core filtering functionality:

- **Filter Initialization**: Default values and facet rendering
- **Filter Application**: Single and multiple criteria filtering
- **Filter UI Updates**: Radio buttons, checkboxes, sliders
- **Active Filter Pills**: Rendering and removal
- **Filter Event Handling**: User interactions
- **Filter Reset**: Clearing all filters
- **Performance**: Large dataset handling
- **Edge Cases**: Invalid data, missing properties

**Key Functions Tested**:
- `renderFacets()`
- `applyFilters()`
- `handleFilterChange()`
- `renderActiveFilterPills()`
- `resetAllFilters()`

### 2. Markdown Renderer Tests (`markdown-renderer.test.js`)

Tests the markdown rendering system:

- **Markdown Parsing**: Basic elements, code blocks, lists, tables
- **Inline Rendering**: Collapsible sections, CSS classes
- **Modal Rendering**: Modal display and functionality
- **Syntax Highlighting**: Code block formatting
- **Print/Download**: File generation and browser APIs
- **Error Handling**: Malformed content, XSS prevention
- **Performance**: Large document handling
- **Accessibility**: ARIA attributes, keyboard navigation

**Key Functions Tested**:
- `renderMarkdown()`
- `renderInlineMarkdown()`
- `renderModalMarkdown()`
- `showModal()`
- `closeModal()`

### 3. Project Rendering Tests (`project-rendering.test.js`)

Tests project display and interaction:

- **Project Card Rendering**: Basic info, metadata, tags
- **Project Grid**: Multiple cards, sorting, responsive design
- **Detail Modal**: Project information display
- **Gallery Modal**: Image navigation and display
- **Event Handling**: Clicks, keyboard navigation
- **Responsive Behavior**: Mobile, tablet, desktop layouts
- **Performance**: Large project lists
- **Accessibility**: ARIA attributes, focus management

**Key Functions Tested**:
- `createProjectCard()`
- `renderProjects()`
- `showProjectDetail()`
- `showGallery()`
- `handleCardClick()`

### 4. End-to-End Tests (`e2e/portfolio.spec.js`)

Tests complete user journeys:

- **Page Load**: Initial state and content loading
- **Filtering**: Complete filter workflows
- **Project Interaction**: Card clicks, modal interactions
- **Markdown Rendering**: Content display and navigation
- **Responsive Design**: Different screen sizes
- **Keyboard Navigation**: Accessibility compliance
- **Performance**: Loading times and responsiveness
- **Error Handling**: Network errors, missing data

### 5. Visual Regression Tests (`visual/visual-regression.spec.js`)

Tests UI consistency:

- **Page Layout**: Full page and component screenshots
- **Interactive States**: Hover, focus, active states
- **Responsive Design**: Mobile, tablet, desktop layouts
- **Modal Design**: All modal types and states
- **Typography**: Text rendering and styling
- **Color Scheme**: Consistent color application
- **Cross-Browser**: Consistency across browsers
- **Animations**: Transition and hover effects

## Test Data

### Mock Projects

The tests use a comprehensive mock project structure:

```javascript
const mockProject = {
  id: 1,
  title: 'Test Project',
  description: 'A comprehensive test project',
  imageUrl: 'https://via.placeholder.com/600x400',
  medium: 'code',
  genre: ['Web Development', 'Mobile App'],
  style: ['Modern', 'Minimalist'],
  tech: ['JavaScript', 'React', 'Node.js'],
  mood: 'Professional',
  year: 2024,
  role: 'Full Stack Developer',
  variant: 'featured',
  status: 'live',
  links: {
    live: 'https://example.com',
    github: 'https://github.com/example',
    demo: 'https://demo.example.com'
  },
  pitch: 'This is a test project pitch.',
  challenge: 'The main challenge was...',
  development: 'Development process included...',
  outcome: 'The outcome was successful.',
  gallery: [
    {
      url: 'https://via.placeholder.com/800x600',
      title: 'Main Screenshot',
      description: 'Primary application view',
      dimensions: '800x600'
    }
  ]
};
```

### Mock Markdown Content

Tests include various markdown content types:

```markdown
# Test Document

This is a **bold** test document with *italic* text.

## Code Example

```javascript
function hello() {
  console.log("Hello, World!");
}
```

## List Example

- Item 1
- Item 2
  - Nested item
- Item 3

## Table Example

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

## Collapsible Section

<details>
<summary>Click to expand</summary>

This content is collapsible.

</details>
```

## Configuration

### Jest Configuration

Located in `package.json`:

```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],
    "collectCoverageFrom": [
      "script.js",
      "markdown-renderer.js",
      "!**/node_modules/**",
      "!**/tests/**"
    ],
    "coverageReporters": ["text", "lcov", "html"],
    "testMatch": [
      "**/tests/**/*.test.js"
    ]
  }
}
```

### Playwright Configuration

Located in `playwright.config.js`:

- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Parallel Execution**: Enabled for faster test runs
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure only
- **Videos**: Retained on failure
- **Traces**: On first retry

## Test Results

### Coverage Reports

After running `npm run test:coverage`, view the HTML coverage report:

```bash
# Open coverage report
open coverage/lcov-report/index.html
```

### Playwright Reports

After running E2E tests, view the HTML report:

```bash
# Open Playwright report
npx playwright show-report
```

### Test Results Directory

All test outputs are saved to `test-results/`:

```
test-results/
├── results.json          # JSON test results
├── results.xml           # JUnit XML results
├── screenshots/          # Failure screenshots
├── videos/              # Failure videos
└── traces/              # Test traces
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    
    - name: Run unit tests
      run: npm run test:coverage
    
    - name: Start development server
      run: npm run serve &
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: test-results/
```

## Best Practices

### Writing Tests

1. **Descriptive Names**: Use clear, descriptive test names
2. **Arrange-Act-Assert**: Structure tests with clear sections
3. **Isolation**: Each test should be independent
4. **Mocking**: Mock external dependencies appropriately
5. **Edge Cases**: Test error conditions and boundary cases

### Example Test Structure

```javascript
describe('Feature Name', () => {
  let setupData;
  
  beforeEach(() => {
    // Arrange: Set up test data
    setupData = createMockData();
  });
  
  afterEach(() => {
    // Clean up after each test
    cleanup();
  });
  
  test('should handle normal case', () => {
    // Act: Perform the action
    const result = functionUnderTest(setupData);
    
    // Assert: Verify the result
    expect(result).toBe(expectedValue);
  });
  
  test('should handle error case', () => {
    // Act & Assert: Test error handling
    expect(() => functionUnderTest(invalidData)).toThrow();
  });
});
```

### Performance Considerations

1. **Test Speed**: Keep unit tests fast (< 100ms each)
2. **Parallel Execution**: Use Jest's parallel execution
3. **Efficient Mocks**: Mock heavy operations
4. **Selective Testing**: Use test patterns to run specific tests

### Debugging Tests

1. **Jest Debug Mode**:
```bash
npm test -- --verbose --detectOpenHandles
```

2. **Playwright Debug Mode**:
```bash
npx playwright test --debug
```

3. **Visual Debugging**:
```bash
npx playwright test --ui
```

## Troubleshooting

### Common Issues

1. **Tests Failing Locally but Passing in CI**:
   - Check for environment-specific code
   - Ensure consistent Node.js versions
   - Verify all dependencies are installed

2. **Visual Regression Test Failures**:
   - Check for dynamic content (dates, random IDs)
   - Verify consistent viewport sizes
   - Review threshold settings

3. **E2E Test Timeouts**:
   - Increase timeout values in configuration
   - Check for slow network conditions
   - Verify server is running correctly

4. **Coverage Issues**:
   - Check `collectCoverageFrom` configuration
   - Ensure all source files are included
   - Verify test files are properly structured

### Performance Optimization

1. **Parallel Test Execution**:
   - Use Jest's `--maxWorkers` option
   - Configure Playwright for parallel runs
   - Split large test suites

2. **Test Data Management**:
   - Use efficient mock data generation
   - Clean up test data after each test
   - Avoid unnecessary setup/teardown

3. **Browser Management**:
   - Use Playwright's browser reuse
   - Configure appropriate timeouts
   - Optimize screenshot and video settings

## Future Enhancements

### Planned Improvements

1. **Visual Testing**:
   - Automated visual regression testing
   - Cross-browser visual consistency checks
   - Responsive design validation

2. **Performance Testing**:
   - Lighthouse CI integration
   - Bundle size monitoring
   - Core Web Vitals tracking

3. **Accessibility Testing**:
   - Automated accessibility audits
   - Screen reader compatibility tests
   - Keyboard navigation validation

4. **API Testing**:
   - Mock API response testing
   - Error handling validation
   - Data transformation testing

### Integration Opportunities

1. **GitHub Actions**: Automated testing on PRs
2. **Vercel/Netlify**: Pre-deployment testing
3. **Lighthouse CI**: Performance monitoring
4. **Codecov**: Coverage reporting
5. **Playwright Test Dashboard**: Test analytics

## Support

For questions or issues with the testing setup:

1. Check the troubleshooting section above
2. Review the test documentation
3. Examine the test examples
4. Check the configuration files
5. Run tests with debug flags for more information

The testing suite is designed to be comprehensive, maintainable, and scalable to support the portfolio's continued development. 