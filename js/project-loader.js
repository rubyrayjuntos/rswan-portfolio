/**
 * Dynamic Project Loader
 * Automatically discovers and loads all project JSON files from _data/projects/
 */

class ProjectLoader {
    constructor() {
        this.projects = [];
        this.loadedProjects = new Map(); // Track loaded projects by ID
        this.loadingPromises = new Map(); // Prevent duplicate loads
    }

    /**
     * Dynamically discover and load all project JSON files
     * Uses a combination of known patterns and dynamic discovery
     */
    async loadAllProjects() {
        console.log('🔄 Starting dynamic project discovery...');
        
        try {
            // First, try to load a project manifest if it exists
            const manifest = await this.loadProjectManifest();
            
            if (manifest && manifest.projects) {
                // Use manifest if available
                console.log('📋 Using project manifest for loading');
                await this.loadProjectsFromManifest(manifest.projects);
            } else {
                // Fallback to dynamic discovery
                console.log('🔍 No manifest found, using dynamic discovery');
                await this.discoverAndLoadProjects();
            }
            
            console.log(`✅ Successfully loaded ${this.projects.length} projects`);
            return this.projects;
            
        } catch (error) {
            console.error('❌ Error loading projects:', error);
            return this.getFallbackProjects();
        }
    }

    /**
     * Try to load a project manifest file
     */
    async loadProjectManifest() {
        try {
            const response = await fetch('_data/projects/manifest.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('No project manifest found, will use dynamic discovery');
        }
        return null;
    }

    /**
     * Load projects from a manifest file
     */
    async loadProjectsFromManifest(projectList) {
        const loadPromises = projectList.map(async (projectInfo) => {
            const filePath = projectInfo.file || `_data/projects/${projectInfo.id}.json`;
            return this.loadSingleProject(filePath, projectInfo.id);
        });

        const results = await Promise.allSettled(loadPromises);
        
        // Filter successful loads and maintain order
        this.projects = results
            .map((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    return result.value;
                } else {
                    console.warn(`Failed to load project ${projectList[index]?.id || index}:`, result.reason);
                    return null;
                }
            })
            .filter(project => project !== null);
    }

    /**
     * Dynamic discovery of project files
     * Uses common naming patterns and known project IDs
     */
    async discoverAndLoadProjects() {
        // Common project patterns to try
        const projectPatterns = [
            // Known project files
            'echoes-of-lumina.json',
            'nova-writers-conspiracy.json',
            'henri-ruben.json',
            'graphic-novel.json',
            'weight-of-a-name.json',
            'character-design.json',
            'arcana.json',
            'tarot-deck.json',
            'brand-automation.json',
            'asteroids.json',
            'elyra.json',
            'set-design.json',
            'world-bible.json',
            'sticker-pack.json',
            'tarot-awakened.json',
            'brand-identity-workflow.json',
            
            // Additional patterns to try
            'sample-project.json',
            'papi-chispa-cartas-del-deseo.json'
        ];

        // Try to load each project file
        const loadPromises = projectPatterns.map(async (filename) => {
            const filePath = `_data/projects/${filename}`;
            return this.loadSingleProject(filePath);
        });

        const results = await Promise.allSettled(loadPromises);
        
        // Filter successful loads
        this.projects = results
            .map((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    return result.value;
                } else {
                    console.log(`Project file not found or failed to load: ${projectPatterns[index]}`);
                    return null;
                }
            })
            .filter(project => project !== null);

        // Sort projects by ID for consistent ordering
        this.projects.sort((a, b) => (a.id || 0) - (b.id || 0));
    }

    /**
     * Load a single project file
     */
    async loadSingleProject(filePath, expectedId = null) {
        // Check if already loaded
        if (this.loadedProjects.has(filePath)) {
            return this.loadedProjects.get(filePath);
        }

        // Check if already loading
        if (this.loadingPromises.has(filePath)) {
            return this.loadingPromises.get(filePath);
        }

        // Create loading promise
        const loadPromise = this._loadProjectFile(filePath, expectedId);
        this.loadingPromises.set(filePath, loadPromise);

        try {
            const project = await loadPromise;
            if (project) {
                this.loadedProjects.set(filePath, project);
                console.log(`✅ Loaded project: ${project.title} (ID: ${project.id})`);
            }
            return project;
        } finally {
            this.loadingPromises.delete(filePath);
        }
    }

    /**
     * Internal method to load a project file
     */
    async _loadProjectFile(filePath, expectedId = null) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                if (response.status === 404) {
                    return null; // File doesn't exist, not an error
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const project = await response.json();
            
            // Validate project structure
            if (!this.validateProject(project)) {
                console.warn(`Invalid project structure in ${filePath}`);
                return null;
            }

            // Ensure project has an ID
            if (!project.id && expectedId) {
                project.id = expectedId;
            }

            return project;

        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                // Network error, file might not exist
                return null;
            }
            console.error(`Error loading ${filePath}:`, error);
            return null;
        }
    }

    /**
     * Validate project structure
     */
    validateProject(project) {
        const requiredFields = ['title', 'description', 'medium'];
        return requiredFields.every(field => project.hasOwnProperty(field));
    }

    /**
     * Get projects filtered by criteria
     */
    getProjectsByFilter(filterFn) {
        return this.projects.filter(filterFn);
    }

    /**
     * Get project by ID
     */
    getProjectById(id) {
        return this.projects.find(p => p.id === id);
    }

    /**
     * Get projects by medium
     */
    getProjectsByMedium(medium) {
        return this.projects.filter(p => p.medium === medium);
    }

    /**
     * Get all unique mediums
     */
    getUniqueMediums() {
        return [...new Set(this.projects.map(p => p.medium))];
    }

    /**
     * Get all unique genres
     */
    getUniqueGenres() {
        const allGenres = this.projects.flatMap(p => p.genre || []);
        return [...new Set(allGenres)];
    }

    /**
     * Get all unique technologies
     */
    getUniqueTechnologies() {
        const allTech = this.projects.flatMap(p => p.tech || []);
        return [...new Set(allTech)];
    }

    /**
     * Get fallback projects if loading fails
     */
    getFallbackProjects() {
        return [{
            id: 1,
            title: "Portfolio (Interactive Web Portfolio)",
            description: "A dynamic and multi-faceted web portfolio designed to comprehensively showcase diverse creative and technical work across Code, Writing, and Art.",
            imageUrl: "https://via.placeholder.com/600x400/e0e5ec/31456A?text=Interactive+Portfolio",
            medium: "code",
            genre: ["Web Development", "Personal Branding", "UX/UI Design"],
            style: ["Soft UI/Neumorphic", "Modern", "Professional"],
            tech: ["HTML", "CSS", "JavaScript", "JSON", "Markdown"],
            mood: "Innovative",
            year: 2025,
            role: "Lead Designer, Frontend Developer",
            variant: "featured",
            status: "live",
            links: {
                live: "C:/Users/raycs/Documents/Projects/rswan-portfolio",
                github: "https://github.com/rayswan/rswan-portfolio",
                demo: "C:/Users/raycs/Documents/Projects/rswan-portfolio"
            },
            pitch: "A sophisticated, data-driven interactive web portfolio that transcends traditional showcases.",
            challenge: "The primary challenge involved architecting a flexible and scalable system capable of dynamically presenting a large and diverse body of work.",
            development: "The development process in 2025 was highly iterative, undergoing three major redesigns as the fundamental understanding shifted towards making the underlying data structure the most critical element.",
            outcome: "The outcome is a highly organized, professional, and interactive portfolio that not only presents diverse projects but also actively demonstrates advanced information architecture."
        }];
    }

    /**
     * Reload all projects
     */
    async reload() {
        this.projects = [];
        this.loadedProjects.clear();
        this.loadingPromises.clear();
        return await this.loadAllProjects();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectLoader;
} else {
    // Browser environment
    window.ProjectLoader = ProjectLoader;
} 