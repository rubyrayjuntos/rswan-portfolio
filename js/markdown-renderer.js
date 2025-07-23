// --- MARKDOWN RENDERER SYSTEM ---

// Markdown rendering library (using marked.js)
let marked = null;

// Initialize markdown renderer
async function initializeMarkdownRenderer() {
    try {
        // Load marked.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js';
        script.onload = () => {
            marked = window.marked;
            configureMarked();
        };
        document.head.appendChild(script);
        
        // Load Prism.js for syntax highlighting
        const prismCSS = document.createElement('link');
        prismCSS.rel = 'stylesheet';
        prismCSS.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css';
        document.head.appendChild(prismCSS);
        
        const prismJS = document.createElement('script');
        prismJS.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js';
        prismJS.onload = () => {
            // Load additional language support
            loadPrismLanguages();
        };
        document.head.appendChild(prismJS);
        
    } catch (error) {
        console.error('Error initializing markdown renderer:', error);
    }
}

// Configure marked.js options
function configureMarked() {
    if (!marked) return;
    
    // Set more robust options to handle edge cases
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false,
        sanitize: false,
        smartLists: true,
        smartypants: false, // Disable to avoid conflicts
        xhtml: false,
        pedantic: false, // Be more lenient with parsing
        silent: false // Show warnings for debugging
    });
    
    // Custom renderer for enhanced features
    const renderer = new marked.Renderer();
    
    // Enhanced code block rendering with error handling
    renderer.code = function(code, language) {
        try {
            const validLanguage = Prism.languages[language] ? language : 'markup';
            const highlighted = Prism.highlight(code, Prism.languages[validLanguage], validLanguage);
            return `<pre class="markdown-code-block"><code class="language-${validLanguage}">${highlighted}</code></pre>`;
        } catch (error) {
            console.warn('Code highlighting failed:', error);
            return `<pre class="markdown-code-block"><code>${code}</code></pre>`;
        }
    };
    
    // Enhanced table rendering
    renderer.table = function(header, body) {
        return `<div class="markdown-table-container"><table class="markdown-table">${header}${body}</table></div>`;
    };
    
    // Enhanced image rendering with error handling
    renderer.image = function(href, title, text) {
        try {
            const imgClass = 'markdown-image';
            const titleAttr = title ? ` title="${title}"` : '';
            const safeHref = href ? href.replace(/[<>]/g, '') : '';
            return `<img src="${safeHref}" alt="${text || ''}" class="${imgClass}"${titleAttr} loading="lazy">`;
        } catch (error) {
            console.warn('Image rendering failed:', error);
            return `<span class="markdown-image-error">[Image: ${text || 'Error loading image'}]</span>`;
        }
    };
    
    // Enhanced link rendering with URL validation
    renderer.link = function(href, title, text) {
        try {
            const isExternal = href && href.startsWith('http');
            const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
            const titleAttr = title ? ` title="${title}"` : '';
            const safeHref = href ? href.replace(/[<>]/g, '') : '#';
            return `<a href="${safeHref}" class="markdown-link"${target}${titleAttr}>${text || href}</a>`;
        } catch (error) {
            console.warn('Link rendering failed:', error);
            return `<span class="markdown-link-error">[Link: ${text || 'Error loading link'}]</span>`;
        }
    };
    
    // Add error handling for other renderer methods
    renderer.html = function(html) {
        try {
            return html;
        } catch (error) {
            console.warn('HTML rendering failed:', error);
            return `<span class="markdown-html-error">[HTML content]</span>`;
        }
    };
    
    marked.use({ renderer });
}

// Main markdown rendering function
function renderMarkdown(markdownContent) {
    // Make function globally available
    window.renderMarkdown = renderMarkdown;
    
    if (!marked) {
        console.warn('Marked.js not loaded, falling back to plain text');
        return `<pre>${markdownContent}</pre>`;
    }
    
    try {
        // Pre-process markdown content to fix common issues
        const sanitizedContent = sanitizeMarkdownContent(markdownContent);
        
        // Parse and render markdown
        const html = marked.parse(sanitizedContent);
        
        // Apply syntax highlighting if Prism is available
        if (window.Prism) {
            // We'll apply highlighting after the content is inserted into the DOM
            setTimeout(() => {
                const container = document.getElementById('markdown-modal-content');
                if (container) {
                    Prism.highlightAllUnder(container);
                }
            }, 100);
        }
        
        return html;
        
    } catch (error) {
        console.error('Error rendering markdown:', error);
        return `<div class="markdown-error">
            <h3>Error Rendering Markdown</h3>
            <p>The markdown content could not be rendered due to a parsing error.</p>
            <details>
                <summary>Technical Details</summary>
                <pre>${error.message}</pre>
            </details>
            <pre>${markdownContent}</pre>
        </div>`;
    }
}

// Load additional Prism.js languages
function loadPrismLanguages() {
    const languages = [
        'javascript', 'typescript', 'jsx', 'tsx', 'python', 'java', 'cpp', 'csharp',
        'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'r', 'sql',
        'bash', 'shell', 'powershell', 'yaml', 'json', 'xml', 'html', 'css',
        'scss', 'sass', 'less', 'docker', 'git', 'markdown'
    ];
    
    languages.forEach(lang => {
        const script = document.createElement('script');
        script.src = `https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${lang}.min.js`;
        document.head.appendChild(script);
    });
}

// --- INLINE MARKDOWN RENDERER ---

/**
 * Renders markdown content inline within project detail sections
 * @param {string} containerId - The ID of the container element
 * @param {string} markdownContent - The markdown content to render
 * @param {Object} options - Rendering options
 */
function renderInlineMarkdown(containerId, markdownContent, options = {}) {
    const container = document.getElementById(containerId);
    if (!container || !marked) return;
    
    const defaultOptions = {
        className: 'markdown-inline',
        showToc: false,
        maxHeight: null,
        collapsible: false
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        // Pre-process markdown content to fix common issues
        const sanitizedContent = sanitizeMarkdownContent(markdownContent);
        
        // Parse and render markdown
        const html = marked.parse(sanitizedContent);
        
        // Create wrapper with classes
        const wrapper = document.createElement('div');
        wrapper.className = `markdown-content ${config.className}`;
        wrapper.innerHTML = html;
        
        // Add table of contents if requested
        if (config.showToc) {
            const toc = generateTableOfContents(html);
            if (toc) {
                wrapper.insertBefore(toc, wrapper.firstChild);
            }
        }
        
        // Add collapsible functionality if requested
        if (config.collapsible) {
            addCollapsibleFunctionality(wrapper);
        }
        
        // Apply max height if specified
        if (config.maxHeight) {
            wrapper.style.maxHeight = config.maxHeight;
            wrapper.style.overflowY = 'auto';
        }
        
        // Clear container and append rendered content
        container.innerHTML = '';
        container.appendChild(wrapper);
        
        // Apply syntax highlighting
        if (window.Prism) {
            Prism.highlightAllUnder(wrapper);
        }
        
    } catch (error) {
        console.error('Error rendering inline markdown:', error);
        
        // Try fallback rendering with simplified content
        try {
            const fallbackContent = createFallbackContent(markdownContent);
            container.innerHTML = `<div class="markdown-content ${config.className}">${fallbackContent}</div>`;
        } catch (fallbackError) {
            console.error('Fallback rendering also failed:', fallbackError);
            container.innerHTML = `
                <div class="markdown-error">
                    <h3>Error Rendering Content</h3>
                    <p>The markdown content could not be rendered due to a parsing error.</p>
                    <details>
                        <summary>Technical Details</summary>
                        <pre>${error.message}</pre>
                    </details>
                    <button onclick="this.parentElement.innerHTML = '<pre>' + ${JSON.stringify(markdownContent)} + '</pre>'">
                        Show Raw Content
                    </button>
                </div>
            `;
        }
    }
}

/**
 * Sanitizes markdown content to fix common parsing issues
 * @param {string} content - Raw markdown content
 * @returns {string} Sanitized markdown content
 */
function sanitizeMarkdownContent(content) {
    if (!content) return '';
    
    let sanitized = content;
    
    // Fix URLs with parentheses by encoding them
    sanitized = sanitized.replace(/\[([^\]]+)\]\(([^)]*)\)/g, (match, text, url) => {
        // Encode parentheses in URLs
        const encodedUrl = url.replace(/\(/g, '%28').replace(/\)/g, '%29');
        return `[${text}](${encodedUrl})`;
    });
    
    // Fix double parentheses in URLs
    sanitized = sanitized.replace(/\[([^\]]+)\]\(([^)]*)\)\)/g, (match, text, url) => {
        // Remove extra closing parenthesis
        const cleanUrl = url.replace(/\)$/, '');
        const encodedUrl = cleanUrl.replace(/\(/g, '%28').replace(/\)/g, '%29');
        return `[${text}](${encodedUrl})`;
    });
    
    // Fix unescaped special characters in code blocks
    sanitized = sanitized.replace(/```([\s\S]*?)```/g, (match, code) => {
        // Escape special characters in code blocks
        return '```' + code.replace(/[&<>]/g, (char) => {
            const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
            return entities[char];
        }) + '```';
    });
    
    // Fix unescaped backticks in inline code
    sanitized = sanitized.replace(/`([^`]+)`/g, (match, code) => {
        // Escape special characters in inline code
        return '`' + code.replace(/[&<>]/g, (char) => {
            const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
            return entities[char];
        }) + '`';
    });
    
    return sanitized;
}

/**
 * Creates fallback content when markdown parsing fails
 * @param {string} content - Raw markdown content
 * @returns {string} HTML fallback content
 */
function createFallbackContent(content) {
    if (!content) return '<p>No content available.</p>';
    
    // Simple markdown to HTML conversion for fallback
    let html = content
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        
        // Links (simplified)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        
        // Lists
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>')
        
        // Paragraphs
        .replace(/\n\n/g, '</p><p>');
    
    // Wrap in paragraph tags
    html = '<p>' + html + '</p>';
    
    // Clean up empty paragraphs and fix structure
    html = html
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<h[1-6]>)/g, '$1')
        .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
        .replace(/<p>(<ul>)/g, '$1')
        .replace(/(<\/ul>)<\/p>/g, '$1')
        .replace(/<p>(<ol>)/g, '$1')
        .replace(/(<\/ol>)<\/p>/g, '$1')
        .replace(/<p>(<pre>)/g, '$1')
        .replace(/(<\/pre>)<\/p>/g, '$1');
    
    return html;
}

// --- MODAL MARKDOWN READER ---

/**
 * Opens a modal with markdown content for larger documents
 * @param {string} title - Modal title
 * @param {string} markdownContent - The markdown content to render
 * @param {Object} options - Modal options
 */
function openMarkdownModal(title, markdownContent, options = {}) {
    const defaultOptions = {
        width: '80%',
        height: '80%',
        showToc: true,
        showPrint: true,
        showDownload: true,
        downloadFilename: 'document.md'
    };
    
    const config = { ...defaultOptions, ...options };
    
    // Check if static modal already exists
    let modal = document.getElementById('markdown-modal');
    let modalTitle = document.getElementById('markdown-modal-title');
    let modalContent = document.getElementById('markdown-modal-content');
    
    if (!modal) {
        // Create modal HTML if it doesn't exist
        const modalHTML = `
            <div id="markdown-modal" class="markdown-modal-overlay">
                <div class="markdown-modal-content" style="width: ${config.width}; height: ${config.height};">
                    <div class="markdown-modal-header">
                        <h3 class="markdown-modal-title" id="markdown-modal-title">${title}</h3>
                        <div class="markdown-modal-controls">
                            ${config.showPrint ? '<button class="markdown-btn" onclick="printMarkdownContent()">Print</button>' : ''}
                            ${config.showDownload ? `<button class="markdown-btn" onclick="downloadMarkdownContent('${config.downloadFilename}', \`${markdownContent.replace(/`/g, '\\`')}\`)">Download</button>` : ''}
                            <button class="markdown-modal-close" onclick="closeMarkdownModal()">&times;</button>
                        </div>
                    </div>
                    <div class="markdown-modal-body">
                        <div id="markdown-modal-content" class="markdown-content markdown-modal"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Get references to the newly created elements
        modal = document.getElementById('markdown-modal');
        modalTitle = document.getElementById('markdown-modal-title');
        modalContent = document.getElementById('markdown-modal-content');
    } else {
        // Update existing modal title
        if (modalTitle) {
            modalTitle.textContent = title;
        }
    }
    
    // Render markdown content
    renderInlineMarkdown('markdown-modal-content', markdownContent, {
        showToc: config.showToc,
        className: 'markdown-modal'
    });
    
    // Show modal
    modal.style.display = 'flex';
    
    // Add escape key listener
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeMarkdownModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

/**
 * Closes the markdown modal
 */
function closeMarkdownModal() {
    const modal = document.getElementById('markdown-modal');
    const modalContent = document.getElementById('markdown-modal-content');
    
    if (modal) {
        modal.style.display = 'none';
    }
    
    if (modalContent) {
        // Clear the content to free up memory
        modalContent.innerHTML = '';
    }
    
    console.log('Markdown modal closed and cleaned up');
}

// --- UTILITY FUNCTIONS ---

/**
 * Generates a table of contents from markdown content
 * @param {string} html - Rendered HTML content
 * @returns {HTMLElement|null} - TOC element or null
 */
function generateTableOfContents(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) return null;
    
    const toc = document.createElement('div');
    toc.className = 'markdown-toc';
    
    const tocTitle = document.createElement('h4');
    tocTitle.textContent = 'Table of Contents';
    toc.appendChild(tocTitle);
    
    const tocList = document.createElement('ul');
    
    headings.forEach((heading, index) => {
        const id = heading.id || `heading-${index}`;
        heading.id = id;
        
        const li = document.createElement('li');
        li.className = `toc-${heading.tagName.toLowerCase()}`;
        
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        link.onclick = (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
        };
        
        li.appendChild(link);
        tocList.appendChild(li);
    });
    
    toc.appendChild(tocList);
    return toc;
}

/**
 * Adds collapsible functionality to markdown content
 * @param {HTMLElement} wrapper - The markdown wrapper element
 */
function addCollapsibleFunctionality(wrapper) {
    const sections = wrapper.querySelectorAll('h1, h2, h3');
    
    sections.forEach(section => {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'markdown-collapse-btn';
        toggleBtn.innerHTML = '▼';
        toggleBtn.onclick = () => toggleSection(section);
        
        section.insertBefore(toggleBtn, section.firstChild);
        section.style.cursor = 'pointer';
    });
}

/**
 * Toggles section visibility
 * @param {HTMLElement} section - The section to toggle
 */
function toggleSection(section) {
    const content = getNextSiblingsUntil(section, 'h1, h2, h3');
    const isCollapsed = content[0]?.style.display === 'none';
    
    content.forEach(el => {
        el.style.display = isCollapsed ? '' : 'none';
    });
    
    const btn = section.querySelector('.markdown-collapse-btn');
    btn.innerHTML = isCollapsed ? '▼' : '▶';
}

/**
 * Gets all sibling elements until a specific selector
 * @param {HTMLElement} element - Starting element
 * @param {string} selector - Stop condition selector
 * @returns {Array} - Array of sibling elements
 */
function getNextSiblingsUntil(element, selector) {
    const siblings = [];
    let next = element.nextElementSibling;
    
    while (next && !next.matches(selector)) {
        siblings.push(next);
        next = next.nextElementSibling;
    }
    
    return siblings;
}

/**
 * Prints the current markdown content
 */
function printMarkdownContent() {
    const content = document.getElementById('markdown-modal-content');
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Print Document</title>
                <link rel="stylesheet" href="styles.css">
                <style>
                    body { margin: 20px; }
                    .markdown-modal-overlay { display: block !important; }
                    .markdown-modal-content { box-shadow: none !important; }
                    .markdown-modal-header { display: none !important; }
                </style>
            </head>
            <body>
                ${content.outerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

/**
 * Downloads markdown content as a file
 * @param {string} filename - The filename to save as
 * @param {string} content - The markdown content
 */
function downloadMarkdownContent(filename, content) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// --- PROJECT INTEGRATION FUNCTIONS ---

/**
 * Loads and renders markdown content for a project section
 * @param {string} projectId - The project ID
 * @param {string} section - The section name (e.g., 'specs', 'docs')
 * @param {string} containerId - The container element ID
 * @param {Object} options - Rendering options
 */
async function loadProjectMarkdown(projectId, section, containerId, options = {}) {
    try {
        const response = await fetch(`_data/projects/${projectId}/${section}.md`);
        if (!response.ok) {
            throw new Error(`Markdown file not found: ${section}.md`);
        }
        
        const markdownContent = await response.text();
        renderInlineMarkdown(containerId, markdownContent, options);
        
    } catch (error) {
        console.warn(`Could not load markdown for ${projectId}/${section}:`, error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<p class="markdown-placeholder">No ${section} content available.</p>`;
        }
    }
}

/**
 * Opens a project document in the modal reader
 * @param {string} projectId - The project ID
 * @param {string} documentName - The document name
 * @param {string} title - The modal title
 */
async function openProjectDocument(projectId, documentName, title) {
    try {
        const response = await fetch(`_data/projects/${projectId}/documents/${documentName}.md`);
        if (!response.ok) {
            throw new Error(`Document not found: ${documentName}.md`);
        }
        
        const markdownContent = await response.text();
        openMarkdownModal(title, markdownContent, {
            downloadFilename: `${projectId}-${documentName}.md`
        });
        
    } catch (error) {
        console.error('Error loading project document:', error);
        alert('Could not load document. Please try again.');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeMarkdownRenderer);

// Make functions globally available
window.renderMarkdown = renderMarkdown;
window.openMarkdownModal = openMarkdownModal;
window.closeMarkdownModal = closeMarkdownModal;
window.printMarkdownContent = printMarkdownContent;
window.downloadMarkdownContent = downloadMarkdownContent; 