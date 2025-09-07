/**
 * PodcastApp - encapsulates UI rendering, filtering, sorting and modal behavior
 */
class PodcastApp {
  /**
   * @param {Array} podcasts
   * @param {Array} genres
   * @param {Array} seasons
   */
  constructor(podcasts, genres, seasons) {
    this.podcasts = podcasts;
    this.genres = genres;
    this.seasons = seasons;

    // DOM
    this.podcastsGrid = document.getElementById('podcastsGrid');
    this.modalOverlay = document.getElementById('modalOverlay');
    this.modalContent = document.getElementById('modalContent');
    this.modalClose = document.getElementById('modalClose');
    this.genreFilter = document.getElementById('genreFilter');
    this.sortFilter = document.getElementById('sortFilter');

    // Bound methods
    this.init = this.init.bind(this);
    this.renderPodcasts = this.renderPodcasts.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.filterAndSortPodcasts = this.filterAndSortPodcasts.bind(this);

    // Wait for DOM
    document.addEventListener('DOMContentLoaded', this.init);
  }

  /**
   * Convert ISO date to readable string
   * @param {string} dateString
   * @returns {string}
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.abs(now - date);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.ceil(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  }

  /**
   * Map genre ids to names
   * @param {number[]} genreIds
   * @returns {string[]}
   */
  getGenreNames(genreIds) {
    return genreIds.map(id => {
      const found = this.genres.find(g => g.id === id);
      return found ? found.title : 'Unknown';
    });
  }

  /**
   * Render the podcast cards
   * @param {Array} list
   */
  renderPodcasts(list) {
    this.podcastsGrid.innerHTML = '';
    list.forEach(podcast => {
      const genres = this.getGenreNames(podcast.genres);
      const updated = this.formatDate(podcast.updated);

      const card = document.createElement('article');
      card.className = 'podcast-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.innerHTML = `
        <div class="card-image">
          <img src="${podcast.image}" alt="${podcast.title} cover image">
        </div>
        <div class="card-content">
          <div>
            <h3 class="card-title">${podcast.title}</h3>
            <div class="card-details">
              <div class="card-detail"><i class="fas fa-list-ol"></i><span>${podcast.seasons} season${podcast.seasons !== 1 ? 's' : ''}</span></div>
              <div class="card-detail"><i class="fas fa-clock"></i><span>${updated}</span></div>
            </div>
            <div class="genre-tags">${genres.map(g => `<span class="genre-tag">${g}</span>`).join('')}</div>
          </div>
          <div class="card-updated">${updated}</div>
        </div>
      `;

      // open modal on click or enter
      card.addEventListener('click', () => this.openModal(podcast));
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.openModal(podcast); });

      this.podcastsGrid.appendChild(card);
    });
  }

  /**
   * Open modal populated with podcast data
   * @param {Object} podcast
   */
  openModal(podcast) {
    const genres = this.getGenreNames(podcast.genres);
    const updated = this.formatDate(podcast.updated);
    const podcastSeasons = (this.seasons.find(s => s.id === podcast.id) || {}).seasonDetails || [];

    this.modalContent.innerHTML = `
      <div class="modal-header">
        <div class="modal-image"><img src="${podcast.image}" alt="${podcast.title} cover"></div>
        <div class="modal-title-section">
          <h2 class="modal-title">${podcast.title}</h2>
          <p class="modal-description">${podcast.description}</p>
          <div class="modal-genres">${genres.map(g => `<span class="modal-genre">${g}</span>`).join('')}</div>
          <div style="margin-top:8px;color:var(--muted)"><i class="fas fa-clock"></i> Last updated: ${updated}</div>
        </div>
      </div>

      <div class="seasons-section">
        <h3 class="seasons-title">Seasons</h3>
        ${podcastSeasons.length ? podcastSeasons.map(s => `
          <div class="season-item">
            <div class="season-name">${s.title}</div>
            <div class="episode-count">${s.episodes} episode${s.episodes !== 1 ? 's' : ''}</div>
          </div>
        `).join('') : '<div class="season-item"><div class="season-name">No seasons available</div></div>'}
      </div>
    `;

    this.modalOverlay.classList.add('active');
    this.modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close modal
   */
  closeModal() {
    this.modalOverlay.classList.remove('active');
    this.modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /**
   * Apply filtering and sorting
   */
  filterAndSortPodcasts() {
    const genreValue = this.genreFilter.value;
    const sortValue = this.sortFilter.value;

    let list = [...this.podcasts];

    if (genreValue !== 'all') {
      const id = parseInt(genreValue, 10);
      list = list.filter(p => p.genres.includes(id));
    }

    switch (sortValue) {
      case 'title':
        list.sort((a,b) => a.title.localeCompare(b.title));
        break;
      case 'seasons':
        list.sort((a,b) => b.seasons - a.seasons);
        break;
      case 'updated':
      default:
        list.sort((a,b) => new Date(b.updated) - new Date(a.updated));
        break;
    }

    this.renderPodcasts(list);
  }

  /**
   * Initialize UI, populate filters, attach listeners
   */
  init() {
    // populate genre filter
    this.genres.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.id;
      opt.textContent = g.title;
      this.genreFilter.appendChild(opt);
    });

    // initial render
    this.renderPodcasts(this.podcasts);

    // listeners
    this.modalClose.addEventListener('click', this.closeModal.bind(this));
    this.modalOverlay.addEventListener('click', (e) => { if (e.target === this.modalOverlay) this.closeModal(); });

    this.genreFilter.addEventListener('change', this.filterAndSortPodcasts.bind(this));
    this.sortFilter.addEventListener('change', this.filterAndSortPodcasts.bind(this));

    // keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalOverlay.classList.contains('active')) this.closeModal();
    });
  }
}

// Initialize the app (relies on globals from data.js)
new PodcastApp(podcasts, genres, seasons);
