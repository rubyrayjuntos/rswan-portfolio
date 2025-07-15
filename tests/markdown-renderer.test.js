/**
 * Markdown Renderer Tests
 * Tests the markdown rendering system including inline rendering, modal functionality, and syntax highlighting
 */

describe('Markdown Renderer', () => {
  let mockMarkdownContent;
  let container;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="markdown-container"></div>
      <div id="markdown-modal" class="markdown-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modal-title"></h2>
            <button class="close-btn">&times;</button>
          </div>
          <div class="modal-body" id="modal-body"></div>
          <div class="modal-footer">
            <button id="print-btn">Print</button>
            <button id="download-btn">Download</button>
          </div>
        </div>
      </div>
    `;

    container = document.getElementById('markdown-container');
    
    // Mock markdown content
    mockMarkdownContent = `
# Test Document

This is a **bold** test document with *italic* text.

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

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

## Links and Images

[Link text](https://example.com)

![Image alt](https://via.placeholder.com/300x200)

## Collapsible Section

<details>
<summary>Click to expand</summary>

This content is collapsible.

</details>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('Markdown Parsing', () => {
    test('should parse basic markdown elements', () => {
      const html = renderMarkdown('# Test Heading\n\nThis is a paragraph.');
      
      expect(html).toContain('<h1>Test Heading</h1>');
      expect(html).toContain('<p>This is a paragraph.</p>');
    });

    test('should handle bold and italic text', () => {
      const html = renderMarkdown('This is **bold** and *italic* text.');
      
      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<em>italic</em>');
    });

    test('should parse code blocks with syntax highlighting', () => {
      const html = renderMarkdown('```javascript\nconst x = 1;\n```');
      
      expect(html).toContain('<pre><code class="language-javascript">');
      expect(html).toContain('const x = 1;');
    });

    test('should parse inline code', () => {
      const html = renderMarkdown('Use the `console.log()` function.');
      
      expect(html).toContain('<code>console.log()</code>');
    });

    test('should parse lists correctly', () => {
      const html = renderMarkdown('- Item 1\n- Item 2\n  - Nested item');
      
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>Item 1</li>');
      expect(html).toContain('<li>Item 2</li>');
    });

    test('should parse numbered lists', () => {
      const html = renderMarkdown('1. First item\n2. Second item');
      
      expect(html).toContain('<ol>');
      expect(html).toContain('<li>First item</li>');
      expect(html).toContain('<li>Second item</li>');
    });

    test('should parse tables', () => {
      const html = renderMarkdown('| Header | Value |\n|--------|-------|\n| Test | Data |');
      
      expect(html).toContain('<table>');
      expect(html).toContain('<th>Header</th>');
      expect(html).toContain('<td>Data</td>');
    });

    test('should parse links', () => {
      const html = renderMarkdown('[Link text](https://example.com)');
      
      expect(html).toContain('<a href="https://example.com">Link text</a>');
    });

    test('should parse images', () => {
      const html = renderMarkdown('![Alt text](https://example.com/image.jpg)');
      
      expect(html).toContain('<img src="https://example.com/image.jpg" alt="Alt text">');
    });

    test('should handle empty markdown', () => {
      const html = renderMarkdown('');
      expect(html).toBe('');
    });

    test('should handle null/undefined input', () => {
      expect(() => renderMarkdown(null)).not.toThrow();
      expect(() => renderMarkdown(undefined)).not.toThrow();
    });
  });

  describe('Inline Markdown Rendering', () => {
    test('should render markdown inline with collapsible sections', () => {
      renderInlineMarkdown(container, mockMarkdownContent, 'Test Document');
      
      expect(container.innerHTML).toContain('<h1>Test Document</h1>');
      expect(container.innerHTML).toContain('<details>');
      expect(container.innerHTML).toContain('<summary>Click to expand</summary>');
    });

    test('should add collapsible wrapper to sections', () => {
      const content = '# Section 1\n\nContent 1\n\n## Section 2\n\nContent 2';
      renderInlineMarkdown(container, content, 'Test');
      
      const details = container.querySelectorAll('details');
      expect(details.length).toBeGreaterThan(0);
    });

    test('should handle markdown without sections', () => {
      const simpleContent = 'This is a simple paragraph.';
      renderInlineMarkdown(container, simpleContent, 'Simple');
      
      expect(container.innerHTML).toContain('<p>This is a simple paragraph.</p>');
    });

    test('should add proper CSS classes', () => {
      renderInlineMarkdown(container, mockMarkdownContent, 'Test');
      
      expect(container.querySelector('.markdown-content')).toBeTruthy();
      expect(container.querySelector('.collapsible-section')).toBeTruthy();
    });

    test('should handle markdown with special characters', () => {
      const content = 'Text with <script>alert("xss")</script> and &amp; entities';
      renderInlineMarkdown(container, content, 'Special');
      
      // Should escape script tags
      expect(container.innerHTML).not.toContain('<script>');
      expect(container.innerHTML).toContain('&lt;script&gt;');
    });
  });

  describe('Modal Markdown Rendering', () => {
    test('should render markdown in modal', () => {
      renderModalMarkdown(mockMarkdownContent, 'Test Document');
      
      const modalBody = document.getElementById('modal-body');
      const modalTitle = document.getElementById('modal-title');
      
      expect(modalTitle.textContent).toBe('Test Document');
      expect(modalBody.innerHTML).toContain('<h1>Test Document</h1>');
    });

    test('should show modal when rendered', () => {
      renderModalMarkdown(mockMarkdownContent, 'Test');
      
      const modal = document.getElementById('markdown-modal');
      expect(modal.classList.contains('show')).toBe(true);
    });

    test('should apply syntax highlighting in modal', () => {
      const contentWithCode = '```javascript\nconst x = 1;\n```';
      renderModalMarkdown(contentWithCode, 'Code Test');
      
      const modalBody = document.getElementById('modal-body');
      expect(modalBody.innerHTML).toContain('language-javascript');
    });

    test('should handle modal with no title', () => {
      renderModalMarkdown(mockMarkdownContent);
      
      const modalTitle = document.getElementById('modal-title');
      expect(modalTitle.textContent).toBe('Document');
    });
  });

  describe('Modal Functionality', () => {
    test('should close modal when close button clicked', () => {
      renderModalMarkdown(mockMarkdownContent, 'Test');
      
      const closeBtn = document.querySelector('.close-btn');
      simulateEvent(closeBtn, 'click');
      
      const modal = document.getElementById('markdown-modal');
      expect(modal.classList.contains('show')).toBe(false);
    });

    test('should close modal when clicking outside content', () => {
      renderModalMarkdown(mockMarkdownContent, 'Test');
      
      const modal = document.getElementById('markdown-modal');
      simulateEvent(modal, 'click');
      
      expect(modal.classList.contains('show')).toBe(false);
    });

    test('should not close modal when clicking inside content', () => {
      renderModalMarkdown(mockMarkdownContent, 'Test');
      
      const modalContent = document.querySelector('.modal-content');
      simulateEvent(modalContent, 'click');
      
      const modal = document.getElementById('markdown-modal');
      expect(modal.classList.contains('show')).toBe(true);
    });

    test('should close modal on escape key', () => {
      renderModalMarkdown(mockMarkdownContent, 'Test');
      
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
      
      const modal = document.getElementById('markdown-modal');
      expect(modal.classList.contains('show')).toBe(false);
    });

    test('should not close modal on other keys', () => {
      renderModalMarkdown(mockMarkdownContent, 'Test');
      
      const otherKeyEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(otherKeyEvent);
      
      const modal = document.getElementById('markdown-modal');
      expect(modal.classList.contains('show')).toBe(true);
    });
  });

  describe('Print and Download Functionality', () => {
    beforeEach(() => {
      // Mock window.print
      window.print = jest.fn();
      
      // Mock createObjectURL and revokeObjectURL
      URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      URL.revokeObjectURL = jest.fn();
    });

    test('should handle print button click', () => {
      renderModalMarkdown(mockMarkdownContent, 'Test');
      
      const printBtn = document.getElementById('print-btn');
      simulateEvent(printBtn, 'click');
      
      expect(window.print).toHaveBeenCalled();
    });

    test('should handle download button click', () => {
      renderModalMarkdown(mockMarkdownContent, 'Test Document');
      
      const downloadBtn = document.getElementById('download-btn');
      simulateEvent(downloadBtn, 'click');
      
      expect(URL.createObjectURL).toHaveBeenCalled();
    });

    test('should create proper download filename', () => {
      renderModalMarkdown(mockMarkdownContent, 'Test Document');
      
      const downloadBtn = document.getElementById('download-btn');
      simulateEvent(downloadBtn, 'click');
      
      // Check that a Blob was created with the markdown content
      expect(URL.createObjectURL).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'text/markdown'
        })
      );
    });
  });

  describe('Syntax Highlighting', () => {
    test('should apply syntax highlighting to code blocks', () => {
      const content = '```javascript\nconst x = 1;\nconsole.log(x);\n```';
      renderInlineMarkdown(container, content, 'Code Test');
      
      const codeBlock = container.querySelector('pre code');
      expect(codeBlock).toHaveClass('language-javascript');
    });

    test('should handle multiple code blocks', () => {
      const content = `
\`\`\`javascript
const x = 1;
\`\`\`

\`\`\`css
body { color: red; }
\`\`\`
      `;
      
      renderInlineMarkdown(container, content, 'Multiple Code');
      
      const codeBlocks = container.querySelectorAll('pre code');
      expect(codeBlocks.length).toBe(2);
      expect(codeBlocks[0]).toHaveClass('language-javascript');
      expect(codeBlocks[1]).toHaveClass('language-css');
    });

    test('should handle code blocks without language specification', () => {
      const content = '```\nPlain text code\n```';
      renderInlineMarkdown(container, content, 'Plain Code');
      
      const codeBlock = container.querySelector('pre code');
      expect(codeBlock).toBeTruthy();
      expect(codeBlock.textContent).toContain('Plain text code');
    });
  });

  describe('Collapsible Sections', () => {
    test('should create collapsible sections for headers', () => {
      const content = '# Section 1\n\nContent 1\n\n## Section 2\n\nContent 2';
      renderInlineMarkdown(container, content, 'Sections');
      
      const details = container.querySelectorAll('details');
      expect(details.length).toBeGreaterThan(0);
    });

    test('should handle nested sections correctly', () => {
      const content = `
# Main Section

Main content

## Sub Section

Sub content

### Sub Sub Section

Sub sub content
      `;
      
      renderInlineMarkdown(container, content, 'Nested');
      
      const details = container.querySelectorAll('details');
      expect(details.length).toBeGreaterThan(0);
    });

    test('should preserve content structure in collapsible sections', () => {
      const content = '# Test Section\n\nThis is content.\n\n- List item 1\n- List item 2';
      renderInlineMarkdown(container, content, 'Structure');
      
      const details = container.querySelector('details');
      expect(details.innerHTML).toContain('<p>This is content.</p>');
      expect(details.innerHTML).toContain('<ul>');
      expect(details.innerHTML).toContain('<li>List item 1</li>');
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed markdown gracefully', () => {
      const malformedContent = '```\nUnclosed code block';
      
      expect(() => renderMarkdown(malformedContent)).not.toThrow();
    });

    test('should handle very large markdown content', () => {
      const largeContent = '# Large Document\n\n' + 'Content\n'.repeat(1000);
      
      expect(() => renderInlineMarkdown(container, largeContent, 'Large')).not.toThrow();
    });

    test('should handle markdown with XSS attempts', () => {
      const xssContent = '<script>alert("xss")</script>\n\n# Safe Content';
      
      renderInlineMarkdown(container, xssContent, 'XSS Test');
      
      expect(container.innerHTML).not.toContain('<script>');
      expect(container.innerHTML).toContain('Safe Content');
    });

    test('should handle missing container element', () => {
      expect(() => renderInlineMarkdown(null, mockMarkdownContent, 'Test')).not.toThrow();
    });
  });

  describe('Performance Tests', () => {
    test('should render large documents efficiently', () => {
      const largeContent = '# Large Document\n\n' + 'Content with **bold** and *italic* text.\n'.repeat(100);
      
      const startTime = performance.now();
      renderInlineMarkdown(container, largeContent, 'Large Document');
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });

    test('should handle multiple rapid renders', () => {
      const content = '# Test\n\nContent';
      
      const startTime = performance.now();
      for (let i = 0; i < 10; i++) {
        renderInlineMarkdown(container, content, `Test ${i}`);
      }
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500); // Should complete in under 500ms
    });
  });

  describe('Accessibility', () => {
    test('should include proper ARIA attributes in collapsible sections', () => {
      const content = '# Test Section\n\nContent';
      renderInlineMarkdown(container, content, 'Accessibility');
      
      const details = container.querySelector('details');
      expect(details).toHaveAttribute('aria-expanded');
    });

    test('should include proper heading structure', () => {
      const content = '# H1\n\n## H2\n\n### H3';
      renderInlineMarkdown(container, content, 'Headings');
      
      expect(container.querySelector('h1')).toBeTruthy();
      expect(container.querySelector('h2')).toBeTruthy();
      expect(container.querySelector('h3')).toBeTruthy();
    });

    test('should include alt text for images', () => {
      const content = '![Alt text](https://example.com/image.jpg)';
      renderInlineMarkdown(container, content, 'Images');
      
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Alt text');
    });
  });
}); 