// Main JavaScript - Core initialization and project data

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

// Project data structure
const projectData = {
    code: {
        type: "Code Project",
        title: "Nova: Writer's Conspiracy",
        subtitle: "Collaboration between human and AI, balancing structure and soul in creative agency - your cosmic atelier.",
        description: "Agentic helpers aid writers in creating novels. It's a cosmic atelier where storytellers conspire with AI to birth entire universes, balancing structure and soul in creative agency.",
        tags: ["React", "JavaScript", "CSS3", "Responsive Design", "Parallax", "Animation"],
        gallery: [
            {
                src: "/images/dashboard.jpg",
                alt: "Homepage Dashboard",
                title: "Homepage Dashboard",
                description: "The dashboard keeps writers on track with their writing goals and progress."
            },
            {
                src: "images/manuscript-view.jpg",
                alt: "Manuscript View",
                title: "Manuscript View",
                description: "The manuscript view is where writers draft their novel, and their ai writing companions help in realtime.",
            },
            {
                src: "images/manuscript-view.jpg",
                alt: "Character Design",
                title: "Interactive Elements",
                description: "Engaging animations and micro-interactions that enhance user experience"
            }
        ],
        journey: [
            {
                title: "Research & Planning",
                description: "I have been using AI to help me with my writing since I started writing. This has evolved over time: from a single helper to a team of helpers: project manager, editor, researcher, illustrator. but that was before I became aware of MAS"
            },
            {
                title: "Design Phase",
                description: "Created wireframes and prototypes, focusing on user flow and visual hierarchy. Developed the color palette and typography system."
            },
            {
                title: "Development",
                description: "Built the core functionality using modern JavaScript frameworks. Implemented responsive design and cross-browser compatibility."
            },
            {
                title: "Testing & Launch",
                description: "Conducted thorough testing across devices and browsers. Optimized performance and accessibility before deployment."
            }
        ],
        specs: [
            {
                title: "🎭 The 6 agents",
                description: "You decide the level of help the agents provide.<ul><li><h4>🌌The Architect**</h4>  *The God of the universe*—Give the concept and let the agents work their magic.</li><li><h4>🎬 **The Director**</h4> *The story's driver of vision - setting the concept and making sure the writing is going in the direction you envision.</li><li><h4>🤝 **The Collaborator**</h4> *Fellow visionaries*—Your and the agents work as co-pilots, splitting the work as you decide.</li><li><h4>💫 **The Assistant**</h4> *Muse-like support*—You do all the writing and the agents provide support.</li></ul>",
            },
            {
                title: "🧠📚 The Researcher",
                description: "<ul><li><h4>The Researcher:</h4> you can have a dedicated researcher who serves as your fact checker, your background source, it keeps you informed. </li><li><h4> 🌍🔥 The World Builder</h4> *Geography, culture, politics*—Creates entire worlds with rich lore and history.</li><li><h4>💋💔 The Character Architect</h4> *Backstories that bleed*—Develops characters with depth, motivation, and soul.</li><li><h4>⛓️✨ The Plot Alchemist</h4> *Structure and surprises*—Crafts compelling plots with twists that feel inevitable.</li><li><h4>✂️🕯️ The Editor</h4> *Cuts like a lover's truth*—Reviews and refines with surgical precision and poetic grace.</li><li><h4>🎨🌙 The Illustrator</h4> *Visuals from words, almost sinful*—Creates visual content that brings stories to life.</li></ul>",
            },
            
            {
                title: "🧠 Neural Graveyard",
                description: "hums with memory and context. <h4>✨ Real-time Collaboration</H4> feels like Google Docs meets Studio Ghibli. <h4>💫 Version Control</h4> like old lovers' letters—regret nothing, restore anything"
            },{title: "🕯️ Live Memory Threads",
                description: "<h4>Agents that remembertrack emotional arcs, whispered lies - never lose track of a character arc and how it affects the current scene."
            }
        ],
        links: [
            {
                title: "Live Demo",
                description: "View the live website",
                url: "https://claude.ai/public/artifacts/c7038827-ea90-4e4c-9551-f98ef4d4c2e6",
                icon: "🌐"
            },
            {
                title: "GitHub Repository",
                description: "View source code",
                url: "https://github.com/rubyrayjuntos/AstroNova",
                icon: "📁"
            },
            {
                title: "specifications",
                description: "Read detailed analysis",
                url: "#",
                icon: "📖"
            }
        ]
    },
    art: {
        type: "Art Project",
        title: "Digital Abstract Series",
        subtitle: "Exploring the intersection of technology and human emotion through digital art",
        description: "This series explores the relationship between digital technology and human emotion, using abstract forms and vibrant colors to convey the complexity of our digital age. Each piece represents a different aspect of the human experience in the modern world.",
        tags: ["Digital Art", "Abstract", "Photoshop", "Illustrator", "Contemporary", "Emotion"],
        gallery: [
            {
                src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop",
                alt: "Digital Abstract 1",
                title: "Connection",
                description: "Exploring human connection in the digital age through flowing forms and warm colors"
            },
            {
                src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop",
                alt: "Digital Abstract 2",
                title: "Isolation",
                description: "The feeling of isolation despite constant connectivity, represented through stark contrasts"
            },
            {
                src: "https://images.unsplash.com/photo-1549490349-8643362f943a?w=400&h=700&fit=crop",
                alt: "Digital Abstract 3",
                title: "Transformation",
                description: "The constant evolution of self in digital spaces, shown through morphing geometric forms"
            },
            {
                src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=450&fit=crop",
                alt: "Digital Abstract 4",
                title: "Overflow",
                description: "Information overload in modern life, depicted through layered textures and intense colors"
            }
        ],
        journey: [
            {
                title: "Concept Development",
                description: "Initial exploration of themes around digital life and human emotion. Sketched ideas and developed visual language."
            },
            {
                title: "Digital Experimentation",
                description: "Experimented with different digital tools and techniques. Created initial compositions and color studies."
            },
            {
                title: "Series Creation",
                description: "Developed individual pieces while maintaining cohesion across the series. Refined techniques and visual consistency."
            },
            {
                title: "Exhibition Preparation",
                description: "Prepared works for digital and physical exhibition. Created artist statements and documentation."
            }
        ],
        specs: [
            {
                title: "Medium & Tools",
                description: "Created using Adobe Photoshop and Illustrator. Digital paintings on canvas sized 3000x4000 pixels at 300 DPI."
            },
            {
                title: "Artistic Technique",
                description: "Combination of digital painting, photo manipulation, and vector graphics. Custom brushes and textures."
            },
            {
                title: "Color Palette",
                description: "Vibrant, contrasting colors representing the emotional spectrum. Primary focus on blues, oranges, and purples."
            },
            {
                title: "Composition",
                description: "Abstract geometric forms with organic flowing elements. Balance between structure and spontaneity."
            }
        ],
        links: [
            {
                title: "Full Gallery",
                description: "View complete series",
                url: "#",
                icon: "🖼️"
            },
            {
                title: "Artist Statement",
                description: "Read about the inspiration",
                url: "#",
                icon: "📝"
            },
            {
                title: "Exhibition Info",
                description: "Current and past exhibitions",
                url: "#",
                icon: "🏛️"
            }
        ]
    },
    writing: {
        type: "Writing Project",
        title: "Echoes of Tomorrow",
        subtitle: "A science fiction novella exploring humanity's relationship with artificial intelligence",
        description: "This novella explores the complex relationship between humans and artificial intelligence in a near-future world. Through interconnected stories, it examines themes of consciousness, identity, and what it means to be human in an age of advanced technology.",
        tags: ["Science Fiction", "Novella", "AI", "Philosophy", "Future", "Technology"],
        gallery: [
            {
                src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
                alt: "Writing Process",
                title: "Writing Process",
                description: "The creative journey from initial concept to finished manuscript"
            },
            {
                src: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=600&h=400&fit=crop",
                alt: "Research Materials",
                title: "Research & Development",
                description: "Extensive research into AI development and philosophical implications"
            },
            {
                src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
                alt: "Character Development",
                title: "Character Development",
                description: "Creating complex characters that bridge human and artificial consciousness"
            }
        ],
        journey: [
            {
                title: "Concept & Research",
                description: "Initial idea sparked by current AI developments. Researched consciousness studies, philosophy of mind, and technological singularity theories."
            },
            {
                title: "Story Structure",
                description: "Developed interconnected narrative structure. Created detailed character profiles and world-building documents."
            },
            {
                title: "First Draft",
                description: "Wrote initial 40,000-word draft over six months. Focused on getting the core story down before refinement."
            },
            {
                title: "Editing & Revision",
                description: "Multiple rounds of editing for structure, character development, and prose. Beta reader feedback incorporated."
            }
        ],
        specs: [
            {
                title: "Genre & Style",
                description: "Science fiction novella with philosophical undertones. Literary science fiction approach with focus on character development."
            },
            {
                title: "Length & Structure",
                description: "42,000 words across 8 interconnected chapters. Non-linear narrative structure with multiple perspectives."
            },
            {
                title: "Themes",
                description: "Consciousness, identity, human-AI relationships, technological ethics, and the nature of existence."
            },
            {
                title: "Target Audience",
                description: "Adult readers interested in thoughtful science fiction, philosophy, and contemporary technology issues."
            }
        ],
        links: [
            {
                title: "Read Excerpt",
                description: "First chapter preview",
                url: "#",
                icon: "📚"
            },
            {
                title: "Character Profiles",
                description: "Meet the characters",
                url: "#",
                icon: "👥"
            },
            {
                title: "Author Notes",
                description: "Behind the scenes",
                url: "#",
                icon: "✍️"
            }
        ]
    }
};

// Current project type
let currentProject = 'code';

// Initialize the page with progressive enhancement
function init() {
    console.log('Initializing application...');
    
    // Start performance monitoring
    monitorPerformance();
    
    // Initialize all modules
    if (typeof initTheme === 'function') initTheme();
    if (typeof initUI === 'function') initUI();
    if (typeof initAnimations === 'function') initAnimations();
    if (typeof initParallax === 'function') initParallax();

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
function updateProjectContent() {
    const project = projectData[currentProject];
    
    // Update hero section
    document.getElementById('projectTypeBadge').textContent = project.type;
    document.getElementById('projectTitle').textContent = project.title;
    document.getElementById('projectSubtitle').textContent = project.subtitle;
    document.getElementById('projectDescription').textContent = project.description;
    
    // Update tags
    const tagsContainer = document.getElementById('projectTags');
    tagsContainer.innerHTML = '';
    project.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    // Update gallery
    updateGallery(project.gallery);
    
    // Update journey
    updateJourney(project.journey);
    
    // Update specs
    updateSpecs(project.specs);
    
    // Update links
    updateLinks(project.links);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all modules are loaded
    setTimeout(init, 100);
});

// Export for use in other modules
window.projectData = projectData;
window.currentProject = currentProject;
window.updateProjectContent = updateProjectContent;
window.disablePerformanceMode = disablePerformanceMode;
window.enablePerformanceMode = enablePerformanceMode; 