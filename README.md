# 🎧 Podcast Explorer

Podcast Explorer is a **responsive, accessible, and interactive web app** that allows users to **discover and explore podcasts** with ease.  
It was built with **vanilla HTML, CSS, and JavaScript**, and emphasizes **clean code structure**, **usability**, and **a polished user interface**.

---

## 🌍 Overview

The goal of this project is to create a **modern podcast browsing experience** that mimics how streaming platforms display content.  
It allows users to quickly scan through available podcasts, dive into details, and interact with the dataset in meaningful ways.

Key highlights:

- Podcasts are presented in **visually appealing cards** that show essential info at a glance (cover art, title, number of seasons, last updated).
- A **filter and sort system** allows users to refine results:
  - By **genre** (e.g., Comedy, History, True Crime).
  - By **sorting rules** (alphabetical, season count, most recent updates).
- A **dynamic modal view** provides deep insights:
  - Full podcast description
  - Genre tags
  - Last updated date
  - Season and episode breakdown
- The design is **responsive** — adapting seamlessly to desktop, tablet, and mobile layouts.
- Accessibility is a core focus:
  - Keyboard navigation
  - Screen reader-friendly labels
  - ARIA attributes for modal dialogs

This project serves as an excellent demonstration of **front-end development skills**, including layout techniques, DOM manipulation, event handling, and user-centered design.

---

## 📌 Features (Detailed)

### 🎨 Podcast Cards
- Display podcasts in a **clean grid layout**.
- Each card includes:
  - Cover image
  - Podcast title
  - Number of seasons (with pluralization handled automatically)
  - Last updated information (human-readable format like *"2 weeks ago"*)
  - Genre tags for quick identification
- Fully clickable and keyboard accessible (`Enter` to open modal).

---

### 🔍 Filtering & Sorting
- **Filter by Genre**  
  - Dropdown menu lists all available genres from the dataset.  
  - Instantly narrows down the visible podcasts.  

- **Sort Options**  
  - **Recently Updated (default):** Shows the freshest content first.  
  - **Alphabetical (A–Z):** Organizes by title for quick lookup.  
  - **By Seasons:** Prioritizes longer-running shows.  

- Updates happen dynamically without page reloads.  

---

### 🪟 Podcast Modal (Details View)
- Opens when a card is clicked or focused + Enter pressed.
- Contains:
  - Large podcast cover image
  - Title & description
  - Genre tags styled as pills
  - Last updated information
  - **Seasons list** with episode counts
- If no seasons are available, the modal gracefully informs the user.
- Modal can be dismissed by:
  - Clicking the close button
  - Clicking the overlay background
  - Pressing the `Esc` key

---

### 📱 Responsive Design
- **Desktop:** Grid supports up to 8 podcasts per row with two rows visible.
- **Tablet:** Grid adapts to 2–4 cards per row.
- **Mobile:** Grid collapses into 1–2 cards per row for readability.
- Modal scales fluidly to fit smaller screens.

---

### ♿ Accessibility
- All interactive elements are keyboard-focusable.
- Cards have `role="button"` and respond to `Enter`.
- Modal uses `aria-hidden` toggling for screen readers.
- Escape key support ensures accessible closing behavior.
- Semantic tags (`<article>`, `<header>`, `<section>`) improve structure.

---

### ⚡ Performance
- Data-driven rendering: cards and filters are generated from `data.js`, not hard-coded.
- DOM updates are efficient (`innerHTML` batch updates).
- No external dependencies beyond icons (Font Awesome).

---

## 🗂️ Project Structure

```plaintext
PodcastExplorer/
│
├── index.html      # Main HTML template
├── styles.css      # Stylesheet for layout, grid, modal, and responsiveness
├── data.js         # Dataset with podcasts, genres, and seasons
├── app.js          # Core application logic (rendering, filtering, sorting, modal handling)
└── README.md       # Documentation
