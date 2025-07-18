/**
 * Portfolio File Manager
 * Enables PPMS to read/write directly to portfolio files
 */

class PortfolioFileManager {
    constructor() {
        this.portfolioPath = '../..'; // Relative to PPMS
        this.projectsPath = `${this.portfolioPath}/_data/projects`;
        this.manifestPath = `${this.portfolioPath}/_data/manifest.json`;
        this.imagesPath = `${this.portfolioPath}/images/projects`;
        this.categoriesPath = `${this.portfolioPath}/_data/categories.json`;
        this.siteSettingsPath = `${this.portfolioPath}/_data/site-settings.json`;
        
        this.fileSystemHandle = null;
        this.isInitialized = false;
    }

    async initialize() {
        try {
            console.log('🔧 Initializing Portfolio File Manager...');
            
            // Check if File System Access API is available
            if ('showDirectoryPicker' in window) {
                await this.requestFileSystemAccess();
            } else {
                console.warn('⚠️ File System Access API not available, using fallback mode');
                this.isInitialized = true;
            }
            
            console.log('✅ Portfolio File Manager initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Portfolio File Manager:', error);
            return false;
        }
    }

    async requestFileSystemAccess() {
        try {
            console.log('📁 Requesting file system access...');
            
            // Request access to the portfolio directory
            this.fileSystemHandle = await window.showDirectoryPicker({
                mode: 'readwrite',
                startIn: 'documents'
            });
            
            console.log('✅ File system access granted');
            this.isInitialized = true;
            
        } catch (error) {
            console.error('❌ File system access denied:', error);
            throw error;
        }
    }

    async loadManifest() {
        try {
            if (this.fileSystemHandle) {
                return await this.readFileFromHandle('_data/manifest.json');
            } else {
                const response = await fetch(this.manifestPath);
                if (!response.ok) {
                    throw new Error(`Failed to load manifest: ${response.status}`);
                }
                return await response.json();
            }
        } catch (error) {
            console.error('❌ Failed to load manifest:', error);
            throw error;
        }
    }

    async loadProject(filename) {
        try {
            const filePath = `_data/projects/${filename}`;
            
            if (this.fileSystemHandle) {
                return await this.readFileFromHandle(filePath);
            } else {
                const response = await fetch(`${this.projectsPath}/${filename}`);
                if (!response.ok) {
                    console.warn(`⚠️ Project file not found: ${filename}`);
                    return null;
                }
                return await response.json();
            }
        } catch (error) {
            console.error(`❌ Failed to load project ${filename}:`, error);
            return null;
        }
    }

    async loadAllProjects() {
        try {
            console.log('📁 Loading all portfolio projects...');
            
            // Load manifest
            const manifest = await this.loadManifest();
            console.log(`📋 Manifest loaded: ${manifest.projects.length} projects listed`);
            
            // Load each project file
            const projectPromises = manifest.projects.map(async (projectInfo) => {
                try {
                    const project = await this.loadProject(projectInfo.file);
                    if (project) {
                        return {
                            ...project,
                            manifestInfo: projectInfo,
                            source: 'portfolio'
                        };
                    }
                    return null;
                } catch (error) {
                    console.warn(`⚠️ Error loading project ${projectInfo.file}:`, error);
                    return null;
                }
            });
            
            const projectResults = await Promise.allSettled(projectPromises);
            const projects = projectResults
                .filter(result => result.status === 'fulfilled' && result.value !== null)
                .map(result => result.value);
            
            console.log(`📊 Portfolio projects loaded: ${projects.length} valid projects`);
            return projects;
            
        } catch (error) {
            console.error('❌ Failed to load portfolio projects:', error);
            throw error;
        }
    }

    async saveProject(project) {
        try {
            console.log(`💾 Saving project: ${project.title}`);
            
            // Generate filename
            const filename = this.generateFilename(project);
            const filePath = `_data/projects/${filename}`;
            
            // Convert to portfolio format
            const portfolioProject = this.convertToPortfolioFormat(project);
            
            // Write file
            if (this.fileSystemHandle) {
                await this.writeFileToHandle(filePath, portfolioProject);
            } else {
                await this.writeFileViaAPI(filePath, portfolioProject);
            }
            
            // Update manifest
            await this.updateManifest(project, filename);
            
            console.log(`✅ Project saved: ${filename}`);
            return filename;
            
        } catch (error) {
            console.error(`❌ Failed to save project ${project.title}:`, error);
            throw error;
        }
    }

    async updateManifest(project, filename) {
        try {
            const manifest = await this.loadManifest();
            
            // Find existing project in manifest
            const existingIndex = manifest.projects.findIndex(p => p.id === project.id);
            
            if (existingIndex >= 0) {
                // Update existing entry
                manifest.projects[existingIndex] = {
                    id: project.id,
                    file: filename,
                    title: project.title,
                    medium: project.medium
                };
            } else {
                // Add new entry
                manifest.projects.push({
                    id: project.id,
                    file: filename,
                    title: project.title,
                    medium: project.medium
                });
            }
            
            // Update last updated timestamp
            manifest.lastUpdated = new Date().toISOString().split('T')[0];
            
            // Save manifest
            if (this.fileSystemHandle) {
                await this.writeFileToHandle('_data/manifest.json', manifest);
            } else {
                await this.writeFileViaAPI('_data/manifest.json', manifest);
            }
            
            console.log('✅ Manifest updated');
            
        } catch (error) {
            console.error('❌ Failed to update manifest:', error);
            throw error;
        }
    }

    generateFilename(project) {
        const cleanTitle = project.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        
        return `${project.id}-${cleanTitle}.json`;
    }

    convertToPortfolioFormat(ppmsProject) {
        // Convert PPMS format to portfolio format
        return {
            id: ppmsProject.id,
            title: ppmsProject.title,
            description: ppmsProject.description,
            imageUrl: ppmsProject.image_url,
            medium: ppmsProject.medium,
            genre: this.convertLookupIdsToStrings(ppmsProject.genres, 'genre'),
            style: this.convertLookupIdsToStrings(ppmsProject.styles, 'style'),
            tech: this.convertLookupIdsToStrings(ppmsProject.technologies, 'technology'),
            mood: ppmsProject.mood,
            year: ppmsProject.year,
            role: ppmsProject.role,
            variant: ppmsProject.variant,
            status: ppmsProject.status,
            links: ppmsProject.links || {},
            pitch: ppmsProject.pitch,
            challenge: ppmsProject.challenge,
            development: ppmsProject.development,
            outcome: ppmsProject.outcome,
            gallery: ppmsProject.gallery || [],
            journey: ppmsProject.journey || [],
            specs: ppmsProject.specs || []
        };
    }

    convertLookupIdsToStrings(lookupIds, type) {
        if (!lookupIds || !Array.isArray(lookupIds)) {
            return [];
        }
        
        // This would need to be implemented with actual lookup data
        // For now, return the IDs as strings
        return lookupIds.map(id => `Lookup-${type}-${id}`);
    }

    async readFileFromHandle(filePath) {
        try {
            const pathParts = filePath.split('/');
            let currentHandle = this.fileSystemHandle;
            
            // Navigate to the file
            for (let i = 0; i < pathParts.length - 1; i++) {
                currentHandle = await currentHandle.getDirectoryHandle(pathParts[i], { create: false });
            }
            
            const fileHandle = await currentHandle.getFileHandle(pathParts[pathParts.length - 1]);
            const file = await fileHandle.getFile();
            const content = await file.text();
            
            return JSON.parse(content);
        } catch (error) {
            console.error(`❌ Failed to read file ${filePath}:`, error);
            throw error;
        }
    }

    async writeFileToHandle(filePath, data) {
        try {
            const pathParts = filePath.split('/');
            let currentHandle = this.fileSystemHandle;
            
            // Navigate to the directory, creating if necessary
            for (let i = 0; i < pathParts.length - 1; i++) {
                currentHandle = await currentHandle.getDirectoryHandle(pathParts[i], { create: true });
            }
            
            const fileHandle = await currentHandle.getFileHandle(pathParts[pathParts.length - 1], { create: true });
            const writable = await fileHandle.createWritable();
            
            const content = JSON.stringify(data, null, 2);
            await writable.write(content);
            await writable.close();
            
        } catch (error) {
            console.error(`❌ Failed to write file ${filePath}:`, error);
            throw error;
        }
    }

    async writeFileViaAPI(filePath, data) {
        // Fallback method using fetch API
        // This would require a server endpoint to handle file writes
        console.warn('⚠️ File System API not available, using fallback mode');
        
        // For now, just log what would be written
        console.log(`Would write to ${filePath}:`, data);
        
        // In a real implementation, this would make a POST request to a server endpoint
        // that handles file writing
    }

    async deleteProject(projectId) {
        try {
            console.log(`🗑️ Deleting project: ${projectId}`);
            
            const manifest = await this.loadManifest();
            const projectIndex = manifest.projects.findIndex(p => p.id === projectId);
            
            if (projectIndex >= 0) {
                const project = manifest.projects[projectIndex];
                
                // Delete project file
                const filePath = `_data/projects/${project.file}`;
                if (this.fileSystemHandle) {
                    await this.deleteFileFromHandle(filePath);
                }
                
                // Remove from manifest
                manifest.projects.splice(projectIndex, 1);
                manifest.lastUpdated = new Date().toISOString().split('T')[0];
                
                // Save updated manifest
                if (this.fileSystemHandle) {
                    await this.writeFileToHandle('_data/manifest.json', manifest);
                }
                
                console.log(`✅ Project deleted: ${project.file}`);
            }
            
        } catch (error) {
            console.error(`❌ Failed to delete project ${projectId}:`, error);
            throw error;
        }
    }

    async deleteFileFromHandle(filePath) {
        try {
            const pathParts = filePath.split('/');
            let currentHandle = this.fileSystemHandle;
            
            // Navigate to the directory
            for (let i = 0; i < pathParts.length - 1; i++) {
                currentHandle = await currentHandle.getDirectoryHandle(pathParts[i], { create: false });
            }
            
            // Delete the file
            await currentHandle.removeEntry(pathParts[pathParts.length - 1]);
            
        } catch (error) {
            console.error(`❌ Failed to delete file ${filePath}:`, error);
            throw error;
        }
    }

    async getProjectStats() {
        try {
            const projects = await this.loadAllProjects();
            
            return {
                totalProjects: projects.length,
                byMedium: this.groupByMedium(projects),
                byStatus: this.groupByStatus(projects),
                byYear: this.groupByYear(projects)
            };
        } catch (error) {
            console.error('❌ Failed to get project stats:', error);
            throw error;
        }
    }

    groupByMedium(projects) {
        return projects.reduce((acc, project) => {
            const medium = project.medium || 'unknown';
            acc[medium] = (acc[medium] || 0) + 1;
            return acc;
        }, {});
    }

    groupByStatus(projects) {
        return projects.reduce((acc, project) => {
            const status = project.status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
    }

    groupByYear(projects) {
        return projects.reduce((acc, project) => {
            const year = project.year || 'unknown';
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});
    }

    async validateProject(project) {
        const errors = [];
        
        // Check required fields
        if (!project.title) errors.push('Title is required');
        if (!project.description) errors.push('Description is required');
        if (!project.medium) errors.push('Medium is required');
        if (!project.year) errors.push('Year is required');
        
        // Check field lengths
        if (project.title && project.title.length > 100) {
            errors.push('Title must be 100 characters or less');
        }
        
        if (project.description && project.description.length > 500) {
            errors.push('Description must be 500 characters or less');
        }
        
        // Check year range
        if (project.year && (project.year < 2000 || project.year > new Date().getFullYear() + 1)) {
            errors.push('Year must be between 2000 and next year');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
}

// Export for use in other scripts
window.PortfolioFileManager = PortfolioFileManager; 