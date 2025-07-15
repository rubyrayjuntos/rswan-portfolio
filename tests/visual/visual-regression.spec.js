/**
 * Visual Regression Tests
 * Tests to ensure UI consistency across changes
 */

const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the portfolio page
    await page.goto('http://localhost:8080');
    await page.waitForSelector('#project-grid', { timeout: 10000 });
  });

  test.describe('Page Layout', () => {
    test('should maintain consistent page layout', async ({ page }) => {
      // Take screenshot of the full page
      await expect(page).toHaveScreenshot('page-layout.png', {
        fullPage: true,
        threshold: 0.1 // Allow 10% difference
      });
    });

    test('should maintain consistent header layout', async ({ page }) => {
      // Take screenshot of header
      const header = page.locator('header');
      await expect(header).toHaveScreenshot('header-layout.png', {
        threshold: 0.05
      });
    });

    test('should maintain consistent filter sidebar', async ({ page }) => {
      // Take screenshot of filter sidebar
      const sidebar = page.locator('#filter-sidebar');
      await expect(sidebar).toHaveScreenshot('filter-sidebar.png', {
        threshold: 0.05
      });
    });

    test('should maintain consistent project grid', async ({ page }) => {
      // Take screenshot of project grid
      const grid = page.locator('#project-grid');
      await expect(grid).toHaveScreenshot('project-grid.png', {
        threshold: 0.05
      });
    });
  });

  test.describe('Project Cards', () => {
    test('should maintain consistent project card design', async ({ page }) => {
      // Take screenshot of first project card
      const firstCard = page.locator('.project-card').first();
      await expect(firstCard).toHaveScreenshot('project-card-default.png', {
        threshold: 0.05
      });
    });

    test('should maintain consistent featured project card', async ({ page }) => {
      // Find featured project card
      const featuredCard = page.locator('.project-card.featured').first();
      
      if (await featuredCard.count() > 0) {
        await expect(featuredCard).toHaveScreenshot('project-card-featured.png', {
          threshold: 0.05
        });
      }
    });

    test('should maintain consistent card hover state', async ({ page }) => {
      // Hover over first project card
      const firstCard = page.locator('.project-card').first();
      await firstCard.hover();
      
      // Wait for hover effects
      await page.waitForTimeout(300);
      
      await expect(firstCard).toHaveScreenshot('project-card-hover.png', {
        threshold: 0.05
      });
    });

    test('should maintain consistent card focus state', async ({ page }) => {
      // Focus on first project card
      const firstCard = page.locator('.project-card').first();
      await firstCard.focus();
      
      await expect(firstCard).toHaveScreenshot('project-card-focus.png', {
        threshold: 0.05
      });
    });
  });

  test.describe('Filter States', () => {
    test('should maintain consistent active filter appearance', async ({ page }) => {
      // Apply a filter
      await page.locator('input[name="medium"][value="code"]').click();
      await page.waitForTimeout(500);
      
      // Take screenshot of active filters
      const activeFilters = page.locator('#active-filters');
      await expect(activeFilters).toHaveScreenshot('active-filters.png', {
        threshold: 0.05
      });
    });

    test('should maintain consistent filter pill design', async ({ page }) => {
      // Apply a filter to create pills
      await page.locator('input[name="medium"][value="code"]').click();
      await page.waitForTimeout(500);
      
      // Take screenshot of filter pills
      const filterPills = page.locator('.filter-pill');
      await expect(filterPills.first()).toHaveScreenshot('filter-pill.png', {
        threshold: 0.05
      });
    });

    test('should maintain consistent filter hover states', async ({ page }) => {
      // Hover over filter option
      const filterOption = page.locator('#medium-list li').first();
      await filterOption.hover();
      
      await page.waitForTimeout(300);
      await expect(filterOption).toHaveScreenshot('filter-hover.png', {
        threshold: 0.05
      });
    });
  });

  test.describe('Modal Design', () => {
    test('should maintain consistent project detail modal', async ({ page }) => {
      // Open project detail modal
      await page.locator('.project-card').first().click();
      
      // Wait for modal to fully load
      await page.waitForTimeout(500);
      
      // Take screenshot of modal
      const modal = page.locator('#project-detail-modal');
      await expect(modal).toHaveScreenshot('project-detail-modal.png', {
        threshold: 0.05
      });
    });

    test('should maintain consistent gallery modal', async ({ page }) => {
      // Find project with gallery and open it
      const projectWithGallery = page.locator('.project-card:has(.gallery-btn)').first();
      
      if (await projectWithGallery.count() > 0) {
        await projectWithGallery.locator('.gallery-btn').click();
        await page.waitForTimeout(500);
        
        // Take screenshot of gallery modal
        const modal = page.locator('#gallery-modal');
        await expect(modal).toHaveScreenshot('gallery-modal.png', {
          threshold: 0.05
        });
      }
    });

    test('should maintain consistent markdown modal', async ({ page }) => {
      // This would require a project with markdown content
      // For now, test the modal structure
      const modal = page.locator('#markdown-modal');
      if (await modal.count() > 0) {
        await expect(modal).toHaveScreenshot('markdown-modal.png', {
          threshold: 0.05
        });
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should maintain consistent mobile layout', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Wait for responsive adjustments
      await page.waitForTimeout(500);
      
      // Take screenshot of mobile layout
      await expect(page).toHaveScreenshot('mobile-layout.png', {
        fullPage: true,
        threshold: 0.1
      });
    });

    test('should maintain consistent tablet layout', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Wait for responsive adjustments
      await page.waitForTimeout(500);
      
      // Take screenshot of tablet layout
      await expect(page).toHaveScreenshot('tablet-layout.png', {
        fullPage: true,
        threshold: 0.1
      });
    });

    test('should maintain consistent desktop layout', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Wait for responsive adjustments
      await page.waitForTimeout(500);
      
      // Take screenshot of desktop layout
      await expect(page).toHaveScreenshot('desktop-layout.png', {
        fullPage: true,
        threshold: 0.1
      });
    });

    test('should maintain consistent mobile project cards', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      // Take screenshot of mobile project card
      const firstCard = page.locator('.project-card').first();
      await expect(firstCard).toHaveScreenshot('mobile-project-card.png', {
        threshold: 0.05
      });
    });
  });

  test.describe('Typography and Colors', () => {
    test('should maintain consistent typography', async ({ page }) => {
      // Take screenshot of text elements
      const textElements = page.locator('h1, h2, h3, p, .project-title, .project-description');
      await expect(textElements.first()).toHaveScreenshot('typography-sample.png', {
        threshold: 0.05
      });
    });

    test('should maintain consistent color scheme', async ({ page }) => {
      // Take screenshot of colored elements
      const coloredElements = page.locator('.status-badge, .filter-pill, .project-tag');
      
      if (await coloredElements.count() > 0) {
        await expect(coloredElements.first()).toHaveScreenshot('color-scheme.png', {
          threshold: 0.05
        });
      }
    });

    test('should maintain consistent button styling', async ({ page }) => {
      // Take screenshot of buttons
      const buttons = page.locator('button');
      await expect(buttons.first()).toHaveScreenshot('button-styling.png', {
        threshold: 0.05
      });
    });
  });

  test.describe('Interactive States', () => {
    test('should maintain consistent button hover states', async ({ page }) => {
      // Hover over a button
      const button = page.locator('button').first();
      await button.hover();
      
      await page.waitForTimeout(300);
      await expect(button).toHaveScreenshot('button-hover.png', {
        threshold: 0.05
      });
    });

    test('should maintain consistent button focus states', async ({ page }) => {
      // Focus on a button
      const button = page.locator('button').first();
      await button.focus();
      
      await expect(button).toHaveScreenshot('button-focus.png', {
        threshold: 0.05
      });
    });

    test('should maintain consistent link hover states', async ({ page }) => {
      // Hover over a link
      const link = page.locator('a').first();
      await link.hover();
      
      await page.waitForTimeout(300);
      await expect(link).toHaveScreenshot('link-hover.png', {
        threshold: 0.05
      });
    });

    test('should maintain consistent input focus states', async ({ page }) => {
      // Focus on an input
      const input = page.locator('input').first();
      await input.focus();
      
      await expect(input).toHaveScreenshot('input-focus.png', {
        threshold: 0.05
      });
    });
  });

  test.describe('Loading States', () => {
    test('should maintain consistent loading indicators', async ({ page }) => {
      // This would require triggering a loading state
      // For now, check if loading elements exist
      const loadingElements = page.locator('.loading, .spinner, [aria-busy="true"]');
      
      if (await loadingElements.count() > 0) {
        await expect(loadingElements.first()).toHaveScreenshot('loading-state.png', {
          threshold: 0.05
        });
      }
    });
  });

  test.describe('Error States', () => {
    test('should maintain consistent error message styling', async ({ page }) => {
      // This would require triggering an error state
      // For now, check if error elements exist
      const errorElements = page.locator('.error, .error-message, [role="alert"]');
      
      if (await errorElements.count() > 0) {
        await expect(errorElements.first()).toHaveScreenshot('error-state.png', {
          threshold: 0.05
        });
      }
    });

    test('should maintain consistent empty state styling', async ({ page }) => {
      // Apply filters that result in no projects
      await page.locator('input[name="medium"][value="code"]').click();
      await page.locator('input[name="tech"][value="NonExistentTech"]').click();
      await page.waitForTimeout(500);
      
      // Take screenshot of empty state
      const emptyState = page.locator('text=No projects found');
      if (await emptyState.count() > 0) {
        await expect(emptyState).toHaveScreenshot('empty-state.png', {
          threshold: 0.05
        });
      }
    });
  });

  test.describe('Accessibility Visual Indicators', () => {
    test('should maintain consistent focus indicators', async ({ page }) => {
      // Focus on various elements
      const focusableElements = page.locator('button, input, a, [tabindex]');
      
      for (let i = 0; i < Math.min(await focusableElements.count(), 3); i++) {
        const element = focusableElements.nth(i);
        await element.focus();
        
        await expect(element).toHaveScreenshot(`focus-indicator-${i}.png`, {
          threshold: 0.05
        });
      }
    });

    test('should maintain consistent ARIA visual indicators', async ({ page }) => {
      // Check for ARIA-related visual elements
      const ariaElements = page.locator('[aria-expanded], [aria-selected], [aria-pressed]');
      
      if (await ariaElements.count() > 0) {
        await expect(ariaElements.first()).toHaveScreenshot('aria-indicator.png', {
          threshold: 0.05
        });
      }
    });
  });

  test.describe('Cross-Browser Consistency', () => {
    test('should maintain consistent appearance across browsers', async ({ page, browserName }) => {
      // Take screenshot with browser name in filename
      await expect(page).toHaveScreenshot(`cross-browser-${browserName}.png`, {
        fullPage: true,
        threshold: 0.1
      });
    });
  });

  test.describe('Animation and Transitions', () => {
    test('should maintain consistent transition animations', async ({ page }) => {
      // Trigger a transition (e.g., opening modal)
      await page.locator('.project-card').first().click();
      
      // Take screenshot during transition
      await page.waitForTimeout(100); // Mid-transition
      await expect(page.locator('#project-detail-modal')).toHaveScreenshot('modal-transition.png', {
        threshold: 0.1
      });
    });

    test('should maintain consistent hover animations', async ({ page }) => {
      // Hover over interactive element
      const interactiveElement = page.locator('.project-card').first();
      await interactiveElement.hover();
      
      // Take screenshot during hover animation
      await page.waitForTimeout(150); // Mid-animation
      await expect(interactiveElement).toHaveScreenshot('hover-animation.png', {
        threshold: 0.1
      });
    });
  });
}); 