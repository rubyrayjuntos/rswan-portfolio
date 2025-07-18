class PortfolioToPPMSConverter {
    constructor() {
        this.ppmsData = {
            version: "1.0.0",
            last_updated: new Date().toISOString(),
            lookups: [],
            projects: [],
            config: [],
            audit_log: []
        };
        this.lookupIds = {
            genre: 1,
            technology: 1,
            style: 1,
            medium: 1
        };
        this.projectId = 1;
        this.nextLookupId = 1; // Global lookup ID counter
        this.showLookupDialog = null; // Dialog function (set by enableLookupDialog)
    }

    // Convert portfolio project to PPMS format
    async convertProject(portfolioProject) {
        try {
            const ppmsProject = {
                id: this.projectId++,
                title: portfolioProject.title || 'Untitled Project',
                description: portfolioProject.description || '',
                year: portfolioProject.year || 2024,
                medium: await this.addLookup('medium', portfolioProject.medium || 'mixed'),
                technologies: await this.convertTechToLookups(portfolioProject.tech || []),
                genres: await this.convertGenresToLookups(portfolioProject.genre || []),
                styles: await this.convertStylesToLookups(portfolioProject.style || []),
                image_url: portfolioProject.imageUrl || '',
                status: portfolioProject.status || 'completed',
                pitch: portfolioProject.pitch || '',
                challenge: portfolioProject.challenge || '',
                development: portfolioProject.development || '',
                outcome: portfolioProject.outcome || '',
                gallery: portfolioProject.gallery || [],
                artifacts: portfolioProject.artifacts || [],
                journey: portfolioProject.journey || [],
                role: portfolioProject.role || '',
                mood: portfolioProject.mood || '',
                links: portfolioProject.links || {},
                specs: portfolioProject.specs || []
            };

            return ppmsProject;
        } catch (error) {
            console.error('Error converting project:', portfolioProject.title, error);
            // Return a minimal project to prevent conversion from stopping
            return {
                id: this.projectId++,
                title: portfolioProject.title || 'Error Project',
                description: 'Error during conversion',
                year: 2024,
                medium: null,
                technologies: [],
                genres: [],
                styles: [],
                image_url: '',
                status: 'error',
                pitch: '',
                challenge: '',
                development: '',
                outcome: '',
                gallery: [],
                artifacts: [],
                journey: [],
                role: '',
                mood: '',
                links: {},
                specs: []
            };
        }
    }

    // Add lookup and return ID
    async addLookup(type, value) {
        if (!value) return null;
        
        // Check if this lookup already exists
        const existing = this.ppmsData.lookups.find(l => l.type === type && l.value === value);
        if (existing) return existing.id;

        // Use global ID counter to avoid conflicts
        const id = this.nextLookupId++;
        
        // Show dialog for problematic lookups
        if (this.showLookupDialog) {
            const shouldContinue = await this.showLookupDialog(type, value, id);
            if (!shouldContinue) {
                throw new Error(`Lookup dialog cancelled for ${type}: ${value}`);
            }
        }
        
        this.ppmsData.lookups.push({
            id,
            type,
            value,
            description: `${type} category`
        });
        return id;
    }

    // Convert tech array to lookup IDs
    async convertTechToLookups(techArray) {
        const results = await Promise.all(techArray.map(tech => this.addLookup('technology', tech)));
        return results.filter(id => id !== null);
    }

    // Convert genres array to lookup IDs
    async convertGenresToLookups(genreArray) {
        const results = await Promise.all(genreArray.map(genre => this.addLookup('genre', genre)));
        return results.filter(id => id !== null);
    }

    // Convert styles array to lookup IDs
    async convertStylesToLookups(styleArray) {
        const results = await Promise.all(styleArray.map(style => this.addLookup('style', style)));
        return results.filter(id => id !== null);
    }

    // Load portfolio projects and convert them
    async loadAndConvertPortfolioProjects() {
        try {
            // Load manifest to get project list
            const manifestResponse = await fetch('../../_data/manifest.json');
            const manifest = await manifestResponse.json();
            
            console.log('Loading projects from manifest:', manifest.projects.length);

            for (const projectEntry of manifest.projects) {
                try {
                    // Extract filename from project entry
                    const projectFile = projectEntry.file || projectEntry;
                    console.log(`Attempting to load: ${projectFile}`);
                    
                    const projectResponse = await fetch(`../../_data/projects/${projectFile}`);
                    if (!projectResponse.ok) {
                        console.warn(`HTTP ${projectResponse.status} for ${projectFile}`);
                        continue;
                    }
                    
                    const project = await projectResponse.json();
                    
                    // Set current project title for dialog
                    if (typeof window !== 'undefined' && window.currentProjectTitle !== undefined) {
                        window.currentProjectTitle = project.title || 'Unknown Project';
                    }
                    
                    const ppmsProject = await this.convertProject(project);
                    this.ppmsData.projects.push(ppmsProject);
                    
                    console.log(`✓ Converted: ${project.title}`);
                } catch (error) {
                    console.warn(`✗ Failed to load project ${projectEntry.file || projectEntry}:`, error);
                    // Continue with next project instead of stopping
                }
            }

            return this.ppmsData;
        } catch (error) {
            console.error('Error loading portfolio projects:', error);
            throw error;
        }
    }

    // Save PPMS data to file
    async savePPMSData() {
        try {
            // For now, we'll use localStorage to store the data
            // and provide a download link for manual saving
            const dataStr = JSON.stringify(this.ppmsData, null, 2);
            localStorage.setItem('ppmsData', dataStr);
            
            // Create download link
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'portfolio-data.json';
            a.textContent = 'Download Updated PPMS Data';
            a.style.display = 'block';
            a.style.margin = '10px 0';
            a.style.padding = '10px';
            a.style.backgroundColor = '#28a745';
            a.style.color = 'white';
            a.style.textDecoration = 'none';
            a.style.borderRadius = '5px';
            a.style.textAlign = 'center';
            
            // Add to page
            const container = document.querySelector('.container');
            container.appendChild(a);
            
            console.log('PPMS data prepared for download');
            return true;
        } catch (error) {
            console.error('Error saving PPMS data:', error);
            return false;
        }
    }

    // Load saved PPMS data from localStorage
    loadSavedData() {
        const savedData = localStorage.getItem('ppmsData');
        if (savedData) {
            try {
                this.ppmsData = JSON.parse(savedData);
                console.log('Loaded saved PPMS data');
                return true;
            } catch (error) {
                console.error('Error loading saved data:', error);
                return false;
            }
        }
        return false;
    }

    // Enable lookup dialog for debugging
    enableLookupDialog(dialogFunction) {
        this.showLookupDialog = dialogFunction;
    }

    // Disable lookup dialog
    disableLookupDialog() {
        this.showLookupDialog = null;
    }

    // Generate conversion report
    generateReport() {
        const report = {
            totalProjects: this.ppmsData.projects.length,
            totalLookups: this.ppmsData.lookups.length,
            lookupBreakdown: {},
            projects: this.ppmsData.projects.map(p => ({
                id: p.id,
                title: p.title,
                year: p.year,
                status: p.status
            }))
        };

        // Count lookups by type
        this.ppmsData.lookups.forEach(lookup => {
            if (!report.lookupBreakdown[lookup.type]) {
                report.lookupBreakdown[lookup.type] = 0;
            }
            report.lookupBreakdown[lookup.type]++;
        });

        return report;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioToPPMSConverter;
} 