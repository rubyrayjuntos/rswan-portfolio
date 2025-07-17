// theme.js

// Theme switching functionality
const themes = ['original', 'dark', 'ocean', 'forest', 'sunset', 'twilight', 'lavender'];

// Global variable to store motion state (initialized as true, adjusted by prefers-reduced-motion check)
window.motionEnabled = true;

function setTheme(themeName) {
    // Remove existing theme classes
    document.body.classList.remove(...themes.map(t => `theme-${t}`));

    // Add the selected theme class
    document.body.classList.add(`theme-${themeName}`);

    // Save preference to localStorage (if you still want manual override to persist)
    localStorage.setItem('selectedTheme', themeName);

    // Recreate particles/waves for theme-specific animations
    // Use a small delay to ensure theme class is applied before particle creation
    // This now accounts for the general particle creation in parallax.js
    if (typeof createParticles === 'function' && window.motionEnabled) {
        // Clear existing particles first
        const heroParticlesContainer = document.getElementById('heroParticles');
        if (heroParticlesContainer) heroParticlesContainer.innerHTML = '';
        setTimeout(() => {
            createParticles(); // Calls theme-specific particle function via parallax.js
        }, 50); // Small delay to ensure CSS variables are applied
    } else {
        console.log("Particle creation skipped: createParticles not defined or motion disabled.");
    }
}

// Function to map project mood to a theme
function getThemeFromMood(mood) {
    if (!mood) return 'original'; // Default theme if mood is not set

    switch (mood.toLowerCase()) {
        case 'innovative':
        case 'inspiring':
            return 'dark'; // Map to your desired theme for these moods
        case 'calming':
            return 'ocean';
        case 'playful':
        case 'energetic':
            return 'sunset';
        case 'professional':
        case 'structured':
            return 'original';
        case 'mystical':
            return 'lavender';
        // Add more mappings as needed for your specific moods
        case 'bold': // Example: Add new mood mappings
            return 'twilight';
        case 'ethereal':
            return 'lavender'; // Can map to existing themes
        case 'organic':
            return 'forest';
        default:
            return 'original'; // Fallback for unmapped moods
    }
}

// Load theme on page load, prioritizing project mood for detail page
function loadTheme() {
    // Determine if it's the detail page or gallery page by checking body IDs
    const isDetailPage = document.body.id === 'detail-page';
    const themeSelect = document.getElementById('theme-select'); // Get the theme dropdown

    if (isDetailPage) {
        const currentProjectJson = sessionStorage.getItem('currentProject');
        if (currentProjectJson) {
            try {
                const currentProject = JSON.parse(currentProjectJson);
                const themeToApply = getThemeFromMood(currentProject.mood);
                setTheme(themeToApply);
                if (themeSelect) themeSelect.value = themeToApply; // Update dropdown
                console.log(`Detail page: Project mood "${currentProject.mood}" mapped to theme "${themeToApply}"`);
            } catch (e) {
                console.error("Error parsing currentProject from sessionStorage:", e);
                const savedTheme = localStorage.getItem('selectedTheme');
                const theme = savedTheme || 'original';
                setTheme(theme);
                if (themeSelect) themeSelect.value = theme;
            }
        } else {
            // Fallback for detail page if no project data in session storage
            console.warn("No project data found in sessionStorage for detail page, loading default theme.");
            const savedTheme = localStorage.getItem('selectedTheme');
            const theme = savedTheme || 'original';
            setTheme(theme);
            if (themeSelect) themeSelect.value = theme;
        }
    } else {
        // For gallery page or other pages, use localStorage preference or default
        const savedTheme = localStorage.getItem('selectedTheme');
        const theme = savedTheme || 'original';
        setTheme(theme);
        if (themeSelect) themeSelect.value = theme;
    }
    // Set up prefers-reduced-motion check - IMPORTANT for accessibility
    window.motionEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.classList.toggle('motion-disabled', !window.motionEnabled); // Add/remove class based on preference
    console.log(`Motion enabled: ${window.motionEnabled}`);
}

// Initialize theme system
function initTheme() {
    loadTheme();
}

// Export functions for use in other modules
window.setTheme = setTheme;
window.loadTheme = loadTheme;
window.initTheme = initTheme;
window.getThemeFromMood = getThemeFromMood; // Export for potential debugging or future use 