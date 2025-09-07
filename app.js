class PodcastApp {
    constructor(podcasts, genres, seasons) {
        this.podcasts = podcasts;
        this.genres = genres;
        this.seasons = seasons;

        // DOM Elements
        this.podcastsGrid = document.getElementById('podcastsGrid');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modalContent = document.getElementById('modalContent');
        this.modalClose = document.getElementById('modalClose');
        this.genreFilter = document.getElementById('genreFilter');
        this.sortFilter = document.getElementById('sortFilter');

        // Bind methods
        this.init = this.init.bind(this);
        this.renderPodcasts = this.renderPodcasts.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.filterAndSortPodcasts = this.filterAndSortPodcasts.bind(this);
        this.getGenreNames = this.getGenreNames.bind(this);
        this.formatDate = this.formatDate.bind(this);

        document.addEventListener('DOMContentLoaded', this.init);
    }

    /**
     * Format ISO date into human readable string
     * @param {string} dateString 
     * @returns {string}
     */
    formatDate(dateString) {
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
     * @param {number[]} genreIds 
     * @returns {string[]}
     */
    getGenreNames(genreIds) {
        return genreIds.map(id => {
            const genre = this.genres.find(g => g.id === id);
            return genre ? genre.title : 'Unknown';
        });
    }

    /**
     * Render podcast cards in the grid
     * @param {Object[]} podcastsToRender 
     */
    renderPodcasts(podcastsToRender) {
        this.podcastsGrid.innerHTML = '';

        podcastsToRender.forEach(podcast => {
            const genreNames = this.getGenreNames(podcast.genres);
            const updatedText = this.formatDate(podcast.updated);

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

            card.addEventListener('click', () => this.openModal(podcast));
            this.podcastsGrid.appendChild(card);
        });
    }

    /**
     * Open modal with podcast details
     * @param {Object} podcast 
     */
    openModal(podcast) {
        const genreNames = this.getGenreNames(podcast.genres);
        const updatedText = this.formatDate(podcast.updated);
        const podcastSeasons = this.seasons.find(s => s.id === podcast.id)?.seasonDetails || [];

        this.modalContent.innerHTML = `
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

        this.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    /**
     * Filter and sort podcasts based on user selection
     */
    filterAndSortPodcasts() {
        const genreValue = this.genreFilter.value;
        const sortValue = this.sortFilter.value;

        let filteredPodcasts = [...this.podcasts];

        if (genreValue !== 'all') {
            filteredPodcasts = filteredPodcasts.filter(podcast =>
                podcast.genres.includes(parseInt(genreValue))
            );
        }

        switch (sortValue) {
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

        this.renderPodcasts(filteredPodcasts);
    }

    /**
     * Initialize the application
     */
    init() {
        // Populate genre filter
        this.genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.title;
            this.genreFilter.appendChild(option);
        });

        // Render initial podcasts
        this.renderPodcasts(this.podcasts);

        // Add event listeners
        this.modalClose.addEventListener('click', this.closeModal.bind(this));
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) this.closeModal();
        });

        this.genreFilter.addEventListener('change', this.filterAndSortPodcasts.bind(this));
        this.sortFilter.addEventListener('change', this.filterAndSortPodcasts.bind(this));

        // Keyboard accessibility for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && this.modalOverlay.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
}

// Initialize app
new PodcastApp(podcasts, genres, seasons);
