// --- GLOBAL VARIABLES ---
let projects = [];
let currentProjectId = null;
let activeFilters = {
    medium: 'all',
    genre: [],
    style: [],
    mood: 'all',
    year: 2018,
    tech: []
};

// --- DOM ELEMENTS ---
const galleryView = document.getElementById('gallery-view');
const detailView = document.getElementById('detail-view');
const projectGrid = document.getElementById('project-grid');
const activeFiltersContainer = document.getElementById('active-filters');
const sidebar = document.getElementById('filter-sidebar');
const yearSlider = document.getElementById('year-slider');
const yearValueSpan = document.getElementById('year-value');
const naturalSearchInput = document.getElementById('natural-search-input');
const naturalSearchButton = document.getElementById('natural-search-button');
const searchLoading = document.getElementById('search-loading');
const guidedResultsContainer = document.getElementById('guided-results');
const backToGalleryBtn = document.getElementById('back-to-gallery');
const siteTitle = document.getElementById('site-title');
const siteSubtitle = document.getElementById('site-subtitle');

// Filter list containers
const filterLists = {
    medium: document.getElementById('medium-list'),
    genre: document.getElementById('genre-list'),
    style: document.getElementById('style-list'),
    tech: document.getElementById('tech-list'),
    mood: document.getElementById('mood-list')
};

// Modal elements
const aboutModal = document.getElementById('about-modal');
const contactModal = document.getElementById('contact-modal');
const galleryModal = document.getElementById('gallery-modal');
const openAboutBtn = document.getElementById('open-about');
const openContactBtn = document.getElementById('open-contact');
const closeButtons = document.querySelectorAll('.modal-close-btn');
const galleryModalTitle = document.getElementById('gallery-modal-title');
const galleryModalGrid = document.getElementById('gallery-modal-grid');
const galleryPrevBtn = document.getElementById('gallery-prev');
const galleryNextBtn = document.getElementById('gallery-next');
const galleryInfo = document.getElementById('gallery-info');

// Gallery state
let currentGallery = null;
let currentGalleryIndex = 0;
const itemsPerPage = 12;

// --- DATA LOADING ---
async function loadProjects() {
    try {
        // First try to load from manifest
        const manifestLoaded = await loadFromManifest();
        
        if (manifestLoaded) {
            console.log(`Loaded ${projects.length} projects from manifest`);
        } else {
            // Fallback to legacy loading for existing projects
            console.warn('Manifest not found, falling back to legacy project discovery');
            await loadLegacyProjects();
        }
        
        // If still no projects loaded, use fallback data
        if (projects.length === 0) {
            console.warn('No project files found, using fallback data');
            projects = getFallbackProjects();
        }
        
        console.log(`Final loaded projects (${projects.length}):`, projects.map(p => p.title));
        
        // Initialize filters after data is loaded
        initializeFilters();
        applyFilters();
    } catch (error) {
        console.error('Error loading projects:', error);
        projects = getFallbackProjects();
        initializeFilters();
        applyFilters();
    }
}

// Load projects using manifest file
async function loadFromManifest() {
    try {
        const manifestResponse = await fetch('_data/projects/manifest.json');
        if (!manifestResponse.ok) {
            return false;
        }
        
        const manifest = await manifestResponse.json();
        const projectPromises = manifest.projects.map(async (projectInfo) => {
            const filePath = `_data/projects/${projectInfo.file}`;
            return loadSingleProject(filePath, projectInfo.id);
        });
        
        const projectData = await Promise.allSettled(projectPromises);
        projects = projectData
            .filter(result => result.status === 'fulfilled' && result.value !== null)
            .map(result => result.value);
            
        return projects.length > 0;
    } catch (error) {
        console.warn('Failed to load from manifest:', error);
        return false;
    }
}

// Legacy project loading for backward compatibility
async function loadLegacyProjects() {
    const legacyFiles = [
        '_data/sample-project.json',
        '_data/papi-chispa-cartas-del-deseo.json',
        '_data/mystic-grove-painting.json',
        '_data/nova-writers-conspiracy.json'
    ];
    
    const projectPromises = legacyFiles.map(file => loadSingleProject(file));
    const projectData = await Promise.allSettled(projectPromises);
    
    projects = projectData
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value);
}

// Load a single project file with error handling
async function loadSingleProject(filePath, projectId = null) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Project file not found: ${filePath}`);
                return null;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const project = await response.json();
        
        // Validate basic project structure
        if (!project.title || !project.description) {
            console.warn(`Invalid project structure in ${filePath}`);
            return null;
        }
        
        return project;
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.warn(`Network error loading ${filePath}:`, error.message);
        } else {
            console.error(`Error loading ${filePath}:`, error);
        }
        return null;
    }
}

// Fallback project data if no files are found
function getFallbackProjects() {
    return [
        {
            id: 1,
            title: "Portfolio (Interactive Web Portfolio)",
            description: "A dynamic and multi-faceted web portfolio designed to comprehensively showcase diverse creative and technical work across Code, Writing, and Art. It features a data-driven organizational structure that allows visitors to sort, filter, and view projects based on their specific interests (e.g., medium, genre, style/theme), catering to various professional perspectives (technical, editorial, creative). The design emphasizes user experience, visual adaptability, and efficient information delivery.",
            imageUrl: "https://via.placeholder.com/600x400/e0e5ec/31456A?text=Interactive+Portfolio",
            medium: "code",
            genre: ["Web Development", "Personal Branding", "UX/UI Design", "Information Architecture", "Data Visualization", "Portfolio Management"],
            style: ["Soft UI/Neumorphic", "Modern", "Professional", "Adaptable UI/UX", "Theme Switching", "Intuitive Navigation"],
            tech: ["HTML", "CSS", "JavaScript", "JSON", "Markdown", "Prism.js", "Marked.js"],
            mood: "Innovative",
            year: 2025,
            role: "Lead Designer, Frontend Developer, Backend Data Architect, Information Architect, UX/UI Developer, Personal Brand Strategist",
            variant: "featured",
            status: "live",
            links: {
                live: "C:/Users/raycs/Documents/Projects/rswan-portfolio",
                github: "https://github.com/rayswan/rswan-portfolio",
                demo: "C:/Users/raycs/Documents/Projects/rswan-portfolio"
            },
            pitch: "A sophisticated, data-driven interactive web portfolio that transcends traditional showcases, allowing visitors to dynamically filter and explore a diverse body of work across code, writing, and art, precisely tailored to their professional interests.",
            challenge: "The primary challenge involved architecting a flexible and scalable system capable of dynamically presenting a large and diverse body of work from multiple creative disciplines (code, writing, art) in a highly customizable way. This required extensive redesigns to recognize and implement a robust data structure (JSON with rich metadata) as the core element, enabling granular filtering by medium, genre, and even mood/style, while ensuring efficient performance and an intuitive user experience.",
            development: "The development process in 2025 was highly iterative, undergoing three major redesigns as the fundamental understanding shifted towards making the underlying data structure the most critical element. This involved extensive work on creating comprehensive JSON metadata for each project, designing the filtering logic, and implementing the front-end presentation layer to respond dynamically to user selections and metadata tags, including the unique mood-based theme switching.",
            outcome: "The outcome is a highly organized, professional, and interactive portfolio that not only presents diverse projects but also actively demonstrates advanced information architecture, dynamic UI/UX principles, and a deep understanding of content categorization. It effectively serves as a powerful tool for self-branding, enabling potential employers or clients to quickly access the most relevant work and understand the breadth and depth of your interdisciplinary skills.",
            gallery: [
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Main+Interface",
                    title: "Main Interface",
                    description: "The primary portfolio interface with neumorphic design elements and advanced filtering",
                    dimensions: "1200x800"
                },
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Filter+System", 
                    title: "Advanced Filter System",
                    description: "Multi-level filtering by medium, genre, style, technology, and mood",
                    dimensions: "1200x800"
                },
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Natural+Search",
                    title: "Natural Language Search",
                    description: "AI-powered search with guided results and intelligent filtering",
                    dimensions: "1200x800"
                },
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Project+Details",
                    title: "Project Detail Views",
                    description: "Comprehensive project case studies with markdown document support",
                    dimensions: "1200x800"
                },
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Theme+Switcher",
                    title: "Mood-Based Theme Switching",
                    description: "Dynamic UI adaptation based on project moods and themes",
                    dimensions: "1200x800"
                },
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Data+Architecture",
                    title: "Data Architecture",
                    description: "JSON metadata structure enabling granular project categorization",
                    dimensions: "1200x800"
                }
            ]
        },
        {
            id: 2,
            title: "Papi Chispa (Cartas del Deseo — Powered by Papi Chispa 💋)",
            description: "An interactive, real-time web-based tarot divination experience powered by AI. Featuring 'Papi Chispa,' a tarot reading heart throb with charm, wit, and telenovela flair, the application offers OpenAI-powered bilingual (Spanglish) fortune-telling with dramatic, one-card-at-a-time reveal and live chat interaction.",
            imageUrl: "https://via.placeholder.com/600x400/e0e5ec/31456A?text=Papi+Chispa+Tarot",
            medium: "code",
            genre: ["AI", "Web Application", "Tarot", "Divination", "Interactive Narrative", "Chatbot", "Bilingual Experience", "Digital Art Integration", "Creative AI", "Social Media Marketing"],
            style: ["Latinx Spiritual", "Telenovela Flair", "Velvet Lounge", "Dramatic Card Flips", "Sultry Spanglish", "Ceremonial Gold", "Cyberpunk Pulse", "Noir Mist", "Desert Mirage"],
            tech: ["React", "Vite", "Tailwind CSS", "FastAPI", "Python", "OpenAI API", "TypeScript", "pnpm", "Render.com"],
            mood: "Mystical",
            year: 2025,
            role: "Lead Developer (Full-Stack), AI Integrator, UI/UX Designer, Concept Creator, Content Writer, Marketing Strategist",
            variant: "featured",
            status: "live",
            links: {
                live: "C:/Users/raycs/Documents/Projects/ViteaTSRE",
                github: "https://github.com/rubyrayjuntos/VITEATSRE",
                demo: "C:/Users/raycs/Documents/Projects/ViteaTSRE"
            },
            pitch: "Cartas del Deseo is an interactive AI-powered tarot divination web experience, embodying the charismatic 'Papi Chispa.' It offers real-time, bilingual (Spanglish) fortune-telling through engaging card reveals and personalized chat, blending mystical insights with dramatic telenovela charm.",
            challenge: "As my first full-stack programming project, the primary challenge was navigating the entire software development lifecycle, from choosing and integrating a technology stack (React, FastAPI, OpenAI API) to deploying a live application. This involved learning core concepts of front-end development, backend API design, and AI integration from scratch, leading to multiple complete re-dos of the tech stack due to initial missteps and the invaluable lesson of needing comprehensive functional and technical specifications before starting development.",
            development: "The development began this year (2025) as my inaugural full-stack project, following approximately three months of dedicated programming effort. The process involved significant learning and iterative development, including multiple 're-dos' of the technology stack as I gained experience in full-stack programming. Key stages included setting up the React frontend with Vite and Tailwind, building the FastAPI backend for AI integration, and configuring deployment to Render.com.",
            outcome: "The project successfully launched a fully functional and engaging interactive tarot reading experience. It served as a pivotal learning ground, providing hands-on experience in full-stack web development, AI API integration, and the critical importance of pre-planning with detailed technical specifications. The outcome is a live, unique application that showcases not only technical proficiency but also a strong creative vision, the ability to bring complex, emotionally resonant concepts to life through technology, and a comprehensive understanding of social media marketing and launch strategies.",
            gallery: [
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Initial+Spread+View",
                    title: "Initial Spread View",
                    description: "The central figure and initial tarot spread interface",
                    dimensions: "1200x800"
                },
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Character+Concepts",
                    title: "Character Concepts Collage",
                    description: "Papi Chispa character development and visual concepts",
                    dimensions: "1200x800"
                },
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Fiery+Heart+Archetype",
                    title: "The Fiery Heart Archetype",
                    description: "Selected archetype drawing from art historical references",
                    dimensions: "800x600"
                },
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Papi+with+Cards",
                    title: "Papi with Cards",
                    description: "Character interaction with tarot deck elements",
                    dimensions: "1000x750"
                },
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Empress+Card+Detail",
                    title: "Empress Card Detail",
                    description: "Detailed view of the Empress tarot card artwork",
                    dimensions: "600x900"
                },
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Lips+Icon",
                    title: "Lips Icon/Card Back",
                    description: "Signature lips icon and card back design",
                    dimensions: "400x400"
                },
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Tower+Reading",
                    title: "In-Progress Reading (Tower)",
                    description: "Live reading session featuring the Tower card",
                    dimensions: "1200x800"
                },
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Sun+Reading",
                    title: "In-Progress Reading (Sun)",
                    description: "Live reading session featuring the Sun card",
                    dimensions: "1200x800"
                },
                {
                    url: "https://via.placeholder.com/400x300/e0e5ec/31456A?text=Horizontal+Grid",
                    title: "Horizontal Image Grid",
                    description: "Layout showcasing multiple project elements",
                    dimensions: "1600x600"
                }
            ]
        },
        {
            id: 3,
            title: "Creative Writing Portfolio",
            description: "A collection of experimental prose and poetry exploring themes of technology and human connection.",
            imageUrl: "https://via.placeholder.com/600x400/e0e5ec/31456A?text=Writing+Project",
            medium: "writing",
            genre: ["Creative Writing", "Poetry", "Experimental"],
            style: ["Modern", "Experimental", "Traditional"],
            tech: [],
            mood: "Serene",
            year: 2023,
            role: "Writer & Poet",
            variant: "regular",
            status: "live",
            links: {
                live: "https://writing.example.com",
                portfolio: "https://portfolio.writing.example.com"
            },
            pitch: "A collection of contemporary writing that bridges the gap between human emotion and technological advancement.",
            challenge: "Finding the right balance between traditional literary forms and modern digital presentation.",
            development: "Curated and edited a selection of works, then designed an elegant digital presentation system.",
            outcome: "A cohesive body of work that demonstrates the evolution of storytelling in the digital age.",
            gallery: []
        }
    ];
}

// --- FILTER MANAGEMENT ---
function initializeFilters() {
    // Set initial year value
    activeFilters.year = parseInt(yearSlider.value, 10);
    yearValueSpan.textContent = yearSlider.value;
    
    // Initialize facets with all projects
    renderFacets(projects);
}

function resetAllFilters() {
    activeFilters = {
        medium: 'all',
        genre: [],
        style: [],
        mood: 'all',
        year: parseInt(yearSlider.min, 10),
        tech: []
    };
    
    // Reset UI controls
    updateFilterUI();
}

function updateFilterUI() {
    // Update Medium radio buttons
    document.querySelectorAll('input[name="medium"]').forEach(input => {
        input.checked = activeFilters.medium === input.value;
    });

    // Update Mood radio buttons
    document.querySelectorAll('input[name="mood"]').forEach(input => {
        input.checked = activeFilters.mood === input.value;
    });

    // Update array-based filters (genre, style, tech)
    ['genre', 'style', 'tech'].forEach(type => {
        document.querySelectorAll(`input[name="${type}"]`).forEach(input => {
            input.checked = activeFilters[type].includes(input.value);
        });
    });

    // Update Year slider
    yearSlider.value = activeFilters.year;
    yearValueSpan.textContent = activeFilters.year;
}

// --- RENDER FUNCTIONS ---
function renderProjects(projectsToRender) {
    projectGrid.innerHTML = '';
    
    if (projectsToRender.length === 0) {
        projectGrid.innerHTML = '<p style="text-align: center; color: var(--text-color);">No projects match the selected filters.</p>';
        return;
    }
    
    projectsToRender.forEach(project => {
        const card = createProjectCard(project);
        projectGrid.appendChild(card);
    });
    // After rendering, check for overflow and add 'truncated' class
    document.querySelectorAll('.card-description').forEach(desc => {
        // Remove class first in case of rerender
        desc.classList.remove('truncated');
        // Check if text is actually truncated
        if (desc.scrollHeight > desc.clientHeight + 2) {
            desc.classList.add('truncated');
        }
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = `project-card ${project.variant || ''}`;
    card.dataset.id = project.id;
    
    const techStack = project.tech ? project.tech.slice(0, 3).map(tech => 
        `<span class="card-tech-tag">${tech}</span>`
    ).join('') : '';
    
    const roleDisplay = project.role ? `<div class="card-role">${project.role}</div>` : '';
    const yearDisplay = project.year ? `<div class="card-year">${project.year}</div>` : '';
    const galleryButton = project.gallery ? 
        `<button class="gallery-btn" data-project-id="${project.id}">View Gallery (${project.gallery.length})</button>` : '';
    const statusBadge = project.status ? `<div class="project-status status-${project.status}">${project.status}</div>` : '';
    
    card.innerHTML = `
        <img src="${project.imageUrl}" alt="${project.title}">
        <div class="project-card-content">
            <div class="card-header">
                <h3>${project.title}</h3>
                ${yearDisplay}
            </div>
            <p class="card-description">${project.description}</p>
            ${roleDisplay}
            <div class="card-tags">
                <span class="card-tag card-medium">${project.medium}</span>
                ${project.genre.map(g => `<span class="card-tag">${g.replace('-', ' ')}</span>`).join('')}
            </div>
            ${techStack ? `<div class="card-tech-stack">
                <span class="tech-label">Tech:</span>
                ${techStack}
                ${project.tech && project.tech.length > 3 ? `<span class="tech-more">+${project.tech.length - 3} more</span>` : ''}
            </div>` : ''}
            ${galleryButton ? `<div class="card-gallery-section">${galleryButton}</div>` : ''}
        </div>
        ${statusBadge}
    `;
    
    return card;
}

function renderDetailPage(project) {
    if (!project) return;
    
    currentProjectId = project.id;
    
    // Populate static elements
    const elements = {
        'detail-hero-img': project.imageUrl,
        'detail-title': project.title,
        'detail-pitch': project.pitch,
        'detail-role': project.role,
        'detail-year': project.year,
        'detail-challenge': project.challenge,
        'detail-development': project.development,
        'detail-outcome': project.outcome
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            if (id === 'detail-hero-img') element.src = value;
        }
    });

    // Populate Links
    const linksContainer = document.getElementById('detail-links');
    linksContainer.innerHTML = '';
    Object.entries(project.links || {}).forEach(([text, url]) => {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = text;
        link.className = 'btn-link';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        linksContainer.appendChild(link);
    });
    
    // Populate Tech Tags
    const techTagsContainer = document.getElementById('detail-tech-tags');
    techTagsContainer.innerHTML = '';
    (project.tech || []).forEach(tech => {
        const tag = document.createElement('div');
        tag.className = 'tech-tag';
        tag.textContent = tech;
        techTagsContainer.appendChild(tag);
    });
    
    // Load project-specific markdown content based on medium
    loadProjectMarkdownContent(project);
}

// --- MARKDOWN INTEGRATION ---

/**
 * Loads project-specific markdown content based on project medium
 * @param {Object} project - The project object
 */
async function loadProjectMarkdownContent(project) {
    if (!project || !project.id) return;
    
    try {
        // For code projects, load technical specifications and functional requirements
        if (project.medium === 'code') {
            // Load technical specifications
            await loadProjectMarkdown(project.id, 'technical-specs', 'tech-specs-content', {
                className: 'markdown-inline',
                showToc: true,
                maxHeight: '400px',
                collapsible: true
            });
            
            // Show tech specs container
            const techSpecsContainer = document.getElementById('tech-specs-container');
            if (techSpecsContainer) {
                techSpecsContainer.style.display = 'block';
            }
            
            // Load functional requirements
            await loadProjectMarkdown(project.id, 'functional-requirements', 'functional-reqs-content', {
                className: 'markdown-inline',
                showToc: true,
                maxHeight: '400px',
                collapsible: true
            });
            
            // Show functional requirements container
            const funcReqsContainer = document.getElementById('functional-reqs-container');
            if (funcReqsContainer) {
                funcReqsContainer.style.display = 'block';
            }
            
            // Hide supporting docs container for code projects
            const supportingDocsContainer = document.getElementById('supporting-docs-container');
            if (supportingDocsContainer) {
                supportingDocsContainer.style.display = 'none';
            }
        }
        
        // For writing projects, load supporting documents
        else if (project.medium === 'writing') {
            // Load supporting documents
            await loadProjectMarkdown(project.id, 'supporting-documents', 'supporting-docs-content', {
                className: 'markdown-inline',
                showToc: true,
                maxHeight: '400px',
                collapsible: true
            });
            
            // Show supporting docs container
            const supportingDocsContainer = document.getElementById('supporting-docs-container');
            if (supportingDocsContainer) {
                supportingDocsContainer.style.display = 'block';
            }
            
            // Hide tech specs and functional reqs containers for writing projects
            const techSpecsContainer = document.getElementById('tech-specs-container');
            const funcReqsContainer = document.getElementById('functional-reqs-container');
            if (techSpecsContainer) techSpecsContainer.style.display = 'none';
            if (funcReqsContainer) funcReqsContainer.style.display = 'none';
        }
        
        // For art projects, hide all document containers
        else {
            const containers = [
                'tech-specs-container',
                'functional-reqs-container', 
                'supporting-docs-container'
            ];
            
            containers.forEach(containerId => {
                const container = document.getElementById(containerId);
                if (container) {
                    container.style.display = 'none';
                }
            });
        }
        
    } catch (error) {
        console.error('Error loading project markdown content:', error);
    }
}

function renderActiveFilterPills() {
    activeFiltersContainer.innerHTML = '';
    
    Object.entries(activeFilters).forEach(([type, value]) => {
        if (type === 'medium' && value !== 'all') {
            createFilterPill(value, type, value);
        } else if (type === 'mood' && value !== 'all') {
            createFilterPill(`Mood: ${value}`, type, value);
        } else if (type === 'year' && value > parseInt(yearSlider.min, 10)) {
            createFilterPill(`After ${value}`, type, value);
        } else if (Array.isArray(value)) {
            value.forEach(item => {
                createFilterPill(item.replace('-', ' '), type, item);
            });
        }
    });
}

function createFilterPill(label, filterType, filterValue) {
    const pill = document.createElement('div');
    pill.className = 'filter-pill';
    pill.innerHTML = `
        <span>${label}</span>
        <button data-filter-type="${filterType}" data-filter-value="${filterValue}" 
                aria-label="Remove ${label} filter">×</button>
    `;
    activeFiltersContainer.appendChild(pill);
}

function renderFacets(availableProjects) {
    const facetPool = activeFilters.medium === 'all' ? projects : 
                     projects.filter(p => p.medium === activeFilters.medium);

    // Render Medium filter (radio buttons)
    const mediumCounts = projects.reduce((acc, p) => ({ ...acc, [p.medium]: (acc[p.medium] || 0) + 1 }), { all: projects.length });
    filterLists.medium.innerHTML = ['all', 'code', 'art', 'writing'].map(m => `
        <li>
            <label class="neumorphic-control">
                <input type="radio" name="medium" value="${m}" ${activeFilters.medium === m ? 'checked' : ''}>
                <span class="checkmark"></span>
                <span style="text-transform: capitalize;">${m}</span>
                <span class="facet-count">${mediumCounts[m] || 0}</span>
            </label>
        </li>
    `).join('');

    // Render array-based filters (genre, style, tech)
    ['genre', 'style', 'tech'].forEach(type => {
        const counts = availableProjects.reduce((acc, p) => { 
            (p[type] || []).forEach(v => { acc[v] = (acc[v] || 0) + 1; }); 
            return acc; 
        }, {});
        
        const allValues = [...new Set(facetPool.flatMap(p => p[type] || []))].sort();
        filterLists[type].innerHTML = allValues.map(v => {
            const count = counts[v] || 0;
            if (count === 0 && !activeFilters[type].includes(v)) return '';
            
            return `
                <li>
                    <label class="neumorphic-control">
                        <input type="checkbox" name="${type}" value="${v}" ${activeFilters[type].includes(v) ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        <span style="text-transform: capitalize;">${v.replace('-', ' ')}</span>
                        <span class="facet-count">${count}</span>
                    </label>
                </li>
            `;
        }).join('');
    });

    // Render Mood filter (radio buttons)
    const moodCounts = availableProjects.reduce((acc, p) => ({ ...acc, [p.mood]: (acc[p.mood] || 0) + 1 }), {});
    const allMoods = ['all', ...[...new Set(facetPool.map(p => p.mood))].sort()];
    filterLists.mood.innerHTML = allMoods.map(m => {
        const count = m === 'all' ? availableProjects.length : moodCounts[m] || 0;
        if (count === 0 && m !== 'all') return '';
        
        return `
            <li>
                <label class="neumorphic-control">
                    <input type="radio" name="mood" value="${m}" ${activeFilters.mood === m ? 'checked' : ''}>
                    <span class="checkmark"></span>
                    <span style="text-transform: capitalize;">${m}</span>
                    <span class="facet-count">${count}</span>
                </label>
            </li>
        `;
    }).join('');
}

function renderGuidedResults(suggestions) {
    guidedResultsContainer.innerHTML = '';
    
    if (!suggestions || suggestions.length === 0) {
        guidedResultsContainer.innerHTML = '<p style="font-size: 0.9rem; color: var(--text-color-light);">No suggestions found. Try a different query.</p>';
        return;
    }
    
    suggestions.forEach(suggestion => {
        const pill = document.createElement('div');
        pill.className = 'guided-search-pill';
        pill.textContent = suggestion.label;
        pill.dataset.filters = JSON.stringify(suggestion.filters);
        guidedResultsContainer.appendChild(pill);
    });
}

// --- FILTERING LOGIC ---
function applyFilters() {
    const filteredProjects = projects.filter(project => {
        // Year filter
        if (project.year < activeFilters.year) return false;
        
        // Medium filter
        if (activeFilters.medium !== 'all' && project.medium !== activeFilters.medium) return false;
        
        // Array-based filters (genre, style, tech)
        const arrayFilters = ['genre', 'style', 'tech'];
        for (const filterType of arrayFilters) {
            if (activeFilters[filterType].length > 0) {
                const hasMatch = activeFilters[filterType].some(value => 
                    project[filterType].includes(value)
                );
                if (!hasMatch) return false;
            }
        }
        
        // Mood filter
        if (activeFilters.mood !== 'all' && project.mood !== activeFilters.mood) return false;
        
        return true;
    });
    
    renderProjects(filteredProjects);
    renderActiveFilterPills();
    renderFacets(filteredProjects);
    updateFilterUI();
}

// --- VIEW ROUTING ---
function showGalleryView() {
    galleryView.style.display = 'block';
    detailView.style.display = 'none';
}

function showDetailView(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        renderDetailPage(project);
        galleryView.style.display = 'none';
        detailView.style.display = 'block';
        window.scrollTo(0, 0);
    }
}

// --- GEMINI API INTEGRATION ---
async function callGeminiAPI(userQuery) {
    searchLoading.style.display = 'block';
    naturalSearchButton.disabled = true;
    guidedResultsContainer.innerHTML = '';

    try {
        const allGenres = [...new Set(projects.flatMap(p => p.genre))].sort();
        const allStyles = [...new Set(projects.flatMap(p => p.style))].sort();
        const allMoods = [...new Set(projects.map(p => p.mood))].sort();
        const allTech = [...new Set(projects.flatMap(p => p.tech || []))].sort();
        const minYear = Math.min(...projects.map(p => p.year));
        const maxYear = Math.max(...projects.map(p => p.year));

        const prompt = `You are an AI assistant for a portfolio website. Based on the user's search query, suggest 2-3 relevant filter combinations from the available options. Each suggestion should include a 'label' (a short, descriptive phrase for the user) and a 'filters' object containing the suggested filter values.

Available filters and their possible values:
- medium: ['all', 'code', 'art', 'writing']
- genre: ${JSON.stringify(allGenres)}
- tech: ${JSON.stringify(allTech)}
- style: ${JSON.stringify(allStyles)}
- mood: ['all', ${allMoods.map(m => `'${m}'`).join(', ')}]
- year: min ${minYear}, max ${maxYear}

User query: "${userQuery}"

Provide the response as a JSON array. Each object in the array should have a 'label' (string) and a 'filters' (object). The 'filters' object should contain properties like 'medium' (string), 'genre' (array of strings), 'tech' (array of strings), 'style' (array of strings), 'mood' (string), and 'year' (number). If a filter is not relevant, omit it from the 'filters' object.`;

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];

        const payload = {
            contents: chatHistory,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            "label": { "type": "STRING" },
                            "filters": {
                                "type": "OBJECT",
                                properties: {
                                    "medium": { "type": "STRING" },
                                    "genre": { "type": "ARRAY", items: { "type": "STRING" } },
                                    "tech": { "type": "ARRAY", items: { "type": "STRING" } },
                                    "style": { "type": "ARRAY", items: { "type": "STRING" } },
                                    "mood": { "type": "STRING" },
                                    "year": { "type": "NUMBER" }
                                }
                            }
                        }
                    }
                }
            }
        };

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBxQqQqQqQqQqQqQqQqQqQqQqQqQqQqQ', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const suggestions = data.candidates[0].content.parts[0].text;
        return JSON.parse(suggestions);

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return [];
    } finally {
        searchLoading.style.display = 'none';
        naturalSearchButton.disabled = false;
    }
}

// --- EVENT HANDLERS ---
function handleFilterChange(e) {
    if (!e.target.name) return;
    
    const type = e.target.name;
    const value = e.target.value;

    if (type === 'medium' || type === 'mood') {
        activeFilters[type] = value;
        if (type === 'medium') {
            activeFilters.genre = [];
            activeFilters.style = [];
            activeFilters.tech = [];
            activeFilters.mood = 'all';
        }
    } else if (type === 'year') {
        activeFilters.year = parseInt(value, 10);
    } else {
        if (e.target.checked) {
            if (!activeFilters[type].includes(value)) {
                activeFilters[type].push(value);
            }
        } else {
            activeFilters[type] = activeFilters[type].filter(item => item !== value);
        }
    }
    
    applyFilters();
}

function handlePillRemove(e) {
    if (e.target.tagName !== 'BUTTON') return;
    
    const { filterType, filterValue } = e.target.dataset;

    if (filterType === 'medium' || filterType === 'mood') {
        activeFilters[filterType] = 'all';
    } else if (filterType === 'year') {
        activeFilters.year = parseInt(yearSlider.min, 10);
    } else {
        activeFilters[filterType] = activeFilters[filterType].filter(item => item !== filterValue);
    }
    
    applyFilters();
}

function handleProjectClick(e) {
    const card = e.target.closest('.project-card');
    if (card) {
        const projectId = parseInt(card.dataset.id, 10);
        showDetailView(projectId);
    }
    
    // Handle gallery button clicks
    if (e.target.classList.contains('gallery-btn')) {
        const projectId = parseInt(e.target.dataset.projectId, 10);
        openGalleryModal(projectId);
    }
}

async function handleNaturalSearch() {
    const query = naturalSearchInput.value.trim();
    if (!query) {
        guidedResultsContainer.innerHTML = '<p style="font-size: 0.9rem; color: var(--text-color-light);">Please enter a search query.</p>';
        return;
    }
    
    const suggestions = await callGeminiAPI(query);
    renderGuidedResults(suggestions);
}

function handleGuidedResultClick(e) {
    const pill = e.target.closest('.guided-search-pill');
    if (pill && pill.dataset.filters) {
        const filtersToApply = JSON.parse(pill.dataset.filters);
        
        resetAllFilters();

        Object.entries(filtersToApply).forEach(([key, value]) => {
            if (activeFilters.hasOwnProperty(key)) {
                activeFilters[key] = value;
            }
        });

        applyFilters();
        guidedResultsContainer.innerHTML = '';
        naturalSearchInput.value = '';
    }
}

// --- MODAL FUNCTIONALITY ---
function openModal(modal) {
    if (modal) modal.style.display = 'flex';
}

function closeModal(modal) {
    if (modal) modal.style.display = 'none';
}

// --- GALLERY FUNCTIONALITY ---
function openGalleryModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.gallery) return;
    
    currentGallery = project.gallery;
    currentGalleryIndex = 0;
    
    galleryModalTitle.textContent = `${project.title} - Gallery`;
    renderGalleryPage();
    openModal(galleryModal);
}

function renderGalleryPage() {
    if (!currentGallery) return;
    
    const startIndex = currentGalleryIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = currentGallery.slice(startIndex, endIndex);
    
    galleryModalGrid.innerHTML = pageItems.map(item => `
        <div class="gallery-item">
            <img src="${item.url}" alt="${item.title}">
            ${item.dimensions ? `<div class="gallery-item-dimensions">${item.dimensions}</div>` : ''}
            <div class="gallery-item-overlay">
                <h4 class="gallery-item-title">${item.title}</h4>
                <p class="gallery-item-description">${item.description}</p>
            </div>
        </div>
    `).join('');
    
    galleryPrevBtn.disabled = currentGalleryIndex === 0;
    galleryNextBtn.disabled = endIndex >= currentGallery.length;
    
    const totalPages = Math.ceil(currentGallery.length / itemsPerPage);
    galleryInfo.textContent = `Page ${currentGalleryIndex + 1} of ${totalPages} • ${currentGallery.length} total images`;
}

function nextGalleryPage() {
    if (currentGallery && (currentGalleryIndex + 1) * itemsPerPage < currentGallery.length) {
        currentGalleryIndex++;
        renderGalleryPage();
    }
}

function prevGalleryPage() {
    if (currentGallery && currentGalleryIndex > 0) {
        currentGalleryIndex--;
        renderGalleryPage();
    }
}

// --- INITIALIZATION ---
function initializeEventListeners() {
    // Filter events
    sidebar.addEventListener('change', handleFilterChange);
    yearSlider.addEventListener('input', (e) => { 
        yearValueSpan.textContent = e.target.value;
    });
    yearSlider.addEventListener('change', handleFilterChange);
    activeFiltersContainer.addEventListener('click', handlePillRemove);
    projectGrid.addEventListener('click', handleProjectClick);
    backToGalleryBtn.addEventListener('click', showGalleryView);

    // Site navigation events
    siteTitle.addEventListener('click', showGalleryView);
    siteSubtitle.addEventListener('click', showGalleryView);

    // Search events
    naturalSearchButton.addEventListener('click', handleNaturalSearch);
    naturalSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleNaturalSearch();
        }
    });
    guidedResultsContainer.addEventListener('click', handleGuidedResultClick);

    // Modal events
    openAboutBtn.addEventListener('click', () => openModal(aboutModal));
    openContactBtn.addEventListener('click', () => openModal(contactModal));
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modalId = e.currentTarget.dataset.modalId;
            const modal = document.getElementById(modalId);
            closeModal(modal);
        });
    });
    
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal-overlay')) {
            closeModal(event.target);
        }
    });

    // Gallery events
    galleryPrevBtn.addEventListener('click', prevGalleryPage);
    galleryNextBtn.addEventListener('click', nextGalleryPage);
}

// Initialize the application
// Global error boundary
window.addEventListener('error', (event) => {
    console.error('Global JavaScript error:', event.error);
    showErrorMessage('An unexpected error occurred. Please refresh the page.');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showErrorMessage('A network or data error occurred. Please check your connection and try again.');
    event.preventDefault(); // Prevent default browser error handling
});

// Error display function
function showErrorMessage(message, type = 'error') {
    // Create or update error display
    let errorContainer = document.getElementById('error-container');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 8px;
            padding: 16px;
            max-width: 400px;
            z-index: 10000;
            font-family: Inter, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(errorContainer);
    }
    
    errorContainer.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <span style="color: #d32f2f; font-size: 18px;">⚠️</span>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: #d32f2f; margin-bottom: 4px;">Error</div>
                <div style="color: #555; font-size: 14px;">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="border: none; background: none; font-size: 18px; cursor: pointer; color: #999;">×</button>
        </div>
    `;
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (errorContainer.parentElement) {
            errorContainer.remove();
        }
    }, 10000);
}

// Enhanced initialization with error handling
async function initializeApp() {
    try {
        console.log('🚀 Initializing portfolio application...');
        
        // Initialize markdown renderer first
        await initializeMarkdownRenderer();
        console.log('✅ Markdown renderer initialized');
        
        // Initialize event listeners
        initializeEventListeners();
        console.log('✅ Event listeners initialized');
        
        // Load projects with error handling
        await loadProjects();
        console.log('✅ Projects loaded successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        showErrorMessage('Failed to initialize the portfolio. Please refresh the page and try again.');
        
        // Attempt graceful degradation
        try {
            console.log('🔄 Attempting graceful degradation...');
            projects = getFallbackProjects();
            initializeFilters();
            applyFilters();
            console.log('✅ Graceful degradation successful');
        } catch (fallbackError) {
            console.error('❌ Graceful degradation failed:', fallbackError);
            showErrorMessage('Critical error: Unable to load portfolio content. Please contact the site administrator.');
        }
    }
}

document.addEventListener('DOMContentLoaded', initializeApp); 