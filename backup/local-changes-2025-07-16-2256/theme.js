// Theme JavaScript - Theme switching functionality

// Theme switching functionality
const themes = ['original', 'dark', 'ocean', 'forest', 'sunset', 'twilight', 'lavender'];

function setTheme(themeName) {
    // Remove existing theme classes
    document.body.classList.remove(...themes.map(t => `theme-${t}`));
    
    // Add the selected theme class
    document.body.classList.add(`theme-${themeName}`);
    
    // Save preference to localStorage
    localStorage.setItem('selectedTheme', themeName);
    
    // Recreate particles/waves for theme-specific animations
    if (typeof createParticles === 'function') {
        // Small delay to ensure theme class is applied
        setTimeout(() => {
            createParticles();
        }, 100);
    }
}

// Load theme from localStorage on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        setTheme(savedTheme);
        document.getElementById('theme-select').value = savedTheme;
    } else {
        // Set a default theme if none is saved
        setTheme('original');
        document.getElementById('theme-select').value = 'original';
    }
}

// Initialize theme system
function initTheme() {
    loadTheme();
}

// Export functions for use in other modules
window.setTheme = setTheme;
window.loadTheme = loadTheme;
window.initTheme = initTheme; 