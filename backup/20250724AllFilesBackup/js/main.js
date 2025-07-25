// Main JavaScript - Core initialization and project data

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Feature detection for progressive enhancement
function supportsParallax() {
    return 'CSS' in window && 'supports' in CSS && 
           CSS.supports('transform', 'translate3d(0, 0, 0)');
}

// Performance monitoring
let frameCount = 0;
let lastTime = performance.now();
window.performanceMode = false;

function monitorPerformance() {
    function checkPerformance(currentTime) {
        frameCount++;
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            if (fps < 15 && !window.performanceMode) {
                console.warn('Very low FPS detected:', fps, '- Enabling performance mode');
                enablePerformanceMode();
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(checkPerformance);
    }
    
    requestAnimationFrame(checkPerformance);
}

function enablePerformanceMode() {
    window.performanceMode = true;
    document.body.classList.add('performance-mode');
    // Disable complex animations
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => particle.style.display = 'none');
}

function disablePerformanceMode() {
    window.performanceMode = false;
    document.body.classList.remove('performance-mode');
    // Re-enable complex animations
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => particle.style.display = '');
    
    // Recreate particles if they were removed
    if (window.motionEnabled) {
        createParticles();
    }
}

// Current project type
let currentProject = 'code';

// Initialize the page with progressive enhancement
async function init() {
    console.log('Initializing application...');
    
    // Start performance monitoring
    monitorPerformance();
    
    // Initialize all modules
    if (typeof initTheme === 'function') initTheme();
    if (typeof initUI === 'function') initUI();
    if (typeof initAnimations === 'function') initAnimations();
    if (typeof initParallax === 'function') initParallax();

    // Load projects and then update content
    const projectLoader = new ProjectLoader();
    try {
        const projects = await projectLoader.loadAllProjects();
        // For now, let's just log them. We'll integrate this into the UI next.
        console.log('Loaded projects:', projects);
        
        // Pass the loaded projects to the UI update function
        if (typeof updateProjectContent === 'function') {
            // We need a way to select the initial project.
            // For now, let's just pick the first one.
            if (projects.length > 0) {
                updateProjectContent(projects[0]); // Update with the first project
            }
        }
        
    } catch (error) {
        console.error('Failed to load projects:', error);
    }


    // Initialize features based on support
    console.log('Checking parallax support and motion...');
    console.log('supportsParallax():', supportsParallax());
    console.log('window.motionEnabled:', window.motionEnabled);
    
    if (supportsParallax() && window.motionEnabled !== false) {
        console.log('Creating particles from main init...');
        if (typeof createParticles === 'function') createParticles();
        if (typeof setupScrollAnimations === 'function') setupScrollAnimations();
    } else {
        console.log('Parallax not supported or disabled - using fallback');
        document.body.classList.add('no-parallax');
    }
    
    if (typeof updateProjectContent === 'function') updateProjectContent();
    setupImageErrorHandling();
    
    // Ensure particles are created after a short delay
    setTimeout(() => {
        const particlesContainer = document.getElementById('heroParticles');
        console.log('Checking particles container after delay...');
        console.log('Container found:', !!particlesContainer);
        if (particlesContainer) {
            console.log('Container children count:', particlesContainer.children.length);
        }
        
        if (particlesContainer && particlesContainer.children.length === 0) {
            console.log('Recreating particles from timeout...');
            if (typeof createParticles === 'function') createParticles();
        }
    }, 500);
    
    // Hide loading overlay
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }, 1000);
}

// Image error handling
function setupImageErrorHandling() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => {
            img.style.display = 'none';
            img.parentElement.classList.add('image-error');
        });
    });
}

// Switch project type
function switchProjectType(type) {
    currentProject = type;
    updateProjectContent();
    
    // Update switcher buttons
    document.querySelectorAll('.switcher-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchProjectType('${type}')"]`).classList.add('active');
}

// Update project content
async function updateProjectContent() {
    console.log('🔧 updateProjectContent() called from main.js');

    try {
        const response = await fetch('_data/projects.json');
        const projects = await response.json();
        const project = projects.find(p => p.type.toLowerCase().includes(currentProject));

        if (!project) {
            console.warn('No project data found for the current project type.');
            return;
        }
        
        // Update hero section
        const projectTypeBadge = document.getElementById('projectTypeBadge');
        const projectTitle = document.getElementById('projectTitle');
        const projectSubtitle = document.getElementById('projectSubtitle');
        const projectDescription = document.getElementById('projectDescription');
        
        if (projectTypeBadge) projectTypeBadge.textContent = project.type;
        if (projectTitle) projectTitle.textContent = project.title;
        if (projectSubtitle) projectSubtitle.textContent = project.subtitle;
        if (projectDescription) projectDescription.textContent = project.description;
        
        // Update tags
        const tagsContainer = document.getElementById('projectTags');
        if (tagsContainer) {
            tagsContainer.innerHTML = '';
            const tags = [...(project.genre || []), ...(project.style || []), ...(project.tech || [])];
            tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        }
        
        // Update gallery
        if (typeof updateGallery === 'function') {
            const galleryWithFullPaths = project.gallery.map(item => ({
                ...item,
                src: `images/projects/${project.slug}/${item.url}`
            }));
            updateGallery(galleryWithFullPaths);
        }
        
        // Update journey
        if (typeof updateJourney === 'function') updateJourney(project.journey);
        
        // Update specs
        if (typeof updateSpecs === 'function') updateSpecs(project.specs);
        
        // Update links
        if (typeof updateLinks === 'function') updateLinks(project.links);

    } catch (error) {
        console.error('Failed to load project data:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    let allProjects = [];
    let fuse;
    const projectLoader = new ProjectLoader();

    // --- DOM Elements ---
    const projectGrid = document.getElementById('projectGrid');
    const mainSearchInput = document.getElementById('mainSearchInput');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const filterIcon = document.getElementById('filter-icon');
    const filterPanel = document.getElementById('filter-panel');
    const closeFilterPanelBtn = document.getElementById('close-filter-panel');
    const filterGroupContainer = document.querySelector('.filter-group-container');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const activeFiltersDisplay = document.getElementById('active-filters-display');
    const loadingSpinner = document.getElementById('loading-spinner');
    const topNav = document.getElementById('top-nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
    const mediumButtons = document.querySelectorAll('.medium-btn');
    const mobileMediumButtons = document.querySelectorAll('.mobile-menu .medium-btn');

    // --- State ---
    let activeFilters = {
        medium: ['art', 'code', 'writing'], // All mediums active by default
        genre: [],
        tech: [],
        style: []
    };
    
    let activeMediums = new Set(['art', 'code', 'writing']); // Track active medium buttons

    // --- Notification System ---
    function showNotification(message, type = 'error', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            error: 'fa-exclamation-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle'
        };
        const iconClass = icons[type] || 'fa-info-circle';

        notification.innerHTML = `
            <i class="fas ${iconClass} notification-icon"></i>
            <div>${message}</div>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            notification.addEventListener('animationend', () => {
                notification.remove();
            });
        }, duration);
    }

    // --- Initialization ---
    async function initializePage() {
        showLoadingSpinner(true);
        try {
            allProjects = await projectLoader.loadAllProjects();
            if (!allProjects || allProjects.length === 0) {
                throw new Error("No projects were loaded.");
            }
            
            initializeSearch(allProjects);
            populateFilterPanel(allProjects);
            setupMediumFilters();
            setupMobileMenu();
            renderProjects(allProjects);
            setupModals();
            setupFooter();
            setupScrollListener();

        } catch (error) {
            console.error("Failed to initialize page:", error);
            showNotification("Error loading projects. Please check the console and try again later.", 'error');
            projectGrid.innerHTML = `<p class="error-message">Could not load project data.</p>`;
        } finally {
            showLoadingSpinner(false);
        }
    }
    
    // --- Loading Spinner ---
    function showLoadingSpinner(show) {
        if (show) {
            loadingSpinner.classList.remove('hidden');
            projectGrid.style.display = 'none';
        } else {
            loadingSpinner.classList.add('hidden');
            projectGrid.style.display = 'grid';
        }
    }

    // --- Search (Fuse.js) ---
    function initializeSearch(projectsData) {
        const options = {
            includeScore: true,
            threshold: 0.4,
            keys: [
                { name: 'title', weight: 0.7 },
                { name: 'description', weight: 0.5 },
                { name: 'pitch', weight: 0.5 },
                { name: 'tech', weight: 0.4 },
                { name: 'genre', weight: 0.4 },
                { name: 'role', weight: 0.3 }
            ]
        };
        fuse = new Fuse(projectsData, options);
        
        // Search input event listeners
        mainSearchInput.addEventListener('input', debounce(() => {
            applyFiltersAndSearch();
        }, 300));
        
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', debounce(() => {
                applyFiltersAndSearch();
            }, 300));
        }
    }
    
    // --- Medium Filter Setup ---
    function setupMediumFilters() {
        // Desktop medium buttons
        mediumButtons.forEach(button => {
            button.addEventListener('click', () => {
                const medium = button.dataset.medium;
                toggleMediumFilter(medium, button);
            });
        });
        
        // Mobile medium buttons
        mobileMediumButtons.forEach(button => {
            button.addEventListener('click', () => {
                const medium = button.dataset.medium;
                toggleMediumFilter(medium, button);
            });
        });
    }
    
    function toggleMediumFilter(medium, clickedButton) {
        if (activeMediums.has(medium)) {
            activeMediums.delete(medium);
            clickedButton.classList.remove('active');
        } else {
            activeMediums.add(medium);
            clickedButton.classList.add('active');
        }
        
        // Update the corresponding button in the other view
        const otherButton = clickedButton.closest('.mobile-menu') 
            ? document.querySelector(`.medium-filters .medium-btn[data-medium="${medium}"]`)
            : document.querySelector(`.mobile-menu .medium-btn[data-medium="${medium}"]`);
        
        if (otherButton) {
            if (activeMediums.has(medium)) {
                otherButton.classList.add('active');
            } else {
                otherButton.classList.remove('active');
            }
        }
        
        // Update active filters
        activeFilters.medium = Array.from(activeMediums);
        
        // Apply filters
        applyFiltersAndSearch();
    }
    
    // --- Mobile Menu Setup ---
    function setupMobileMenu() {
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('is-open');
            });
        }
        
        if (mobileFilterBtn) {
            mobileFilterBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                filterPanel.classList.toggle('is-open');
                
                // Update mobile button state
                const icon = mobileFilterBtn.querySelector('i');
                if (filterPanel.classList.contains('is-open')) {
                    mobileFilterBtn.setAttribute('aria-label', 'Close filters');
                    icon.classList.remove('fa-sliders-h');
                    icon.classList.add('fa-times');
                } else {
                    mobileFilterBtn.setAttribute('aria-label', 'Open filters');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-sliders-h');
                }
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('is-open') && 
                !mobileMenu.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('is-open');
            }
        });
        
        // Close filter panel when clicking outside
        document.addEventListener('click', (e) => {
            if (filterPanel.classList.contains('is-open') && 
                !filterPanel.contains(e.target) && 
                !filterIcon.contains(e.target) &&
                !mobileFilterBtn.contains(e.target)) {
                closeFilterPanel();
            }
        });

        // Close filter panel on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && filterPanel.classList.contains('is-open')) {
                closeFilterPanel();
            }
        });
    }
    
    // --- Filter Panel Functions ---
    function closeFilterPanel() {
        filterPanel.classList.remove('is-open');
        
        // Reset desktop button state
        if (filterIcon) {
            const icon = filterIcon.querySelector('i');
            filterIcon.setAttribute('aria-label', 'Open filters');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-sliders-h');
        }
        
        // Reset mobile button state
        if (mobileFilterBtn) {
            const mobileIcon = mobileFilterBtn.querySelector('i');
            mobileFilterBtn.setAttribute('aria-label', 'Open filters');
            mobileIcon.classList.remove('fa-times');
            mobileIcon.classList.add('fa-sliders-h');
        }
    }

    // --- Project Card Rendering ---
    
    // Function to truncate description to specified number of lines
    function truncateDescription(description, maxLines = 4) {
        if (!description) return '';
        
        // Remove HTML tags for line counting but preserve basic formatting
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = description;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        // Split into lines and limit to maxLines
        const lines = plainText.split('\n').filter(line => line.trim());
        if (lines.length <= maxLines) {
            // If within limit, return the original HTML but clean up spacing
            return description.replace(/\s*<br\s*\/?>\s*/gi, ' ').replace(/\s+/g, ' ').trim();
        }
        
        // Take first maxLines and add ellipsis
        const truncatedLines = lines.slice(0, maxLines);
        const truncatedText = truncatedLines.join(' ') + '...';
        
        return truncatedText;
    }
    
    function renderProjects(projectsToRender) {
        projectGrid.innerHTML = '';
        if (projectsToRender.length === 0) {
            projectGrid.innerHTML = `<p class="info-message">No projects match your current criteria.</p>`;
            return;
        }

        projectsToRender.forEach(project => {
            if (!project || !project.id || !project.slug) {
                console.warn('Skipping invalid project data:', project);
                return;
            }
            const card = document.createElement('div');
            card.className = 'project-card';
            card.dataset.id = project.id;

            // CRITICAL: Use the slug from project-loader.js for the path
            const heroImageUrl = `images/projects/${project.slug}/${project.imageUrl}`;

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
                    <img src="${heroImageUrl}" alt="${project.title}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x400/e0e5ec/31456A?text=Image+Not+Found';">
                    <span class="card-medium-badge medium-${project.medium?.toLowerCase()}">${project.medium}</span>
                </div>
                <div class="project-card-content">
                    <div class="card-header">
                        <h3>${project.title}</h3>
                        <div class="card-year">${project.year || ''}</div>
                    </div>
                    <p class="card-description">${truncateDescription(project.description)}</p>
                    <div class="card-info-section">
                        ${createTagsHTML(project.role, 'Role', 'tag-role')}
                        ${createTagsHTML(project.genre, 'Genre', 'tag-genre')}
                        ${createTagsHTML(project.tech, 'Technology', 'tag-tech')}
                    </div>
                </div>`;

            card.addEventListener('click', () => {
                const fullProject = allProjects.find(p => p.id === project.id);
                if (fullProject) {
                    // Use slug (JSON filename) for URL parameter instead of numeric ID
                    const projectSlug = fullProject.slug || fullProject.id;
                    window.location.href = `ParallaxThemes.html?project=${projectSlug}`;
                } else {
                    console.error(`Could not find full project data for ID: ${project.id}`);
                    showNotification('Could not load project details. Data is missing.', 'error');
                }
            });
            projectGrid.appendChild(card);
        });
    }

    // --- Filtering Logic ---
    function populateFilterPanel(projects) {
        const filters = {
            genre: { label: 'Genre', values: new Set() },
            tech: { label: 'Technology', values: new Set() },
            style: { label: 'Style', values: new Set() }
        };

        projects.forEach(p => {
            ['genre', 'tech', 'style'].forEach(key => {
                if (p[key] && Array.isArray(p[key])) {
                    p[key].forEach(val => filters[key].values.add(val));
                }
            });
        });

        filterGroupContainer.innerHTML = Object.keys(filters).map(key => {
            const filter = filters[key];
            if (filter.values.size === 0) return '';
            
            const options = [...filter.values].sort().map(value => `
                <div class="filter-option">
                    <input type="checkbox" id="filter-${key}-${value}" name="${key}" value="${value}">
                    <label for="filter-${key}-${value}">${value}</label>
                </div>
            `).join('');

            return `
                <div class="filter-group">
                    <button class="filter-group-header">
                        <span>${filter.label}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="filter-group-body">${options}</div>
                </div>
            `;
        }).join('');
    }

    function applyFiltersAndSearch() {
        let projectsToFilter = allProjects;

        // 1. Apply search query first
        const searchQuery = mainSearchInput.value.trim() || (mobileSearchInput ? mobileSearchInput.value.trim() : '');
        if (searchQuery && fuse) {
            const searchResults = fuse.search(searchQuery);
            projectsToFilter = searchResults.map(result => result.item);
        }

        // 2. Apply medium filter (from buttons)
        if (activeFilters.medium.length > 0) {
            projectsToFilter = projectsToFilter.filter(p => {
                return p.medium && activeFilters.medium.includes(p.medium);
            });
        }

        // 3. Apply other checkbox filters
        const hasOtherActiveFilters = ['genre', 'tech', 'style'].some(key => activeFilters[key].length > 0);
        if (hasOtherActiveFilters) {
            projectsToFilter = projectsToFilter.filter(p => {
                return ['genre', 'tech', 'style'].every(key => {
                    const values = activeFilters[key];
                    if (values.length === 0) return true;
                    if (!p[key]) return false;

                    if (Array.isArray(p[key])) {
                        return values.some(v => p[key].includes(v));
                    }
                    return values.includes(p[key]);
                });
            });
        }
        
        renderProjects(projectsToFilter);
        updateActiveFiltersDisplay();
        filterPanel.classList.remove('is-open');
    }

    function updateActiveFiltersFromCheckboxes() {
        // Preserve medium filters from buttons
        const currentMediumFilters = activeFilters.medium;
        activeFilters = { medium: currentMediumFilters, genre: [], tech: [], style: [] };
        const checked = filterGroupContainer.querySelectorAll('input:checked');
        checked.forEach(box => {
            activeFilters[box.name].push(box.value);
        });
    }

    function updateActiveFiltersDisplay() {
        activeFiltersDisplay.innerHTML = '';
        const allActive = Object.values(activeFilters).flat();
        
        if (allActive.length > 0) {
            allActive.forEach(value => {
                const pill = document.createElement('div');
                pill.className = 'filter-pill';
                pill.textContent = value;
                pill.dataset.value = value;
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '&times;';
                pill.appendChild(closeBtn);
                activeFiltersDisplay.appendChild(pill);
            });
            activeFiltersDisplay.classList.remove('hidden');
        } else {
            activeFiltersDisplay.classList.add('hidden');
        }
    }
    
    function clearAllFilters() {
        // Clear checkbox filters
        filterGroupContainer.querySelectorAll('input:checked').forEach(box => box.checked = false);
        
        // Reset medium filters to all active
        activeMediums = new Set(['art', 'code', 'writing']);
        activeFilters.medium = Array.from(activeMediums);
        
        // Update button states
        document.querySelectorAll('.medium-btn').forEach(btn => {
            btn.classList.add('active');
        });
        
        updateActiveFiltersFromCheckboxes();
        applyFiltersAndSearch();
    }

    filterGroupContainer.addEventListener('click', e => {
        if (e.target.classList.contains('filter-group-header')) {
            e.target.parentElement.classList.toggle('is-open');
        }
    });

    activeFiltersDisplay.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            const valueToRemove = e.target.parentElement.dataset.value;
            const checkbox = filterGroupContainer.querySelector(`input[value="${valueToRemove}"]`);
            if (checkbox) checkbox.checked = false;
            updateActiveFiltersFromCheckboxes();
            applyFiltersAndSearch();
        }
    });

    // --- Filter Panel Event Handlers ---
    if (filterIcon) {
        filterIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            filterPanel.classList.toggle('is-open');
            
            // Update button state
            const icon = filterIcon.querySelector('i');
            if (filterPanel.classList.contains('is-open')) {
                filterIcon.setAttribute('aria-label', 'Close filters');
                icon.classList.remove('fa-sliders-h');
                icon.classList.add('fa-times');
            } else {
                filterIcon.setAttribute('aria-label', 'Open filters');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-sliders-h');
            }
        });
    }

    if (closeFilterPanelBtn) {
        closeFilterPanelBtn.addEventListener('click', () => {
            closeFilterPanel();
        });
    }

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            updateActiveFiltersFromCheckboxes();
            applyFiltersAndSearch();
        });
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            clearAllFilters();
        });
    }

    // --- Modals ---
    function setupModals() {
        document.querySelectorAll('[data-modal-target]').forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.dataset.modalTarget;
                const tabId = button.dataset.tabTarget;
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    modal.classList.add('is-visible');
                    // Handle tab switching if specified
                    if (tabId) {
                        modal.querySelectorAll('.tab-button, .tab-content').forEach(el => el.classList.remove('active'));
                        modal.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
                        modal.querySelector(`.tab-content#${tabId}`).classList.add('active');
                    }
                }
            });
        });

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', e => {
                if (e.target === overlay) overlay.classList.remove('is-visible');
            });
        });

        document.querySelectorAll('.modal-close-btn').forEach(button => {
            button.addEventListener('click', () => {
                button.closest('.modal-overlay').classList.remove('is-visible');
            });
        });
        
        document.querySelectorAll('.modal-tabs').forEach(tabsContainer => {
            tabsContainer.addEventListener('click', e => {
                if (e.target.matches('.tab-button')) {
                    const tabId = e.target.dataset.tab;
                    const modalContent = tabsContainer.closest('.modal-content');
                    
                    modalContent.querySelectorAll('.tab-button, .tab-content').forEach(el => el.classList.remove('active'));
                    e.target.classList.add('active');
                    modalContent.querySelector(`#${tabId}`).classList.add('active');
                }
            });
        });

        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message!');
            e.target.closest('.modal-overlay').classList.remove('is-visible');
            e.target.reset();
        });
    }

    // --- Footer ---
    function setupFooter() {
        const copyrightEl = document.getElementById('copyright');
        copyrightEl.textContent = `© ${new Date().getFullYear()} R. Swan. All Rights Reserved.`;
    }

    // --- UI Enhancements ---
    function setupScrollListener() {
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                topNav.classList.add('scrolled');
            } else {
                topNav.classList.remove('scrolled');
            }
            lastScrollY = window.scrollY;
        });
    }
    
    // --- Global Error Handling ---
    window.addEventListener('error', (event) => {
        showNotification(`A script error occurred: ${event.message}`, 'error');
    });

    window.addEventListener('unhandledrejection', (event) => {
        showNotification(`An unexpected error occurred: ${event.reason}`, 'error');
    });

    // --- Go! ---
    initializePage();
}); 