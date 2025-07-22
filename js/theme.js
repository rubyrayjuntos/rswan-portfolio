/**
 * @function getThemeFromMood
 * @description Maps a project's mood string to a corresponding theme class name.
 * @param {string} mood - The mood string from the project's data.
 * @returns {string} The CSS class name for the theme.
 */
function getThemeFromMood(mood) {
    if (!mood) return 'original'; // Default theme

    const moodMap = {
        // Creative & Dynamic
        'innovative': 'dark',
        'inspiring': 'dark',
        'bold': 'twilight',
        'energetic': 'sunset',
        'playful': 'sunset',

        // Calm & Ethereal
        'calming': 'ocean',
        'ethereal': 'lavender',
        'mystical': 'lavender',

        // Natural & Grounded
        'organic': 'forest',

        // Professional & Structured
        'professional': 'original',
        'structured': 'original',
        'technical': 'original'
    };

    return moodMap[mood.toLowerCase()] || 'original';
} 