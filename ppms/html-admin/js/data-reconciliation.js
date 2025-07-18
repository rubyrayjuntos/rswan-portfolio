/**
 * Data Reconciliation System
 * Compares PPMS data with portfolio data to identify sync issues
 */

class DataReconciliation {
    constructor() {
        this.ppmsData = null;
        this.portfolioData = null;
        this.manifest = null;
    }

    async performFullReconciliation() {
        try {
            console.log('Starting data reconciliation...');
            
            // Load both data sources
            await this.loadPPMSData();
            await this.loadPortfolioData();
            
            // Perform analysis
            const report = {
                summary: this.generateSummary(),
                missingProjects: this.findMissingProjects(),
                duplicateProjects: this.findDuplicateProjects(),
                formatIssues: this.findFormatIssues(),
                recommendations: this.generateRecommendations()
            };
            
            console.log('Reconciliation completed:', report.summary);
            return report;
            
        } catch (error) {
            console.error('Reconciliation failed:', error);
            throw new Error(`Reconciliation failed: ${error.message}`);
        }
    }

    async loadPPMSData() {
        try {
            const response = await fetch('html-admin/data/portfolio-data.json');
            if (!response.ok) {
                throw new Error(`Failed to load PPMS data: ${response.status} ${response.statusText}`);
            }
            this.ppmsData = await response.json();
            console.log('PPMS data loaded:', this.ppmsData.projects?.length || 0, 'projects');
        } catch (error) {
            console.error('Error loading PPMS data:', error);
            // Create empty data structure if file doesn't exist
            this.ppmsData = {
                projects: [],
                lookups: [],
                version: "1.0.0",
                last_updated: new Date().toISOString()
            };
        }
    }

    async loadPortfolioData() {
        try {
            // Load manifest
            const manifestResponse = await fetch('../../_data/manifest.json');
            if (!manifestResponse.ok) {
                throw new Error(`Failed to load portfolio manifest: ${manifestResponse.status}`);
            }
            this.manifest = await manifestResponse.json();
            
            // Load all project files
            this.portfolioData = {
                projects: [],
                manifest: this.manifest
            };
            
            if (this.manifest.projects && this.manifest.projects.length > 0) {
                for (const projectRef of this.manifest.projects) {
                    try {
                        // Try the exact filename first
                        let projectResponse = await fetch(`../../_data/projects/${projectRef.file}`);
                        
                        // If that fails, try without the numbered prefix
                        if (!projectResponse.ok) {
                            const filenameWithoutPrefix = projectRef.file.replace(/^\d+-/, '');
                            projectResponse = await fetch(`../../_data/projects/${filenameWithoutPrefix}`);
                        }
                        
                        // If that fails, try cleaning up the filename (remove extra dashes)
                        if (!projectResponse.ok) {
                            const cleanFilename = projectRef.file.replace(/^\d+-/, '').replace(/-+/g, '-');
                            projectResponse = await fetch(`../../_data/projects/${cleanFilename}`);
                        }
                        
                        // If that fails, try with just the title as filename
                        if (!projectResponse.ok) {
                            const titleFilename = projectRef.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.json';
                            projectResponse = await fetch(`../../_data/projects/${titleFilename}`);
                        }
                        
                        if (projectResponse.ok) {
                            const project = await projectResponse.json();
                            project.source = 'portfolio';
                            project.file = projectRef.file;
                            project.manifestId = projectRef.id;
                            this.portfolioData.projects.push(project);
                        } else {
                            console.warn(`Failed to load project file: ${projectRef.file}`);
                            // Add a placeholder project for missing files
                            this.portfolioData.projects.push({
                                id: projectRef.id,
                                title: projectRef.title,
                                description: `[Missing file: ${projectRef.file}]`,
                                source: 'portfolio',
                                file: projectRef.file,
                                manifestId: projectRef.id,
                                missing: true
                            });
                        }
                    } catch (error) {
                        console.warn(`Error loading project ${projectRef.file}:`, error);
                        // Add a placeholder project for error cases
                        this.portfolioData.projects.push({
                            id: projectRef.id,
                            title: projectRef.title,
                            description: `[Error loading: ${projectRef.file}]`,
                            source: 'portfolio',
                            file: projectRef.file,
                            manifestId: projectRef.id,
                            error: true
                        });
                    }
                }
            }
            
            console.log('Portfolio data loaded:', this.portfolioData.projects.length, 'projects');
            
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            this.portfolioData = {
                projects: [],
                manifest: null
            };
        }
    }

    generateSummary() {
        const ppmsProjects = this.ppmsData.projects?.length || 0;
        const portfolioProjects = this.portfolioData.projects?.length || 0;
        const missingProjects = this.findMissingProjects().length;
        const duplicateProjects = this.findDuplicateProjects().length;
        const formatIssues = this.findFormatIssues().length;
        
        return {
            totalProjects: Math.max(ppmsProjects, portfolioProjects),
            ppmsProjects,
            portfolioProjects,
            missingProjects,
            duplicateProjects,
            formatIssues,
            lastUpdated: new Date().toISOString()
        };
    }

    findMissingProjects() {
        const missing = [];
        
        // Find projects in PPMS but not in portfolio
        if (this.ppmsData.projects) {
            for (const ppmsProject of this.ppmsData.projects) {
                const found = this.portfolioData.projects.find(p => 
                    this.normalizeProjectId(p) === this.normalizeProjectId(ppmsProject)
                );
                if (!found) {
                    missing.push({
                        id: ppmsProject.id,
                        title: ppmsProject.title,
                        description: ppmsProject.description,
                        source: 'ppms',
                        type: 'missing_in_portfolio'
                    });
                }
            }
        }
        
        // Find projects in portfolio but not in PPMS
        if (this.portfolioData.projects) {
            for (const portfolioProject of this.portfolioData.projects) {
                const found = this.ppmsData.projects?.find(p => 
                    this.normalizeProjectId(p) === this.normalizeProjectId(portfolioProject)
                );
                if (!found) {
                    missing.push({
                        id: portfolioProject.id || portfolioProject.title,
                        title: portfolioProject.title,
                        description: portfolioProject.description,
                        source: 'portfolio',
                        type: 'missing_in_ppms',
                        file: portfolioProject.file
                    });
                }
            }
        }
        
        return missing;
    }

    findDuplicateProjects() {
        const duplicates = [];
        const seen = new Map();
        
        // Check for duplicates within PPMS
        if (this.ppmsData.projects) {
            for (const project of this.ppmsData.projects) {
                const normalizedId = this.normalizeProjectId(project);
                if (seen.has(normalizedId)) {
                    const existing = seen.get(normalizedId);
                    if (!duplicates.find(group => group.some(p => p.id === existing.id))) {
                        duplicates.push([existing, project]);
                    }
                } else {
                    seen.set(normalizedId, project);
                }
            }
        }
        
        // Check for duplicates within portfolio
        seen.clear();
        if (this.portfolioData.projects) {
            for (const project of this.portfolioData.projects) {
                const normalizedId = this.normalizeProjectId(project);
                if (seen.has(normalizedId)) {
                    const existing = seen.get(normalizedId);
                    if (!duplicates.find(group => group.some(p => p.id === existing.id))) {
                        duplicates.push([existing, project]);
                    }
                } else {
                    seen.set(normalizedId, project);
                }
            }
        }
        
        return duplicates;
    }

    findFormatIssues() {
        const issues = [];
        
        // Check PPMS projects for format issues
        if (this.ppmsData.projects) {
            for (const project of this.ppmsData.projects) {
                const projectIssues = this.validateProjectFormat(project, 'ppms');
                issues.push(...projectIssues);
            }
        }
        
        // Check portfolio projects for format issues
        if (this.portfolioData.projects) {
            for (const project of this.portfolioData.projects) {
                const projectIssues = this.validateProjectFormat(project, 'portfolio');
                issues.push(...projectIssues);
            }
        }
        
        return issues;
    }

    validateProjectFormat(project, source) {
        const issues = [];
        
        // Check required fields
        if (!project.title) {
            issues.push({
                projectId: project.id || 'unknown',
                projectTitle: project.title || 'Untitled',
                field: 'title',
                description: 'Missing required title field',
                source,
                severity: 'error'
            });
        }
        
        if (!project.description) {
            issues.push({
                projectId: project.id || 'unknown',
                projectTitle: project.title || 'Untitled',
                field: 'description',
                description: 'Missing required description field',
                source,
                severity: 'error'
            });
        }
        
        // Check for empty arrays that should have content
        if (project.technologies && Array.isArray(project.technologies) && project.technologies.length === 0) {
            issues.push({
                projectId: project.id || 'unknown',
                projectTitle: project.title || 'Untitled',
                field: 'technologies',
                description: 'Technologies array is empty',
                source,
                severity: 'warning'
            });
        }
        
        if (project.genres && Array.isArray(project.genres) && project.genres.length === 0) {
            issues.push({
                projectId: project.id || 'unknown',
                projectTitle: project.title || 'Untitled',
                field: 'genres',
                description: 'Genres array is empty',
                source,
                severity: 'warning'
            });
        }
        
        // Check for invalid URLs
        if (project.image_url && !this.isValidUrl(project.image_url)) {
            issues.push({
                projectId: project.id || 'unknown',
                projectTitle: project.title || 'Untitled',
                field: 'image_url',
                description: 'Invalid image URL format',
                source,
                severity: 'warning'
            });
        }
        
        return issues;
    }

    generateRecommendations() {
        const recommendations = [];
        const summary = this.generateSummary();
        
        // Recommend sync if there are missing projects
        if (summary.missingProjects > 0) {
            recommendations.push({
                id: 'sync_missing',
                title: 'Sync Missing Projects',
                description: `${summary.missingProjects} projects are missing from one system. Consider importing them to maintain consistency.`,
                priority: 'high',
                action: 'sync'
            });
        }
        
        // Recommend duplicate cleanup
        if (summary.duplicateProjects > 0) {
            recommendations.push({
                id: 'clean_duplicates',
                title: 'Clean Up Duplicates',
                description: `${summary.duplicateProjects} duplicate projects found. Review and merge or remove duplicates.`,
                priority: 'medium',
                action: 'cleanup'
            });
        }
        
        // Recommend format fixes
        if (summary.formatIssues > 0) {
            recommendations.push({
                id: 'fix_format',
                title: 'Fix Format Issues',
                description: `${summary.formatIssues} format issues detected. Fix required fields and validate data.`,
                priority: 'medium',
                action: 'fix'
            });
        }
        
        // Recommend regular sync if systems are out of sync
        if (summary.ppmsProjects !== summary.portfolioProjects) {
            recommendations.push({
                id: 'regular_sync',
                title: 'Establish Regular Sync',
                description: 'Project counts differ between systems. Consider setting up automated synchronization.',
                priority: 'high',
                action: 'automate'
            });
        }
        
        // Recommend data validation
        if (summary.totalProjects > 0) {
            recommendations.push({
                id: 'validate_data',
                title: 'Validate All Data',
                description: 'Run comprehensive validation on all project data to ensure quality and consistency.',
                priority: 'low',
                action: 'validate'
            });
        }
        
        return recommendations;
    }

    normalizeProjectId(project) {
        // Create a normalized ID for comparison
        const title = (project.title || '').toString().toLowerCase().trim();
        const id = (project.id || '').toString().toLowerCase().trim();
        
        // Use title if available, otherwise use ID
        return title || id;
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Utility method to get detailed project comparison
    getProjectComparison(projectId) {
        const ppmsProject = this.ppmsData.projects?.find(p => p.id === projectId);
        const portfolioProject = this.portfolioData.projects?.find(p => 
            this.normalizeProjectId(p) === this.normalizeProjectId({ id: projectId })
        );
        
        return {
            ppms: ppmsProject,
            portfolio: portfolioProject,
            differences: this.findProjectDifferences(ppmsProject, portfolioProject)
        };
    }

    findProjectDifferences(ppmsProject, portfolioProject) {
        const differences = [];
        
        if (!ppmsProject || !portfolioProject) {
            return differences;
        }
        
        const fields = ['title', 'description', 'year', 'medium', 'technologies', 'genres', 'image_url'];
        
        for (const field of fields) {
            const ppmsValue = ppmsProject[field];
            const portfolioValue = portfolioProject[field];
            
            if (JSON.stringify(ppmsValue) !== JSON.stringify(portfolioValue)) {
                differences.push({
                    field,
                    ppms: ppmsValue,
                    portfolio: portfolioValue
                });
            }
        }
        
        return differences;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataReconciliation;
} 