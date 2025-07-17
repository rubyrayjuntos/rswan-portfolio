// Parallax JavaScript - Particle effects and parallax functionality

// Feature detection for progressive enhancement
function supportsParallax() {
    return 'CSS' in window && 'supports' in CSS && 
           CSS.supports('transform', 'translate3d(0, 0, 0)');
}

// Create theme-specific particles based on current theme
function createParticles() {
    const particlesContainer = document.getElementById('heroParticles');
    if (!particlesContainer) return;
    
    // Check current theme
    const currentTheme = getCurrentTheme();
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    // Create theme-specific particles
    switch (currentTheme) {
        case 'lavender':
            createLavenderElements(particlesContainer);
            break;
        case 'ocean':
            createOceanWaves(particlesContainer);
            break;
        case 'sunset':
            createSunsetElements(particlesContainer);
            break;
        case 'forest':
            createForestElements(particlesContainer);
            break;
        case 'dark':
            createDarkElements(particlesContainer);
            break;
        case 'twilight':
            createTwilightElements(particlesContainer);
            break;
        default:
            createDefaultParticles(particlesContainer);
            break;
    }
}

// Helper function to get current theme
function getCurrentTheme() {
    const classList = document.body.classList;
    for (let className of classList) {
        if (className.startsWith('theme-')) {
            return className.replace('theme-', '');
        }
    }
    return 'original';
}

// Create default floating particles
function createDefaultParticles(container) {
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const size = Math.random() * 4 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        
        container.appendChild(particle);
    }
}

// Create specialized lavender/floral animations
function createLavenderElements(container) {
    console.log('Creating lavender floral elements...');
    container.innerHTML = ''; // Clear existing content

    // Create lavender flowers (the main "blobs" that will now look more like abstract flower forms)
    const flowerLayers = [
        { count: 6, size: 40, opacity: 0.3, color: '#e6e6fa', speed: 0.3 }, // Far flowers (light lavender)
        { count: 8, size: 50, opacity: 0.5, color: '#d8bfd8', speed: 0.5 }, // Mid flowers (medium lavender)
        { count: 10, size: 60, opacity: 0.7, color: '#dda0dd', speed: 0.7 }, // Near flowers (plum)
        { count: 12, size: 70, opacity: 0.9, color: '#9370db', speed: 0.9 }  // Close flowers (medium purple)
    ];

    flowerLayers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
            const flower = document.createElement('div');
            flower.className = 'lavender-flower';

            const xPos = (i / layer.count) * 120 - 10;
            const yPos = 20 + (layerIndex * 15) + (Math.random() * 20 - 10);
            const size = layer.size + Math.random() * 20; // Randomize size for natural feel
            const swayDelay = Math.random() * 4;

            flower.style.cssText = `
                position: absolute;
                left: ${xPos}%;
                top: ${yPos}%;
                width: ${size}px;
                height: ${size}px;
                /* Softer radial gradient for the main flower 'head', with more transparency at edge */
                background: radial-gradient(circle at center, ${layer.color} 0%, rgba(147, 112, 219, 0.2) 70%, transparent 100%);
                border-radius: 50%; /* Keep it round for the central part */
                opacity: ${layer.opacity};
                animation: flowerSway ${8 + layer.speed * 4}s ease-in-out infinite;
                animation-delay: ${swayDelay}s;
                z-index: ${10 - layerIndex};
                filter: blur(1px); /* Keep subtle blur */
            `;

            // Add more defined petals to the main flower form
            createFlowerPetals(flower, size, layer.color);

            container.appendChild(flower);
        }
    });

    // Create floating petals (these are the true 'particles' that look like petals, drifting freely)
    createFloatingPetals(container);

    // Create ethereal glow effects (these add the soft, mystical atmosphere)
    createEtherealGlow(container);

    // Create gentle breeze particles (these add subtle motion cues)
    createGentleBreeze(container);

    console.log('Lavender floral elements created!');
}

// Function to create more realistic flower petals, attached to the main flower div
function createFlowerPetals(flower, flowerSize, baseColor) {
    const petalCount = 6; // Number of petals around the central flower
    const petalBaseSize = flowerSize * 0.2; // Base size relative to the main flower
    // Petal color variations, blending from base to darker lavender tones
    const petalColors = [baseColor, 'rgba(147, 112, 219, 0.8)', 'rgba(103, 58, 183, 0.6)'];

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'flower-petal';

        const angle = (i / petalCount) * 360; // Position petals evenly around the center
        const size = petalBaseSize + (Math.random() * petalBaseSize * 0.5); // Randomize petal size slightly
        const color = petalColors[Math.floor(Math.random() * petalColors.length)];

        petal.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            width: ${size}px;
            height: ${size * 1.5}px; /* Make petals more elongated and pointed */
            /* Linear gradient for a more defined, less blobby form */
            background: linear-gradient(to bottom right, ${color}, rgba(147, 112, 219, 0.2));
            /* Custom border-radius for a more organic petal shape: top-left, top-right, bottom-right, bottom-left */
            border-radius: 50% 50% 10% 10%; /* Rounded top, slightly pointed bottom */
            transform-origin: center bottom; /* Rotate from the base of the petal */
            /* Position around the center of the main flower, with a slight offset */
            transform: translate(-50%, -50%) rotate(${angle}deg) translateY(${flowerSize * 0.2}px);
            opacity: 0.9;
            z-index: 1;
            filter: blur(0.5px); /* Very slight blur to soften edges, make it ethereal */
            animation: petalSway ${6 + Math.random() * 3}s ease-in-out infinite;
            animation-delay: ${i * 0.5}s;
            --petal-angle: ${angle}deg; /* Pass angle as CSS variable for animation */
        `;

        flower.appendChild(petal);
    }
}

// Create floating petals (these are the true 'particles' that look like petals, drifting freely)
function createFloatingPetals(container) {
    for (let i = 0; i < 25; i++) {
        const petal = document.createElement('div');
        petal.className = 'floating-petal';

        const size = 8 + Math.random() * 12; // Size of floating petals
        const xPos = Math.random() * 100;
        const delay = Math.random() * 10;
        const colors = ['#e6e6fa', '#d8bfd8', '#dda0dd', '#9370db']; // Lavender color palette for floating petals
        const color = colors[Math.floor(Math.random() * colors.length)];

        petal.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size * 1.5}px; /* Elongated floating petal */
            background: linear-gradient(to bottom right, ${color}, rgba(147, 112, 219, 0.4));
            border-radius: 50% 50% 10% 10%; /* Consistent petal shape for floating elements */
            animation: petalFloat ${12 + Math.random() * 8}s linear infinite;
            animation-delay: ${delay}s;
            z-index: 5;
            transform: rotate(${Math.random() * 360}deg); /* Random initial rotation for natural drift */
            filter: blur(0.5px); /* Soft blur for ethereal feel */
        `;

        container.appendChild(petal);
    }
}

// Create ethereal glow effects
function createEtherealGlow(container) {
    for (let i = 0; i < 8; i++) {
        const glow = document.createElement('div');
        glow.className = 'ethereal-glow';
        
        const size = 100 + Math.random() * 200;
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;
        
        glow.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            top: ${yPos}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(221, 160, 221, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            animation: etherealFloat ${15 + Math.random() * 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            z-index: 1;
        `;
        
        container.appendChild(glow);
    }
}

// Create gentle breeze particles
function createGentleBreeze(container) {
    for (let i = 0; i < 15; i++) {
        const breeze = document.createElement('div');
        breeze.className = 'gentle-breeze';
        
        const size = 2 + Math.random() * 3;
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;
        
        breeze.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            top: ${yPos}%;
            width: ${size}px;
            height: ${size}px;
            background: rgba(230, 230, 250, 0.6);
            border-radius: 50%;
            animation: breezeFloat ${8 + Math.random() * 6}s linear infinite;
            animation-delay: ${Math.random() * 4}s;
            z-index: 3;
        `;
        
        container.appendChild(breeze);
    }
}

// Placeholder functions for other themes (these would be implemented similarly)
function createOceanWaves(container) {
    // Ocean theme implementation would go here
    createDefaultParticles(container);
}

function createSunsetElements(container) {
    // Sunset theme implementation would go here
    createDefaultParticles(container);
}

function createForestElements(container) {
    // Forest theme implementation would go here
    createDefaultParticles(container);
}

function createDarkElements(container) {
    // Dark theme implementation would go here
    createDefaultParticles(container);
}

function createTwilightElements(container) {
    // Twilight theme implementation would go here
    createDefaultParticles(container);
}

// Create journey particles
function createJourneyParticles(container) {
    if (!container) return;
    
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'journey-particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const size = Math.random() * 4 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
        particle.style.opacity = Math.random() * 0.6 + 0.4;
        
        container.appendChild(particle);
    }
}

// Initialize parallax effects
function initParallax() {
    if (supportsParallax() && window.motionEnabled) {
        createParticles();
    }
}

// Test function for debugging particles
function testParticles() {
    console.log('Testing particle creation...');
    createParticles();
}

// Export functions for use in other modules
window.createParticles = createParticles;
window.createJourneyParticles = createJourneyParticles;
window.initParallax = initParallax;
window.supportsParallax = supportsParallax;
window.testParticles = testParticles;
window.createLavenderElements = createLavenderElements; 