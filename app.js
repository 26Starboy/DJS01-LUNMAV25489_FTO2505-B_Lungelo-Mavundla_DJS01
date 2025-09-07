// DOM Elements
const podcastsGrid = document.getElementById('podcastsGrid');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const genreFilter = document.getElementById('genreFilter');
const sortFilter = document.getElementById('sortFilter');

/**
 * Format date to human readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Get genre names by IDs
 * @param {number[]} genreIds - Array of genre IDs
 * @returns {string[]} Array of genre names
 */
function getGenreNames(genreIds) {
    return genreIds.map(id => {
        const genre = genres.find(g => g.id === id);
        return genre ? genre.title : 'Unknown';
    });
}

