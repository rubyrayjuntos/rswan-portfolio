
// ==========================================================
// UNIFIED MAIN SCRIPT V6 - FACETED FILTERING & DYNAMIC UI
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
        medium: [],
        genre: [],
        tech: [],
        style: []
    };

    // --- DOM ELEMENTS ---
    const projectGrid = document.getElementById('projectGrid');
    const mainSearchInput = document.getElementById('mainSearchInput');
    const loadingSpinner = document.getElementById('loading-spinner');
    const filterPanel = document.getElementById('filter-panel');
    const filterGroupContainer = document.querySelector('#filter-panel .filter-group-container');
    const activeFiltersDisplay = document.getElementById('active-filters-display');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const applyFiltersBtn = document.getElementById('apply-filters-btn'); // Though redundant, we manage it.
    const filterIcon = document.getElementById('filter-icon');
    const closeFilterPanelBtn = document.getElementById('close-filter-panel');


    // --- NOTIFICATION SYSTEM ---
    function showNotification(message, type = 'error', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="notification-icon"><i class="fas fa-times-circle"></i></span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;
        container.appendChild(notification);

        // Auto-dismiss
        const timer = setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, duration);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timer);
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        });
    }


    // ==========================================================
    // DATA LOADING
    // ==========================================================
    async function loadAllData() {
        showLoadingSpinner(true);
        try {
            // Use cache-busting query param to ensure fresh data
            const manifestResponse = await fetch(`_data/projects.json?v=${new Date().getTime()}`);
            if (!manifestResponse.ok) {
                throw new Error(`Manifest fetch failed: ${manifestResponse.status}`);
            }
            const projectManifest = await manifestResponse.json();

            if (!projectManifest || !Array.isArray(projectManifest.projects)) {
                 console.error("Invalid manifest format:", projectManifest);
                 throw new Error("Manifest format is invalid.");
            }

            // The manifest now contains the project data directly.
            allProjects = projectManifest.projects.map(p => ({
                ...p,
                slug: p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
            }));

            allDocuments = extractDocumentsFromProjects(allProjects);
            initializePage();

        } catch (error) {
            console.error("A critical error during data loading:", error);
            showNotification("Error loading project data. See console for details.", "error");
            if (projectGrid) projectGrid.innerHTML = `<p class="error-message">Could not load project data.</p>`;
        } finally {
            showLoadingSpinner(false);
        }
    }

    function extractDocumentsFromProjects(projects) {
        const extractedDocs = [];
        projects.forEach(project => {
            if (project.artifacts && Array.isArray(project.artifacts)) {
                project.artifacts.forEach(doc => {
                    extractedDocs.push({
                        id: `${project.id}-${doc.name.replace(/\s+/g, '-')}`,
                        name: doc.name,
                        description: doc.description,
                        path: doc.path,
                        projectTitle: project.title,
                        // Inherit filterable properties from parent project
                        medium: project.medium ? [project.medium] : [],
                        genre: project.genre || [],
                        style: project.style || [],
                        tech: project.tech || [],
                        year: project.year,
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

        const fragment = document.createDocumentFragment();
        const renderFunction = (currentView === 'projects') ? createProjectCard : createDocumentCard;
        itemsToRender.forEach(item => fragment.appendChild(renderFunction(item)));
        projectGrid.appendChild(fragment);
    }

   function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.id = project.id;
    card.dataset.slug = project.slug;

    // Default image if none provided
    const heroImageUrl = project.imageUrl
        ? project.imageUrl
        : 'https://placehold.co/600x400/e0e5ec/31456A?text=Image+Not+Found';

    // Safely access nested properties
    const description = project.description || '';
    const genre = project.genre || [];
    const tech = project.tech || [];
    const style = project.style || [];
    const medium = project.medium || 'N/A';

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
            <span class="card-medium-badge medium-${medium.toLowerCase()}">${medium}</span>
        </div>
        <div class="project-card-content">
            <div class="card-header">
                <h3>${project.title}</h3>
                <div class="card-year">${project.year || ''}</div>
            </div>
            <p class="card-description">${truncateText(description)}</p>
            <div class="card-tags-container">
                ${createTagsHTML(genre, 'Genre', 'tag-genre')}
                ${createTagsHTML(tech, 'Tech', 'tag-tech')}
            </div>
        </div>`;
    return card;
}


    function createDocumentCard(doc) {
        const card = document.createElement('div');
        card.className = 'project-card document-card'; // Add a specific class for styling
        card.dataset.id = doc.id;
        card.dataset.path = doc.path;

        card.innerHTML = `
            <div class="document-card-icon">
                <i class="fas fa-file-alt"></i>
            </div>
            <div class="project-card-content">
                <div class="card-header">
                    <h3>${doc.name}</h3>
                    <div class="card-year">${doc.year || ''}</div>
                </div>
                <p class="card-description">${truncateText(doc.description)}</p>
                <div class="card-info-section">
                    <span class="card-tag tag-project-link">From: ${doc.projectTitle}</span>
                    ${(doc.medium || []).map(m => `<span class="card-tag tag-medium">${m}</span>`).join('')}
                    ${(doc.genre || []).map(g => `<span class="card-tag tag-genre">${g}</span>`).join('')}
                    ${(doc.tech || []).map(t => `<span class="card-tag tag-tech">${t}</span>`).join('')}
                </div>
            </div>`;
        return card;
    }

    function truncateText(text, maxLength = 120) {
        if (!text) return '';
        // First, remove HTML tags to get plain text for length check
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';

        if (plainText.length <= maxLength) {
            return text; // Return original text if it's short enough
        }
        // Truncate plain text and add ellipsis
        return plainText.substring(0, maxLength).trim() + '...';
    }


    // ==========================================================
    // FILTERING & SEARCH
    // ==========================================================
    function initializeSearch(data) {
        fuse = new Fuse(data, {
            includeScore: true,
            threshold: 0.4,
            keys: [
                'title', 'name', 'description', 'role',
                'tech', 'genre', 'style', 'medium'
            ]
        });
    }

    function applyFiltersAndSearch() {
        const dataSource = (currentView === 'projects') ? allProjects : allDocuments;
        let results = dataSource;

        // 1. Search Filter (if applicable)
        const searchQuery = mainSearchInput.value.trim();
        if (searchQuery.length > 1 && fuse) {
            results = fuse.search(searchQuery).map(result => result.item);
        }

        // 2. Facet Filters
        const hasActiveFilters = Object.values(activeFilters).some(arr => arr.length > 0);
        if (hasActiveFilters) {
            results = results.filter(item => {
                return Object.keys(activeFilters).every(key => {
                    if (activeFilters[key].length === 0) return true;
                    if (!item[key] || item[key].length === 0) return false;

                    // Ensure item[key] is an array for consistent checking
                    const itemValues = Array.isArray(item[key]) ? item[key] : [item[key]];

                    // **CASE-INSENSITIVE** Check if any of the item's values are in the active filter list
                    return activeFilters[key].some(filterValue => 
                        itemValues.some(itemValue => itemValue.toLowerCase() === filterValue.toLowerCase())
                    );
                });
            });
        }

        // 3. Render the final results
        renderItems(results);

        // 4. Update UI elements based on the new state
        updateFilterPanel(dataSource, results); // Update panel with relevant counts
        updateActiveFiltersDisplay(); // Update the "Active Filters" bar
    }

    function populateFilterPanel(projectsData) {
        if (!filterGroupContainer) return;

        const filters = {
            medium: { label: 'Medium', values: new Set() },
            genre: { label: 'Genre', values: new Set() },
            tech: { label: 'Tech', values: new Set() },
            style: { label: 'Style', values: new Set() }
        };

        // Extract all possible filter values from the entire dataset
        projectsData.forEach(p => {
            // Medium is a string, not an array in the source data
            if (p.medium) filters.medium.values.add(p.medium);
            (p.genre || []).forEach(g => filters.genre.values.add(g));
            (p.tech || []).forEach(t => filters.tech.values.add(t));
            (p.style || []).forEach(s => filters.style.values.add(s));
        });

        let panelHTML = '';
        for (const [key, { label, values }] of Object.entries(filters)) {
            if (values.size > 0) {
                const optionsHTML = [...values].sort().map(value => {
                    const id = `filter-${key}-${value.replace(/\s+/g, '-')}`;
                    return `
                        <div class="filter-option" data-key="${key}" data-value="${value}">
                            <input type="checkbox" id="${id}" name="${key}" value="${value}">
                            <label for="${id}">${value} <span class="filter-count">(0)</span></label>
                        </div>
                    `;
                }).join('');

                panelHTML += `
                    <div class="filter-group is-open">
                        <button class="filter-group-header">
                            <span>${label}</span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="filter-group-body">${optionsHTML}</div>
                    </div>
                `;
            }
        }
        filterGroupContainer.innerHTML = panelHTML;

        // Add accordion functionality
        filterGroupContainer.querySelectorAll('.filter-group-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('is-open');
            });
        });
    }

    function updateFilterPanel(fullDataset, currentlyVisibleItems) {
        if (!filterGroupContainer) return;

        // First, calculate counts based on currently visible items
        const counts = {};
        Object.keys(activeFilters).forEach(key => {
            counts[key] = {};
            currentlyVisibleItems.forEach(item => {
                const values = Array.isArray(item[key]) ? item[key] : [item[key]];
                values.forEach(value => {
                    if (value) {
                        counts[key][value] = (counts[key][value] || 0) + 1;
                    }
                });
            });
        });

        // Update the DOM
        filterGroupContainer.querySelectorAll('.filter-option').forEach(option => {
            const { key, value } = option.dataset;
            const count = counts[key]?.[value] || 0;
            const countEl = option.querySelector('.filter-count');
            const inputEl = option.querySelector('input');

            if (countEl) {
                countEl.textContent = `(${count})`;
            }

            // Disable option if it has no relevant items, but don't disable if it's already checked
            if (inputEl && !inputEl.checked) {
                 option.classList.toggle('disabled', count === 0);
                 inputEl.disabled = (count === 0);
            }
        });
    }


    function updateActiveFiltersFromPanel() {
        // Reset current active filters
        Object.keys(activeFilters).forEach(key => activeFilters[key] = []);
        // Read from checkboxes
        filterGroupContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(box => {
            if (activeFilters[box.name]) {
                activeFilters[box.name].push(box.value);
            }
        });
    }

    function updateActiveFiltersDisplay() {
        if (!activeFiltersDisplay) return;

        const allActive = Object.values(activeFilters).flat();

        if (allActive.length === 0) {
            activeFiltersDisplay.classList.add('hidden');
            activeFiltersDisplay.innerHTML = '';
            return;
        }

        activeFiltersDisplay.classList.remove('hidden');

        const filterTagsHTML = allActive.map(filterValue => {
            const filterType = Object.keys(activeFilters).find(key => activeFilters[key].includes(filterValue));
            return `
                <div class="active-filter-tag" data-type="${filterType}" data-value="${filterValue}">
                    <span>${filterValue}</span>
                    <button class="remove-filter-btn">&times;</button>
                </div>
            `;
        }).join('');

        activeFiltersDisplay.innerHTML = `
            <span class="active-filters-label">Active:</span>
            ${filterTagsHTML}
            <button id="clear-all-active-btn">Clear All</button>
        `;
    }


    // ==========================================================
    // EVENT HANDLERS & INITIALIZATION
    // ==========================================================
    function switchView(newView) {
        if (currentView === newView) return;
        currentView = newView;

        // This part is for a potential view switcher UI, which is not in the HTML but good to have
        // document.getElementById('switcher-projects-btn').classList.toggle('active', newView === 'projects');
        // document.getElementById('switcher-docs-btn').classList.toggle('active', newView === 'documents');

        const dataSource = (currentView === 'projects') ? allProjects : allDocuments;
        initializeSearch(dataSource);
        populateFilterPanel(dataSource); // Repopulate filters for the new view
        applyFiltersAndSearch(); // Apply current filters to the new view
    }

    function handleGridClick(e) {
        const card = e.target.closest('.project-card');
        if (!card) return;

        if (currentView === 'documents') {
            const docPath = card.dataset.path;
            if (docPath) {
                // This could be a modal, a new tab, etc.
                alert(`This will open the document reader for: ${docPath}`);
            }
        } else {
            const projectSlug = card.dataset.slug;
            if (projectSlug) {
                window.location.href = `ParallaxThemes.html?project=${projectSlug}`;
            }
        }
    }

    function toggleFilterPanel() {
        if (filterPanel) {
            const isVisible = filterPanel.classList.contains('is-visible');
            filterPanel.classList.toggle('is-visible', !isVisible);
        }
    }

    function clearAllFilters() {
        Object.keys(activeFilters).forEach(key => activeFilters[key] = []);
        if (filterGroupContainer) {
            filterGroupContainer.querySelectorAll('input:checked').forEach(box => {
                box.checked = false;
            });
        }
        applyFiltersAndSearch();
    }

    function setupEventListeners() {
        // Search
        if (mainSearchInput) {
            mainSearchInput.addEventListener('input', debounce(applyFiltersAndSearch, 300));
        }

        // Filter Panel
        if (filterIcon) filterIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFilterPanel();
        });
        if (closeFilterPanelBtn) closeFilterPanelBtn.addEventListener('click', toggleFilterPanel);

        // Clicks outside the filter panel should close it
        document.addEventListener('click', (e) => {
            if (filterPanel && filterPanel.classList.contains('is-visible')) {
                if (!filterPanel.contains(e.target) && !filterIcon.contains(e.target)) {
                    filterPanel.classList.remove('is-visible');
                }
            }
        });


        // Filter Logic
        if (filterGroupContainer) {
            filterGroupContainer.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    updateActiveFiltersFromPanel();
                    applyFiltersAndSearch();
                }
            });
        }
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearAllFilters);
        }
        if (applyFiltersBtn) { // This button is redundant now but we'll make it close the panel
            applyFiltersBtn.addEventListener('click', toggleFilterPanel);
        }


        // Active Filters Bar
        if (activeFiltersDisplay) {
            activeFiltersDisplay.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-filter-btn')) {
                    const tag = e.target.closest('.active-filter-tag');
                    const { type, value } = tag.dataset;
                    activeFilters[type] = activeFilters[type].filter(item => item !== value);
                    const checkbox = filterGroupContainer.querySelector(`input[name="${type}"][value="${value}"]`);
                    if (checkbox) checkbox.checked = false;
                    applyFiltersAndSearch();
                }
                if (e.target.id === 'clear-all-active-btn') {
                    clearAllFilters();
                }
            });
        }

        // Project Grid
        if (projectGrid) {
            projectGrid.addEventListener('click', handleGridClick);
        }

        // Modals (re-using your existing robust logic)
        const modalTriggers = document.querySelectorAll('[data-modal-target]');
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const modalId = trigger.getAttribute('data-modal-target');
                const tabId = trigger.getAttribute('data-tab-target');
                const targetModal = document.getElementById(modalId);

                if (targetModal) {
                    targetModal.classList.add('is-visible');
                    const tabs = targetModal.querySelectorAll('.tab-button');
                    const tabContents = targetModal.querySelectorAll('.tab-content');
                    tabs.forEach(tab => tab.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    const targetTab = targetModal.querySelector(`.tab-button[data-tab="${tabId}"]`);
                    const targetContent = targetModal.querySelector(`.tab-content[id="${tabId}"]`);
                    if (targetTab) targetTab.classList.add('active');
                    if (targetContent) targetContent.classList.add('active');
                }
            });
        });

        const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
        modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal-overlay').classList.remove('is-visible');
            });
        });

        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('is-visible');
                }
            });
        });
    }

    function showLoadingSpinner(show) {
        if (!loadingSpinner) return;
        loadingSpinner.classList.toggle('hidden', !show);
        if (projectGrid) {
            projectGrid.style.display = show ? 'none' : 'grid';
        }
    }

    function initializePage() {
        setupEventListeners();
        initializeSearch(allProjects);
        populateFilterPanel(allProjects);
        applyFiltersAndSearch(); // Initial render
    }

    // --- Go! ---
    loadAllData();

    // --- Utility ---
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Copyright and Year
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.getElementById('copyright');
    if (copyrightElement) {
        copyrightElement.textContent = `© ${currentYear} R. Swan. All Rights Reserved.`;
    }
});
