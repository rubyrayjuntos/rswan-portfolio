// Parallax JavaScript - Defines all theme-specific particle animation functions.

(function() {
    'use strict';

    // This object will be attached to the window and will hold all our animation functions.
    const particleAnimations = {};

    // --- Default / Original Theme ---
    particleAnimations.original = function(container) {
        container.innerHTML = '';
        const particleCount = 80;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 4 + 4;
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${size}px;
                height: ${size}px;
                animation-delay: ${Math.random() * 20}s;
                animation-duration: ${Math.random() * 15 + 10}s;
                opacity: ${Math.random() * 0.5 + 0.3};
            `;
            container.appendChild(particle);
        }
    };

    // --- Dark Theme (Celestial) ---
    particleAnimations.dark = function(container) {
        container.innerHTML = '';
        const moon = document.createElement('div');
        moon.className = 'moon';
        container.appendChild(moon);

        for (let i = 0; i < 150; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2 + 1;
            star.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${size}px;
                height: ${size}px;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(star);
        }
        for (let i = 0; i < 5; i++) {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            shootingStar.style.animationDelay = `${i * 3 + Math.random() * 3}s`;
            container.appendChild(shootingStar);
        }
    };

    // --- Ocean Theme ---
    particleAnimations.ocean = function(container) {
        container.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const wave = document.createElement('div');
            wave.className = 'wave';
            wave.style.top = `${30 + (i * 10)}%`;
            wave.style.animationDuration = `${10 + i * 2}s`;
            wave.style.opacity = 0.1 + (i * 0.1);
            container.appendChild(wave);
        }
    };

    // --- Forest Theme ---
    particleAnimations.forest = function(container) {
        container.innerHTML = '';
        const treeLayers = [
            { count: 15, size: 80, z: -400, opacity: 0.7 },
            { count: 12, size: 120, z: -200, opacity: 0.8 },
            { count: 10, size: 160, z: -50, opacity: 0.9 },
            { count: 8, size: 200, z: 0, opacity: 1 }
        ];
        treeLayers.forEach(layer => {
            const layerDiv = document.createElement('div');
            layerDiv.className = 'forest-layer';
            layerDiv.style.transform = `translateZ(${layer.z}px)`;
            for (let i = 0; i < layer.count; i++) {
                const tree = document.createElement('div');
                const size = layer.size * (Math.random() * 0.5 + 0.75);
                tree.style.cssText = `
                    left: ${Math.random() * 110 - 5}%;
                    border-left: ${size / 2}px solid transparent;
                    border-right: ${size / 2}px solid transparent;
                    border-bottom: ${size}px solid rgba(255, 255, 255, ${layer.opacity});
                `;
                layerDiv.appendChild(tree);
            }
            container.appendChild(layerDiv);
        });
    };

    // --- Sunset Theme ---
    particleAnimations.sunset = function(container) {
        container.innerHTML = '';
        const sun = document.createElement('div');
        sun.className = 'sun';
        container.appendChild(sun);
        const sky = document.createElement('div');
        sky.className = 'sky';
        container.appendChild(sky);

        container.addEventListener('hero-scroll', (e) => {
            const { scrollPercent } = e.detail;
            sun.style.top = `${50 + scrollPercent * 50}%`;
            const newColors = [
                `rgba(135, 206, 235, ${1 - scrollPercent})`,
                `rgba(255, 215, 0, ${1 - scrollPercent * 0.5})`,
                '#FFA500', '#FF4500', '#8B0000'
            ];
            sky.style.background = `linear-gradient(to bottom, ${newColors.join(', ')})`;
        });
    };

    // --- Twilight Theme ---
    particleAnimations.twilight = function(container) {
        container.innerHTML = '';
        const buildingLayers = [
            { count: 8, color: '#233140', z: -500 },
            { count: 6, color: '#2C3E50', z: -250 },
            { count: 5, color: '#34495E', z: 0 }
        ];
        buildingLayers.forEach(layer => {
            const layerDiv = document.createElement('div');
            layerDiv.className = 'twilight-layer';
            layerDiv.style.transform = `translateZ(${layer.z}px)`;
            for (let i = 0; i < layer.count; i++) {
                const building = document.createElement('div');
                const width = 8 + Math.random() * 12;
                const height = 25 + Math.random() * 45;
                building.style.cssText = `
                    left: ${Math.random() * 100}%;
                    width: ${width}%;
                    height: ${height}%;
                    background-color: ${layer.color};
                `;
                const windowCount = Math.floor(width * height / 30);
                for (let j = 0; j < windowCount; j++) {
                    if (Math.random() > 0.4) {
                        const win = document.createElement('div');
                        win.className = 'window';
                        win.style.animationDelay = `${Math.random() * 3}s`;
                        building.appendChild(win);
                    }
                }
                layerDiv.appendChild(building);
            }
            container.appendChild(layerDiv);
        });
    };

    // --- Lavender Theme ---
    particleAnimations.lavender = function(container) {
        container.innerHTML = '';
        // Simplified for brevity, retaining the core idea
        for (let i = 0; i < 25; i++) {
            const petal = document.createElement('div');
            petal.className = 'floating-petal';
            const size = 8 + Math.random() * 12;
            petal.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${size}px;
                height: ${size * 1.5}px;
                animation-delay: ${Math.random() * 10}s;
            `;
            container.appendChild(petal);
        }
        for (let i = 0; i < 8; i++) {
            const glow = document.createElement('div');
            glow.className = 'ethereal-glow';
            const size = 100 + Math.random() * 200;
            glow.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${size}px;
                height: ${size}px;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(glow);
        }
    };

    // Attach the animations object to the window scope
    window.particleAnimations = particleAnimations;

})(); 