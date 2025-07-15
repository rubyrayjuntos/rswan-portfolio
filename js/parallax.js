// Parallax JavaScript - Particle effects and parallax functionality

// Feature detection for progressive enhancement
function supportsParallax() {
    return 'CSS' in window && 'supports' in CSS && 
           CSS.supports('transform', 'translate3d(0, 0, 0)');
}

// Create floating particles with enhanced visibility
function createParticles() {
    const particlesContainer = document.getElementById('heroParticles');
    if (!particlesContainer) return;
    
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
        
        // Random opacity for depth
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        
        particlesContainer.appendChild(particle);
    }
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
    if (supportsParallax() && window.motionEnabled) {
        createParticles();
    }
}

// Export functions for use in other modules
window.createParticles = createParticles;
window.createJourneyParticles = createJourneyParticles;
window.initParallax = initParallax;
window.supportsParallax = supportsParallax; 