
// js/filter.js

// --- STATE MANAGEMENT ---
let fuse;
let allProjects = [];
let allDocuments = [];
let currentView = 'projects';

let allFilterValues = {
    genre: [],
    tech: [],
    style: []
};

let activeFilters = {
    medium: [],
    genre: [],
    tech: [],
    style: []
};

// --- DOM ELEMENTS ---
let projectGrid, mainSearchInput, filterGroupContainer, activeFiltersDisplay;

// --- RENDER FUNCTIONS (passed from main.js) ---
let renderItems;

// ==========================================================
// INITIALIZATION
// ==========================================================
export function init(projects, documents, renderFunc) {
    allProjects = projects;
    allDocuments = documents;
    renderItems = renderFunc;

    // Cache DOM elements
    projectGrid = document.getElementById('projectGrid');
    mainSearchInput = document.getElementById('mainSearchInput');
    filterGroupContainer = document.querySelector('#filter-sidebar .filter-group-container');
    activeFiltersDisplay = document.getElementById('active-filters-display');

    calculateAllFilterValues();
    initializeSearch(allProjects);
    populateFilterPanel(allProjects, activeFilters);
    renderActiveFilterPills();
    setupFilterEventListeners();
}

// ==========================================================
// FILTERING & SEARCH CORE
// ==========================================================
function initializeSearch(data) {
    fuse = new Fuse(data, {
        includeScore: true,
        threshold: 0.4,
        keys: ['title', 'name', 'description', 'tech', 'genre', 'role', 'tagline', 'valueStatement', 'architectureHighlight', 'pitch']
    });
}

function applyFiltersAndSearch() {
    projectGrid.classList.add('grid-updating');

    let dataSource = (currentView === 'projects') ? allProjects : allDocuments;
    let itemsToFilter = dataSource;
    const searchQuery = mainSearchInput.value.trim();

    if (searchQuery && fuse) {
        itemsToFilter = fuse.search(searchQuery).map(result => result.item);
    }

    const filterKeys = ['medium', 'genre', 'tech', 'style'];
    const hasActiveFilters = filterKeys.some(key => activeFilters[key].length > 0);

    if (hasActiveFilters) {
        itemsToFilter = itemsToFilter.filter(p => {
            return filterKeys.every(key => {
                if (activeFilters[key].length === 0) return true;
                if (!p[key]) return false;
                if (Array.isArray(p[key])) {
                    const projectValues = p[key].map(val => typeof val === 'string' ? val.toLowerCase() : val);
                    const filterValues = activeFilters[key].map(val => typeof val === 'string' ? val.toLowerCase() : val);
                    return filterValues.some(v => projectValues.includes(v));
                }
                return activeFilters[key].map(val => val.toLowerCase()).includes(String(p[key]).toLowerCase());
            });
        });
    }

    renderItems(itemsToFilter);
    projectGrid.offsetHeight; // Trigger reflow
    projectGrid.classList.remove('grid-updating');

    return itemsToFilter;
}

// ==========================================================
// UI RENDERING (FILTER PANEL & PILLS)
// ==========================================================
function populateFilterPanel(projectsData, currentFilters) {
    if (!filterGroupContainer) return;

    const createOptions = (filterKey, allValues) => {
        const counts = {};
        projectsData.forEach(p => {
            const values = p[filterKey] || [];
            const arrayValues = Array.isArray(values) ? values : [values];
            arrayValues.forEach(val => {
                let v = (val || '').toString().trim();
                if (filterKey === 'medium') v = v.toLowerCase();
                if (v) counts[v] = (counts[v] || 0) + 1;
            });
        });

        const activeValues = (currentFilters[filterKey] || []).map(v => v.toLowerCase());

        return allValues
            .sort((a, b) => {
                const countA = counts[a] || 0;
                const countB = counts[b] || 0;
                if (countB !== countA) return countB - countA;
                return a.localeCompare(b);
            })
            .filter(value => {
                const count = counts[value] || 0;
                return count > 0 || activeValues.includes(value.toLowerCase());
            })
            .map(value => {
                const count = counts[value] || 0;
                const isChecked = activeValues.includes(value.toLowerCase());
                const id = `filter-${filterKey}-${value.replace(/\W+/g, '-')}`;
                return `
                    <div class="filter-option">
                        <input type="checkbox" id="${id}" name="${filterKey}" value="${value}" ${isChecked ? 'checked' : ''}>
                        <label for="${id}">${value} <span class="filter-count">(${count})</span></label>
                    </div>
                `;
            }).join('');
    };

    const mediumOptions = createOptions('medium', ['art', 'code', 'writing']);
    const genreOptions = createOptions('genre', allFilterValues.genre);
    const techOptions = createOptions('tech', allFilterValues.tech);
    const styleOptions = createOptions('style', allFilterValues.style);

    filterGroupContainer.innerHTML = `
        <div class="filter-group is-open">
            <button class="filter-group-header"><span>Medium</span><i class="fas fa-chevron-down"></i></button>
            <div class="filter-group-body">${mediumOptions}</div>
        </div>
        <div class="filter-group is-open">
            <button class="filter-group-header"><span>Genre</span><i class="fas fa-chevron-down"></i></button>
            <div class="filter-group-body">${genreOptions}</div>
        </div>
        <div class="filter-group is-open">
            <button class="filter-group-header"><span>Tech</span><i class="fas fa-chevron-down"></i></button>
            <div class="filter-group-body">${techOptions}</div>
        </div>
        <div class="filter-group is-open">
            <button class="filter-group-header"><span>Style</span><i class="fas fa-chevron-down"></i></button>
            <div class="filter-group-body">${styleOptions}</div>
        </div>
    `;

    filterGroupContainer.querySelectorAll('.filter-group-header').forEach(header => {
        header.addEventListener('click', () => header.parentElement.classList.toggle('is-open'));
    });

    filterGroupContainer.querySelectorAll('input[type="checkbox"]').forEach(box => {
        box.addEventListener('change', handleFilterChange);
    });
}

function renderActiveFilterPills() {
    if (!activeFiltersDisplay) return;
    activeFiltersDisplay.innerHTML = '';
    let hasFilters = false;

    for (const category in activeFilters) {
        activeFilters[category].forEach(value => {
            hasFilters = true;
            const pill = document.createElement('div');
            pill.className = 'filter-pill';
            pill.innerHTML = `
                <span>${value}</span>
                <button data-category="${category}" data-value="${value}">&times;</button>
            `;
            activeFiltersDisplay.appendChild(pill);
        });
    }

    if (hasFilters) {
        const clearButton = document.createElement('button');
        clearButton.className = 'filter-pill clear-all';
        clearButton.textContent = 'Clear All';
        activeFiltersDisplay.appendChild(clearButton);
    }

    activeFiltersDisplay.classList.toggle('hidden', !hasFilters);
}

// ==========================================================
// EVENT HANDLERS
// ==========================================================
function setupFilterEventListeners() {
    mainSearchInput.addEventListener('input', debounce(() => {
        const filteredData = applyFiltersAndSearch();
        populateFilterPanel(filteredData, activeFilters);
        renderActiveFilterPills();
    }, 300));

    activeFiltersDisplay.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName !== 'BUTTON') return;

        if (target.classList.contains('clear-all')) {
            for (const category in activeFilters) {
                activeFilters[category] = [];
            }
        } else {
            const { category, value } = target.dataset;
            if (category && value) {
                activeFilters[category] = activeFilters[category].filter(v => v !== value);
            }
        }
        
        handleFilterChange();
    });
}

function handleFilterChange() {
    updateActiveFiltersFromPanel();
    const filteredData = applyFiltersAndSearch();
    populateFilterPanel(filteredData, activeFilters);
    renderActiveFilterPills();
}

function updateActiveFiltersFromPanel() {
    ['medium', 'genre', 'tech', 'style'].forEach(key => activeFilters[key] = []);
    filterGroupContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(box => {
        if (activeFilters[box.name]) {
            activeFilters[box.name].push(box.value);
        }
    });
}

function calculateAllFilterValues() {
    const genres = new Set();
    const techs = new Set();
    const styles = new Set();
    allProjects.forEach(p => {
        (p.genre || []).forEach(g => genres.add(g.trim()));
        (p.tech || []).forEach(t => techs.add(t.trim()));
        (p.style || []).forEach(s => styles.add(s.trim()));
    });
    allFilterValues.genre = Array.from(genres);
    allFilterValues.tech = Array.from(techs);
    allFilterValues.style = Array.from(styles);
}

// --- Utility ---
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
