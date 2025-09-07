/**
 * PodcastApp - encapsulates UI rendering, filtering, sorting and modal behavior
 */
class PodcastApp {
  /**
   * Constructor is called when we create a new PodcastApp.
   * It receives 3 arrays: podcasts, genres, seasons.
   */
  constructor(podcasts, genres, seasons) {
    // Save input data into properties of the class
    this.podcasts = podcasts;
    this.genres = genres;
    this.seasons = seasons;

    // ====== DOM Elements ======
    // Get references to important HTML elements we will update
    this.podcastsGrid = document.getElementById('podcastsGrid');
    this.modalOverlay = document.getElementById('modalOverlay');
    this.modalContent = document.getElementById('modalContent');
    this.modalClose = document.getElementById('modalClose');
    this.genreFilter = document.getElementById('genreFilter');
    this.sortFilter = document.getElementById('sortFilter');

    // ====== Method Bindings ======
    // Bind methods so "this" always refers to the class instance
    this.init = this.init.bind(this);
    this.renderPodcasts = this.renderPodcasts.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.filterAndSortPodcasts = this.filterAndSortPodcasts.bind(this);

    // Run init once the DOM is ready
    document.addEventListener('DOMContentLoaded', this.init);
  }

  /**
   * Convert ISO date string to a human-friendly string
   * Example: "2025-09-08" → "Yesterday" or "3 weeks ago"
   */
  formatDate(dateString) {
    const date = new Date(dateString);     // convert string to Date
    const now = new Date();                // current date
    const diff = Math.abs(now - date);     // difference in ms
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)); // convert ms → days

    // Return relative string depending on how many days passed
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.ceil(days / 7)} weeks ago`;
    return date.toLocaleDateString();      // fallback to standard date
  }

  /**
   * Convert an array of genre IDs into genre names
   * Example: [1, 3] → ["True Crime", "History"]
   */
  getGenreNames(genreIds) {
    return genreIds.map(id => {
      const found = this.genres.find(g => g.id === id);
      return found ? found.title : 'Unknown';
    });
  }

  /**
   * Render podcast cards into the grid
   * @param {Array} list - podcasts to show
   */
  renderPodcasts(list) {
    this.podcastsGrid.innerHTML = ''; // clear grid before rendering

    list.forEach(podcast => {
      const genres = this.getGenreNames(podcast.genres); // map genre IDs → names
      const updated = this.formatDate(podcast.updated);  // format last updated

      // Create card container
      const card = document.createElement('article');
      card.className = 'podcast-card';
      card.tabIndex = 0; // make focusable
      card.setAttribute('role', 'button'); // treat card like a button

      // Fill card HTML
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

      // Open modal when user clicks or presses Enter
      card.addEventListener('click', () => this.openModal(podcast));
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.openModal(podcast); });

      // Add card to the grid
      this.podcastsGrid.appendChild(card);
    });
  }

  /**
   * Open modal showing podcast details
   */
  openModal(podcast) {
    const genres = this.getGenreNames(podcast.genres);       // genre names
    const updated = this.formatDate(podcast.updated);        // last updated
    const podcastSeasons = (this.seasons.find(s => s.id === podcast.id) || {}).seasonDetails || [];

    // Build modal HTML
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

    // Show modal
    this.modalOverlay.classList.add('active');
    this.modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent scrolling background
  }

  /**
   * Close modal
   */
  closeModal() {
    this.modalOverlay.classList.remove('active');
    this.modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // restore scroll
  }

  /**
   * Filter and sort the podcast list based on dropdowns
   */
  filterAndSortPodcasts() {
    const genreValue = this.genreFilter.value; // selected genre
    const sortValue = this.sortFilter.value;   // selected sort option

    let list = [...this.podcasts]; // copy of all podcasts

    // Apply genre filter
    if (genreValue !== 'all') {
      const id = parseInt(genreValue, 10);
      list = list.filter(p => p.genres.includes(id));
    }

    // Apply sorting
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

    // Re-render grid
    this.renderPodcasts(list);
  }

  /**
   * Initialize the app:
   * - Populate genre dropdown
   * - Render initial podcasts
   * - Attach event listeners
   */
  init() {
    // Populate genre filter with <option> elements
    this.genres.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.id;
      opt.textContent = g.title;
      this.genreFilter.appendChild(opt);
    });

    // Render all podcasts initially
    this.renderPodcasts(this.podcasts);

    // Event listeners
    this.modalClose.addEventListener('click', this.closeModal.bind(this));
    this.modalOverlay.addEventListener('click', (e) => { 
      if (e.target === this.modalOverlay) this.closeModal(); // close if background clicked
    });

    this.genreFilter.addEventListener('change', this.filterAndSortPodcasts.bind(this));
    this.sortFilter.addEventListener('change', this.filterAndSortPodcasts.bind(this));

    // Keyboard accessibility: Esc closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalOverlay.classList.contains('active')) this.closeModal();
    });
  }
}

// Create and run the app using data from data.js
new PodcastApp(podcasts, genres, seasons);
