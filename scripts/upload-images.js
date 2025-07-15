const fs = require('fs');
const path = require('path');

// Configuration
const IMAGES_DIR = './images/uploads/projects';
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

/**
 * Lists all available project images
 */
function listProjectImages() {
    const projects = {};
    
    if (!fs.existsSync(IMAGES_DIR)) {
        console.log('No images directory found. Creating...');
        fs.mkdirSync(IMAGES_DIR, { recursive: true });
        return projects;
    }
    
    const projectDirs = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    projectDirs.forEach(projectName => {
        const projectPath = path.join(IMAGES_DIR, projectName);
        const files = fs.readdirSync(projectPath)
            .filter(file => SUPPORTED_FORMATS.includes(path.extname(file).toLowerCase()));
        
        projects[projectName] = files.map(file => ({
            filename: file,
            path: `./images/uploads/projects/${projectName}/${file}`,
            fullPath: path.join(projectPath, file)
        }));
    });
    
    return projects;
}

/**
 * Creates a new project directory and moves images there
 */
function createProject(projectName, imageFiles) {
    const projectDir = path.join(IMAGES_DIR, projectName);
    
    if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
        console.log(`Created project directory: ${projectDir}`);
    }
    
    // Move images to project directory
    imageFiles.forEach(imageFile => {
        if (fs.existsSync(imageFile)) {
            const filename = path.basename(imageFile);
            const destPath = path.join(projectDir, filename);
            
            // Copy file to project directory
            fs.copyFileSync(imageFile, destPath);
            console.log(`Moved ${filename} to ${projectDir}`);
        } else {
            console.log(`Warning: ${imageFile} not found`);
        }
    });
}

/**
 * Generates HTML image tags for a project
 */
function generateImageHTML(projectName) {
    const projects = listProjectImages();
    const projectImages = projects[projectName];
    
    if (!projectImages) {
        console.log(`No images found for project: ${projectName}`);
        return '';
    }
    
    return projectImages.map(img => 
        `<img src="${img.path}" alt="${projectName} - ${img.filename}" style="max-width: 100%; height: auto; margin: 10px 0;">`
    ).join('\n');
}

/**
 * Updates the main portfolio data with image paths
 */
function updatePortfolioData() {
    const projects = listProjectImages();
    const portfolioData = [];
    
    Object.keys(projects).forEach(projectName => {
        const images = projects[projectName];
        if (images.length > 0) {
            portfolioData.push({
                project: projectName,
                mainImage: images[0].path,
                gallery: images.map(img => ({
                    url: img.path,
                    title: img.filename.replace(/\.[^/.]+$/, ""), // Remove extension
                    description: `${projectName} image`,
                    dimensions: "auto"
                }))
            });
        }
    });
    
    return portfolioData;
}

// CLI Commands
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
    case 'list':
        console.log('Available project images:');
        console.log(JSON.stringify(listProjectImages(), null, 2));
        break;
        
    case 'create':
        if (args.length < 2) {
            console.log('Usage: node upload-images.js create <project-name> <image1> [image2] ...');
            process.exit(1);
        }
        const projectName = args[0];
        const imageFiles = args.slice(1);
        createProject(projectName, imageFiles);
        break;
        
    case 'html':
        if (args.length < 1) {
            console.log('Usage: node upload-images.js html <project-name>');
            process.exit(1);
        }
        console.log(generateImageHTML(args[0]));
        break;
        
    case 'data':
        console.log(JSON.stringify(updatePortfolioData(), null, 2));
        break;
        
    default:
        console.log(`
Image Management Script for Portfolio

Usage:
  node upload-images.js list                    - List all project images
  node upload-images.js create <project> <img1> [img2] ... - Create project and add images
  node upload-images.js html <project>          - Generate HTML for project images
  node upload-images.js data                    - Generate portfolio data JSON

Examples:
  node upload-images.js create "ai-tarot" ./temp/tarot1.jpg ./temp/tarot2.png
  node upload-images.js html "ai-tarot"
        `);
}

module.exports = {
    listProjectImages,
    createProject,
    generateImageHTML,
    updatePortfolioData
}; 