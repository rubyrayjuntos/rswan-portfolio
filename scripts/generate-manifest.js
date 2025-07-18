const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, '..', '_data', 'projects');
const manifestPath = path.join(projectsDir, 'manifest.json');

fs.readdir(projectsDir, (err, files) => {
    if (err) {
        console.error('Error reading projects directory:', err);
        return;
    }

    const projectFiles = files
        .filter(file => path.extname(file).toLowerCase() === '.json' && file !== 'manifest.json')
        .map(file => `_data/projects/${file}`);

    const manifestContent = JSON.stringify(projectFiles, null, 2);

    fs.writeFile(manifestPath, manifestContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing manifest file:', err);
            return;
        }
        console.log(`✅ Manifest file created successfully at ${manifestPath} with ${projectFiles.length} projects.`);
    });
}); 