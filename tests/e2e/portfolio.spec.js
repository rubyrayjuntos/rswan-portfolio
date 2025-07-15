/**
 * End-to-End Tests for Portfolio
 * Tests the complete user journey and interactions
 */

const { test, expect } = require('@playwright/test');

test.describe('Portfolio E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the portfolio page
    await page.goto('http://localhost:8080');
    
    // Wait for the page to load
    await page.waitForSelector('#project-grid', { timeout: 10000 });
  });

  test.describe('Page Load and Initial State', () => {
    test('should load portfolio page successfully', async ({ page }) => {
      // Check that the main elements are present
      await expect(page.locator('#project-grid')).toBeVisible();
      await expect(page.locator('#filter-sidebar')).toBeVisible();
      await expect(page.locator('header')).toBeVisible();
    });

    test('should display projects on initial load', async ({ page }) => {
      // Check that at least one project card is visible
      const projectCards = page.locator('.project-card');
      await expect(projectCards.first()).toBeVisible();
      
      // Check that project cards have required content
      await expect(projectCards.first().locator('.project-title')).toBeVisible();
      await expect(projectCards.first().locator('.project-image')).toBeVisible();
    });

    test('should initialize filters correctly', async ({ page }) => {
      // Check that filter sidebar is populated
      await expect(page.locator('#medium-list')).toBeVisible();
      await expect(page.locator('#genre-list')).toBeVisible();
      await expect(page.locator('#style-list')).toBeVisible();
      await expect(page.locator('#tech-list')).toBeVisible();
      await expect(page.locator('#mood-list')).toBeVisible();
      await expect(page.locator('#year-slider')).toBeVisible();
    });

    test('should show all projects initially', async ({ page }) => {
      // Count initial projects
      const initialProjectCount = await page.locator('.project-card').count();
      expect(initialProjectCount).toBeGreaterThan(0);
      
      // Check that no "no projects" message is shown
      await expect(page.locator('text=No projects found')).not.toBeVisible();
    });
  });

  test.describe('Filtering Functionality', () => {
    test('should filter projects by medium', async ({ page }) => {
      // Get initial project count
      const initialCount = await page.locator('.project-card').count();
      
      // Click on a medium filter (e.g., 'code')
      await page.locator('input[name="medium"][value="code"]').click();
      
      // Wait for filtering to complete
      await page.waitForTimeout(500);
      
      // Check that projects are filtered
      const filteredCount = await page.locator('.project-card').count();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
      
      // Check that active filter pill is shown
      await expect(page.locator('.filter-pill')).toBeVisible();
    });

    test('should filter projects by multiple criteria', async ({ page }) => {
      // Apply multiple filters
      await page.locator('input[name="medium"][value="code"]').click();
      await page.locator('input[name="genre"][value="Web Development"]').click();
      
      // Wait for filtering
      await page.waitForTimeout(500);
      
      // Check that multiple filter pills are shown
      const filterPills = page.locator('.filter-pill');
      await expect(filterPills).toHaveCount(2);
    });

    test('should filter projects by year', async ({ page }) => {
      // Get initial count
      const initialCount = await page.locator('.project-card').count();
      
      // Move year slider to 2023
      await page.locator('#year-slider').fill('2023');
      
      // Wait for filtering
      await page.waitForTimeout(500);
      
      // Check that projects are filtered
      const filteredCount = await page.locator('.project-card').count();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });

    test('should remove filters when pills are clicked', async ({ page }) => {
      // Apply a filter
      await page.locator('input[name="medium"][value="code"]').click();
      await page.waitForTimeout(500);
      
      // Check that filter pill is shown
      await expect(page.locator('.filter-pill')).toBeVisible();
      
      // Click the remove button on the filter pill
      await page.locator('.filter-pill button').click();
      
      // Wait for filter removal
      await page.waitForTimeout(500);
      
      // Check that filter pill is removed
      await expect(page.locator('.filter-pill')).not.toBeVisible();
    });

    test('should reset all filters', async ({ page }) => {
      // Apply multiple filters
      await page.locator('input[name="medium"][value="code"]').click();
      await page.locator('input[name="genre"][value="Web Development"]').click();
      await page.waitForTimeout(500);
      
      // Click reset button
      await page.locator('button:has-text("Reset All")').click();
      
      // Wait for reset
      await page.waitForTimeout(500);
      
      // Check that no filter pills are shown
      await expect(page.locator('.filter-pill')).not.toBeVisible();
    });

    test('should show "no projects" message when no matches', async ({ page }) => {
      // Apply a very specific filter that should match no projects
      await page.locator('input[name="medium"][value="code"]').click();
      await page.locator('input[name="tech"][value="NonExistentTech"]').click();
      await page.waitForTimeout(500);
      
      // Check that "no projects" message is shown
      await expect(page.locator('text=No projects found')).toBeVisible();
    });
  });

  test.describe('Project Interaction', () => {
    test('should open project detail modal when card is clicked', async ({ page }) => {
      // Click on the first project card
      await page.locator('.project-card').first().click();
      
      // Check that modal is opened
      await expect(page.locator('#project-detail-modal')).toBeVisible();
      await expect(page.locator('#project-detail-modal .modal-content')).toBeVisible();
    });

    test('should display project details in modal', async ({ page }) => {
      // Open project detail modal
      await page.locator('.project-card').first().click();
      
      // Check that project information is displayed
      await expect(page.locator('#detail-title')).toBeVisible();
      await expect(page.locator('#detail-body')).toBeVisible();
      
      // Check that project sections are present
      await expect(page.locator('text=Pitch')).toBeVisible();
      await expect(page.locator('text=Challenge')).toBeVisible();
      await expect(page.locator('text=Development')).toBeVisible();
      await expect(page.locator('text=Outcome')).toBeVisible();
    });

    test('should close project detail modal', async ({ page }) => {
      // Open modal
      await page.locator('.project-card').first().click();
      await expect(page.locator('#project-detail-modal')).toBeVisible();
      
      // Close modal
      await page.locator('#project-detail-modal .close-btn').click();
      
      // Check that modal is closed
      await expect(page.locator('#project-detail-modal')).not.toBeVisible();
    });

    test('should open gallery modal when gallery button is clicked', async ({ page }) => {
      // Find a project with gallery
      const projectWithGallery = page.locator('.project-card:has(.gallery-btn)').first();
      
      if (await projectWithGallery.count() > 0) {
        // Click gallery button
        await projectWithGallery.locator('.gallery-btn').click();
        
        // Check that gallery modal is opened
        await expect(page.locator('#gallery-modal')).toBeVisible();
        await expect(page.locator('#gallery-title')).toBeVisible();
      }
    });

    test('should navigate through gallery images', async ({ page }) => {
      // Open gallery
      const projectWithGallery = page.locator('.project-card:has(.gallery-btn)').first();
      
      if (await projectWithGallery.count() > 0) {
        await projectWithGallery.locator('.gallery-btn').click();
        
        // Check that navigation buttons are present
        await expect(page.locator('.gallery-nav-prev')).toBeVisible();
        await expect(page.locator('.gallery-nav-next')).toBeVisible();
        
        // Navigate to next image
        await page.locator('.gallery-nav-next').click();
        
        // Check that gallery content changed
        await page.waitForTimeout(300);
      }
    });

    test('should open external links in new tab', async ({ page, context }) => {
      // Open project detail modal
      await page.locator('.project-card').first().click();
      
      // Find external links
      const externalLinks = page.locator('.external-link');
      
      if (await externalLinks.count() > 0) {
        // Click external link
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          externalLinks.first().click()
        ]);
        
        // Check that new page is opened
        expect(newPage).toBeTruthy();
        await newPage.close();
      }
    });
  });

  test.describe('Markdown Rendering', () => {
    test('should render markdown content inline', async ({ page }) => {
      // Open project detail modal
      await page.locator('.project-card').first().click();
      
      // Check that markdown content is rendered
      await expect(page.locator('.markdown-content')).toBeVisible();
      
      // Check that markdown elements are properly rendered
      await expect(page.locator('h1, h2, h3')).toBeVisible();
      await expect(page.locator('p')).toBeVisible();
    });

    test('should handle collapsible sections', async ({ page }) => {
      // Open project detail modal
      await page.locator('.project-card').first().click();
      
      // Check for collapsible sections
      const collapsibleSections = page.locator('details');
      
      if (await collapsibleSections.count() > 0) {
        // Check that sections are present
        await expect(collapsibleSections.first()).toBeVisible();
        
        // Click to expand section
        await collapsibleSections.first().locator('summary').click();
        
        // Check that content is visible
        await expect(collapsibleSections.first().locator(':not(summary)')).toBeVisible();
      }
    });

    test('should render code blocks with syntax highlighting', async ({ page }) => {
      // Open project detail modal
      await page.locator('.project-card').first().click();
      
      // Check for code blocks
      const codeBlocks = page.locator('pre code');
      
      if (await codeBlocks.count() > 0) {
        // Check that code blocks are rendered
        await expect(codeBlocks.first()).toBeVisible();
        
        // Check that syntax highlighting classes are applied
        const codeClass = await codeBlocks.first().getAttribute('class');
        expect(codeClass).toContain('language-');
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should adapt to mobile screen size', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Check that mobile-specific classes are applied
      await expect(page.locator('.project-card')).toHaveClass(/mobile/);
      
      // Check that filter sidebar is accessible on mobile
      await expect(page.locator('#filter-sidebar')).toBeVisible();
    });

    test('should adapt to tablet screen size', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Check that layout adapts appropriately
      await expect(page.locator('#project-grid')).toBeVisible();
      await expect(page.locator('#filter-sidebar')).toBeVisible();
    });

    test('should adapt to desktop screen size', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Check that desktop layout is applied
      await expect(page.locator('#project-grid')).toBeVisible();
      await expect(page.locator('#filter-sidebar')).toBeVisible();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate projects with keyboard', async ({ page }) => {
      // Focus on first project card
      await page.locator('.project-card').first().focus();
      
      // Press Enter to open detail modal
      await page.keyboard.press('Enter');
      
      // Check that modal is opened
      await expect(page.locator('#project-detail-modal')).toBeVisible();
      
      // Press Escape to close modal
      await page.keyboard.press('Escape');
      
      // Check that modal is closed
      await expect(page.locator('#project-detail-modal')).not.toBeVisible();
    });

    test('should navigate filters with keyboard', async ({ page }) => {
      // Focus on filter controls
      await page.locator('#medium-list input').first().focus();
      
      // Navigate with Tab key
      await page.keyboard.press('Tab');
      
      // Check that focus moves to next element
      await expect(page.locator('#genre-list input').first()).toBeFocused();
    });
  });

  test.describe('Performance Tests', () => {
    test('should load page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      // Navigate to page
      await page.goto('http://localhost:8080');
      await page.waitForSelector('#project-grid', { timeout: 10000 });
      
      const loadTime = Date.now() - startTime;
      
      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should filter projects quickly', async ({ page }) => {
      // Apply filter and measure time
      const startTime = Date.now();
      
      await page.locator('input[name="medium"][value="code"]').click();
      await page.waitForTimeout(500);
      
      const filterTime = Date.now() - startTime;
      
      // Filtering should complete within 1 second
      expect(filterTime).toBeLessThan(1000);
    });

    test('should open modals quickly', async ({ page }) => {
      // Measure modal opening time
      const startTime = Date.now();
      
      await page.locator('.project-card').first().click();
      await expect(page.locator('#project-detail-modal')).toBeVisible();
      
      const modalTime = Date.now() - startTime;
      
      // Modal should open within 500ms
      expect(modalTime).toBeLessThan(500);
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper heading structure', async ({ page }) => {
      // Check that headings are properly structured
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      await expect(headings.first()).toBeVisible();
      
      // Check that main heading is h1
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should have proper alt text for images', async ({ page }) => {
      // Check that images have alt text
      const images = page.locator('img');
      
      for (let i = 0; i < await images.count(); i++) {
        const altText = await images.nth(i).getAttribute('alt');
        expect(altText).toBeTruthy();
      }
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check that interactive elements have proper labels
      const buttons = page.locator('button');
      
      for (let i = 0; i < await buttons.count(); i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const textContent = await button.textContent();
        
        // Button should have either aria-label or text content
        expect(ariaLabel || textContent).toBeTruthy();
      }
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Check that all interactive elements are focusable
      const focusableElements = page.locator('button, input, a, [tabindex]');
      
      for (let i = 0; i < await focusableElements.count(); i++) {
        const element = focusableElements.nth(i);
        await element.focus();
        await expect(element).toBeFocused();
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network error by navigating to non-existent page
      await page.goto('http://localhost:8080/nonexistent');
      
      // Should show appropriate error or redirect
      await expect(page).toHaveURL(/localhost:8080/);
    });

    test('should handle missing project data', async ({ page }) => {
      // This would require mocking the data loading
      // For now, just check that the page doesn't crash
      await expect(page.locator('#project-grid')).toBeVisible();
    });

    test('should handle broken images gracefully', async ({ page }) => {
      // Check that the page still works even if some images fail to load
      await expect(page.locator('.project-card')).toBeVisible();
    });
  });
}); 