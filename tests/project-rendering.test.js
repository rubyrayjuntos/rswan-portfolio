/**
 * Project Rendering Tests
 * Tests the project card rendering, detail views, gallery functionality, and responsive behavior
 */

describe('Project Rendering', () => {
  let mockProject;
  let projectGrid;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="project-grid"></div>
      <div id="project-detail-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="detail-title"></h2>
            <button class="close-btn">&times;</button>
          </div>
          <div class="modal-body" id="detail-body"></div>
        </div>
      </div>
      <div id="gallery-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="gallery-title"></h3>
            <button class="close-btn">&times;</button>
          </div>
          <div class="modal-body" id="gallery-body"></div>
        </div>
      </div>
    `;

    projectGrid = document.getElementById('project-grid');
    
    // Create mock project
    mockProject = createMockProject({
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
        },
        {
          url: 'https://via.placeholder.com/400x300',
          title: 'Mobile View',
          description: 'Responsive mobile layout',
          dimensions: '400x300'
        }
      ]
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('Project Card Rendering', () => {
    test('should render project card with basic information', () => {
      const card = createProjectCard(mockProject);
      
      expect(card).toHaveClass('project-card');
      expect(card.querySelector('.project-title')).toHaveTextContent('Test Project');
      expect(card.querySelector('.project-description')).toHaveTextContent('A comprehensive test project');
    });

    test('should render project image correctly', () => {
      const card = createProjectCard(mockProject);
      const image = card.querySelector('.project-image img');
      
      expect(image).toHaveAttribute('src', 'https://via.placeholder.com/600x400');
      expect(image).toHaveAttribute('alt', 'Test Project');
    });

    test('should render project metadata', () => {
      const card = createProjectCard(mockProject);
      
      expect(card.querySelector('.project-year')).toHaveTextContent('2024');
      expect(card.querySelector('.project-role')).toHaveTextContent('Full Stack Developer');
      expect(card.querySelector('.project-medium')).toHaveTextContent('code');
    });

    test('should render project tags', () => {
      const card = createProjectCard(mockProject);
      const tags = card.querySelectorAll('.project-tag');
      
      expect(tags.length).toBeGreaterThan(0);
      expect(Array.from(tags).some(tag => tag.textContent.includes('Web Development'))).toBe(true);
      expect(Array.from(tags).some(tag => tag.textContent.includes('Modern'))).toBe(true);
    });

    test('should render status badge for live projects', () => {
      const card = createProjectCard(mockProject);
      const statusBadge = card.querySelector('.status-badge');
      
      expect(statusBadge).toHaveClass('status-live');
      expect(statusBadge).toHaveTextContent('Live');
    });

    test('should render different status badges', () => {
      const draftProject = { ...mockProject, status: 'draft' };
      const card = createProjectCard(draftProject);
      const statusBadge = card.querySelector('.status-badge');
      
      expect(statusBadge).toHaveClass('status-draft');
      expect(statusBadge).toHaveTextContent('Draft');
    });

    test('should render featured variant with special styling', () => {
      const card = createProjectCard(mockProject);
      
      expect(card).toHaveClass('featured');
      expect(card.querySelector('.featured-badge')).toBeTruthy();
    });

    test('should render regular variant without featured styling', () => {
      const regularProject = { ...mockProject, variant: 'regular' };
      const card = createProjectCard(regularProject);
      
      expect(card).not.toHaveClass('featured');
      expect(card.querySelector('.featured-badge')).toBeFalsy();
    });

    test('should handle projects without gallery', () => {
      const projectWithoutGallery = { ...mockProject, gallery: [] };
      const card = createProjectCard(projectWithoutGallery);
      
      expect(card.querySelector('.gallery-btn')).toBeFalsy();
    });

    test('should handle projects with missing optional fields', () => {
      const minimalProject = {
        id: 2,
        title: 'Minimal Project',
        description: 'Minimal description',
        imageUrl: 'https://via.placeholder.com/600x400',
        medium: 'code',
        year: 2024
      };
      
      const card = createProjectCard(minimalProject);
      
      expect(card).toBeTruthy();
      expect(card.querySelector('.project-title')).toHaveTextContent('Minimal Project');
      expect(card.querySelector('.project-role')).toBeFalsy(); // Should not exist
    });
  });

  describe('Project Grid Rendering', () => {
    test('should render multiple project cards', () => {
      const projects = [mockProject, { ...mockProject, id: 2, title: 'Second Project' }];
      
      renderProjects(projects);
      
      const cards = projectGrid.querySelectorAll('.project-card');
      expect(cards.length).toBe(2);
    });

    test('should handle empty project list', () => {
      renderProjects([]);
      
      expect(projectGrid.innerHTML).toContain('No projects found');
    });

    test('should apply responsive grid classes', () => {
      renderProjects([mockProject]);
      
      expect(projectGrid).toHaveClass('project-grid');
      const card = projectGrid.querySelector('.project-card');
      expect(card).toHaveClass('project-card');
    });

    test('should sort projects by year (newest first)', () => {
      const projects = [
        { ...mockProject, id: 1, year: 2022 },
        { ...mockProject, id: 2, year: 2024 },
        { ...mockProject, id: 3, year: 2023 }
      ];
      
      renderProjects(projects);
      
      const cards = projectGrid.querySelectorAll('.project-card');
      const firstCardYear = cards[0].querySelector('.project-year').textContent;
      const lastCardYear = cards[2].querySelector('.project-year').textContent;
      
      expect(firstCardYear).toBe('2024');
      expect(lastCardYear).toBe('2022');
    });
  });

  describe('Project Detail Modal', () => {
    test('should render project details in modal', () => {
      showProjectDetail(mockProject);
      
      const modal = document.getElementById('project-detail-modal');
      const title = document.getElementById('detail-title');
      const body = document.getElementById('detail-body');
      
      expect(modal.classList.contains('show')).toBe(true);
      expect(title.textContent).toBe('Test Project');
      expect(body.innerHTML).toContain('A comprehensive test project');
    });

    test('should render project sections', () => {
      showProjectDetail(mockProject);
      
      const body = document.getElementById('detail-body');
      
      expect(body.innerHTML).toContain('Pitch');
      expect(body.innerHTML).toContain('Challenge');
      expect(body.innerHTML).toContain('Development');
      expect(body.innerHTML).toContain('Outcome');
    });

    test('should render project links', () => {
      showProjectDetail(mockProject);
      
      const body = document.getElementById('detail-body');
      
      expect(body.innerHTML).toContain('https://example.com');
      expect(body.innerHTML).toContain('https://github.com/example');
      expect(body.innerHTML).toContain('https://demo.example.com');
    });

    test('should render project metadata in detail view', () => {
      showProjectDetail(mockProject);
      
      const body = document.getElementById('detail-body');
      
      expect(body.innerHTML).toContain('2024');
      expect(body.innerHTML).toContain('Full Stack Developer');
      expect(body.innerHTML).toContain('Professional');
    });

    test('should close detail modal', () => {
      showProjectDetail(mockProject);
      
      const closeBtn = document.querySelector('#project-detail-modal .close-btn');
      simulateEvent(closeBtn, 'click');
      
      const modal = document.getElementById('project-detail-modal');
      expect(modal.classList.contains('show')).toBe(false);
    });

    test('should handle projects without optional sections', () => {
      const minimalProject = {
        ...mockProject,
        pitch: '',
        challenge: '',
        development: '',
        outcome: ''
      };
      
      showProjectDetail(minimalProject);
      
      const body = document.getElementById('detail-body');
      expect(body.innerHTML).toContain('Test Project');
      // Should not contain empty sections
      expect(body.innerHTML).not.toContain('Pitch');
    });
  });

  describe('Gallery Modal', () => {
    test('should render gallery modal with images', () => {
      showGallery(mockProject);
      
      const modal = document.getElementById('gallery-modal');
      const title = document.getElementById('gallery-title');
      const body = document.getElementById('gallery-body');
      
      expect(modal.classList.contains('show')).toBe(true);
      expect(title.textContent).toBe('Test Project Gallery');
      expect(body.querySelectorAll('.gallery-item').length).toBe(2);
    });

    test('should render gallery items with metadata', () => {
      showGallery(mockProject);
      
      const body = document.getElementById('gallery-body');
      const items = body.querySelectorAll('.gallery-item');
      
      expect(items[0].querySelector('img')).toHaveAttribute('src', 'https://via.placeholder.com/800x600');
      expect(items[0].querySelector('.gallery-item-title')).toHaveTextContent('Main Screenshot');
      expect(items[0].querySelector('.gallery-item-description')).toHaveTextContent('Primary application view');
    });

    test('should handle gallery navigation', () => {
      showGallery(mockProject);
      
      const body = document.getElementById('gallery-body');
      const prevBtn = body.querySelector('.gallery-nav-prev');
      const nextBtn = body.querySelector('.gallery-nav-next');
      
      expect(prevBtn).toBeTruthy();
      expect(nextBtn).toBeTruthy();
    });

    test('should close gallery modal', () => {
      showGallery(mockProject);
      
      const closeBtn = document.querySelector('#gallery-modal .close-btn');
      simulateEvent(closeBtn, 'click');
      
      const modal = document.getElementById('gallery-modal');
      expect(modal.classList.contains('show')).toBe(false);
    });

    test('should handle projects without gallery', () => {
      const projectWithoutGallery = { ...mockProject, gallery: [] };
      
      expect(() => showGallery(projectWithoutGallery)).not.toThrow();
    });
  });

  describe('Event Handling', () => {
    test('should handle card click to show detail modal', () => {
      const card = createProjectCard(mockProject);
      projectGrid.appendChild(card);
      
      simulateEvent(card, 'click');
      
      const modal = document.getElementById('project-detail-modal');
      expect(modal.classList.contains('show')).toBe(true);
    });

    test('should handle gallery button click', () => {
      const card = createProjectCard(mockProject);
      projectGrid.appendChild(card);
      
      const galleryBtn = card.querySelector('.gallery-btn');
      simulateEvent(galleryBtn, 'click');
      
      const modal = document.getElementById('gallery-modal');
      expect(modal.classList.contains('show')).toBe(true);
    });

    test('should prevent event bubbling on gallery button click', () => {
      const card = createProjectCard(mockProject);
      projectGrid.appendChild(card);
      
      const galleryBtn = card.querySelector('.gallery-btn');
      const clickEvent = new Event('click', { bubbles: true });
      
      // Mock stopPropagation
      clickEvent.stopPropagation = jest.fn();
      
      galleryBtn.dispatchEvent(clickEvent);
      
      expect(clickEvent.stopPropagation).toHaveBeenCalled();
    });

    test('should handle external link clicks', () => {
      const card = createProjectCard(mockProject);
      projectGrid.appendChild(card);
      
      const externalLink = card.querySelector('.external-link');
      if (externalLink) {
        const originalOpen = window.open;
        window.open = jest.fn();
        
        simulateEvent(externalLink, 'click');
        
        expect(window.open).toHaveBeenCalled();
        window.open = originalOpen;
      }
    });
  });

  describe('Responsive Behavior', () => {
    test('should apply responsive classes based on screen size', () => {
      // Mock matchMedia for mobile
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query.includes('max-width: 768px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      renderProjects([mockProject]);
      
      const card = projectGrid.querySelector('.project-card');
      expect(card).toHaveClass('mobile');
    });

    test('should handle different screen sizes', () => {
      // Mock matchMedia for desktop
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      renderProjects([mockProject]);
      
      const card = projectGrid.querySelector('.project-card');
      expect(card).not.toHaveClass('mobile');
    });
  });

  describe('Performance Tests', () => {
    test('should render large project lists efficiently', () => {
      const largeProjectList = Array.from({ length: 100 }, (_, i) => 
        createMockProject({ id: i + 1, title: `Project ${i + 1}` })
      );
      
      const startTime = performance.now();
      renderProjects(largeProjectList);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(200); // Should complete in under 200ms
    });

    test('should handle rapid project updates', () => {
      const projects = [mockProject];
      
      const startTime = performance.now();
      for (let i = 0; i < 10; i++) {
        renderProjects(projects);
      }
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500); // Should complete in under 500ms
    });
  });

  describe('Accessibility', () => {
    test('should include proper ARIA attributes', () => {
      const card = createProjectCard(mockProject);
      
      expect(card).toHaveAttribute('role', 'article');
      expect(card).toHaveAttribute('tabindex', '0');
    });

    test('should include proper alt text for images', () => {
      const card = createProjectCard(mockProject);
      const image = card.querySelector('.project-image img');
      
      expect(image).toHaveAttribute('alt', 'Test Project');
    });

    test('should include proper button labels', () => {
      const card = createProjectCard(mockProject);
      const galleryBtn = card.querySelector('.gallery-btn');
      
      if (galleryBtn) {
        expect(galleryBtn).toHaveAttribute('aria-label');
      }
    });

    test('should handle keyboard navigation', () => {
      const card = createProjectCard(mockProject);
      projectGrid.appendChild(card);
      
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      card.dispatchEvent(enterEvent);
      
      const modal = document.getElementById('project-detail-modal');
      expect(modal.classList.contains('show')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing project data gracefully', () => {
      const invalidProject = {
        id: 1,
        title: 'Invalid Project'
        // Missing required fields
      };
      
      expect(() => createProjectCard(invalidProject)).not.toThrow();
    });

    test('should handle broken image URLs', () => {
      const projectWithBrokenImage = {
        ...mockProject,
        imageUrl: 'https://broken-url.com/image.jpg'
      };
      
      const card = createProjectCard(projectWithBrokenImage);
      const image = card.querySelector('.project-image img');
      
      // Should still render the card
      expect(card).toBeTruthy();
      expect(image).toHaveAttribute('src', 'https://broken-url.com/image.jpg');
    });

    test('should handle malformed project data', () => {
      const malformedProject = {
        id: 'invalid-id',
        title: null,
        description: undefined,
        year: 'not-a-number'
      };
      
      expect(() => createProjectCard(malformedProject)).not.toThrow();
    });
  });
}); 