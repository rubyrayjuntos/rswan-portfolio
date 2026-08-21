// ==========================================================
// MAIN SCRIPT - V6 (MODULAR)
// Handles high-level page orchestration, data loading, and UI events.
// Filtering and search logic is now in filter.js
// ==========================================================
import { init as initFilter } from './filter.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    let allProjects = [];
    let allDocuments = [];
    let currentView = 'projects'; // 'projects' or 'documents'

    // --- DOM ELEMENTS ---
    const projectGrid = document.getElementById('projectGrid');
    const loadingSpinner = document.getElementById('loading-spinner');
    const aboutBtn = document.getElementById('about-btn');
    const connectModal = document.getElementById('connectModal');
    const viewProjectsBtn = document.getElementById('switcher-projects-btn');
    const viewDocsBtn = document.getElementById('switcher-docs-btn');
    const mainContent = document.getElementById('main-content');
    const filterSidebar = document.getElementById('filter-sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const openFilterBtn = document.getElementById('filter-icon');
    const closeFilterBtn = document.getElementById('close-filter-btn');

    // --- NOTIFICATION SYSTEM ---
    function showNotification(message, type = 'error', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;
        container.textContent = message;
        container.className = `notification ${type}`;
        container.style.display = 'block';
        setTimeout(() => { container.style.display = 'none'; }, duration);
    }

    // ==========================================================
    // DATA LOADING
    // ==========================================================
    async function loadAllData() {
        try {
            const manifestResponse = await fetch('_data/projects/manifest.json?v=' + new Date().getTime());
            if (!manifestResponse.ok) throw new Error(`Manifest fetch failed: ${manifestResponse.status}`);
            const projectManifest = await manifestResponse.json();
            if (!projectManifest || projectManifest.length === 0) return [];
            const projectPromises = projectManifest.map(async (filePath) => {
                try {
                    const projectResponse = await fetch(filePath);
                    if (!projectResponse.ok) return null;
                    const project = await projectResponse.json();
                    const fileName = filePath.split('/').pop();
                    project.slug = fileName.replace('.json', '');
                    return project;
                } catch (error) {
                    console.error(`Error processing file ${filePath}:`, error);
                    return null;
                }
            });
            const results = await Promise.all(projectPromises);
            return results.filter(p => p !== null);
        } catch (error) {
            console.error("A critical error during data loading:", error);
            showNotification("Error loading project data. See console for details.", "error");
            return [];
        }
    }

    function extractDocumentsFromProjects(loadedProjects) {
        const extractedDocs = [];
        loadedProjects.forEach(project => {
            if (project.artifacts && Array.isArray(project.artifacts)) {
                project.artifacts.forEach(doc => {
                    extractedDocs.push({
                        id: `${project.id}-${doc.name.replace(/\s+/g, '-')}`,
                        name: doc.name,
                        description: doc.description,
                        path: doc.path,
                        projectTitle: project.title,
                        medium: project.medium,
                        genre: project.details?.tags?.genre || [],
                        style: project.details?.tags?.style || [],
                        year: project.year,
                        tech: project.details?.tags?.tech || []
                    });
                });
            }
        });
        return extractedDocs;
    }

    // ==========================================================
    // RENDERING LOGIC
    // ==========================================================
    function renderItems(itemsToRender) {
        if (!projectGrid) return;
        projectGrid.innerHTML = '';
        if (itemsToRender.length === 0) {
            projectGrid.innerHTML = `<p class="info-message">No items match your current criteria.</p>`;
            return;
        }
        const renderFunction = (currentView === 'projects') ? createProjectCard : createDocumentCard;
        itemsToRender.forEach(item => projectGrid.appendChild(renderFunction(item)));
    }

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.id = project.id;
        card.dataset.slug = project.slug;
        const heroImageUrl = project.imageUrl
            ? `images/projects/${project.slug}/${project.imageUrl}`
            : 'https://placehold.co/600x400/e0e5ec/31456A?text=Image+Not+Found';
        const value = project.valueStatement || project.pitch || project.description || '';
        const highlight = project.architectureHighlight || '';
        const tagline = project.tagline || '';
        const domain = String(project.domain || '').toLowerCase();
        
        card.innerHTML = `
            <div class="project-card-hero">
                <img src="${heroImageUrl}" alt="${project.title}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x400/e0e5ec/31456A?text=Image+Error';">
            </div>
            <div class="project-card-content">
                <div class="card-header">
                    <h3 class="card-title">${project.title}</h3>
                    ${project.year ? `<div class="card-year">${project.year}</div>` : ''}
                </div>
                ${tagline ? `<p class="card-tagline${domain ? ` domain-${domain}` : ''}">${tagline}</p>` : ''}
                <p class="card-value">${value}</p>
                ${highlight ? `<p class="card-architecture">${highlight}</p>` : ''}
                ${renderTechChips(project.tech)}
            </div>`;
        return card;
    }

    function techIcon(name) {
        const key = String(name || '').toLowerCase();
        const brands = {
            react: 'fa-react',
            'node.js': 'fa-node-js',
            python: 'fa-python',
            pytorch: 'fa-python',
            'github actions': 'fa-github'
        };
        if (brands[key]) return { prefix: 'fab', icon: brands[key] };
        const solid = {
            'ai safety': 'fa-shield-halved',
            'agent governance': 'fa-sitemap',
            xstate: 'fa-diagram-project',
            guardrails: 'fa-ban',
            gemini: 'fa-star',
            'applied ai': 'fa-brain',
            llm: 'fa-comments',
            forecasting: 'fa-chart-line',
            typescript: 'fa-code',
            mlops: 'fa-gears',
            'azure ml': 'fa-cloud',
            terraform: 'fa-cubes',
            databricks: 'fa-database',
            'ai architecture': 'fa-layer-group',
            agents: 'fa-robot',
            evaluation: 'fa-clipboard-check',
            hgnn: 'fa-circle-nodes',
            'scientific ai': 'fa-flask',
            'ml governance': 'fa-scale-balanced',
            genai: 'fa-wand-magic-sparkles',
            multimodal: 'fa-photo-film',
            'workflow orchestration': 'fa-diagram-project',
            'state management': 'fa-code-branch',
            vite: 'fa-bolt'
        };
        return { prefix: 'fas', icon: solid[key] || 'fa-microchip' };
    }

    function renderTechChips(tech) {
        const items = (tech || []).map(t => String(t).trim()).filter(Boolean).slice(0, 6);
        if (!items.length) return '';
        const chips = items.map(t => {
            const { prefix, icon } = techIcon(t);
            return `<li><i class="${prefix} ${icon}" aria-hidden="true"></i><span>${t}</span></li>`;
        }).join('');
        return `<ul class="card-tech-chips">${chips}</ul>`;
    }

    function createDocumentCard(doc) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.id = doc.id;
        card.dataset.path = doc.path;
        card.innerHTML = `
            <div class="project-card-content">
                <div class="card-header">
                    <h3>${doc.name}</h3>
                    <div class="card-year">${doc.year || ''}</div>
                </div>
                <p class="card-description">${truncateDescription(doc.description)}</p>
                <div class="card-info-section">
                    <span class="card-tag tag-medium">${doc.medium}</span>
                    ${(doc.genre || []).map(g => `<span class="card-tag tag-genre">${g}</span>`).join('')}
                    ${(doc.tech || []).map(t => `<span class="card-tag tag-tech">${t}</span>`).join('')}
                </div>
            </div>`;
        return card;
    }

    function truncateDescription(description, maxLines = 4) {
        if (!description) return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = description;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        const lines = plainText.split('\n').filter(line => line.trim());
        if (lines.length <= maxLines) {
            return description.replace(/\s*<br\s*\/?>\s*/gi, ' ').replace(/\s+/g, ' ').trim();
        }
        return lines.slice(0, maxLines).join(' ') + '...';
    }

    // ==========================================================
    // EVENT HANDLERS & INITIALIZATION
    // ==========================================================
    function handleGridClick(e) {
        const card = e.target.closest('.project-card');
        if (!card) return;
        if (currentView === 'documents') {
            const docPath = card.dataset.path;
            if (docPath) alert(`This will open the document reader for: ${docPath}`);
        } else {
            const projectSlug = card.dataset.slug;
            if (projectSlug) window.location.href = `ParallaxThemes.html?project=${projectSlug}`;
        }
    }

    function toggleSidebar() {
        const isOpen = filterSidebar.classList.contains('is-open');
        filterSidebar.classList.toggle('is-open', !isOpen);
        mainContent.classList.toggle('sidebar-open', !isOpen);
        const topNav = document.getElementById('top-nav');
        if (topNav) topNav.classList.toggle('sidebar-open', !isOpen);
        sidebarBackdrop.classList.toggle('is-visible', !isOpen);
    }

    function setupEventListeners() {
        if (openFilterBtn) openFilterBtn.addEventListener('click', toggleSidebar);
        if (closeFilterBtn) closeFilterBtn.addEventListener('click', toggleSidebar);
        if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', toggleSidebar);
        
        // viewProjectsBtn.addEventListener('click', () => switchView('projects'));
        // viewDocsBtn.addEventListener('click', () => switchView('documents'));
        
        projectGrid.addEventListener('click', handleGridClick);

        if (aboutBtn && connectModal) {
            aboutBtn.addEventListener('click', () => {
                connectModal.classList.add('is-visible');
                connectModal.querySelectorAll('.tab-button').forEach(t => {
                    t.classList.toggle('active', t.getAttribute('data-tab-target') === 'resume');
                });
                connectModal.querySelectorAll('.tab-content').forEach(c => {
                    c.classList.toggle('active', c.getAttribute('data-tab') === 'resume');
                });
            });
        }

        const modalCloseBtn = document.querySelector('.modal-close-btn');
        if (modalCloseBtn && connectModal) {
            modalCloseBtn.addEventListener('click', () => {
                connectModal.classList.remove('is-visible');
            });
        }

        const modalTabs = document.querySelectorAll('.modal-tabs .tab-button');
        const tabContents = document.querySelectorAll('.modal-body .tab-content');
        if (modalTabs.length && tabContents.length) {
            modalTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    modalTabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    tab.classList.add('active');
                    const target = tab.getAttribute('data-tab-target');
                    const content = document.querySelector(`.modal-body .tab-content[data-tab="${target}"]`);
                    if (content) content.classList.add('active');
                });
            });
        }
    }

    function showLoadingSpinner(show) {
        if (!loadingSpinner) return;
        loadingSpinner.classList.toggle('hidden', !show);
        projectGrid.style.display = show ? 'none' : 'grid';
    }

    async function initializePage() {
        showLoadingSpinner(true);
        setupEventListeners();
        try {
            allProjects = await loadAllData();
            allDocuments = extractDocumentsFromProjects(allProjects);
            
            // Initialize the filter module
            initFilter(allProjects, allDocuments, renderItems);

            renderItems(allProjects);

        } catch (error) {
            console.error("Failed to initialize page:", error);
            showNotification("Error initializing projects.", 'error');
            if (projectGrid) projectGrid.innerHTML = `<p class="error-message">Could not load project data.</p>`;
        } finally {
            showLoadingSpinner(false);
        }
    }

    // --- Go! ---
    initializePage();
});