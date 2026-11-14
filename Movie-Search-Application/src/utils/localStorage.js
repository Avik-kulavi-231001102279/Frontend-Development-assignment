// LocalStorage helper utilities for CineScope

const STORAGE_KEYS = {
  FAVORITES: 'cinescope_favorites',
  THEME: 'cinescope_theme',
  SEARCH_HISTORY: 'cinescope_search_history',
};

// --- FAVORITES ---
export const getStoredFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

export const saveFavorites = (favorites) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

// --- THEME ---
export const getStoredTheme = () => {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (theme === 'light' || theme === 'dark') return theme;
    // Default to dark theme for CineScope cinematic experience
    return 'dark';
  } catch (error) {
    return 'dark';
  }
};

export const saveTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Error saving theme to localStorage:', error);
  }
};

// --- SEARCH HISTORY ---
export const getStoredSearchHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

export const saveSearchHistory = (history) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving search history to localStorage:', error);
  }
};

export const addSearchHistoryTerm = (term) => {
  if (!term || typeof term !== 'string') return [];
  const cleanTerm = term.trim();
  if (cleanTerm.length < 2) return getStoredSearchHistory();

  try {
    const history = getStoredSearchHistory();
    // Filter out previous occurrence (case-insensitive) and prepend to top
    const updated = [
      cleanTerm,
      ...history.filter((item) => item.toLowerCase() !== cleanTerm.toLowerCase())
    ].slice(0, 8); // Keep last 8 searches

    saveSearchHistory(updated);
    return updated;
  } catch (error) {
    return [];
  }
};

export const removeSearchHistoryTerm = (termToRemove) => {
  try {
    const history = getStoredSearchHistory();
    const updated = history.filter((item) => item.toLowerCase() !== termToRemove.toLowerCase());
    saveSearchHistory(updated);
    return updated;
  } catch (error) {
    return [];
  }
};

export const clearStoredSearchHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    return [];
  } catch (error) {
    return [];
  }
};

