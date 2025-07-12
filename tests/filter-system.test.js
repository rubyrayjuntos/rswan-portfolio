/**
 * Filter System Tests
 * Tests the core filtering functionality including facet rendering, filter application, and UI updates
 */

describe('Filter System', () => {
  let mockProjects;
  let filterSidebar;
  let projectGrid;
  let activeFiltersContainer;

  beforeEach(() => {
    // Setup DOM elements
    document.body.innerHTML = `
      <div id="filter-sidebar">
        <ul id="medium-list"></ul>
        <ul id="genre-list"></ul>
        <ul id="style-list"></ul>
        <ul id="tech-list"></ul>
        <ul id="mood-list"></ul>
        <input type="range" id="year-slider" min="2018" max="2025" value="2018">
        <span id="year-value">2018</span>
      </div>
      <div id="project-grid"></div>
      <div id="active-filters"></div>
    `;

    // Get DOM elements
    filterSidebar = document.getElementById('filter-sidebar');
    projectGrid = document.getElementById('project-grid');
    activeFiltersContainer = document.getElementById('active-filters');

    // Create mock projects
    mockProjects = [
      createMockProject({
        id: 1,
        medium: 'code',
        genre: ['Web Development', 'Mobile App'],
        style: ['Modern', 'Minimalist'],
        tech: ['JavaScript', 'React'],
        mood: 'Professional',
        year: 2024
      }),
      createMockProject({
        id: 2,
        medium: 'art',
        genre: ['Digital Art', 'Illustration'],
        style: ['Bold', 'Experimental'],
        tech: ['Adobe Creative Suite'],
        mood: 'Creative',
        year: 2023
      }),
      createMockProject({
        id: 3,
        medium: 'writing',
        genre: ['Creative Writing'],
        style: ['Traditional'],
        tech: [],
        mood: 'Serene',
        year: 2022
      })
    ];

    // Initialize global variables
    window.projects = mockProjects;
    window.activeFilters = {
      medium: 'all',
      genre: [],
      style: [],
      mood: 'all',
      year: 2018,
      tech: []
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('Filter Initialization', () => {
    test('should initialize filters with default values', () => {
      expect(activeFilters).toEqual({
        medium: 'all',
        genre: [],
        style: [],
        mood: 'all',
        year: 2018,
        tech: []
      });
    });

    test('should render facets with correct counts', () => {
      renderFacets(mockProjects);

      // Check medium counts
      const mediumList = document.getElementById('medium-list');
      expect(mediumList.innerHTML).toContain('all');
      expect(mediumList.innerHTML).toContain('code');
      expect(mediumList.innerHTML).toContain('art');
      expect(mediumList.innerHTML).toContain('writing');

      // Check genre counts
      const genreList = document.getElementById('genre-list');
      expect(genreList.innerHTML).toContain('Web Development');
      expect(genreList.innerHTML).toContain('Digital Art');
    });

    test('should handle empty project list', () => {
      window.projects = [];
      renderFacets([]);
      
      const mediumList = document.getElementById('medium-list');
      expect(mediumList.innerHTML).toContain('all');
      expect(mediumList.innerHTML).toContain('0');
    });
  });

  describe('Filter Application', () => {
    test('should filter projects by medium', () => {
      activeFilters.medium = 'code';
      const filteredProjects = applyFilters();
      
      expect(filteredProjects).toHaveLength(1);
      expect(filteredProjects[0].medium).toBe('code');
    });

    test('should filter projects by multiple genres', () => {
      activeFilters.genre = ['Web Development', 'Digital Art'];
      const filteredProjects = applyFilters();
      
      expect(filteredProjects).toHaveLength(2);
      expect(filteredProjects.some(p => p.genre.includes('Web Development'))).toBe(true);
      expect(filteredProjects.some(p => p.genre.includes('Digital Art'))).toBe(true);
    });

    test('should filter projects by year', () => {
      activeFilters.year = 2023;
      const filteredProjects = applyFilters();
      
      expect(filteredProjects).toHaveLength(2);
      expect(filteredProjects.every(p => p.year >= 2023)).toBe(true);
    });

    test('should filter projects by multiple criteria', () => {
      activeFilters.medium = 'code';
      activeFilters.tech = ['React'];
      activeFilters.year = 2024;
      
      const filteredProjects = applyFilters();
      
      expect(filteredProjects).toHaveLength(1);
      expect(filteredProjects[0].id).toBe(1);
    });

    test('should return all projects when no filters applied', () => {
      const filteredProjects = applyFilters();
      expect(filteredProjects).toHaveLength(3);
    });

    test('should handle projects with missing properties', () => {
      const incompleteProject = {
        id: 4,
        title: 'Incomplete Project',
        medium: 'code',
        year: 2024
        // Missing genre, style, tech, mood
      };
      
      mockProjects.push(incompleteProject);
      activeFilters.genre = ['Web Development'];
      
      const filteredProjects = applyFilters();
      expect(filteredProjects).toHaveLength(0); // Should be filtered out
    });
  });

  describe('Filter UI Updates', () => {
    test('should update filter UI when filters change', () => {
      // Create radio buttons
      const mediumRadio = document.createElement('input');
      mediumRadio.type = 'radio';
      mediumRadio.name = 'medium';
      mediumRadio.value = 'code';
      document.getElementById('medium-list').appendChild(mediumRadio);

      // Update filters
      activeFilters.medium = 'code';
      updateFilterUI();

      expect(mediumRadio.checked).toBe(true);
    });

    test('should update year slider value', () => {
      const yearSlider = document.getElementById('year-slider');
      const yearValue = document.getElementById('year-value');

      activeFilters.year = 2023;
      updateFilterUI();

      expect(yearSlider.value).toBe('2023');
      expect(yearValue.textContent).toBe('2023');
    });

    test('should handle checkbox updates', () => {
      // Create checkboxes
      const genreCheckbox = document.createElement('input');
      genreCheckbox.type = 'checkbox';
      genreCheckbox.name = 'genre';
      genreCheckbox.value = 'Web Development';
      document.getElementById('genre-list').appendChild(genreCheckbox);

      // Update filters
      activeFilters.genre = ['Web Development'];
      updateFilterUI();

      expect(genreCheckbox.checked).toBe(true);
    });
  });

  describe('Active Filter Pills', () => {
    test('should render active filter pills', () => {
      activeFilters.medium = 'code';
      activeFilters.genre = ['Web Development'];
      activeFilters.year = 2023;

      renderActiveFilterPills();

      const pills = activeFiltersContainer.querySelectorAll('.filter-pill');
      expect(pills.length).toBeGreaterThan(0);
      expect(activeFiltersContainer.innerHTML).toContain('code');
      expect(activeFiltersContainer.innerHTML).toContain('Web Development');
    });

    test('should handle pill removal', () => {
      activeFilters.genre = ['Web Development'];
      renderActiveFilterPills();

      const removeButton = activeFiltersContainer.querySelector('button[data-filter-type="genre"]');
      expect(removeButton).toBeTruthy();

      // Simulate click
      simulateEvent(removeButton, 'click');
      handlePillRemove({ target: removeButton });

      expect(activeFilters.genre).toEqual([]);
    });

    test('should reset filters when pills are removed', () => {
      activeFilters.medium = 'code';
      activeFilters.year = 2023;
      renderActiveFilterPills();

      const mediumRemoveButton = activeFiltersContainer.querySelector('button[data-filter-type="medium"]');
      simulateEvent(mediumRemoveButton, 'click');
      handlePillRemove({ target: mediumRemoveButton });

      expect(activeFilters.medium).toBe('all');
    });
  });

  describe('Filter Event Handling', () => {
    test('should handle medium filter changes', () => {
      const event = {
        target: {
          name: 'medium',
          value: 'code'
        }
      };

      handleFilterChange(event);

      expect(activeFilters.medium).toBe('code');
      expect(activeFilters.genre).toEqual([]);
      expect(activeFilters.style).toEqual([]);
      expect(activeFilters.tech).toEqual([]);
      expect(activeFilters.mood).toBe('all');
    });

    test('should handle checkbox filter changes', () => {
      const event = {
        target: {
          name: 'genre',
          value: 'Web Development',
          checked: true
        }
      };

      handleFilterChange(event);

      expect(activeFilters.genre).toContain('Web Development');
    });

    test('should handle checkbox unchecking', () => {
      activeFilters.genre = ['Web Development'];
      
      const event = {
        target: {
          name: 'genre',
          value: 'Web Development',
          checked: false
        }
      };

      handleFilterChange(event);

      expect(activeFilters.genre).not.toContain('Web Development');
    });

    test('should handle year slider changes', () => {
      const event = {
        target: {
          name: 'year',
          value: '2023'
        }
      };

      handleFilterChange(event);

      expect(activeFilters.year).toBe(2023);
    });

    test('should prevent duplicate values in array filters', () => {
      activeFilters.genre = ['Web Development'];
      
      const event = {
        target: {
          name: 'genre',
          value: 'Web Development',
          checked: true
        }
      };

      handleFilterChange(event);

      expect(activeFilters.genre).toEqual(['Web Development']);
      expect(activeFilters.genre.length).toBe(1);
    });
  });

  describe('Filter Reset', () => {
    test('should reset all filters to default values', () => {
      // Set some filters
      activeFilters.medium = 'code';
      activeFilters.genre = ['Web Development'];
      activeFilters.year = 2023;

      resetAllFilters();

      expect(activeFilters).toEqual({
        medium: 'all',
        genre: [],
        style: [],
        mood: 'all',
        year: 2018,
        tech: []
      });
    });

    test('should update UI after reset', () => {
      // Create some filter controls
      const mediumRadio = document.createElement('input');
      mediumRadio.type = 'radio';
      mediumRadio.name = 'medium';
      mediumRadio.value = 'code';
      mediumRadio.checked = true;
      document.getElementById('medium-list').appendChild(mediumRadio);

      resetAllFilters();

      expect(mediumRadio.checked).toBe(false);
    });
  });

  describe('Performance Tests', () => {
    test('should handle large project lists efficiently', () => {
      // Create 100 mock projects
      const largeProjectList = Array.from({ length: 100 }, (_, i) => 
        createMockProject({
          id: i + 1,
          medium: i % 3 === 0 ? 'code' : i % 3 === 1 ? 'art' : 'writing',
          genre: [`Genre ${i % 5}`],
          year: 2018 + (i % 8)
        })
      );

      window.projects = largeProjectList;
      
      const startTime = performance.now();
      renderFacets(largeProjectList);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });

    test('should filter large lists quickly', () => {
      const largeProjectList = Array.from({ length: 1000 }, (_, i) => 
        createMockProject({
          id: i + 1,
          medium: 'code',
          year: 2024
        })
      );

      window.projects = largeProjectList;
      activeFilters.medium = 'code';
      activeFilters.year = 2024;

      const startTime = performance.now();
      const filteredProjects = applyFilters();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50); // Should complete in under 50ms
      expect(filteredProjects.length).toBe(1000);
    });
  });

  describe('Edge Cases', () => {
    test('should handle projects with empty arrays', () => {
      const projectWithEmptyArrays = createMockProject({
        genre: [],
        style: [],
        tech: []
      });

      mockProjects.push(projectWithEmptyArrays);
      activeFilters.genre = ['Web Development'];

      const filteredProjects = applyFilters();
      expect(filteredProjects).toHaveLength(1); // Should not include the empty project
    });

    test('should handle null/undefined project properties', () => {
      const projectWithNulls = {
        id: 5,
        title: 'Null Project',
        medium: 'code',
        year: 2024,
        genre: null,
        style: undefined,
        tech: null,
        mood: null
      };

      mockProjects.push(projectWithNulls);
      activeFilters.genre = ['Web Development'];

      const filteredProjects = applyFilters();
      expect(filteredProjects).toHaveLength(1); // Should not include the null project
    });

    test('should handle filter changes with invalid event targets', () => {
      const invalidEvent = {
        target: null
      };

      expect(() => handleFilterChange(invalidEvent)).not.toThrow();
    });

    test('should handle pill removal with missing data attributes', () => {
      const invalidPillEvent = {
        target: {
          tagName: 'BUTTON',
          dataset: {}
        }
      };

      expect(() => handlePillRemove(invalidPillEvent)).not.toThrow();
    });
  });
}); 