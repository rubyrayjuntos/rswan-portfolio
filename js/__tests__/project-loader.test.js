// Import the class we want to test
const ProjectLoader = require('../project-loader');

// Mock the global fetch function before each test
global.fetch = jest.fn();

describe('ProjectLoader', () => {
  // Clear all mocks after each test to ensure test isolation
  afterEach(() => {
    fetch.mockClear();
  });

  describe('loadProjectManifest', () => {
    it('should fetch and parse the project manifest successfully', async () => {
      // 1. Arrange: Set up the mock environment
      const mockManifest = [
        '_data/projects/project1.json',
        '_data/projects/project2.json',
      ];

      // Configure the mock fetch to return a successful response with our mock data
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      });

      const loader = new ProjectLoader();

      // 2. Act: Call the method we are testing
      const manifest = await loader.loadProjectManifest();

      // 3. Assert: Check if the result is what we expect
      expect(manifest).toEqual(mockManifest); // Verify the manifest content
      expect(fetch).toHaveBeenCalledTimes(1); // Verify that fetch was called exactly once
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('_data/projects/manifest.json')); // Verify the correct URL was fetched
    });

    it('should return an empty array if the manifest fetch fails', async () => {
      // 1. Arrange: Set up a failing network request
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const loader = new ProjectLoader();
      // Suppress the expected console error to keep test output clean
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // 2. Act: Call the method
      const manifest = await loader.loadProjectManifest();

      // 3. Assert: Check for the fallback behavior
      expect(manifest).toEqual([]); // Should return an empty array on failure
      expect(fetch).toHaveBeenCalledTimes(1);

      // Restore the original console.error function
      consoleErrorSpy.mockRestore();
    });
  });
}); 