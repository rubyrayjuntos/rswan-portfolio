// UI JavaScript - UI interactions, motion controls, and content updates

// Motion control functionality
window.motionEnabled = true;

function toggleMotion() {
    window.motionEnabled = !window.motionEnabled;
    document.body.classList.toggle('motion-disabled', !window.motionEnabled);
    
    const button = document.querySelector('.motion-toggle');
    button.innerHTML = window.motionEnabled ? 
        '🎬 Stop Parallax' : 
        '⏸️ Start Parallax';
}

// Update gallery section
function updateGallery(galleryItems) {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';
    
    // Use different layout for art projects
    if (window.currentProject === 'art') {
        galleryGrid.className = 'art-gallery';
    } else {
        galleryGrid.className = 'gallery-grid';
    }
    
    galleryItems.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${item.src}" alt="${item.alt}" loading="lazy">
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

// Update journey section
function updateJourney(journeyItems) {
    const timelineContainer = document.getElementById('timelineContainer');
    timelineContainer.innerHTML = '';
    
    // Add hero background to journey section
    const journeyHeroBg = document.createElement('div');
    journeyHeroBg.className = 'journey-hero-bg';
    timelineContainer.appendChild(journeyHeroBg);
    
    // Add journey particles container
    const journeyParticles = document.createElement('div');
    journeyParticles.className = 'journey-particles';
    timelineContainer.appendChild(journeyParticles);
    
    // Create journey particles
    if (typeof createJourneyParticles === 'function') {
        createJourneyParticles(journeyParticles);
    }
    
    console.log('Journey background elements created:', { journeyHeroBg, journeyParticles });
    
    // Add flowing arrows to timeline
    const flowArrow1 = document.createElement('div');
    flowArrow1.className = 'flow-arrow-1';
    flowArrow1.innerHTML = '▼';
    timelineContainer.appendChild(flowArrow1);
    
    const flowArrow2 = document.createElement('div');
    flowArrow2.className = 'flow-arrow-2';
    flowArrow2.innerHTML = '▼';
    timelineContainer.appendChild(flowArrow2);
    
    const flowArrow3 = document.createElement('div');
    flowArrow3.className = 'flow-arrow-3';
    flowArrow3.innerHTML = '▼';
    timelineContainer.appendChild(flowArrow3);
    
    journeyItems.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        timelineContainer.appendChild(timelineItem);
        
        // Add staggered delay for sequential appearance
        timelineItem.style.transitionDelay = `${index * 0.2}s`;
    });
    
    // Setup simplified timeline scroll animation
    if (typeof setupTimelineScrollAnimation === 'function') {
        setupTimelineScrollAnimation();
    }
}

// Update specs section with enhanced styling and parallax
function updateSpecs(specItems) {
    const specsGrid = document.getElementById('specsGrid');
    specsGrid.innerHTML = '';
    
    specItems.forEach((spec, index) => {
        const specCard = document.createElement('div');
        specCard.className = 'spec-card';
        specCard.setAttribute('data-parallax', 'true');
        specCard.setAttribute('data-speed', (0.1 + index * 0.05).toString());
        
        // Extract icon from title if present
        const iconMatch = spec.title.match(/^([🎭🧠📚🌍🔥💋💔⛓️✨✂️🕯️🎨🌙]+)/);
        const icon = iconMatch ? iconMatch[1] : '⚡';
        const cleanTitle = spec.title.replace(/^[🎭🧠📚🌍🔥💋💔⛓️✨✂️🕯️🎨🌙]+/, '').trim();
        
        specCard.innerHTML = `
            <div class="floating-icon">${icon}</div>
            <div class="bg-pattern"></div>
            <div class="particle-effect"></div>
            <h3>${cleanTitle}</h3>
            <div class="spec-content">${spec.description}</div>
        `;
        specsGrid.appendChild(specCard);
    });
    
    // Setup parallax for spec cards
    if (typeof setupSpecCardsParallax === 'function') {
        setupSpecCardsParallax();
    }
}

// Update links section
function updateLinks(linkItems) {
    const linksSection = document.getElementById('linksSection');
    linksSection.innerHTML = '';
    
    linkItems.forEach(link => {
        const linkCard = document.createElement('a');
        linkCard.className = 'link-card';
        linkCard.href = link.url;
        linkCard.innerHTML = `
            <span class="icon">${link.icon}</span>
            <h3>${link.title}</h3>
            <p>${link.description}</p>
        `;
        linksSection.appendChild(linkCard);
    });
}

// Performance mode toggle
function togglePerformanceMode() {
    if (window.performanceMode) {
        disablePerformanceMode();
        const button = document.querySelector('.performance-toggle');
        button.innerHTML = '⚡ Performance Mode';
        button.style.background = 'rgba(255,255,255,0.1)';
    } else {
        enablePerformanceMode();
        const button = document.querySelector('.performance-toggle');
        button.innerHTML = '🚀 Full Effects';
        button.style.background = 'rgba(255,140,0,0.3)';
    }
}

// Check system preference on load
function checkSystemPreferences() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        toggleMotion();
    }
}

// Initialize UI
function initUI() {
    checkSystemPreferences();
}

// Export functions for use in other modules
window.toggleMotion = toggleMotion;
window.updateGallery = updateGallery;
window.updateJourney = updateJourney;
window.updateSpecs = updateSpecs;
window.updateLinks = updateLinks;
window.initUI = initUI;
window.togglePerformanceMode = togglePerformanceMode; 