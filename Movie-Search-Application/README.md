# CineScope – Movie Discovery Platform 🎬🍿

![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6.0.7-646CFF.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC.svg)
![Axios](https://img.shields.io/badge/Axios-1.7.9-5A29E4.svg)
![OMDb_API](https://img.shields.io/badge/OMDb%20API-v1-E50914.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**CineScope** is a modern, responsive, and cinema-inspired Movie Search and Discovery web application built with **React.js**, **Vite**, **Tailwind CSS**, and the **OMDb API**. Designed with a cinema-first aesthetic, CineScope empowers film enthusiasts to search across hundreds of thousands of titles, explore comprehensive cast and crew details, view real-time IMDb ratings, browse high-resolution posters, and curate a personalized watchlist with persistent local storage.

---

## 🌟 Key Highlights & Academic Objectives

- **Third-Party API Integration:** Reusable Axios architecture communicating securely with the Open Movie Database (OMDb) REST API.
- **Search Debouncing (500ms):** Custom `useDebounce` hook that avoids unnecessary network requests during rapid user keystrokes.
- **Race Condition Prevention & Optimization:** Employs standard `AbortController` cancellation to ensure stale in-flight responses never overwrite newer search queries.
- **Full-Featured Pagination:** Standardized 10 movies per page according to OMDb API specifications, with direct page jumping, ellipses, and boundary controls.
- **Persistent Personal Watchlist:** Full CRUD capabilities for saved movies backed by browser `localStorage`, with duplicate prevention by `imdbID`.
- **Cinema-Themed UI/UX:** Default deep-charcoal dark theme with vivid crimson red accents, glassmorphic navigation, animated toast feedback, and skeleton loaders.
- **Theme Switching:** Dark/Light mode toggle with instant visual adaptation and `localStorage` preference synchronization.

---

## 📸 Core Pages & Features

### 1. 🏠 Cinematic Home Page (`/`)
- **Cinematic Hero Banner:** Eye-catching headline, tagline, and prominent search bar with instant type and year filters.
- **Popular Suggestion Chips:** One-click shortcuts for popular franchises (*Batman*, *Marvel*, *Sci-Fi*, *Star Wars*, etc.).
- **Spotlight Feature Section:** Showcases a critically acclaimed film with detailed synopsis, IMDb score, awards, and watchlist button.
- **Featured Discovery Grid:** Handpicked collection of cinematic masterpieces fetched dynamically.
- **Recent Searches Strip:** Quick access to recently performed searches with instant recall and clearing.

### 2. 🔍 Search & Discovery Page (`/search`)
- **Debounced Search Input:** Triggers queries automatically 500ms after user pauses typing (minimum 2 characters required).
- **Type Filter:** Switch between *All Types*, *Movies*, *Series*, and *Episodes*.
- **Release Year Filter:** Precise filtering by 4-digit release year (e.g., `2024`, `2020`, `1994`).
- **Interactive Movie Cards:**
  - High-definition poster with automatic fallback for missing or broken assets (`N/A`).
  - Title, Release Year, IMDb ID, and color-coded Content Type badges.
  - Interactive Watchlist toggle button with heart animation and tooltip.
  - "Details" button leading to the dedicated movie view.
- **Smart Pagination:** Previous/Next buttons, direct numeric page links with ellipses, current page range, and total results count.
- **URL Synchronization:** Search query and active filters are mirrored in URL search parameters (`?q=batman&type=movie&year=2022&page=1`), making searches shareable and bookmarkable.

### 3. 🎞️ Movie Details Page (`/movie/:id`)
- **Comprehensive Movie Dossier:** Fetches complete movie metadata via IMDb ID (`i=...&plot=full`).
- **Displays:**
  - Large movie poster and ambient glowing backdrop.
  - Movie Title, Release Year, Age Rating (`PG-13`, `R`, etc.), Runtime, and Genre tags.
  - Rating metrics: IMDb score, total votes, Metascore critic rating, and Box Office earnings.
  - Full unabridged storyline and synopsis.
  - Cast and crew breakdown: Director, Writers, and Starring Actors.
  - Production data: Spoken Languages, Country of Origin, and Awards recognition.
- **Actions:** Add to/Remove from Watchlist button, Share link button, Back to Search button, and external direct link to IMDb.

### 4. ❤️ My Watchlist / Favorites Page (`/favorites`)
- **Personal Watchlist:** Displays all saved movies stored in browser `localStorage`.
- **Watchlist Search & Filtering:** Filter your saved collection by keyword or content type (*Movie*, *Series*).
- **Watchlist Sorting:** Sort saved titles by *Recently Added*, *Title (A–Z)*, or *Release Year*.
- **Duplicate Prevention:** Safe insertion logic strictly verifies `imdbID` uniqueness.
- **Empty State:** Clean, animated cinema prompt guiding users back to discovery when no titles are saved.
- **Data Persistence:** Stored titles remain saved across browser tabs, reloads, and sessions.

### 5. 🛠️ Additional UI/UX Features
- **Theme Toggle:** Effortlessly switch between Cinema Dark Mode (default) and Light Mode.
- **Toast Notifications:** Smooth floating alert cards confirming when a movie is added to or removed from the watchlist.
- **Custom Loading Skeletons:** Matching 2:3 aspect ratio shimmer placeholders that prevent layout shifts during fetches.
- **Scroll to Top Button:** Floating action button that appears smoothly after scrolling past 300px.
- **Graceful Error Handling:** Dedicated error screens for missing API keys, network disconnections, or empty results with quick retry options.

---

## 🏗️ Project Architecture

```
Movie-Search-Application/
├── public/
│   └── clapperboard.svg          # CineScope SVG Favicon
├── src/
│   ├── components/
│   │   ├── ErrorMessage.jsx      # Friendly error and empty-state displays
│   │   ├── Footer.jsx            # Cinema-themed footer with API attribution
│   │   ├── Loading.jsx           # Animated loading spinner with pulse effect
│   │   ├── MovieCard.jsx         # Card component with poster, badges, heart toggle
│   │   ├── MovieGrid.jsx         # Responsive grid container for movie cards
│   │   ├── Navbar.jsx            # Responsive header with logo, search, and navlinks
│   │   ├── Pagination.jsx        # Smart pagination with ellipses and page numbers
│   │   ├── ScrollToTop.jsx       # Floating scroll-to-top button
│   │   ├── SearchBar.jsx         # Search input with type/year filters & history
│   │   ├── SkeletonCard.jsx      # Shimmer loading skeletons for cards & details
│   │   ├── ThemeToggle.jsx       # Dark / Light mode toggle button
│   │   └── Toast.jsx             # Floating notification manager for favorites
│   │
│   ├── context/
│   │   ├── FavoritesContext.jsx  # Watchlist state management & toast triggers
│   │   └── ThemeContext.jsx      # Theme provider synchronizing document class
│   │
│   ├── hooks/
│   │   └── useDebounce.js        # Debounce hook (500ms delay for search inputs)
│   │
│   ├── pages/
│   │   ├── Favorites.jsx         # Watchlist view with filtering and sorting
│   │   ├── Home.jsx              # Landing page with hero, spotlight, and curated lists
│   │   ├── MovieDetails.jsx      # Full movie profile view with cast and ratings
│   │   ├── NotFound.jsx          # Custom 404 "Scene Not Found" page
│   │   └── SearchResults.jsx     # Main search page with grid, filters, and pagination
│   │
│   ├── services/
│   │   └── movieApi.js           # Reusable Axios service for all OMDb API calls
│   │
│   ├── styles/
│   │   └── global.css            # Tailwind directives, theme variables, custom scrollbars
│   │
│   ├── utils/
│   │   └── localStorage.js       # LocalStorage helpers for favorites, theme, history
│   │
│   ├── App.jsx                   # Route configuration and global providers
│   └── main.jsx                  # Application entry point
│
├── .env                          # Local environment variables (VITE_OMDB_API_KEY)
├── .env.example                  # Template environment variables
├── index.html                    # Root HTML document with Google Fonts
├── package.json                  # Dependencies and build scripts
├── postcss.config.js             # PostCSS Tailwind plugins
├── tailwind.config.js            # Cinema color palette, shadows, animations
└── vite.config.js                # Vite development and bundle configuration
```

---

## 💻 Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | Declarative Component-Based UI Library |
| **Vite 6** | Ultra-Fast Next Generation Frontend Tooling |
| **Tailwind CSS 3** | Utility-First Modern CSS Framework |
| **React Router DOM 6** | Declarative Client-Side Routing and URL parameter management |
| **Axios** | Promise-based HTTP Client with AbortController cancellation |
| **Lucide React** | Clean, lightweight modern icons |
| **OMDb API** | Third-Party REST API for film catalog and metadata |
| **LocalStorage API** | Browser client storage for favorites, theme, and history |

---

## 🚀 Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- `npm` or `yarn` / `pnpm`

### Step 1: Clone or Navigate to the Repository
```bash
git clone <repository-url>
cd Movie-Search-Application
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure OMDb API Key
Create a `.env` file in the root directory (you can copy from `.env.example`):
```bash
cp .env.example .env
```
Open `.env` and add your OMDb API key:
```env
VITE_OMDB_API_KEY=your_api_key_here
```

> **Note:** A valid working API key is already configured in `.env` for testing and evaluation. If you want to use your own personal key, obtain a free key at [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx) and update `.env`.

### Step 4: Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000/
```

### Step 5: Build for Production
To create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 🔑 OMDb API Documentation & Parameters Used

CineScope interfaces with the official OMDb REST endpoint (`https://www.omdbapi.com/`):

| Operation | Query Parameters | Description |
| :--- | :--- | :--- |
| **Search Movies** | `?s={query}&page={page}&type={type}&y={year}&apikey={key}` | Searches titles with pagination and filters. |
| **Movie Details** | `?i={imdbID}&plot=full&apikey={key}` | Retrieves full movie dossier, ratings, and cast. |

**API Key Security:**
The API key is accessed strictly through `import.meta.env.VITE_OMDB_API_KEY` and is never hardcoded inside source files.

---

## 🧪 Verification & Academic Testing Checklist

- [x] **API Integration:** Dynamic data fetched directly from OMDb API.
- [x] **Debouncing:** 500ms debounce verified via `useDebounce` hook.
- [x] **Optimization:** Outdated requests aborted using `AbortController` signal.
- [x] **Pagination:** Smooth 10-item pagination with total results calculation.
- [x] **Favorites / Watchlist:** Add/remove items with duplicate prevention and LocalStorage persistence.
- [x] **Dark / Light Theme:** Custom toggle dynamically updating the document theme class.
- [x] **Responsive Layout:** Tested across mobile screens, tablets, laptops, and ultra-wide desktops.
- [x] **Skeletons & Error Handling:** Shimmer loading cards and friendly notices for missing or invalid data.

---

## 📜 License

This project is created for academic and educational purposes under the **MIT License**.
Movie data and imagery are provided by the [Open Movie Database (OMDb) API](https://www.omdbapi.com/).

