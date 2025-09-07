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

/**
 * Render podcast cards in the grid
 * @param {Object[]} podcastsToRender - Array of podcast objects
 */
function renderPodcasts(podcastsToRender) {
    podcastsGrid.innerHTML = '';
    
    podcastsToRender.forEach(podcast => {
        const genreNames = getGenreNames(podcast.genres);
        const updatedText = formatDate(podcast.updated);
        
        const card = document.createElement('div');
        card.className = 'podcast-card';
        card.innerHTML = `
            <div class="card-image">
                <img src="${podcast.image}" alt="${podcast.title}">
            </div>
            <div class="card-content">
                <h3 class="card-title">${podcast.title}</h3>
                <div class="card-details">
                    <div class="card-detail">
                        <i class="fas fa-list-ol"></i>
                        <span>${podcast.seasons} season${podcast.seasons !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="card-detail">
                        <i class="fas fa-clock"></i>
                        <span>${updatedText}</span>
                    </div>
                </div>
                <div class="genre-tags">
                    ${genreNames.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => openModal(podcast));
        podcastsGrid.appendChild(card);
    });
}