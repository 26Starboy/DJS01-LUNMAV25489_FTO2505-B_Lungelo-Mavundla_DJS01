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

/**
 * Open modal with podcast details
 * @param {Object} podcast - Podcast object
 */
function openModal(podcast) {
    const genreNames = getGenreNames(podcast.genres);
    const updatedText = formatDate(podcast.updated);
    const podcastSeasons = seasons.find(s => s.id === podcast.id)?.seasonDetails || [];
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <div class="modal-image">
                <img src="${podcast.image}" alt="${podcast.title}">
            </div>
            <div class="modal-title-section">
                <h2 class="modal-title">${podcast.title}</h2>
                <p class="modal-description">${podcast.description}</p>
                <div class="modal-date">
                    <i class="fas fa-clock"></i>
                    <span>Last updated: ${updatedText}</span>
                </div>
                <div class="modal-genres">
                    ${genreNames.map(genre => `<span class="modal-genre">${genre}</span>`).join('')}
                </div>
            </div>
        </div>
        <div class="seasons-section">
            <h3 class="seasons-title">Seasons</h3>
            ${podcastSeasons.map(season => `
                <div class="season-item">
                    <span class="season-name">${season.title}</span>
                    <span class="episode-count">${season.episodes} episode${season.episodes !== 1 ? 's' : ''}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 */
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/**
 * Filter and sort podcasts based on user selection
 */
function filterAndSortPodcasts() {
    const genreValue = genreFilter.value;
    const sortValue = sortFilter.value;
    
    let filteredPodcasts = [...podcasts];
    
    // Filter by genre
    if (genreValue !== 'all') {
        filteredPodcasts = filteredPodcasts.filter(podcast => 
            podcast.genres.includes(parseInt(genreValue))
        );
    }
    
    // Sort podcasts
    switch(sortValue) {
        case 'title':
            filteredPodcasts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'seasons':
            filteredPodcasts.sort((a, b) => b.seasons - a.seasons);
            break;
        case 'updated':
        default:
            filteredPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
            break;
    }
    
    renderPodcasts(filteredPodcasts);
}

/**
 * Initialize the application
 */
function init() {
    // Populate genre filter
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.title;
        genreFilter.appendChild(option);
    });
    
    // Render initial podcasts
    renderPodcasts(podcasts);
    
    // Add event listeners
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    genreFilter.addEventListener('change', filterAndSortPodcasts);
    sortFilter.addEventListener('change', filterAndSortPodcasts);
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);