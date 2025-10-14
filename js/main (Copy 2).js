// ==========================================================
// UNIFIED MAIN SCRIPT V6 - FILTERING FIX
// Handles project/document loading, filtering, search, modals,
// and dual-view (Project/Document) logic for the main portfolio page.
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    let allProjects = [];
    let allDocuments = [];
    let currentView = 'projects'; // 'projects' or 'documents'
    let fuse;

    let activeFilters = {
        medium: 'all', // Changed to string for single selection
        genre: [],
        tech: [],
        style: []
    };

    // --- DOM ELEMENTS ---
    const projectGrid = document.getElementById('projectGrid');
    const mainSearchInput = document.getElementById('mainSearchInput');
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
    const filterGroupContainer = document.querySelector('#filter-sidebar .filter-group-container');
    const activeFiltersDisplay = document.getElementById('active-filters-display');

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
        const details = project.details || {};
        const description = details.description || project.description || '';
        const role = details.role || project.role || '';
        const tags = details.tags || {};
        const genre = tags.genre || project.genre || [];
        const tech = tags.tech || project.tech || [];
        const style = tags.style || project.style || [];
        const createTagsHTML = (items, label, tagClass = '') => {
            if (!items || items.length === 0) return '';
            let itemsArray = Array.isArray(items) ? items : String(items).split(',').map(item => item.trim());
            if (itemsArray.length === 0 || (itemsArray.length === 1 && !itemsArray[0])) return '';
            const visibleItems = itemsArray.slice(0, 3);
            const hiddenCount = itemsArray.length - visibleItems.length;
            return `
                <div class="card-tags-group">
                    <h4 class="card-tags-label">${label}</h4>
                    <div class="card-tags">
                        ${visibleItems.map(item => `<span class="card-tag ${tagClass}">${item.replace(/-/g, ' ')}</span>`).join('')}
                        ${hiddenCount > 0 ? `<span class="card-tag-more">+${hiddenCount}</span>` : ''}
                    </div>
                </div>`;
        };
        card.innerHTML = `
            <div class="project-card-hero">
                <img src="${heroImageUrl}" alt="${project.title}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x400/e0e5ec/31456A?text=Image+Error';">
                <span class="card-medium-badge medium-${project.medium?.toLowerCase()}">${project.medium}</span>
            </div>
            <div class="project-card-content">
                <div class="card-header">
                    <h3>${project.title}</h3>
                    <div class="card-year">${project.year || ''}</div>
                </div>
                <p class="card-description">${truncateDescription(description)}</p>
            </div>`;
        return card;
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
    // FILTERING & SEARCH
    // ==========================================================
    function initializeSearch(data) {
        fuse = new Fuse(data, {
            includeScore: true,
            threshold: 0.4,
            keys: ['title', 'name', 'description', 'tech', 'genre', 'role']
        });
    }

    function applyFiltersAndSearch() {
        let dataSource = (currentView === 'projects') ? allProjects : allDocuments;
        let itemsToFilter = dataSource;

        const searchQuery = mainSearchInput.value.trim();
        if (searchQuery && fuse) {
            itemsToFilter = fuse.search(searchQuery).map(result => result.item);
        }

        // Apply facet filters
        itemsToFilter = itemsToFilter.filter(p => {
            const mediumMatch = activeFilters.medium === 'all' || p.medium === activeFilters.medium;

            // For array-based filters, check if at least ONE of the selected tags is present in the project's tags.
            const
                if (!p[key]) return false;
                if (Array.isArray(p[key])) {
                    return activeFilters[key].some(v => p[key].includes(v));
                }
                return activeFilters[key].includes(p[key]);
            });
        });
    }
        renderItems(itemsToFilter);
    }

function populateFilterPanel(projectsData) {
    if (!filterGroupContainer) return;

    // --- Medium (always show all three) ---
    const mediums = ['Art', 'Code', 'Writing'];
    // Count projects by medium
    const mediumCounts = {};
    projectsData.forEach(p => {
        const m = (p.medium || '').toLowerCase();
        if (mediums.map(x => x.toLowerCase()).includes(m)) {
            mediumCounts[m] = (mediumCounts[m] || 0) + 1;
        }
    });
    const mediumOptions = mediums.map(medium => {
        const key = medium.toLowerCase();
        const count = mediumCounts[key] || 0;
        return `
            <div class="filter-option">
                <input type="checkbox" id="filter-medium-${key}" name="medium" value="${medium}">
                <label for="filter-medium-${key}">${medium} <span class="filter-count">(${count})</span></label>
            </div>
        `;
    }).join('');

    // --- Genre (shortlist only) ---
    const genreShortlist = [
        'Tarot',
        'Speculative Fiction',
        'Romance',
        'Comics/Graphic Novels',
        'Brand Design'
    ];
    // Count projects by genre
    const genreCounts = {};
    projectsData.forEach(p => {
        const genres = (p.genre || []).map(g => g.trim());
        genres.forEach(g => {
            if (genreShortlist.includes(g)) {
                genreCounts[g] = (genreCounts[g] || 0) + 1;
            }
        });
    });
    const genreOptions = genreShortlist.map(genre => `
        <div class="filter-option">
            <input type="checkbox" id="filter-genre-${genre.replace(/\s+/g, '-')}" name="genre" value="${genre}">
            <label for="filter-genre-${genre.replace(/\s+/g, '-')}">${genre} <span class="filter-count">(${genreCounts[genre] || 0})</span></label>
        </div>
    `).join('');

    // --- Tech (shortlist only) ---
    const techShortlist = ['JavaScript', 'Python', 'AI/ML', 'React'];
    const techCounts = {};
    projectsData.forEach(p => {
        const techs = (p.tech || []).map(t => t.trim());
        techs.forEach(t => {
            if (techShortlist.includes(t)) {
                techCounts[t] = (techCounts[t] || 0) + 1;
            }
        });
    });
    const techOptions = techShortlist.map(tech => `
        <div class="filter-option">
            <input type="checkbox" id="filter-tech-${tech.replace(/\W+/g, '-')}" name="tech" value="${tech}">
            <label for="filter-tech-${tech.replace(/\W+/g, '-')}" >${tech} <span class="filter-count">(${techCounts[tech] || 0})</span></label>
        </div>
    `).join('');

    // --- Style (shortlist only) ---
    const styleShortlist = ['Expressive', 'Minimalist', 'Narrative-Driven'];
    const styleCounts = {};
    projectsData.forEach(p => {
        const styles = (p.style || []).map(s => s.trim());
        styles.forEach(s => {
            if (styleShortlist.includes(s)) {
                styleCounts[s] = (styleCounts[s] || 0) + 1;
            }
        });
    });
    const styleOptions = styleShortlist.map(style => `
        <div class="filter-option">
            <input type="checkbox" id="filter-style-${style.replace(/\s+/g, '-')}" name="style" value="${style}">
            <label for="filter-style-${style.replace(/\s+/g, '-')}">${style} <span class="filter-count">(${styleCounts[style] || 0})</span></label>
        </div>
    `).join('');

    // --- Build the filter panel HTML ---
    filterGroupContainer.innerHTML = `
        <div class="filter-group">
            <button class="filter-group-header"><span>Medium</span><i class="fas fa-chevron-down"></i></button>
            <div class="filter-group-body">${mediumOptions}</div>
        </div>
        <div class="filter-group">
            <button class="filter-group-header"><span>Genre</span><i class="fas fa-chevron-down"></i></button>
            <div class="filter-group-body">${genreOptions}</div>
        </div>
        <div class="filter-group">
            <button class="filter-group-header"><span>Tech</span><i class="fas fa-chevron-down"></i></button>
            <div class="filter-group-body">${techOptions}</div>
        </div>
        <div class="filter-group">
            <button class="filter-group-header"><span>Style</span><i class="fas fa-chevron-down"></i></button>
            <div class="filter-group-body">${styleOptions}</div>
        </div>
    `;

    // Expand/collapse
    filterGroupContainer.querySelectorAll('.filter-group-header').forEach(header => {
        header.addEventListener('click', () => header.parentElement.classList.toggle('is-open'));
    });

    // Add instant filtering on checkbox change
    filterGroupContainer.querySelectorAll('input[type="checkbox"]').forEach(box => {
        box.addEventListener('change', () => {
            updateActiveFiltersFromPanel();
            applyFiltersAndSearch();
        });
    });
}


    function updateActiveFiltersFromPanel() {
        ['medium','genre', 'tech', 'style'].forEach(key => activeFilters[key] = []);
        filterGroupContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(box => {
            if (activeFilters[box.name]) activeFilters[box.name].push(box.value);
        });
    }

    // ==========================================================
    // EVENT HANDLERS & INITIALIZATION
    // ==========================================================
    function switchView(newView) {
        if (currentView === newView) return;
        currentView = newView;
        viewProjectsBtn.classList.toggle('active', newView === 'projects');
        viewDocsBtn.classList.toggle('active', newView === 'documents');
        initializeSearch(currentView === 'projects' ? allProjects : allDocuments);
        applyFiltersAndSearch();
    }

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
if (aboutBtn && connectModal) {
    aboutBtn.addEventListener('click', () => {
        connectModal.classList.add('is-visible');
    });
}
// Modal tab switching logic
const modalTabs = document.querySelectorAll('.modal-tabs .tab-button');
const tabContents = document.querySelectorAll('.modal-body .tab-content');

if (modalTabs.length && tabContents.length) {
    modalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs and contents
            modalTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            // Add active to clicked tab and corresponding content
            tab.classList.add('active');
            const target = tab.getAttribute('data-tab-target');
            const content = document.querySelector(`.modal-body .tab-content[data-tab="${target}"]`);
            if (content) content.classList.add('active');
        });
    });
}
const modalCloseBtn = document.querySelector('.modal-close-btn');
if (modalCloseBtn && connectModal) {
    modalCloseBtn.addEventListener('click', () => {
        connectModal.classList.remove('is-visible');
    });
}
    function setupEventListeners() {
        if (openFilterBtn) openFilterBtn.addEventListener('click', toggleSidebar);
        if (closeFilterBtn) closeFilterBtn.addEventListener('click', toggleSidebar);
        if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', toggleSidebar);
        viewProjectsBtn.addEventListener('click', () => switchView('projects'));
        viewDocsBtn.addEventListener('click', () => switchView('documents'));
        projectGrid.addEventListener('click', handleGridClick);
        mainSearchInput.addEventListener('input', () => debounce(applyFiltersAndSearch, 300)());
    }

    function showLoadingSpinner(show) {
        if (!loadingSpinner) return;
        loadingSpinner.classList.toggle('hidden', !show);
        projectGrid.style.display = show ? 'none' : 'grid';
    }

    async function initializePage() {
        showLoadingSpinner(true);
        try {
            allProjects = await loadAllData();
            console.log("Loaded projects:", allProjects);
        
            allDocuments = extractDocumentsFromProjects(allProjects);
            initializeSearch(allProjects);
            populateFilterPanel(allProjects);
            setupEventListeners();
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

    // --- Utility ---
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});