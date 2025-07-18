/**
 * Portfolio File Manager
 * Manages direct file system access to portfolio JSON files
 */

class PortfolioFileManager {
    constructor() {
        this.manifest = null;
        this.projects = [];
        this.fileHandle = null;
        this.directoryHandle = null;
        this.useFileSystemAPI = 'showDirectoryPicker' in window;
    }

    async init() {
        try {
            if (this.useFileSystemAPI) {
                await this.requestFileSystemAccess();
            }
            await this.loadManifest();
            return true;
        } catch (error) {
            console.error('PortfolioFileManager init failed:', error);
            return false;
        }
    }

    async requestFileSystemAccess() {
        try {
            this.directoryHandle = await window.showDirectoryPicker({
                mode: 'readwrite',
                startIn: 'documents'
            });
            console.log('File system access granted');
            return true;
        } catch (error) {
            console.warn('File system access denied, falling back to fetch API:', error);
            this.useFileSystemAPI = false;
            return false;
        }
    }

    async loadManifest() {
        try {
            if (this.useFileSystemAPI && this.directoryHandle) {
                this.manifest = await this.readFileWithFileSystem('_data/manifest.json');
            } else {
                const response = await fetch('../../_data/manifest.json');
                if (!response.ok) {
                    throw new Error(`Failed to load manifest: ${response.status}`);
                }
                this.manifest = await response.json();
            }
            
            console.log('Manifest loaded:', this.manifest.projects?.length || 0, 'projects');
            return this.manifest;
        } catch (error) {
            console.error('Error loading manifest:', error);
            // Create default manifest if file doesn't exist
            this.manifest = {
                version: "1.0.0",
                last_updated: new Date().toISOString(),
                projects: []
            };
            return this.manifest;
        }
    }

    async loadProject(filename) {
        try {
            let projectData;
            
            if (this.useFileSystemAPI && this.directoryHandle) {
                projectData = await this.readFileWithFileSystem(`_data/projects/${filename}`);
            } else {
                const response = await fetch(`../../_data/projects/${filename}`);
                if (!response.ok) {
                    throw new Error(`Failed to load project: ${response.status}`);
                }
                projectData = await response.json();
            }
            
            return projectData;
        } catch (error) {
            console.error(`Error loading project ${filename}:`, error);
            throw error;
        }
    }

    async saveProject(project, filename = null) {
        try {
            // Generate filename if not provided
            if (!filename) {
                filename = this.generateFilename(project);
            }
            
            // Convert project to portfolio format
            const portfolioProject = this.convertToPortfolioFormat(project);
            
            // Save the project file
            if (this.useFileSystemAPI && this.directoryHandle) {
                await this.writeFileWithFileSystem(`_data/projects/${filename}`, portfolioProject);
            } else {
                // For fetch API, we can't write files, so just return success
                console.warn('File System API not available - cannot save project file');
                return { success: true, filename, message: 'File saved (simulated)' };
            }
            
            // Update manifest if project is new
            await this.updateManifestIfNeeded(project, filename);
            
            return { success: true, filename };
        } catch (error) {
            console.error('Error saving project:', error);
            throw error;
        }
    }

    async deleteProject(filename) {
        try {
            if (this.useFileSystemAPI && this.directoryHandle) {
                await this.deleteFileWithFileSystem(`_data/projects/${filename}`);
                
                // Remove from manifest
                this.manifest.projects = this.manifest.projects.filter(p => p.file !== filename);
                await this.saveManifest();
                
                return { success: true, message: 'Project deleted' };
            } else {
                console.warn('File System API not available - cannot delete project file');
                return { success: false, message: 'Cannot delete files without File System API' };
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    }

    async updateManifestIfNeeded(project, filename) {
        const existingProject = this.manifest.projects.find(p => 
            this.normalizeProjectId(p) === this.normalizeProjectId(project)
        );
        
        if (!existingProject) {
            // Add new project to manifest
            this.manifest.projects.push({
                id: project.id || this.generateId(),
                title: project.title,
                file: filename,
                description: project.description
            });
            
            await this.saveManifest();
        }
    }

    async saveManifest() {
        try {
            this.manifest.last_updated = new Date().toISOString();
            
            if (this.useFileSystemAPI && this.directoryHandle) {
                await this.writeFileWithFileSystem('_data/manifest.json', this.manifest);
            } else {
                console.warn('File System API not available - cannot save manifest');
            }
            
            return true;
        } catch (error) {
            console.error('Error saving manifest:', error);
            throw error;
        }
    }

    async readFileWithFileSystem(path) {
        try {
            const pathParts = path.split('/');
            let currentHandle = this.directoryHandle;
            
            // Navigate to the directory
            for (let i = 0; i < pathParts.length - 1; i++) {
                currentHandle = await currentHandle.getDirectoryHandle(pathParts[i], { create: true });
            }
            
            // Get the file handle
            const fileHandle = await currentHandle.getFileHandle(pathParts[pathParts.length - 1]);
            const file = await fileHandle.getFile();
            const content = await file.text();
            
            return JSON.parse(content);
        } catch (error) {
            console.error(`Error reading file ${path}:`, error);
            throw error;
        }
    }

    async writeFileWithFileSystem(path, data) {
        try {
            const pathParts = path.split('/');
            let currentHandle = this.directoryHandle;
            
            // Navigate to the directory
            for (let i = 0; i < pathParts.length - 1; i++) {
                currentHandle = await currentHandle.getDirectoryHandle(pathParts[i], { create: true });
            }
            
            // Create the file
            const fileHandle = await currentHandle.getFileHandle(pathParts[pathParts.length - 1], { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(JSON.stringify(data, null, 2));
            await writable.close();
            
            console.log(`File written: ${path}`);
        } catch (error) {
            console.error(`Error writing file ${path}:`, error);
            throw error;
        }
    }

    async deleteFileWithFileSystem(path) {
        try {
            const pathParts = path.split('/');
            let currentHandle = this.directoryHandle;
            
            // Navigate to the directory
            for (let i = 0; i < pathParts.length - 1; i++) {
                currentHandle = await currentHandle.getDirectoryHandle(pathParts[i]);
            }
            
            // Delete the file
            await currentHandle.removeEntry(pathParts[pathParts.length - 1]);
            
            console.log(`File deleted: ${path}`);
        } catch (error) {
            console.error(`Error deleting file ${path}:`, error);
            throw error;
        }
    }

    generateFilename(project) {
        const title = project.title || 'untitled-project';
        const sanitizedTitle = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        
        return `${sanitizedTitle}.json`;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    normalizeProjectId(project) {
        const title = (project.title || '').toLowerCase().trim();
        const id = (project.id || '').toLowerCase().trim();
        return title || id;
    }

    convertToPortfolioFormat(ppmsProject) {
        // Convert PPMS format to portfolio format
        return {
            id: ppmsProject.id,
            title: ppmsProject.title,
            description: ppmsProject.description,
            year: ppmsProject.year,
            medium: ppmsProject.medium,
            technologies: this.convertLookupsToStrings(ppmsProject.technologies, 'technology'),
            genres: this.convertLookupsToStrings(ppmsProject.genres, 'genre'),
            styles: this.convertLookupsToStrings(ppmsProject.styles, 'style'),
            image_url: ppmsProject.image_url,
            status: ppmsProject.status || 'completed',
            pitch: ppmsProject.pitch,
            challenge: ppmsProject.challenge,
            development: ppmsProject.development,
            outcome: ppmsProject.outcome,
            gallery: ppmsProject.gallery || [],
            artifacts: ppmsProject.artifacts || [],
            journey: ppmsProject.journey || []
        };
    }

    convertLookupsToStrings(lookupIds, type) {
        if (!lookupIds || !Array.isArray(lookupIds)) {
            return [];
        }
        
        // For now, return the IDs as strings
        // In a full implementation, you'd look up the actual values
        return lookupIds.map(id => id.toString());
    }

    convertToPPMSFormat(portfolioProject) {
        // Convert portfolio format to PPMS format
        return {
            id: portfolioProject.id,
            title: portfolioProject.title,
            description: portfolioProject.description,
            year: portfolioProject.year,
            medium: portfolioProject.medium,
            technologies: this.convertStringsToLookups(portfolioProject.technologies, 'technology'),
            genres: this.convertStringsToLookups(portfolioProject.genres, 'genre'),
            styles: this.convertStringsToLookups(portfolioProject.styles, 'style'),
            image_url: portfolioProject.image_url,
            status: portfolioProject.status,
            pitch: portfolioProject.pitch,
            challenge: portfolioProject.challenge,
            development: portfolioProject.development,
            outcome: portfolioProject.outcome,
            gallery: portfolioProject.gallery || [],
            artifacts: portfolioProject.artifacts || [],
            journey: portfolioProject.journey || []
        };
    }

    convertStringsToLookups(strings, type) {
        if (!strings || !Array.isArray(strings)) {
            return [];
        }
        
        // For now, return the strings as IDs
        // In a full implementation, you'd create or find lookup IDs
        return strings.map(str => str.toString());
    }

    async getProjectStats() {
        try {
            await this.loadManifest();
            
            const stats = {
                totalProjects: this.manifest.projects?.length || 0,
                lastUpdated: this.manifest.last_updated,
                version: this.manifest.version,
                fileSystemAccess: this.useFileSystemAPI,
                projects: this.manifest.projects || []
            };
            
            return stats;
        } catch (error) {
            console.error('Error getting project stats:', error);
            throw error;
        }
    }

    async validateProject(project) {
        const errors = [];
        
        if (!project.title) {
            errors.push('Title is required');
        }
        
        if (!project.description) {
            errors.push('Description is required');
        }
        
        if (!project.year) {
            errors.push('Year is required');
        }
        
        if (!project.medium) {
            errors.push('Medium is required');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Utility method to get all projects
    async getAllProjects() {
        try {
            await this.loadManifest();
            
            const projects = [];
            for (const projectRef of this.manifest.projects) {
                try {
                    const project = await this.loadProject(projectRef.file);
                    projects.push(project);
                } catch (error) {
                    console.warn(`Failed to load project ${projectRef.file}:`, error);
                }
            }
            
            return projects;
        } catch (error) {
            console.error('Error loading all projects:', error);
            throw error;
        }
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioFileManager;
} 