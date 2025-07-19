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

    async loadAllProjects() {
        try {
            const projectList = await this.loadProjectManifest();
            const projectPromises = projectList.map(filePath => this.loadSingleProject(filePath));
            const loadedProjects = await Promise.all(projectPromises);
            
            // Filter out any nulls from failed loads and sort by ID
            this.projects = loadedProjects
                .filter(p => p !== null)
                .sort((a, b) => a.id - b.id);
            
            this.projects.forEach(p => this.loadedProjects.set(p.id, p));

            return this.projects;
        } catch (error) {
            console.error('❌ Failed to load all projects:', error);
            // Fallback to a minimal set if manifest fails
            return this.getFallbackProjects();
        }
    }

    async loadProjectManifest() {
        try {
            console.log('📄 Fetching project manifest...');
            const response = await fetch('_data/projects/manifest.json');
            if (!response.ok) {
                throw new Error(`Manifest fetch failed with status ${response.status}`);
            }
            const manifest = await response.json();
            console.log(`✅ Manifest loaded successfully with ${manifest.length} projects.`);
            return manifest;
        } catch (error) {
            console.error('⚠️ Could not load manifest.json:', error);
            console.warn('Falling back to empty project list. Please run "npm run manifest".');
            return []; // Return empty array on failure
        }
    }

    async loadProjectsFromManifest(projectList) {
        const loadPromises = projectList.map(filePath => this.loadSingleProject(filePath));
        const projects = await Promise.all(loadPromises);
        return projects.filter(p => p !== null); // Filter out any that failed to load
    }
    
    async discoverAndLoadProjects() {
        // This method is now effectively replaced by loadAllProjects,
        // which uses the manifest. We'll keep it for potential future use
        // but the primary mechanism is now manifest-driven.
        console.warn('discoverAndLoadProjects is deprecated. Using manifest-based loading.');
        return this.loadAllProjects();
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