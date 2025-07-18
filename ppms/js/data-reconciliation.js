/**
 * PPMS Data Reconciliation Script
 * Audits and reconciles data between PPMS and portfolio site
 */

class DataReconciliation {
    constructor() {
        this.portfolioPath = '../..';
        this.ppmsDataPath = 'data/portfolio-data.json';
        this.manifestPath = `${this.portfolioPath}/_data/manifest.json`;
        this.projectsPath = `${this.portfolioPath}/_data/projects`;
        
        this.portfolioProjects = [];
        this.ppmsProjects = [];
        this.reconciliationReport = {
            totalPortfolioProjects: 0,
            totalPPMSProjects: 0,
            missingInPPMS: [],
            missingInPortfolio: [],
            duplicates: [],
            formatIssues: [],
            syncStatus: 'unknown'
        };
    }

    async performFullReconciliation() {
        console.log('🔍 Starting data reconciliation...');
        
        try {
            // Load data from both sources
            await this.loadPortfolioData();
            await this.loadPPMSData();
            
            // Perform analysis
            this.analyzeData();
            
            // Generate report
            this.generateReport();
            
            // Update PPMS dashboard
            this.updatePPMSDashboard();
            
            console.log('✅ Data reconciliation completed');
            return this.reconciliationReport;
            
        } catch (error) {
            console.error('❌ Data reconciliation failed:', error);
            throw error;
        }
    }

    async loadPortfolioData() {
        console.log('📁 Loading portfolio data...');
        
        try {
            // Load manifest
            const manifestResponse = await fetch(this.manifestPath);
            if (!manifestResponse.ok) {
                throw new Error(`Failed to load manifest: ${manifestResponse.status}`);
            }
            
            const manifest = await manifestResponse.json();
            console.log(`📋 Manifest loaded: ${manifest.projects.length} projects listed`);
            
            // Load individual project files
            const projectPromises = manifest.projects.map(async (projectInfo) => {
                try {
                    const filePath = `${this.projectsPath}/${projectInfo.file}`;
                    const response = await fetch(filePath);
                    
                    if (!response.ok) {
                        console.warn(`⚠️ Project file not found: ${projectInfo.file}`);
                        return null;
                    }
                    
                    const project = await response.json();
                    return {
                        ...project,
                        manifestInfo: projectInfo,
                        source: 'portfolio'
                    };
                } catch (error) {
                    console.warn(`⚠️ Error loading project ${projectInfo.file}:`, error);
                    return null;
                }
            });
            
            const projectResults = await Promise.allSettled(projectPromises);
            this.portfolioProjects = projectResults
                .filter(result => result.status === 'fulfilled' && result.value !== null)
                .map(result => result.value);
            
            console.log(`📊 Portfolio projects loaded: ${this.portfolioProjects.length} valid projects`);
            
        } catch (error) {
            console.error('❌ Failed to load portfolio data:', error);
            throw error;
        }
    }

    async loadPPMSData() {
        console.log('📁 Loading PPMS data...');
        
        try {
            const response = await fetch(this.ppmsDataPath);
            if (!response.ok) {
                throw new Error(`Failed to load PPMS data: ${response.status}`);
            }
            
            const ppmsData = await response.json();
            this.ppmsProjects = ppmsData.projects || [];
            
            console.log(`📊 PPMS projects loaded: ${this.ppmsProjects.length} projects`);
            
        } catch (error) {
            console.error('❌ Failed to load PPMS data:', error);
            throw error;
        }
    }

    analyzeData() {
        console.log('🔍 Analyzing data differences...');
        
        // Update counts
        this.reconciliationReport.totalPortfolioProjects = this.portfolioProjects.length;
        this.reconciliationReport.totalPPMSProjects = this.ppmsProjects.length;
        
        // Find missing projects
        this.findMissingProjects();
        
        // Find duplicates
        this.findDuplicates();
        
        // Check format issues
        this.checkFormatIssues();
        
        // Determine sync status
        this.determineSyncStatus();
    }

    findMissingProjects() {
        // Find projects in portfolio but not in PPMS
        this.reconciliationReport.missingInPPMS = this.portfolioProjects.filter(portfolioProject => {
            return !this.ppmsProjects.some(ppmsProject => 
                ppmsProject.id === portfolioProject.id || 
                ppmsProject.title === portfolioProject.title
            );
        });
        
        // Find projects in PPMS but not in portfolio
        this.reconciliationReport.missingInPortfolio = this.ppmsProjects.filter(ppmsProject => {
            return !this.portfolioProjects.some(portfolioProject => 
                portfolioProject.id === ppmsProject.id || 
                portfolioProject.title === ppmsProject.title
            );
        });
        
        console.log(`📊 Missing in PPMS: ${this.reconciliationReport.missingInPPMS.length} projects`);
        console.log(`📊 Missing in Portfolio: ${this.reconciliationReport.missingInPortfolio.length} projects`);
    }

    findDuplicates() {
        // Check for duplicate titles in portfolio
        const portfolioTitles = this.portfolioProjects.map(p => p.title);
        const duplicateTitles = portfolioTitles.filter((title, index) => 
            portfolioTitles.indexOf(title) !== index
        );
        
        this.reconciliationReport.duplicates = duplicateTitles.map(title => {
            return this.portfolioProjects.filter(p => p.title === title);
        });
        
        console.log(`📊 Duplicates found: ${this.reconciliationReport.duplicates.length} groups`);
    }

    checkFormatIssues() {
        this.reconciliationReport.formatIssues = [];
        
        // Check portfolio projects for required fields
        this.portfolioProjects.forEach(project => {
            const issues = [];
            
            if (!project.title) issues.push('Missing title');
            if (!project.description) issues.push('Missing description');
            if (!project.medium) issues.push('Missing medium');
            if (!project.year) issues.push('Missing year');
            
            if (issues.length > 0) {
                this.reconciliationReport.formatIssues.push({
                    project: project.title || project.id,
                    issues: issues,
                    source: 'portfolio'
                });
            }
        });
        
        // Check PPMS projects for required fields
        this.ppmsProjects.forEach(project => {
            const issues = [];
            
            if (!project.title) issues.push('Missing title');
            if (!project.description) issues.push('Missing description');
            if (!project.medium) issues.push('Missing medium');
            if (!project.year) issues.push('Missing year');
            
            if (issues.length > 0) {
                this.reconciliationReport.formatIssues.push({
                    project: project.title || project.id,
                    issues: issues,
                    source: 'ppms'
                });
            }
        });
        
        console.log(`📊 Format issues found: ${this.reconciliationReport.formatIssues.length} projects`);
    }

    determineSyncStatus() {
        const isInSync = this.reconciliationReport.totalPortfolioProjects === this.reconciliationReport.totalPPMSProjects &&
                        this.reconciliationReport.missingInPPMS.length === 0 &&
                        this.reconciliationReport.missingInPortfolio.length === 0;
        
        this.reconciliationReport.syncStatus = isInSync ? 'synced' : 'out-of-sync';
        
        console.log(`📊 Sync status: ${this.reconciliationReport.syncStatus}`);
    }

    generateReport() {
        console.log('📋 Generating reconciliation report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                portfolioProjects: this.reconciliationReport.totalPortfolioProjects,
                ppmsProjects: this.reconciliationReport.totalPPMSProjects,
                syncStatus: this.reconciliationReport.syncStatus,
                issuesFound: this.reconciliationReport.missingInPPMS.length + 
                            this.reconciliationReport.missingInPortfolio.length +
                            this.reconciliationReport.duplicates.length +
                            this.reconciliationReport.formatIssues.length
            },
            details: this.reconciliationReport,
            recommendations: this.generateRecommendations()
        };
        
        // Save report
        this.saveReport(report);
        
        return report;
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.reconciliationReport.missingInPPMS.length > 0) {
            recommendations.push({
                type: 'import',
                description: `Import ${this.reconciliationReport.missingInPPMS.length} projects from portfolio to PPMS`,
                projects: this.reconciliationReport.missingInPPMS.map(p => p.title)
            });
        }
        
        if (this.reconciliationReport.missingInPortfolio.length > 0) {
            recommendations.push({
                type: 'export',
                description: `Export ${this.reconciliationReport.missingInPortfolio.length} projects from PPMS to portfolio`,
                projects: this.reconciliationReport.missingInPortfolio.map(p => p.title)
            });
        }
        
        if (this.reconciliationReport.duplicates.length > 0) {
            recommendations.push({
                type: 'cleanup',
                description: `Resolve ${this.reconciliationReport.duplicates.length} duplicate project titles`,
                duplicates: this.reconciliationReport.duplicates
            });
        }
        
        if (this.reconciliationReport.formatIssues.length > 0) {
            recommendations.push({
                type: 'validation',
                description: `Fix format issues in ${this.reconciliationReport.formatIssues.length} projects`,
                issues: this.reconciliationReport.formatIssues
            });
        }
        
        return recommendations;
    }

    async saveReport(report) {
        try {
            const reportData = JSON.stringify(report, null, 2);
            const blob = new Blob([reportData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `data-reconciliation-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            console.log('📄 Reconciliation report saved');
        } catch (error) {
            console.error('❌ Failed to save report:', error);
        }
    }

    updatePPMSDashboard() {
        console.log('📊 Updating PPMS dashboard...');
        
        // Update project counts
        const totalProjectsElement = document.getElementById('totalProjects');
        if (totalProjectsElement) {
            totalProjectsElement.textContent = this.reconciliationReport.totalPortfolioProjects;
        }
        
        // Add portfolio sync status
        this.addPortfolioSyncStatus();
        
        // Add reconciliation summary
        this.addReconciliationSummary();
    }

    addPortfolioSyncStatus() {
        // Find or create sync status element
        let syncStatusElement = document.getElementById('portfolioSyncStatus');
        if (!syncStatusElement) {
            const dashboardHeader = document.querySelector('.dashboard-header');
            if (dashboardHeader) {
                const syncContainer = document.createElement('div');
                syncContainer.className = 'sync-status-container';
                syncContainer.innerHTML = `
                    <div class="sync-status">
                        <span class="sync-indicator ${this.reconciliationReport.syncStatus}"></span>
                        <span id="portfolioSyncStatus">Portfolio: ${this.reconciliationReport.syncStatus}</span>
                    </div>
                `;
                dashboardHeader.appendChild(syncContainer);
            }
        } else {
            syncStatusElement.textContent = `Portfolio: ${this.reconciliationReport.syncStatus}`;
        }
    }

    addReconciliationSummary() {
        // Add reconciliation summary to dashboard
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (dashboardGrid) {
            const summarySection = document.createElement('section');
            summarySection.className = 'reconciliation-section';
            summarySection.innerHTML = `
                <h2><i class="fas fa-sync-alt"></i> Data Reconciliation</h2>
                <div class="reconciliation-summary">
                    <div class="summary-item">
                        <span class="label">Portfolio Projects:</span>
                        <span class="value">${this.reconciliationReport.totalPortfolioProjects}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">PPMS Projects:</span>
                        <span class="value">${this.reconciliationReport.totalPPMSProjects}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Missing in PPMS:</span>
                        <span class="value warning">${this.reconciliationReport.missingInPPMS.length}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Missing in Portfolio:</span>
                        <span class="value warning">${this.reconciliationReport.missingInPortfolio.length}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Duplicates:</span>
                        <span class="value error">${this.reconciliationReport.duplicates.length}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Format Issues:</span>
                        <span class="value error">${this.reconciliationReport.formatIssues.length}</span>
                    </div>
                </div>
                <div class="reconciliation-actions">
                    <button class="btn btn-primary" onclick="dataReconciliation.performFullReconciliation()">
                        <i class="fas fa-sync"></i> Reconcile Now
                    </button>
                    <button class="btn btn-secondary" onclick="dataReconciliation.showDetailedReport()">
                        <i class="fas fa-file-alt"></i> View Report
                    </button>
                </div>
            `;
            
            dashboardGrid.appendChild(summarySection);
        }
    }

    showDetailedReport() {
        // Create modal with detailed reconciliation report
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content reconciliation-report-modal">
                <div class="modal-header">
                    <h3>Data Reconciliation Report</h3>
                    <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="report-section">
                        <h4>Summary</h4>
                        <p>Portfolio: ${this.reconciliationReport.totalPortfolioProjects} projects</p>
                        <p>PPMS: ${this.reconciliationReport.totalPPMSProjects} projects</p>
                        <p>Status: <span class="status-${this.reconciliationReport.syncStatus}">${this.reconciliationReport.syncStatus}</span></p>
                    </div>
                    
                    ${this.reconciliationReport.missingInPPMS.length > 0 ? `
                        <div class="report-section">
                            <h4>Missing in PPMS (${this.reconciliationReport.missingInPPMS.length})</h4>
                            <ul>
                                ${this.reconciliationReport.missingInPPMS.map(p => `<li>${p.title}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${this.reconciliationReport.missingInPortfolio.length > 0 ? `
                        <div class="report-section">
                            <h4>Missing in Portfolio (${this.reconciliationReport.missingInPortfolio.length})</h4>
                            <ul>
                                ${this.reconciliationReport.missingInPortfolio.map(p => `<li>${p.title}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${this.reconciliationReport.duplicates.length > 0 ? `
                        <div class="report-section">
                            <h4>Duplicates (${this.reconciliationReport.duplicates.length})</h4>
                            <ul>
                                ${this.reconciliationReport.duplicates.map(dups => 
                                    `<li>${dups[0].title} (${dups.length} instances)</li>`
                                ).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
}

// Initialize data reconciliation
const dataReconciliation = new DataReconciliation();

// Auto-run reconciliation when PPMS loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        dataReconciliation.performFullReconciliation();
    }, 1000);
});

// Export for use in other scripts
window.dataReconciliation = dataReconciliation; 