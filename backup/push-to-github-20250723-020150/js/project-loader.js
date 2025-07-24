/**
 * @class ProjectLoader
 * @description Handles the discovery and loading of project data.
 * It fetches a manifest file, then asynchronously loads all listed project JSON files.
 * It also injects a 'slug' into each project object based on its filename.
 */
class ProjectLoader {
    constructor() {
        this.projects = [];
    }

    /**
     * Fetches the list of project file paths from the manifest.
     * @returns {Promise<string[]>} A list of paths to project JSON files.
     */
    async _loadProjectManifest() {
        try {
            const response = await fetch('_data/projects/manifest.json?v=' + new Date().getTime());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching or parsing project manifest:', error);
            return [];
        }
    }

    /**
     * Fetches a single project file and injects the 'slug'.
     * @param {string} filePath - The path to the project's JSON file.
     * @returns {Promise<object|null>} The project data object or null if failed.
     */
    async _loadProjectFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                console.error(`Failed to load project file: ${filePath}`, response.statusText);
                return null;
            }
            const project = await response.json();
            
            // CRITICAL: Inject the slug from the filename
            if (project && filePath) {
                const fileName = filePath.split('/').pop();
                project.slug = fileName.replace('.json', '');
            }

            return project;
        } catch (error) {
            console.error(`Error fetching or processing project file: ${filePath}`, error);
            return null;
        }
    }

    /**
     * Loads all projects listed in the manifest file.
     * @returns {Promise<object[]>} A promise that resolves to an array of all project data.
     */
    async loadAllProjects() {
        const projectPaths = await this._loadProjectManifest();
        if (!projectPaths || projectPaths.length === 0) {
            console.warn("Project manifest is empty or failed to load.");
            return [];
        }

        const projectPromises = projectPaths.map(path => this._loadProjectFile(path));
        const results = await Promise.all(projectPromises);

        // Filter out nulls from failed fetches and check for duplicate IDs
        const idMap = new Map();
        const uniqueProjects = [];
        for (const project of results.filter(p => p !== null)) {
            if (project && project.id) {
                if (!idMap.has(project.id)) {
                    idMap.set(project.id, true);
                    uniqueProjects.push(project);
                } else {
                    console.warn(`Duplicate project ID ${project.id} ("${project.title}") found. Skipping duplicate.`);
                }
            } else {
                console.warn('A project file seems to be missing an ID or is invalid.', project);
            }
        }
        
        this.projects = uniqueProjects;
        return this.projects;
    }
} 