const fs = require('fs');
const path = require('path');

// Project image mapping - you can customize this based on your actual images
const projectImages = {
    'nova-writers-conspiracy': [
        { oldName: 'nova-logo.jpg', newName: 'nova-logo-main.jpg', description: 'Main logo' },
        { oldName: 'nova-architecture.jpg', newName: 'nova-architecture-system.jpg', description: 'System architecture' },
        { oldName: 'nova-dashboard.jpg', newName: 'nova-dashboard-interface.jpg', description: 'Dashboard interface' },
        { oldName: 'nova-chat.jpg', newName: 'nova-chat-interface.jpg', description: 'Chat interface' }
    ],
    'henri-ruben': [
        { oldName: 'henri-ruben-cover.jpg', newName: 'henri-ruben-cover-art.jpg', description: 'Cover art' },
        { oldName: 'henri-ruben-characters.jpg', newName: 'henri-ruben-character-sketches.jpg', description: 'Character sketches' }
    ],
    'graphic-novel': [
        { oldName: 'graphic-novel-cover.jpg', newName: 'graphic-novel-cover-art.jpg', description: 'Cover art' },
        { oldName: 'graphic-novel-underground.jpg', newName: 'graphic-novel-underground-sequence.jpg', description: 'Underground sequence' },
        { oldName: 'graphic-novel-transformation.jpg', newName: 'graphic-novel-transformation-sequence.jpg', description: 'Transformation sequence' },
        { oldName: 'graphic-novel-cosmic.jpg', newName: 'graphic-novel-cosmic-journey.jpg', description: 'Cosmic journey' }
    ],
    'character-design': [
        { oldName: 'character-design-process.jpg', newName: 'character-design-process-overview.jpg', description: 'Process overview' },
        { oldName: 'character-sketches.jpg', newName: 'character-design-sketches.jpg', description: 'Character sketches' },
        { oldName: 'character-development.jpg', newName: 'character-design-development.jpg', description: 'Development process' },
        { oldName: 'character-expressions.jpg', newName: 'character-design-expressions.jpg', description: 'Expression studies' }
    ],
    'tarot-deck': [
        { oldName: 'tarot-deck-cover.jpg', newName: 'tarot-deck-cover-art.jpg', description: 'Deck cover' },
        { oldName: 'major-arcana-sample.jpg', newName: 'tarot-deck-major-arcana-sample.jpg', description: 'Major arcana sample' },
        { oldName: 'minor-arcana-sample.jpg', newName: 'tarot-deck-minor-arcana-sample.jpg', description: 'Minor arcana sample' },
        { oldName: 'tarot-symbols.jpg', newName: 'tarot-deck-symbolic-elements.jpg', description: 'Symbolic elements' }
    ],
    'set-design': [
        { oldName: 'set-design-overview.jpg', newName: 'set-design-overview.jpg', description: 'Design overview' },
        { oldName: 'set-character-spaces.jpg', newName: 'set-design-character-spaces.jpg', description: 'Character spaces' },
        { oldName: 'set-narrative-environments.jpg', newName: 'set-design-narrative-environments.jpg', description: 'Narrative environments' },
        { oldName: 'set-atmospheric-details.jpg', newName: 'set-design-atmospheric-details.jpg', description: 'Atmospheric details' }
    ],
    'world-bible': [
        { oldName: 'world-bible-cover.jpg', newName: 'world-bible-cover.jpg', description: 'Cover' },
        { oldName: 'world-maps.jpg', newName: 'world-bible-maps.jpg', description: 'World maps' },
        { oldName: 'world-cultures.jpg', newName: 'world-bible-cultures.jpg', description: 'Cultural systems' },
        { oldName: 'world-magic.jpg', newName: 'world-bible-magic-systems.jpg', description: 'Magic systems' }
    ],
    'sticker-pack': [
        { oldName: 'sticker-pack-overview.jpg', newName: 'sticker-pack-overview.jpg', description: 'Pack overview' },
        { oldName: 'tarot-stickers.jpg', newName: 'sticker-pack-tarot-stickers.jpg', description: 'Tarot stickers' },
        { oldName: 'astrology-stickers.jpg', newName: 'sticker-pack-astrology-stickers.jpg', description: 'Astrology stickers' },
        { oldName: 'sticker-applications.jpg', newName: 'sticker-pack-digital-applications.jpg', description: 'Digital applications' }
    ],
    'tarot-awakened': [
        { oldName: 'tarot-awakened-cover.jpg', newName: 'tarot-awakened-series-cover.jpg', description: 'Series cover' },
        { oldName: 'fool-journey.jpg', newName: 'tarot-awakened-fool-journey.jpg', description: 'Fool\'s journey' },
        { oldName: 'video-samples.jpg', newName: 'tarot-awakened-video-samples.jpg', description: 'Video samples' },
        { oldName: 'educational-content.jpg', newName: 'tarot-awakened-educational-content.jpg', description: 'Educational content' }
    ],
    'weight-of-a-name': [
        { oldName: 'weight-of-name-cover.jpg', newName: 'weight-of-name-cover-art.jpg', description: 'Cover art' },
        { oldName: 'elias-character.jpg', newName: 'weight-of-name-elias-character.jpg', description: 'Elias character study' }
    ],
    'arcana': [
        { oldName: 'arcana-cover.jpg', newName: 'arcana-cover-art.jpg', description: 'Cover art' },
        { oldName: 'arcana-characters.jpg', newName: 'arcana-character-designs.jpg', description: 'Character designs' },
        { oldName: 'arcana-cosmos.jpg', newName: 'arcana-cosmic-setting.jpg', description: 'Cosmic setting' }
    ],
    'elyra': [
        { oldName: 'elyra-cover.jpg', newName: 'elyra-cover-art.jpg', description: 'Cover art' },
        { oldName: 'elyra-journey.jpg', newName: 'elyra-fool-path.jpg', description: 'Fool\'s path' },
        { oldName: 'elyra-encounters.jpg', newName: 'elyra-key-encounters.jpg', description: 'Key encounters' }
    ],
    'brand-automation': [
        { oldName: 'brand-automation-dashboard.jpg', newName: 'brand-automation-dashboard.jpg', description: 'Dashboard' },
        { oldName: 'brand-workflow.jpg', newName: 'brand-automation-workflow.jpg', description: 'Automation workflow' },
        { oldName: 'brand-outputs.jpg', newName: 'brand-automation-generated-assets.jpg', description: 'Generated assets' }
    ],
    'asteroids': [
        { oldName: 'asteroids-gameplay.jpg', newName: 'asteroids-gameplay-screenshot.jpg', description: 'Gameplay screenshot' },
        { oldName: 'asteroids-mobile.jpg', newName: 'asteroids-mobile-interface.jpg', description: 'Mobile interface' },
        { oldName: 'asteroids-graphics.jpg', newName: 'asteroids-enhanced-graphics.jpg', description: 'Enhanced graphics' }
    ]
};

// Function to create project directories
function createProjectDirectories() {
    const baseDir = path.join(__dirname, '..', 'images', 'projects');
    
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
    }
    
    Object.keys(projectImages).forEach(projectName => {
        const projectDir = path.join(baseDir, projectName);
        if (!fs.existsSync(projectDir)) {
            fs.mkdirSync(projectDir, { recursive: true });
            console.log(`Created directory: ${projectDir}`);
        }
    });
}

// Function to generate a mapping file for manual organization
function generateImageMapping() {
    const mapping = {};
    
    Object.entries(projectImages).forEach(([projectName, images]) => {
        mapping[projectName] = {
            directory: `images/projects/${projectName}/`,
            images: images.map(img => ({
                newName: img.newName,
                description: img.description,
                suggestedOldName: img.oldName
            }))
        };
    });
    
    const mappingPath = path.join(__dirname, '..', 'image-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
    console.log(`Generated image mapping file: ${mappingPath}`);
}

// Function to update JSON files with new image paths
function updateJsonImagePaths() {
    const projectsDir = path.join(__dirname, '..', '_data', 'projects');
    
    Object.entries(projectImages).forEach(([projectName, images]) => {
        const jsonPath = path.join(projectsDir, `${projectName}.json`);
        
        if (fs.existsSync(jsonPath)) {
            const projectData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            
            // Update main image
            if (projectData.imageUrl) {
                projectData.imageUrl = `images/projects/${projectName}/${projectName}-cover-art.jpg`;
            }
            
            // Update gallery images
            if (projectData.gallery) {
                projectData.gallery = projectData.gallery.map((item, index) => {
                    if (images[index]) {
                        return {
                            ...item,
                            url: `images/projects/${projectName}/${images[index].newName}`
                        };
                    }
                    return item;
                });
            }
            
            fs.writeFileSync(jsonPath, JSON.stringify(projectData, null, 2));
            console.log(`Updated JSON file: ${jsonPath}`);
        }
    });
}

// Main execution
console.log('🚀 Image Organization Script');
console.log('============================\n');

console.log('1. Creating project directories...');
createProjectDirectories();

console.log('\n2. Generating image mapping file...');
generateImageMapping();

console.log('\n3. Updating JSON files with new image paths...');
updateJsonImagePaths();

console.log('\n✅ Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Check the generated image-mapping.json file');
console.log('2. Move your images to the appropriate project folders');
console.log('3. Rename them according to the mapping');
console.log('4. Update any missing image references in the JSON files'); 