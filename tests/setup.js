// Jest setup file for testing environment
require('@testing-library/jest-dom');

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// QUICK PATCH: Load and expose main functions for testing
// This is a temporary solution - see TODO in README for proper refactoring
const fs = require('fs');
const path = require('path');

// Read and execute the main script files to expose functions globally
function loadScriptFile(filename) {
  try {
    const scriptPath = path.join(__dirname, '..', filename);
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    // Create a mock DOM environment
    const mockDocument = {
      getElementById: jest.fn(),
      querySelector: jest.fn(),
      querySelectorAll: jest.fn(),
      createElement: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      body: {
        innerHTML: '',
        appendChild: jest.fn(),
        removeChild: jest.fn()
      },
      head: {
        appendChild: jest.fn()
      }
    };
    
    const mockWindow = {
      document: mockDocument,
      location: { href: 'http://localhost:8080' },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      open: jest.fn(),
      print: jest.fn(),
      performance: { now: () => Date.now() }
    };
    
    // Mock global objects
    global.document = mockDocument;
    global.window = mockWindow;
    global.location = mockWindow.location;
    
    // Execute the script in a controlled environment
    const scriptFunction = new Function('document', 'window', 'location', scriptContent);
    scriptFunction(mockDocument, mockWindow, mockWindow.location);
    
    // Expose functions that might be defined in the script
    if (typeof global.renderInlineMarkdown === 'undefined' && typeof window.renderInlineMarkdown !== 'undefined') {
      global.renderInlineMarkdown = window.renderInlineMarkdown;
    }
    if (typeof global.renderModalMarkdown === 'undefined' && typeof window.renderModalMarkdown !== 'undefined') {
      global.renderModalMarkdown = window.renderModalMarkdown;
    }
    if (typeof global.renderMarkdown === 'undefined' && typeof window.renderMarkdown !== 'undefined') {
      global.renderMarkdown = window.renderMarkdown;
    }
    if (typeof global.createProjectCard === 'undefined' && typeof window.createProjectCard !== 'undefined') {
      global.createProjectCard = window.createProjectCard;
    }
    if (typeof global.renderProjects === 'undefined' && typeof window.renderProjects !== 'undefined') {
      global.renderProjects = window.renderProjects;
    }
    if (typeof global.showProjectDetail === 'undefined' && typeof window.showProjectDetail !== 'undefined') {
      global.showProjectDetail = window.showProjectDetail;
    }
    if (typeof global.showGallery === 'undefined' && typeof window.showGallery !== 'undefined') {
      global.showGallery = window.showGallery;
    }
    
  } catch (error) {
    console.warn(`Could not load ${filename} for testing:`, error.message);
  }
}

// Load the main script files
loadScriptFile('script.js');
loadScriptFile('markdown-renderer.js');

// Helper function to create a mock project
global.createMockProject = (overrides = {}) => ({
  id: 1,
  title: 'Test Project',
  description: 'A test project for testing',
  imageUrl: 'https://via.placeholder.com/600x400',
  medium: 'code',
  genre: ['Web Development'],
  style: ['Modern'],
  tech: ['JavaScript'],
  mood: 'Professional',
  year: 2024,
  role: 'Full Stack Developer',
  variant: 'featured',
  status: 'live',
  links: {
    live: 'https://example.com',
    github: 'https://github.com/example'
  },
  pitch: 'A test project pitch',
  challenge: 'Test challenge description',
  development: 'Test development process',
  outcome: 'Test outcome description',
  gallery: [
    {
      url: 'https://via.placeholder.com/400x300',
      title: 'Test Image',
      description: 'A test image',
      dimensions: '400x300'
    }
  ],
  ...overrides
});

// Helper function to create a mock DOM element
global.createMockElement = (tagName = 'div', attributes = {}) => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  return element;
};

// Helper function to simulate user interactions
global.simulateEvent = (element, eventType, options = {}) => {
  const event = new Event(eventType, { bubbles: true, ...options });
  element.dispatchEvent(event);
  return event;
};

// Helper function to wait for async operations
global.waitFor = (callback, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      try {
        const result = callback();
        if (result) {
          resolve(result);
          return;
        }
      } catch (error) {
        // Continue checking
      }
      
      if (Date.now() - startTime > timeout) {
        reject(new Error(`waitFor timed out after ${timeout}ms`));
        return;
      }
      
      setTimeout(check, 10);
    };
    
    check();
  });
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock; 