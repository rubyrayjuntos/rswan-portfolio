// js/ui-controller.js
// See implementation guide for full class. This is the core UI controller for the library grid.
class GridController {
    constructor(dataset, config) {
        this.fullDataset = dataset;
        this.config = config;
        this.fuse = new Fuse(this.fullDataset, { keys: config.fuseKeys, includeScore: true, threshold: 0.4 });
        this.state = {
            searchTerm: '',
            category: '',
            tags: [],
            sortBy: 'category-asc',
            itemsToShow: 12,
        };
        this.init();
    }
    init() {
        this.cacheDOMElements();
        this.populateFilterOptions();
        this.attachEventListeners();
        this.updateGrid();
    }
    cacheDOMElements() {
        this.gridElement = document.getElementById(this.config.gridId);
        this.searchInput = document.getElementById('search-input');
        this.filterTrigger = document.getElementById('filter-trigger-btn');
        this.sidebar = document.getElementById('filter-sidebar');
        this.sidebarOverlay = document.getElementById('sidebar-overlay');
        this.sidebarClose = document.getElementById('sidebar-close-btn');
        this.categoryFilter = document.getElementById('category-filter');
        this.tagsContainer = document.getElementById('tags-filter-container');
        this.sortSelect = document.getElementById('sort-select');
        this.appliedFiltersContainer = document.getElementById('applied-filters-container');
        this.loadMoreBtn = document.getElementById('load-more-btn');
    }
    populateFilterOptions() {
        const categories = [...new Set(this.fullDataset.map(d => d.category).filter(Boolean))].sort();
        const tags = [...new Set(this.fullDataset.flatMap(d => d.tags || []))].sort();
        categories.forEach(c => {
            this.categoryFilter.innerHTML += `<option value="${c}">${c}</option>`;
        });
        tags.forEach(t => {
            this.tagsContainer.innerHTML += `
                <label>
                    <input type="checkbox" name="tags" value="${t}"> ${t}
                </label>
            `;
        });
    }
    attachEventListeners() {
        this.searchInput.addEventListener('input', (e) => {
            this.state.searchTerm = e.target.value;
            this.updateGrid();
        });
        this.filterTrigger.addEventListener('click', () => this.toggleSidebar(true));
        this.sidebarClose.addEventListener('click', () => this.toggleSidebar(false));
        this.sidebarOverlay.addEventListener('click', () => this.toggleSidebar(false));
        this.categoryFilter.addEventListener('change', (e) => {
            this.state.category = e.target.value;
            this.updateGrid();
        });
        this.tagsContainer.addEventListener('change', () => {
            this.state.tags = Array.from(this.tagsContainer.querySelectorAll('input:checked')).map(el => el.value);
            this.updateGrid();
        });
        this.sortSelect.addEventListener('change', (e) => {
            this.state.sortBy = e.target.value;
            this.updateGrid();
        });
        this.appliedFiltersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-chip')) {
                const { type, value } = e.target.dataset;
                this.removeFilter(type, value);
            } else if (e.target.classList.contains('clear-all-btn')) {
                this.clearAllFilters();
            }
        });
        this.loadMoreBtn.addEventListener('click', () => {
            this.state.itemsToShow += 12;
            this.updateGrid();
        });
    }
    toggleSidebar(open) {
        this.sidebar.classList.toggle('open', open);
        this.sidebarOverlay.classList.toggle('open', open);
    }
    removeFilter(type, value) {
        if (type === 'category') {
            this.state.category = '';
            this.categoryFilter.value = '';
        }
        if (type === 'tag') {
            this.state.tags = this.state.tags.filter(t => t !== value);
            this.tagsContainer.querySelector(`input[value="${value}"]`).checked = false;
        }
        this.updateGrid();
    }
    clearAllFilters() {
        this.state.category = '';
        this.state.tags = [];
        this.categoryFilter.value = '';
        this.tagsContainer.querySelectorAll('input:checked').forEach(el => el.checked = false);
        this.updateGrid();
    }
    updateGrid() {
        this.renderSkeletonLoader();
        setTimeout(() => {
            let results = this.fullDataset;
            if (this.state.category) {
                results = results.filter(item => item.category === this.state.category);
            }
            if (this.state.tags.length > 0) {
                results = results.filter(item => this.state.tags.every(tag => item.tags && item.tags.includes(tag)));
            }
            if (this.state.searchTerm.trim() !== '') {
                const searchResults = this.fuse.search(this.state.searchTerm, { collection: results });
                results = searchResults.map(result => result.item);
            }
            const [sortKey, sortDir] = this.state.sortBy.split('-');
            results.sort((a, b) => {
                const valA = a[sortKey];
                const valB = b[sortKey];
                if (valA < valB) return sortDir === 'asc' ? -1 : 1;
                if (valA > valB) return sortDir === 'asc' ? 1 : -1;
                return 0;
            });
            this.renderAppliedFilters();
            this.renderCards(results);
        }, 50);
    }
    renderSkeletonLoader() {
        this.gridElement.innerHTML = '';
        this.gridElement.classList.add('loading');
        for (let i = 0; i < 8; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-card';
            skeleton.innerHTML = `
                <div class="skeleton-content">
                    <div class="skeleton-line" style="width: 60%;"></div>
                    <div class="skeleton-line" style="width: 90%;"></div>
                    <div class="skeleton-line" style="width: 80%;"></div>
                </div>
            `;
            this.gridElement.appendChild(skeleton);
        }
    }
    renderAppliedFilters() {
        this.appliedFiltersContainer.innerHTML = '';
        let hasFilters = false;
        if (this.state.category) {
            this.appliedFiltersContainer.innerHTML += `
                <div class="filter-chip">
                    Category: ${this.state.category}
                    <button class="remove-chip" data-type="category" data-value="${this.state.category}">&times;</button>
                </div>`;
            hasFilters = true;
        }
        this.state.tags.forEach(tag => {
            this.appliedFiltersContainer.innerHTML += `
                <div class="filter-chip">
                    Tag: ${tag}
                    <button class="remove-chip" data-type="tag" data-value="${tag}">&times;</button>
                </div>`;
            hasFilters = true;
        });
        if (hasFilters) {
            this.appliedFiltersContainer.innerHTML += `<button class="clear-all-btn">Clear All</button>`;
        }
    }
    renderCards(items) {
        this.gridElement.classList.remove('loading');
        this.gridElement.innerHTML = '';
        if (items.length === 0) {
            this.gridElement.innerHTML = `
                <div class="empty-state-container">
                    <h3>No items match your criteria.</h3>
                    <p>Try adjusting your filters or clearing your search.</p>
                </div>`;
            this.loadMoreBtn.style.display = 'none';
            return;
        }
        const itemsToRender = items.slice(0, this.state.itemsToShow);
        itemsToRender.forEach(item => {
            const card = this.config.cardRenderer(item);
            this.gridElement.appendChild(card);
        });
        if (items.length > this.state.itemsToShow) {
            this.loadMoreBtn.style.display = 'block';
        } else {
            this.loadMoreBtn.style.display = 'none';
        }
    }
}
