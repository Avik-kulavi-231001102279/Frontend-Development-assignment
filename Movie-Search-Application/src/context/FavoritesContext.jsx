import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStoredFavorites, saveFavorites } from '../utils/localStorage';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => getStoredFavorites());
  const [toasts, setToasts] = useState([]);

  // Persist to LocalStorage whenever favorites change
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  // Toast notification helper
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Check if a movie is already favorited
  const isFavorite = useCallback(
    (imdbID) => {
      if (!imdbID) return false;
      return favorites.some((movie) => movie.imdbID === imdbID);
    },
    [favorites]
  );

  // Add movie to favorites (prevent duplicates!)
  const addFavorite = useCallback(
    (movie) => {
      if (!movie || !movie.imdbID) return;

      setFavorites((prev) => {
        // Prevent duplicate favorite entries
        if (prev.some((m) => m.imdbID === movie.imdbID)) {
          return prev;
        }

        // Standardize stored movie object
        const movieEntry = {
          imdbID: movie.imdbID,
          Title: movie.Title || 'Untitled',
          Year: movie.Year || 'N/A',
          Type: movie.Type || 'movie',
          Poster: movie.Poster || 'N/A',
          Genre: movie.Genre || '',
          imdbRating: movie.imdbRating || '',
          Plot: movie.Plot || '',
          addedAt: new Date().toISOString(),
        };

        return [movieEntry, ...prev];
      });

      addToast(`"${movie.Title}" added to your Favorites!`, 'success');
    },
    [addToast]
  );

  // Remove movie from favorites
  const removeFavorite = useCallback(
    (imdbID, movieTitle) => {
      if (!imdbID) return;

      setFavorites((prev) => prev.filter((movie) => movie.imdbID !== imdbID));
      const title = movieTitle || 'Movie';
      addToast(`"${title}" removed from your Favorites.`, 'info');
    },
    [addToast]
  );

  // Toggle favorite helper
  const toggleFavorite = useCallback(
    (movie) => {
      if (!movie || !movie.imdbID) return;
      if (isFavorite(movie.imdbID)) {
        removeFavorite(movie.imdbID, movie.Title);
      } else {
        addFavorite(movie);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  // Clear all favorites helper
  const clearAllFavorites = useCallback(() => {
    if (favorites.length === 0) return;
    setFavorites([]);
    addToast('All favorites cleared.', 'info');
  }, [favorites.length, addToast]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearAllFavorites,
        toasts,
        removeToast,
        addToast,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

