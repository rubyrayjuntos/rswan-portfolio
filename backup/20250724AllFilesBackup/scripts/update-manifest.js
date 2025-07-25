#!/usr/bin/env node

/**
 * Update Project Manifest Script
 * 
 * This script scans the _data/projects directory and automatically updates
 * the manifest.json file with all found JSON files.
 * 
 * Usage: node scripts/update-manifest.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECTS_DIR = '_data/projects';
const MANIFEST_FILE = '_data/projects/manifest.json';

function updateManifest() {
    console.log('🔄 Scanning for project files...');
    
    try {
        // Read the projects directory
        const files = fs.readdirSync(PROJECTS_DIR);
        
        // Filter for JSON files (excluding manifest.json itself)
        const jsonFiles = files.filter(file => 
            file.endsWith('.json') && 
            file !== 'manifest.json' &&
            !file.startsWith('.')
        );
        
        console.log(`📁 Found ${jsonFiles.length} project files`);
        
        // Read existing manifest to preserve IDs
        let existingManifest = { projects: [] };
        if (fs.existsSync(MANIFEST_FILE)) {
            try {
                existingManifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
            } catch (error) {
                console.warn('⚠️  Could not parse existing manifest, starting fresh');
            }
        }
        
        // Create a map of existing projects by filename
        const existingProjects = new Map();
        existingManifest.projects.forEach(project => {
            existingProjects.set(project.file, project);
        });
        
        // Process each JSON file
        const projects = [];
        let nextId = 1;
        
        // Find the highest existing ID
        existingManifest.projects.forEach(project => {
            if (project.id && project.id >= nextId) {
                nextId = project.id + 1;
            }
        });
        
        jsonFiles.forEach(filename => {
            const filePath = path.join(PROJECTS_DIR, filename);
            
            try {
                // Read the project file to get basic info
                const projectData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                
                // Check if we have existing data for this file
                const existing = existingProjects.get(filename);
                
                const project = {
                    id: existing?.id || nextId++,
                    file: filename,
                    title: projectData.title || filename.replace('.json', ''),
                    medium: projectData.medium || 'unknown'
                };
                
                // Preserve any additional metadata from existing manifest
                if (existing) {
                    Object.assign(project, existing);
                }
                
                projects.push(project);
                console.log(`✅ Processed: ${project.title} (ID: ${project.id})`);
                
            } catch (error) {
                console.error(`❌ Error processing ${filename}:`, error.message);
            }
        });
        
        // Sort projects by ID
        projects.sort((a, b) => a.id - b.id);
        
        // Create new manifest
        const newManifest = {
            version: "1.0",
            lastUpdated: new Date().toISOString().split('T')[0],
            projects: projects
        };
        
        // Write the manifest file
        fs.writeFileSync(MANIFEST_FILE, JSON.stringify(newManifest, null, 2));
        
        console.log(`✅ Manifest updated with ${projects.length} projects`);
        console.log(`📄 Manifest saved to: ${MANIFEST_FILE}`);
        
        // Show summary
        console.log('\n📊 Project Summary:');
        const mediumCounts = {};
        projects.forEach(project => {
            mediumCounts[project.medium] = (mediumCounts[project.medium] || 0) + 1;
        });
        
        Object.entries(mediumCounts).forEach(([medium, count]) => {
            console.log(`   ${medium}: ${count} projects`);
        });
        
    } catch (error) {
        console.error('❌ Error updating manifest:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    updateManifest();
}

module.exports = { updateManifest }; 