// Project Loader - Handles loading project data and populating detail pages

// Project data structure for different types
const projectTemplates = {
    code: {
        sections: ['overview', 'gallery', 'journey', 'specs', 'links'],
        sectionTitles: {
            overview: 'Project Overview',
            gallery: 'Gallery',
            journey: 'Development Journey', 
            specs: 'Technical Specifications',
            links: 'Project Links'
        }
    },
    art: {
        sections: ['overview', 'gallery', 'process', 'inspiration', 'links'],
        sectionTitles: {
            overview: 'Artwork Overview',
            gallery: 'Gallery',
            process: 'Creative Process',
            inspiration: 'Inspiration & Concept',
            links: 'Art Links'
        }
    },
    writing: {
        sections: ['overview', 'excerpts', 'process', 'themes', 'links'],
        sectionTitles: {
            overview: 'Writing Overview',
            excerpts: 'Excerpts',
            process: 'Writing Process',
            themes: 'Themes & Analysis',
            links: 'Writing Links'
        }
    }
};

// Load and populate project data
function loadProjectData() {
    const projectData = sessionStorage.getItem('currentProject');
    
    if (!projectData) {
        // No project data found, redirect back to portfolio
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const project = JSON.parse(projectData);
        const projectType = project.medium.toLowerCase();
    
    // Update page title and meta
    document.title = `${project.title} - Project Details`;
    updateMetaTags(project);
    
    // Populate hero section
    populateHeroSection(project);
    
    // Populate overview section
    populateOverviewSection(project);
    
    // Populate sections based on project type
    const template = projectTemplates[projectType] || projectTemplates.code;
    
    // Show/hide sections based on project type
    showRelevantSections(template.sections, template.sectionTitles);
    
    // Populate content for each section
    populateProjectSections(project, template);
    
    // Update navigation links
    updateNavigationLinks(template.sections);
    } catch (error) {
        console.error('Error loading project data:', error);
        // Redirect back to portfolio on error
        window.location.href = 'index.html';
    }
}

// Update meta tags for SEO
function updateMetaTags(project) {
    const metaDescription = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    
    if (metaDescription) metaDescription.content = project.description;
    if (ogTitle) ogTitle.content = project.title;
    if (ogDescription) ogDescription.content = project.description;
    if (twitterTitle) twitterTitle.content = project.title;
    if (twitterDescription) twitterDescription.content = project.description;
}

// Populate hero section
function populateHeroSection(project) {
    const typeBadge = document.getElementById('projectTypeBadge');
    const title = document.getElementById('projectTitle');
    const subtitle = document.getElementById('projectSubtitle');
    
    if (typeBadge) typeBadge.textContent = `${project.medium} Project`;
    if (title) title.textContent = project.title;
    if (subtitle) subtitle.textContent = project.pitch || project.description;
}

// Populate overview section
function populateOverviewSection(project) {
    const description = document.getElementById('projectDescription');
    const tags = document.getElementById('projectTags');
    
    if (description) description.textContent = project.description;
    
    if (tags && project.tech) {
        tags.innerHTML = '';
        project.tech.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = tech;
            tags.appendChild(tag);
        });
    }
}

// Show relevant sections and hide others
function showRelevantSections(sections, sectionTitles) {
    const allSections = ['overview', 'gallery', 'journey', 'specs', 'links', 'process', 'inspiration', 'excerpts', 'themes'];
    
    allSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            if (sections.includes(sectionId)) {
                section.style.display = 'block';
                // Update section title if we have a custom one
                const titleElement = section.querySelector('.section-title');
                if (titleElement && sectionTitles[sectionId]) {
                    titleElement.innerHTML = `${sectionTitles[sectionId]}<span class="title-sparkle">✨</span>`;
                }
            } else {
                section.style.display = 'none';
            }
        }
    });
}

// Update navigation links
function updateNavigationLinks(sections) {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const sectionId = href.replace('#', '');
        
        if (sectionId === 'home' || sections.includes(sectionId)) {
            link.style.display = 'block';
        } else {
            link.style.display = 'none';
        }
    });
}

// Populate project sections based on type
function populateProjectSections(project, template) {
    template.sections.forEach(sectionId => {
        switch (sectionId) {
            case 'gallery':
                populateGallerySection(project);
                break;
            case 'journey':
                populateJourneySection(project);
                break;
            case 'specs':
                populateSpecsSection(project);
                break;
            case 'links':
                populateLinksSection(project);
                break;
            case 'process':
                populateProcessSection(project);
                break;
            case 'inspiration':
                populateInspirationSection(project);
                break;
            case 'excerpts':
                populateExcerptsSection(project);
                break;
            case 'themes':
                populateThemesSection(project);
                break;
        }
    });
}

// Populate gallery section
function populateGallerySection(project) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid || !project.gallery) return;
    
    galleryGrid.innerHTML = '';
    project.gallery.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${item.url}" alt="${item.title}" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-overlay-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </div>
        `;
        galleryGrid.appendChild(galleryItem);
    });
}

// Populate journey section
function populateJourneySection(project) {
    const timelineContainer = document.getElementById('timelineContainer');
    if (!timelineContainer || !project.journey) return;
    
    timelineContainer.innerHTML = '';
    project.journey.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        timelineContainer.appendChild(timelineItem);
    });
}

// Populate specs section
function populateSpecsSection(project) {
    const specsGrid = document.getElementById('specsGrid');
    if (!specsGrid || !project.specs) return;
    
    specsGrid.innerHTML = '';
    project.specs.forEach(spec => {
        const specCard = document.createElement('div');
        specCard.className = 'spec-card';
        specCard.innerHTML = `
            <h3>${spec.title}</h3>
            <p>${spec.description}</p>
        `;
        specsGrid.appendChild(specCard);
    });
}

// Populate links section
function populateLinksSection(project) {
    const linksSection = document.getElementById('linksSection');
    if (!linksSection || !project.links) return;
    
    linksSection.innerHTML = '';
    Object.entries(project.links).forEach(([text, url]) => {
        const linkCard = document.createElement('a');
        linkCard.className = 'link-card';
        linkCard.href = url;
        linkCard.target = '_blank';
        linkCard.rel = 'noopener noreferrer';
        linkCard.innerHTML = `
            <span class="icon">🔗</span>
            <h3>${text}</h3>
            <p>Visit ${text}</p>
        `;
        linksSection.appendChild(linkCard);
    });
}

// Populate process section (for art projects)
function populateProcessSection(project) {
    const processContent = document.getElementById('processContent');
    if (!processContent || !project.process) return;
    
    processContent.innerHTML = `
        <div class="process-content">
            <p>${project.process}</p>
        </div>
    `;
}

// Populate inspiration section (for art projects)
function populateInspirationSection(project) {
    const inspirationContent = document.getElementById('inspirationContent');
    if (!inspirationContent || !project.inspiration) return;
    
    inspirationContent.innerHTML = `
        <div class="inspiration-content">
            <p>${project.inspiration}</p>
        </div>
    `;
}

// Populate excerpts section (for writing projects)
function populateExcerptsSection(project) {
    const excerptsContent = document.getElementById('excerptsContent');
    if (!excerptsContent || !project.excerpts) return;
    
    excerptsContent.innerHTML = `
        <div class="excerpts-content">
            <p>${project.excerpts}</p>
        </div>
    `;
}

// Populate themes section (for writing projects)
function populateThemesSection(project) {
    const themesContent = document.getElementById('themesContent');
    if (!themesContent || !project.themes) return;
    
    themesContent.innerHTML = `
        <div class="themes-content">
            <p>${project.themes}</p>
        </div>
    `;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure all elements are loaded
    setTimeout(() => {
        loadProjectData();
    }, 100);
});

// Export for use in other modules
window.loadProjectData = loadProjectData; 