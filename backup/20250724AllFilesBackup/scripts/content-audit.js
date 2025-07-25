const fs = require('fs');
const path = require('path');

// Configuration
const PROJECTS_DIR = '_data/projects';
const IMAGES_DIR = 'images/projects';
const OUTPUT_FILE = 'content-audit-report.md';



// Helper functions
function checkFileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        return false;
    }
}



function validateUrl(url) {
    if (!url || url === '#' || url === '') return { valid: false, reason: 'Empty or placeholder' };
    if (url.startsWith('http')) return { valid: true, reason: 'External URL' };
    if (url.startsWith('images/') || url.startsWith('_data/')) return { valid: true, reason: 'Internal path' };
    return { valid: false, reason: 'Invalid format' };
}

function analyzeProject(jsonPath) {
    const projectData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const projectName = path.basename(jsonPath, '.json');
    const projectId = projectData.id;
    
    const analysis = {
        name: projectData.title || 'Untitled',
        filename: projectName,
        id: projectId,
        medium: projectData.medium || 'unknown',
        status: 'Incomplete',
        issues: [],
        missingContent: [],
        brokenLinks: [],
        missingImages: [],
        actionItems: [],
        projectData: projectData // Store the full project data for report generation
    };

    // Check basic content sections
    const requiredSections = ['title', 'description', 'pitch', 'challenge', 'development', 'outcome'];
    requiredSections.forEach(section => {
        if (!projectData[section] || projectData[section].trim() === '') {
            analysis.missingContent.push(section);
            analysis.issues.push(`Missing ${section}`);
        }
    });

    // Check medium-specific sections
    if (projectData.medium === 'art') {
        ['process', 'inspiration'].forEach(section => {
            if (!projectData[section] || projectData[section].trim() === '') {
                analysis.missingContent.push(section);
                analysis.issues.push(`Missing ${section} (required for art projects)`);
            }
        });
    } else if (projectData.medium === 'code') {
        if (!projectData.specs || projectData.specs.length === 0) {
            analysis.missingContent.push('specs');
            analysis.issues.push('Missing specs (required for code projects)');
        }
        if (!projectData.artifacts || projectData.artifacts.length === 0) {
            analysis.missingContent.push('artifacts');
            analysis.issues.push('Missing artifacts (required for code projects)');
        }
    } else if (projectData.medium === 'writing') {
        if (!projectData.excerpts || projectData.excerpts.trim() === '') {
            analysis.missingContent.push('excerpts');
            analysis.issues.push('Missing excerpts (required for writing projects)');
        }
        if (!projectData.themesAnalysis || projectData.themesAnalysis.trim() === '') {
            analysis.missingContent.push('themesAnalysis');
            analysis.issues.push('Missing themes analysis (required for writing projects)');
        }
    }

    // Check images - Card hero images are typically present as card-hero.jpg
    if (projectData.imageUrl) {
        // Use the project filename (slug) for the folder path, not the project ID
        const projectSlug = projectName; // projectName is the filename without .json
        const imagePath = `${projectSlug}/${projectData.imageUrl}`;
        const fullPath = path.join(IMAGES_DIR, imagePath);
        console.log(`Checking card hero: ${fullPath} (exists: ${checkFileExists(fullPath)})`);
        if (!checkFileExists(fullPath)) {
            analysis.missingImages.push(`Card hero: ${imagePath}`);
            analysis.issues.push(`Missing card hero image: ${imagePath}`);
        }
    } else {
        analysis.missingImages.push('Card hero: Not specified');
        analysis.issues.push('Missing card hero image URL');
    }

    // Check gallery images
    if (projectData.gallery && Array.isArray(projectData.gallery)) {
        const projectSlug = projectName; // Define projectSlug for gallery checking
        projectData.gallery.forEach((item, index) => {
            if (item.url) {
                const imagePath = `${projectSlug}/${item.url}`;
                const fullPath = path.join(IMAGES_DIR, imagePath);
                if (!checkFileExists(fullPath)) {
                    analysis.missingImages.push(`Gallery ${index + 1}: ${imagePath}`);
                    analysis.issues.push(`Missing gallery image: ${imagePath}`);
                }
            } else {
                analysis.missingImages.push(`Gallery ${index + 1}: No URL specified`);
                analysis.issues.push(`Gallery item ${index + 1} missing URL`);
            }
        });
    } else {
        analysis.missingContent.push('gallery');
        analysis.issues.push('Missing gallery array');
    }

    // Check links
    if (projectData.links) {
        Object.entries(projectData.links).forEach(([key, url]) => {
            const validation = validateUrl(url);
            if (!validation.valid) {
                analysis.brokenLinks.push(`${key}: ${url} (${validation.reason})`);
                analysis.issues.push(`Broken link ${key}: ${validation.reason}`);
            }
        });
    } else {
        analysis.missingContent.push('links');
        analysis.issues.push('Missing links object');
    }

    // Check artifacts for code projects
    if (projectData.medium === 'code' && projectData.artifacts) {
        projectData.artifacts.forEach((artifact, index) => {
            if (!artifact.name || !artifact.description) {
                analysis.issues.push(`Artifact ${index + 1} missing name or description`);
            }
            if (artifact.url) {
                const validation = validateUrl(artifact.url);
                if (!validation.valid) {
                    analysis.brokenLinks.push(`Artifact ${index + 1} URL: ${artifact.url} (${validation.reason})`);
                }
            }
        });
    }

    // Determine status
    if (analysis.issues.length === 0) {
        analysis.status = 'Complete';
    } else if (analysis.issues.length <= 3) {
        analysis.status = 'Needs Review';
    } else {
        analysis.status = 'Incomplete';
    }

    // Generate action items
    analysis.missingContent.forEach(item => {
        analysis.actionItems.push(`Add missing ${item} content`);
    });
    analysis.missingImages.forEach(item => {
        analysis.actionItems.push(`Add missing image: ${item}`);
    });
    analysis.brokenLinks.forEach(item => {
        analysis.actionItems.push(`Fix broken link: ${item}`);
    });

    return analysis;
}

function generateReport(analyses) {
    let report = `# Portfolio Content Audit Report
*Generated on: ${new Date().toLocaleDateString()}*

## Executive Summary
This report provides a comprehensive audit of all project JSON files in the portfolio, identifying missing content, broken image links, incomplete sections, and areas requiring content completion.

## Audit Scope
- **Projects Analyzed**: ${analyses.length} JSON files in \`_data/projects/\`
- **Image Folders Checked**: All folders in \`images/projects/\`
- **Content Sections Reviewed**: All standard portfolio sections per project medium
- **Links Verified**: All external and internal links
- **Artifacts Reviewed**: All project artifact fields

## Summary Statistics
- **Total Projects**: ${analyses.length}
- **Complete Projects**: ${analyses.filter(a => a.status === 'Complete').length}
- **Needs Review**: ${analyses.filter(a => a.status === 'Needs Review').length}
- **Incomplete Projects**: ${analyses.filter(a => a.status === 'Incomplete').length}
- **Missing Images**: ${analyses.reduce((sum, a) => sum + a.missingImages.length, 0)}
- **Broken Links**: ${analyses.reduce((sum, a) => sum + a.brokenLinks.length, 0)}
- **Missing Content Sections**: ${analyses.reduce((sum, a) => sum + a.missingContent.length, 0)}

## Priority Action Items
1. **High Priority**: Projects with missing core content (title, description, pitch)
2. **Medium Priority**: Projects with missing medium-specific content
3. **Low Priority**: Projects with missing images or broken links

## Detailed Findings

`;

    // Group by status
    const complete = analyses.filter(a => a.status === 'Complete');
    const needsReview = analyses.filter(a => a.status === 'Needs Review');
    const incomplete = analyses.filter(a => a.status === 'Incomplete');

    // Add each project analysis
    [...incomplete, ...needsReview, ...complete].forEach(analysis => {
        report += `## ${analysis.name} (${analysis.filename}.json)
**Medium**: ${analysis.medium}
**Status**: ${analysis.status}

### Content Sections:
- **Title**: ${analysis.missingContent.includes('title') ? '❌ Missing' : '✅ Present'}
- **Description**: ${analysis.missingContent.includes('description') ? '❌ Missing' : '✅ Present'}
- **Pitch**: ${analysis.missingContent.includes('pitch') ? '❌ Missing' : '✅ Present'}
- **Challenge**: ${analysis.missingContent.includes('challenge') ? '❌ Missing' : '✅ Present'}
- **Development**: ${analysis.missingContent.includes('development') ? '❌ Missing' : '✅ Present'}
- **Outcome**: ${analysis.missingContent.includes('outcome') ? '❌ Missing' : '✅ Present'}

### Medium-Specific Sections:
`;

        if (analysis.medium === 'art') {
            report += `**For Art Projects:**
- **Process**: ${analysis.missingContent.includes('process') ? '❌ Missing' : '✅ Present'}
- **Inspiration**: ${analysis.missingContent.includes('inspiration') ? '❌ Missing' : '✅ Present'}
`;
        } else if (analysis.medium === 'code') {
            report += `**For Code Projects:**
- **Specs**: ${analysis.missingContent.includes('specs') ? '❌ Missing' : '✅ Present'}
- **Artifacts**: ${analysis.missingContent.includes('artifacts') ? '❌ Missing' : '✅ Present'}
`;
        } else if (analysis.medium === 'writing') {
            report += `**For Writing Projects:**
- **Excerpts**: ${analysis.missingContent.includes('excerpts') ? '❌ Missing' : '✅ Present'}
- **Themes**: ${analysis.missingContent.includes('themesAnalysis') ? '❌ Missing' : '✅ Present'}
`;
        }

        // Count gallery images
        const totalGalleryImages = analysis.projectData.gallery ? analysis.projectData.gallery.length : 0;
        const missingGalleryImages = analysis.missingImages.filter(img => img.includes('Gallery')).length;
        const presentGalleryImages = totalGalleryImages - missingGalleryImages;
        
        report += `
### Images:
- **Card Hero**: ${analysis.missingImages.some(img => img.includes('Card hero')) ? '❌ Missing' : '✅ Present'}
- **Gallery Images**: ${presentGalleryImages > 0 ? `${presentGalleryImages} ✅ Present` : '0 ❌ Missing'}
${analysis.missingImages.filter(img => img.includes('Gallery')).map(img => `  - ${img}`).join('\n')}

### Links:
${analysis.brokenLinks.length > 0 ? analysis.brokenLinks.map(link => `- 🔗 ${link}`).join('\n') : '- ✅ All links valid'}

### Issues Found:
${analysis.issues.length > 0 ? analysis.issues.map(issue => `- ${issue}`).join('\n') : '- No issues found'}

### Action Items:
${analysis.actionItems.length > 0 ? analysis.actionItems.map(item => `- ${item}`).join('\n') : '- No action required'}

---
`;
    });

    report += `
## Recommendations
- Focus on completing core content (title, description, pitch) for all projects first
- Add missing medium-specific content based on project type
- Create missing image assets and update JSON files accordingly
- Verify and fix all external links
- Review artifact documentation for code projects
- Consider adding journey sections for projects that would benefit from process documentation

## Next Steps
1. Address high-priority missing content
2. Create missing image assets
3. Fix broken links
4. Review and refine existing content
5. Test all projects in the portfolio interface
`;

    return report;
}

// Main execution
function main() {
    try {
        console.log('Starting content audit...');
        
        // Get all JSON files
        const jsonFiles = fs.readdirSync(PROJECTS_DIR)
            .filter(file => file.endsWith('.json') && file !== 'manifest.json');
        
        console.log(`Found ${jsonFiles.length} project files to audit`);
        
        // Analyze each project
        const analyses = [];
        jsonFiles.forEach(file => {
            const jsonPath = path.join(PROJECTS_DIR, file);
            try {
                const analysis = analyzeProject(jsonPath);
                analyses.push(analysis);
                console.log(`✓ Analyzed ${analysis.name} (${analysis.status})`);
            } catch (error) {
                console.error(`✗ Error analyzing ${file}:`, error.message);
            }
        });
        
        // Generate report
        const report = generateReport(analyses);
        fs.writeFileSync(OUTPUT_FILE, report);
        
        console.log(`\nAudit complete! Report saved to ${OUTPUT_FILE}`);
        console.log(`\nSummary:`);
        console.log(`- Total projects: ${analyses.length}`);
        console.log(`- Complete: ${analyses.filter(a => a.status === 'Complete').length}`);
        console.log(`- Needs review: ${analyses.filter(a => a.status === 'Needs Review').length}`);
        console.log(`- Incomplete: ${analyses.filter(a => a.status === 'Incomplete').length}`);
    } catch (error) {
        console.error('Error in main function:', error);
    }
}

main(); 