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
    
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false,
        sanitize: false,
        smartLists: true,
        smartypants: true,
        xhtml: false
    });
    
    // Custom renderer for enhanced features
    const renderer = new marked.Renderer();
    
    // Enhanced code block rendering
    renderer.code = function(code, language) {
        const validLanguage = Prism.languages[language] ? language : 'markup';
        const highlighted = Prism.highlight(code, Prism.languages[validLanguage], validLanguage);
        return `<pre class="markdown-code-block"><code class="language-${validLanguage}">${highlighted}</code></pre>`;
    };
    
    // Enhanced table rendering
    renderer.table = function(header, body) {
        return `<div class="markdown-table-container"><table class="markdown-table">${header}${body}</table></div>`;
    };
    
    // Enhanced image rendering
    renderer.image = function(href, title, text) {
        const imgClass = 'markdown-image';
        const titleAttr = title ? ` title="${title}"` : '';
        return `<img src="${href}" alt="${text}" class="${imgClass}"${titleAttr} loading="lazy">`;
    };
    
    // Enhanced link rendering
    renderer.link = function(href, title, text) {
        const isExternal = href.startsWith('http');
        const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        const titleAttr = title ? ` title="${title}"` : '';
        return `<a href="${href}" class="markdown-link"${target}${titleAttr}>${text}</a>`;
    };
    
    marked.use({ renderer });
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
        // Parse and render markdown
        const html = marked.parse(markdownContent);
        
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
        container.innerHTML = `<p class="markdown-error">Error rendering content: ${error.message}</p>`;
    }
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
    
    // Create modal HTML
    const modalHTML = `
        <div id="markdown-modal" class="markdown-modal-overlay">
            <div class="markdown-modal-content" style="width: ${config.width}; height: ${config.height};">
                <div class="markdown-modal-header">
                    <h3 class="markdown-modal-title">${title}</h3>
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
    
    // Render markdown content
    renderInlineMarkdown('markdown-modal-content', markdownContent, {
        showToc: config.showToc,
        className: 'markdown-modal'
    });
    
    // Show modal
    const modal = document.getElementById('markdown-modal');
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
    if (modal) {
        modal.remove();
    }
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