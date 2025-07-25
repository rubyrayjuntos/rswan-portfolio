const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, '..', '_data', 'projects');
const manifestPath = path.join(projectsDir, 'manifest.json');

try {
    const allFiles = fs.readdirSync(projectsDir);

    const projectFiles = allFiles.filter(file => {
        const filePath = path.join(projectsDir, file);
        return fs.statSync(filePath).isFile() && file.endsWith('.json') && file !== 'manifest.json';
    });

    const manifestData = projectFiles.map(file => `_data/projects/${file}`);

    fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2));

    console.log(`✅ Manifest generated successfully at ${manifestPath}`);
    console.log(`Found ${manifestData.length} projects.`);

} catch (error) {
    console.error('Error generating project manifest:', error);
} 