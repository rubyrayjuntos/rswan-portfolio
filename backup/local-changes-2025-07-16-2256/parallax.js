// Parallax JavaScript - Particle effects and parallax functionality

// Feature detection for progressive enhancement
function supportsParallax() {
    return 'CSS' in window && 'supports' in CSS && 
           CSS.supports('transform', 'translate3d(0, 0, 0)');
}

// Create floating particles with enhanced visibility
function createParticles() {
    const particlesContainer = document.getElementById('heroParticles');
    if (!particlesContainer) {
        console.log('Particles container not found!');
        return;
    }
    
    // Check if we're in ocean theme
    const isOceanTheme = document.body.classList.contains('theme-ocean');
    const isSunsetTheme = document.body.classList.contains('theme-sunset');
    const isForestTheme = document.body.classList.contains('theme-forest');
    const isDarkTheme = document.body.classList.contains('theme-dark');
    const isTwilightTheme = document.body.classList.contains('theme-twilight');
    const isLavenderTheme = document.body.classList.contains('theme-lavender');
    
    if (isOceanTheme) {
        createOceanWaves(particlesContainer);
    } else if (isSunsetTheme) {
        createSunsetElements(particlesContainer);
    } else if (isForestTheme) {
        createForestElements(particlesContainer);
    } else if (isDarkTheme) {
        createDarkElements(particlesContainer);
    } else if (isTwilightTheme) {
        createTwilightElements(particlesContainer);
    } else if (isLavenderTheme) {
        createLavenderElements(particlesContainer);
    } else {
        createRegularParticles(particlesContainer);
    }
}

// Create specialized ocean wave animations
function createOceanWaves(container) {
    console.log('Creating ocean waves...');
    container.innerHTML = ''; // Clear existing content
    
    // Create multiple wave layers for depth
    const waveLayers = [
        { count: 3, speed: 0.5, amplitude: 40, opacity: 0.3, color: 'rgba(76, 175, 240, 0.4)' }, // Deep waves
        { count: 4, speed: 0.8, amplitude: 30, opacity: 0.5, color: 'rgba(33, 150, 243, 0.6)' }, // Mid waves
        { count: 5, speed: 1.2, amplitude: 20, opacity: 0.7, color: 'rgba(21, 101, 192, 0.8)' }, // Surface waves
        { count: 6, speed: 1.8, amplitude: 15, opacity: 0.9, color: 'rgba(255, 255, 255, 0.9)' }  // Foam waves
    ];
    
    waveLayers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
            const wave = document.createElement('div');
            wave.className = 'ocean-wave';
            
            // Position waves across the screen
            const xPos = (i / layer.count) * 100;
            const yPos = 50 + (layerIndex * 10) + (Math.random() * 20 - 10); // Stagger layers
            
            wave.style.cssText = `
                position: absolute;
                left: ${xPos}%;
                top: ${yPos}%;
                width: 200px;
                height: 4px;
                background: ${layer.color};
                border-radius: 50%;
                opacity: ${layer.opacity};
                animation: waveFloat ${15 + layer.speed * 10}s linear infinite;
                animation-delay: ${i * 2 + layerIndex * 3}s;
                transform: translateX(-50%);
                filter: blur(1px);
                z-index: ${10 - layerIndex};
            `;
            
            container.appendChild(wave);
        }
    });
    
    // Add some floating sea elements
    createSeaElements(container);
    
    console.log('Ocean waves created!');
}

// Create specialized sunset animations
function createSunsetElements(container) {
    console.log('Creating sunset elements...');
    container.innerHTML = ''; // Clear existing content
    
    // Create the sun
    const sun = document.createElement('div');
    sun.className = 'sunset-sun';
    sun.style.cssText = `
        position: absolute;
        top: 20%;
        left: 50%;
        width: 120px;
        height: 120px;
        background: radial-gradient(circle, #ff6b35 0%, #f7931e 30%, #ffd700 60%, rgba(255, 215, 0, 0.8) 100%);
        border-radius: 50%;
        transform: translateX(-50%);
        box-shadow: 
            0 0 60px rgba(255, 107, 53, 0.8),
            0 0 120px rgba(255, 215, 0, 0.6),
            0 0 180px rgba(255, 107, 53, 0.4);
        z-index: 10;
        animation: sunGlow 8s ease-in-out infinite;
    `;
    container.appendChild(sun);
    
    // Create multiple cloud layers
    const cloudLayers = [
        { count: 3, speed: 0.3, opacity: 0.4, scale: 1.2, color: 'rgba(255, 255, 255, 0.9)' }, // High clouds
        { count: 4, speed: 0.6, opacity: 0.6, scale: 1, color: 'rgba(255, 182, 193, 0.8)' },   // Mid clouds (pink)
        { count: 5, speed: 0.9, opacity: 0.8, scale: 0.8, color: 'rgba(255, 160, 122, 0.7)' }  // Low clouds (orange)
    ];
    
    cloudLayers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'sunset-cloud';
            
            const xPos = (i / layer.count) * 120 - 10; // Spread across screen
            const yPos = 15 + (layerIndex * 8) + (Math.random() * 10 - 5);
            const size = 80 + Math.random() * 60;
            
            cloud.style.cssText = `
                position: absolute;
                left: ${xPos}%;
                top: ${yPos}%;
                width: ${size}px;
                height: ${size * 0.6}px;
                background: ${layer.color};
                border-radius: 50px;
                opacity: ${layer.opacity};
                animation: cloudDrift ${20 + layer.speed * 10}s linear infinite;
                animation-delay: ${i * 3 + layerIndex * 2}s;
                transform: scale(${layer.scale});
                filter: blur(2px);
                z-index: ${8 - layerIndex};
            `;
            
            container.appendChild(cloud);
        }
    });
    
    // Create atmospheric particles (dust, light rays)
    createAtmosphericEffects(container);
    
    // Create horizon line
    const horizon = document.createElement('div');
    horizon.className = 'sunset-horizon';
    horizon.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, 
            rgba(255, 107, 53, 0.8) 0%, 
            rgba(255, 182, 193, 0.6) 25%, 
            rgba(255, 160, 122, 0.7) 50%, 
            rgba(255, 182, 193, 0.6) 75%, 
            rgba(255, 107, 53, 0.8) 100%);
        z-index: 5;
        box-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
    `;
    container.appendChild(horizon);
    
    console.log('Sunset elements created!');
}

// Create specialized forest animations
function createForestElements(container) {
    console.log('Creating forest elements...');
    container.innerHTML = ''; // Clear existing content
    
    // Create multiple tree layers for depth
    const treeLayers = [
        { count: 3, speed: 0.2, height: 120, opacity: 0.3, color: '#1b5e20' }, // Far trees (dark)
        { count: 4, speed: 0.4, height: 100, opacity: 0.5, color: '#2e7d32' }, // Mid trees
        { count: 5, speed: 0.6, height: 80, opacity: 0.7, color: '#388e3c' },   // Near trees
        { count: 6, speed: 0.8, height: 60, opacity: 0.9, color: '#4caf50' }    // Close trees (bright)
    ];
    
    treeLayers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
            const tree = document.createElement('div');
            tree.className = 'forest-tree';
            
            const xPos = (i / layer.count) * 120 - 10; // Spread across screen
            const treeHeight = layer.height + Math.random() * 40;
            const swayDelay = Math.random() * 4;
            
            tree.style.cssText = `
                position: absolute;
                left: ${xPos}%;
                bottom: -${treeHeight}px;
                width: ${treeHeight * 0.3}px;
                height: ${treeHeight}px;
                background: linear-gradient(to top, ${layer.color} 0%, ${layer.color} 60%, #2e7d32 100%);
                opacity: ${layer.opacity};
                animation: treeSway ${8 + layer.speed * 4}s ease-in-out infinite;
                animation-delay: ${swayDelay}s;
                transform-origin: bottom;
                z-index: ${10 - layerIndex};
                border-radius: ${treeHeight * 0.15}px ${treeHeight * 0.15}px 0 0;
            `;
            
            // Add tree trunk
            const trunk = document.createElement('div');
            trunk.className = 'tree-trunk';
            trunk.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: ${treeHeight * 0.08}px;
                height: ${treeHeight * 0.2}px;
                background: linear-gradient(to top, #5d4037 0%, #8d6e63 100%);
                border-radius: 2px;
                z-index: 1;
            `;
            tree.appendChild(trunk);
            
            container.appendChild(tree);
        }
    });
    
    // Create forest floor elements
    createForestFloor(container);
    
    // Create atmospheric mist
    createForestMist(container);
    
    console.log('Forest elements created!');
}

// Create specialized dark/cosmic animations
function createDarkElements(container) {
    console.log('Creating dark cosmic elements...');
    container.innerHTML = ''; // Clear existing content
    
    // Create nebula clouds
    const nebulaLayers = [
        { count: 2, speed: 0.3, opacity: 0.2, color: 'rgba(0, 188, 212, 0.4)', scale: 1.5 }, // Cyan nebula
        { count: 3, speed: 0.5, opacity: 0.3, color: 'rgba(156, 39, 176, 0.5)', scale: 1.2 }, // Purple nebula
        { count: 2, speed: 0.7, opacity: 0.4, color: 'rgba(255, 64, 129, 0.6)', scale: 1.0 }  // Pink nebula
    ];
    
    nebulaLayers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
            const nebula = document.createElement('div');
            nebula.className = 'cosmic-nebula';
            
            const xPos = (i / layer.count) * 120 - 10;
            const yPos = 20 + (layerIndex * 15) + (Math.random() * 20 - 10);
            const size = 200 + Math.random() * 150;
            
            nebula.style.cssText = `
                position: absolute;
                left: ${xPos}%;
                top: ${yPos}%;
                width: ${size}px;
                height: ${size * 0.6}px;
                background: radial-gradient(ellipse, ${layer.color} 0%, transparent 70%);
                border-radius: 50%;
                opacity: ${layer.opacity};
                animation: nebulaFloat ${25 + layer.speed * 10}s ease-in-out infinite;
                animation-delay: ${i * 4 + layerIndex * 3}s;
                transform: scale(${layer.scale});
                filter: blur(8px);
                z-index: ${8 - layerIndex};
            `;
            
            container.appendChild(nebula);
        }
    });
    
    // Create cosmic particles (stars)
    createCosmicStars(container);
    
    // Create aurora effects
    createAuroraEffects(container);
    
    // Create cosmic dust
    createCosmicDust(container);
    
    console.log('Dark cosmic elements created!');
}

// Create specialized twilight/city animations
function createTwilightElements(container) {
    console.log('Creating twilight city elements...');
    container.innerHTML = ''; // Clear existing content
    
    // Create building silhouettes
    const buildingLayers = [
        { count: 4, height: 80, opacity: 0.3, color: '#2c3e50' }, // Far buildings
        { count: 6, height: 100, opacity: 0.5, color: '#34495e' }, // Mid buildings
        { count: 8, height: 120, opacity: 0.7, color: '#2c3e50' }, // Near buildings
        { count: 10, height: 140, opacity: 0.9, color: '#34495e' }  // Close buildings
    ];
    
    buildingLayers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
            const building = document.createElement('div');
            building.className = 'twilight-building';
            
            const xPos = (i / layer.count) * 120 - 10;
            const buildingHeight = layer.height + Math.random() * 40;
            const buildingWidth = 20 + Math.random() * 30;
            
            building.style.cssText = `
                position: absolute;
                left: ${xPos}%;
                bottom: -${buildingHeight}px;
                width: ${buildingWidth}px;
                height: ${buildingHeight}px;
                background: linear-gradient(to top, ${layer.color} 0%, #1a252f 100%);
                opacity: ${layer.opacity};
                z-index: ${10 - layerIndex};
                border-radius: 5px 5px 0 0;
            `;
            
            // Add glowing windows
            createBuildingWindows(building, buildingWidth, buildingHeight, layerIndex);
            
            container.appendChild(building);
        }
    });
    
    // Create street lights
    createStreetLights(container);
    
    // Create atmospheric effects
    createTwilightAtmosphere(container);
    
    console.log('Twilight city elements created!');
}

// Create specialized lavender/floral animations
function createLavenderElements(container) {
    console.log('Creating lavender floral elements...');
    container.innerHTML = ''; // Clear existing content
    
    // Create lavender flowers
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
            const size = layer.size + Math.random() * 20;
            const swayDelay = Math.random() * 4;
            
            flower.style.cssText = `
                position: absolute;
                left: ${xPos}%;
                top: ${yPos}%;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, ${layer.color} 0%, rgba(147, 112, 219, 0.6) 70%);
                border-radius: 50%;
                opacity: ${layer.opacity};
                animation: flowerSway ${8 + layer.speed * 4}s ease-in-out infinite;
                animation-delay: ${swayDelay}s;
                z-index: ${10 - layerIndex};
                filter: blur(1px);
            `;
            
            // Add flower petals
            createFlowerPetals(flower, size, layer.color);
            
            container.appendChild(flower);
        }
    });
    
    // Create floating petals
    createFloatingPetals(container);
    
    // Create ethereal glow effects
    createEtherealGlow(container);
    
    // Create gentle breeze particles
    createGentleBreeze(container);
    
    console.log('Lavender floral elements created!');
}

// Create flower petals
function createFlowerPetals(flower, size, color) {
    const petalCount = 6;
    const petalSize = size * 0.3;
    
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'flower-petal';
        
        const angle = (i / petalCount) * 360;
        const xPos = Math.cos(angle * Math.PI / 180) * (size * 0.4);
        const yPos = Math.sin(angle * Math.PI / 180) * (size * 0.4);
        
        petal.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            width: ${petalSize}px;
            height: ${petalSize * 0.6}px;
            background: radial-gradient(ellipse, ${color} 0%, rgba(147, 112, 219, 0.4) 70%);
            border-radius: 50% 50% 0 50%;
            transform: translate(-50%, -50%) rotate(${angle}deg);
            z-index: 1;
            animation: petalSway ${6 + Math.random() * 3}s ease-in-out infinite;
            animation-delay: ${i * 0.5}s;
        `;
        
        flower.appendChild(petal);
    }
}

// Create floating petals
function createFloatingPetals(container) {
    for (let i = 0; i < 25; i++) {
        const petal = document.createElement('div');
        petal.className = 'floating-petal';
        
        const size = 8 + Math.random() * 12;
        const xPos = Math.random() * 100;
        const delay = Math.random() * 10;
        const colors = ['#e6e6fa', '#d8bfd8', '#dda0dd', '#9370db'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        petal.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size * 0.6}px;
            background: radial-gradient(ellipse, ${color} 0%, rgba(147, 112, 219, 0.6) 70%);
            border-radius: 50% 50% 0 50%;
            animation: petalFloat ${12 + Math.random() * 8}s linear infinite;
            animation-delay: ${delay}s;
            z-index: 5;
            transform: rotate(${Math.random() * 360}deg);
        `;
        
        container.appendChild(petal);
    }
}

// Create ethereal glow effects
function createEtherealGlow(container) {
    for (let i = 0; i < 8; i++) {
        const glow = document.createElement('div');
        glow.className = 'ethereal-glow';
        
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;
        const size = 100 + Math.random() * 150;
        const delay = Math.random() * 8;
        
        glow.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            top: ${yPos}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(147, 112, 219, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            animation: glowPulse ${10 + Math.random() * 5}s ease-in-out infinite;
            animation-delay: ${delay}s;
            z-index: 3;
            filter: blur(8px);
        `;
        
        container.appendChild(glow);
    }
}

// Create gentle breeze particles
function createGentleBreeze(container) {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'breeze-particle';
        
        const size = Math.random() * 3 + 1;
        const xPos = Math.random() * 100;
        const delay = Math.random() * 15;
        
        particle.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(147, 112, 219, 0.8) 0%, rgba(230, 230, 250, 0.4) 70%);
            border-radius: 50%;
            animation: breezeFloat ${18 + Math.random() * 12}s linear infinite;
            animation-delay: ${delay}s;
            z-index: 4;
        `;
        
        container.appendChild(particle);
    }
}

// Create glowing windows on buildings
function createBuildingWindows(building, width, height, layerIndex) {
    const windowRows = Math.floor(height / 20);
    const windowCols = Math.floor(width / 8);
    
    for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
            if (Math.random() > 0.3) { // 70% chance of window being lit
                const window = document.createElement('div');
                window.className = 'building-window';
                
                const windowSize = 3 + Math.random() * 2;
                const xPos = (col / windowCols) * width;
                const yPos = height - (row * 20) - 10;
                const isLit = Math.random() > 0.2;
                
                window.style.cssText = `
                    position: absolute;
                    left: ${xPos}px;
                    top: ${yPos}px;
                    width: ${windowSize}px;
                    height: ${windowSize}px;
                    background: ${isLit ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
                    border-radius: 1px;
                    animation: ${isLit ? 'windowFlicker' : 'none'} ${3 + Math.random() * 4}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 5}s;
                    z-index: 1;
                `;
                
                building.appendChild(window);
            }
        }
    }
}

// Create street lights
function createStreetLights(container) {
    for (let i = 0; i < 8; i++) {
        const light = document.createElement('div');
        light.className = 'street-light';
        
        const xPos = (i / 8) * 100;
        const lightHeight = 60 + Math.random() * 20;
        const delay = i * 0.5;
        
        light.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            bottom: -${lightHeight}px;
            width: 4px;
            height: ${lightHeight}px;
            background: linear-gradient(to top, #34495e 0%, #2c3e50 100%);
            z-index: 8;
        `;
        
        // Add light bulb
        const bulb = document.createElement('div');
        bulb.className = 'light-bulb';
        bulb.style.cssText = `
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 12px;
            height: 12px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 193, 7, 0.6) 70%);
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(255, 193, 7, 0.8);
            animation: lightPulse ${4 + Math.random() * 2}s ease-in-out infinite;
            animation-delay: ${delay}s;
            z-index: 9;
        `;
        
        light.appendChild(bulb);
        container.appendChild(light);
    }
}

// Create twilight atmospheric effects
function createTwilightAtmosphere(container) {
    // Create light pollution
    for (let i = 0; i < 15; i++) {
        const pollution = document.createElement('div');
        pollution.className = 'light-pollution';
        
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 60;
        const size = 50 + Math.random() * 100;
        const delay = Math.random() * 10;
        
        pollution.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            top: ${yPos}%;
            width: ${size}px;
            height: ${size * 0.3}px;
            background: radial-gradient(ellipse, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            animation: pollutionDrift ${20 + Math.random() * 10}s linear infinite;
            animation-delay: ${delay}s;
            z-index: 3;
            filter: blur(3px);
        `;
        
        container.appendChild(pollution);
    }
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'twilight-particle';
        
        const size = Math.random() * 3 + 1;
        const xPos = Math.random() * 100;
        const delay = Math.random() * 15;
        
        particle.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 193, 7, 0.3) 70%);
            border-radius: 50%;
            animation: twilightParticleFloat ${15 + Math.random() * 10}s linear infinite;
            animation-delay: ${delay}s;
            z-index: 4;
        `;
        
        container.appendChild(particle);
    }
}

// Create cosmic stars with twinkling effects
function createCosmicStars(container) {
    const starTypes = [
        { count: 20, size: 2, color: 'rgba(255, 255, 255, 0.9)', twinkleSpeed: 3 }, // Bright stars
        { count: 15, size: 1.5, color: 'rgba(0, 188, 212, 0.8)', twinkleSpeed: 4 },  // Cyan stars
        { count: 12, size: 1, color: 'rgba(156, 39, 176, 0.7)', twinkleSpeed: 5 },   // Purple stars
        { count: 8, size: 3, color: 'rgba(255, 193, 7, 0.9)', twinkleSpeed: 2 }      // Golden stars
    ];
    
    starTypes.forEach((starType, typeIndex) => {
        for (let i = 0; i < starType.count; i++) {
            const star = document.createElement('div');
            star.className = 'cosmic-star';
            
            const xPos = Math.random() * 100;
            const yPos = Math.random() * 100;
            const delay = Math.random() * 10;
            
            star.style.cssText = `
                position: absolute;
                left: ${xPos}%;
                top: ${yPos}%;
                width: ${starType.size}px;
                height: ${starType.size}px;
                background: ${starType.color};
                border-radius: 50%;
                box-shadow: 0 0 ${starType.size * 2}px ${starType.color};
                animation: starTwinkle ${starType.twinkleSpeed}s ease-in-out infinite;
                animation-delay: ${delay}s;
                z-index: ${10 - typeIndex};
            `;
            
            container.appendChild(star);
        }
    });
}

// Create aurora borealis effects
function createAuroraEffects(container) {
    for (let i = 0; i < 3; i++) {
        const aurora = document.createElement('div');
        aurora.className = 'cosmic-aurora';
        
        const colors = [
            'linear-gradient(90deg, rgba(0, 188, 212, 0.3) 0%, rgba(156, 39, 176, 0.3) 50%, rgba(255, 64, 129, 0.3) 100%)',
            'linear-gradient(90deg, rgba(156, 39, 176, 0.3) 0%, rgba(255, 64, 129, 0.3) 50%, rgba(255, 193, 7, 0.3) 100%)',
            'linear-gradient(90deg, rgba(0, 188, 212, 0.3) 0%, rgba(255, 193, 7, 0.3) 50%, rgba(156, 39, 176, 0.3) 100%)'
        ];
        
        const yPos = 30 + (i * 20);
        const delay = i * 2;
        
        aurora.style.cssText = `
            position: absolute;
            top: ${yPos}%;
            left: -10%;
            width: 120%;
            height: 60px;
            background: ${colors[i]};
            border-radius: 30px;
            animation: auroraWave ${12 + i * 2}s ease-in-out infinite;
            animation-delay: ${delay}s;
            z-index: 6;
            filter: blur(4px);
            opacity: 0.6;
        `;
        
        container.appendChild(aurora);
    }
}

// Create cosmic dust particles
function createCosmicDust(container) {
    for (let i = 0; i < 25; i++) {
        const dust = document.createElement('div');
        dust.className = 'cosmic-dust';
        
        const size = Math.random() * 2 + 0.5;
        const xPos = Math.random() * 100;
        const delay = Math.random() * 15;
        
        dust.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(0, 188, 212, 0.3) 70%);
            border-radius: 50%;
            animation: cosmicDustFloat ${20 + Math.random() * 10}s linear infinite;
            animation-delay: ${delay}s;
            z-index: 4;
        `;
        
        container.appendChild(dust);
    }
}

// Create forest floor elements
function createForestFloor(container) {
    // Create ground cover
    for (let i = 0; i < 12; i++) {
        const ground = document.createElement('div');
        ground.className = 'forest-ground';
        
        const xPos = Math.random() * 100;
        const size = 20 + Math.random() * 30;
        
        ground.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            bottom: 0;
            width: ${size}px;
            height: ${size * 0.3}px;
            background: linear-gradient(to top, #2e7d32 0%, #4caf50 100%);
            border-radius: 50% 50% 0 0;
            opacity: 0.6;
            z-index: 2;
        `;
        
        container.appendChild(ground);
    }
    
    // Create fallen leaves
    for (let i = 0; i < 15; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'forest-leaf';
        
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 20;
        const size = 8 + Math.random() * 12;
        const delay = Math.random() * 6;
        
        leaf.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            bottom: ${yPos}%;
            width: ${size}px;
            height: ${size * 0.6}px;
            background: linear-gradient(45deg, #8bc34a 0%, #689f38 100%);
            border-radius: 50% 0 50% 0;
            opacity: 0.7;
            animation: leafFloat ${10 + Math.random() * 5}s ease-in-out infinite;
            animation-delay: ${delay}s;
            z-index: 3;
        `;
        
        container.appendChild(leaf);
    }
}

// Create atmospheric mist between trees
function createForestMist(container) {
    for (let i = 0; i < 8; i++) {
        const mist = document.createElement('div');
        mist.className = 'forest-mist';
        
        const xPos = Math.random() * 100;
        const yPos = 20 + Math.random() * 60;
        const width = 100 + Math.random() * 150;
        const delay = Math.random() * 8;
        
        mist.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            top: ${yPos}%;
            width: ${width}px;
            height: 40px;
            background: linear-gradient(90deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.3) 50%, 
                rgba(255, 255, 255, 0.1) 100%);
            border-radius: 20px;
            opacity: 0.4;
            animation: mistDrift ${15 + Math.random() * 10}s linear infinite;
            animation-delay: ${delay}s;
            z-index: 5;
            filter: blur(3px);
        `;
        
        container.appendChild(mist);
    }
}

// Create atmospheric effects for sunset
function createAtmosphericEffects(container) {
    // Create light rays
    for (let i = 0; i < 8; i++) {
        const ray = document.createElement('div');
        ray.className = 'sunset-ray';
        
        const angle = (i / 8) * 360;
        const xPos = 50 + Math.cos(angle * Math.PI / 180) * 30;
        const yPos = 20 + Math.sin(angle * Math.PI / 180) * 20;
        const length = 200 + Math.random() * 100;
        
        ray.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            top: ${yPos}%;
            width: 2px;
            height: ${length}px;
            background: linear-gradient(to bottom, 
                rgba(255, 215, 0, 0.8) 0%, 
                rgba(255, 182, 193, 0.4) 50%, 
                rgba(255, 160, 122, 0.2) 100%);
            transform: rotate(${angle}deg);
            transform-origin: top;
            opacity: 0.6;
            animation: rayFade ${6 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${i * 0.5}s;
            z-index: 6;
        `;
        
        container.appendChild(ray);
    }
    
    // Create floating dust particles
    for (let i = 0; i < 20; i++) {
        const dust = document.createElement('div');
        dust.className = 'sunset-dust';
        
        const size = Math.random() * 3 + 1;
        const xPos = Math.random() * 100;
        const delay = Math.random() * 10;
        
        dust.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(255, 182, 193, 0.8) 0%, rgba(255, 160, 122, 0.4) 70%);
            border-radius: 50%;
            animation: dustFloat ${12 + Math.random() * 8}s linear infinite;
            animation-delay: ${delay}s;
            z-index: 4;
        `;
        
        container.appendChild(dust);
    }
}

// Create floating sea elements (bubbles, seaweed, etc.)
function createSeaElements(container) {
    // Create bubbles
    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'sea-bubble';
        
        const size = Math.random() * 8 + 4;
        const xPos = Math.random() * 100;
        const delay = Math.random() * 10;
        
        bubble.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            bottom: -20px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 70%);
            border-radius: 50%;
            animation: bubbleRise ${8 + Math.random() * 4}s linear infinite;
            animation-delay: ${delay}s;
            z-index: 5;
        `;
        
        container.appendChild(bubble);
    }
    
    // Create seaweed elements
    for (let i = 0; i < 8; i++) {
        const seaweed = document.createElement('div');
        seaweed.className = 'seaweed';
        
        const xPos = Math.random() * 100;
        const height = 60 + Math.random() * 40;
        const swayDelay = Math.random() * 4;
        
        seaweed.style.cssText = `
            position: absolute;
            left: ${xPos}%;
            bottom: -${height}px;
            width: 3px;
            height: ${height}px;
            background: linear-gradient(to top, rgba(76, 175, 80, 0.8), rgba(76, 175, 80, 0.3));
            border-radius: 2px;
            animation: seaweedSway 6s ease-in-out infinite;
            animation-delay: ${swayDelay}s;
            transform-origin: bottom;
            z-index: 3;
        `;
        
        container.appendChild(seaweed);
    }
}

// Create regular particles (existing functionality)
function createRegularParticles(container) {
    console.log('Creating regular particles...');
    const particleCount = 80; // Increased count
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random sizes for variety
        const size = Math.random() * 4 + 4; // 4-8px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random animation delays and durations
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        
        // Random opacity for depth - make more visible for testing
        particle.style.opacity = Math.random() * 0.3 + 0.7; // Higher opacity for testing
        
        container.appendChild(particle);
    }
    
    console.log(`Created ${particleCount} particles. Container now has ${container.children.length} children.`);
}

// Create journey particles
function createJourneyParticles(container) {
    if (!container) return;
    
    const particleCount = 100; // More particles for better visibility
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'journey-particle';
        
        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random sizes for variety
        const size = Math.random() * 4 + 4; // 4-8px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random animation delays and durations
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
        
        // Higher opacity for better visibility
        particle.style.opacity = Math.random() * 0.6 + 0.4;
        
        container.appendChild(particle);
    }
}

// Initialize parallax effects
function initParallax() {
    console.log('Initializing parallax effects...');
    console.log('supportsParallax():', supportsParallax());
    console.log('window.motionEnabled:', window.motionEnabled);
    
    // Force enable motion for testing
    if (window.motionEnabled === undefined) {
        window.motionEnabled = true;
        console.log('Motion was undefined, setting to true');
    }
    
    if (supportsParallax() && window.motionEnabled) {
        console.log('Creating particles from initParallax...');
        createParticles();
    } else {
        console.log('Parallax not supported or motion disabled');
        // Force create particles anyway for testing
        console.log('Forcing particle creation for testing...');
        createParticles();
    }
}

// Test function to manually create particles
function testParticles() {
    console.log('=== PARTICLE TEST ===');
    console.log('Container exists:', !!document.getElementById('heroParticles'));
    console.log('Motion enabled:', window.motionEnabled);
    console.log('Parallax supported:', supportsParallax());
    createParticles();
    console.log('=== END TEST ===');
}

// Export functions for use in other modules
window.createParticles = createParticles;
window.createJourneyParticles = createJourneyParticles;
window.initParallax = initParallax;
window.supportsParallax = supportsParallax;
window.testParticles = testParticles; 