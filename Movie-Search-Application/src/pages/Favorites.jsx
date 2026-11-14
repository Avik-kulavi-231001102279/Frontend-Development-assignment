import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Film,
  Trash2,
  Compass,
  ArrowUpDown,
  Filter,
  Eye,
  Star,
  Search,
} from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';

export default function Favorites() {
  const { favorites, clearAllFavorites, favoritesCount } = useFavorites();

  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'title-asc' | 'year-desc'
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort favorites list
  const filteredFavorites = useMemo(() => {
    let result = [...favorites];

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(
        (m) => (m.Type || 'movie').toLowerCase() === filterType.toLowerCase()
      );
    }

    // Filter by search query within watchlist
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((m) =>
        (m.Title || '').toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'title-asc') {
        return (a.Title || '').localeCompare(b.Title || '');
      }
      if (sortBy === 'year-desc') {
        const yearA = parseInt(a.Year, 10) || 0;
        const yearB = parseInt(b.Year, 10) || 0;
        return yearB - yearA;
      }
      // 'newest' added
      const dateA = new Date(a.addedAt || 0).getTime();
      const dateB = new Date(b.addedAt || 0).getTime();
      return dateB - dateA;
    });

    return result;
  }, [favorites, filterType, sortBy, searchTerm]);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <Heart className="w-6 h-6 text-cinema-red fill-cinema-red" />
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              My Watchlist
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cinema-red/15 text-cinema-red border border-cinema-red/30 text-xs font-bold">
              {favoritesCount}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Curated list of your saved movies and series, stored safely in your local browser cache.
          </p>
        </div>

        {favoritesCount > 0 && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
                  clearAllFavorites();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-cinema-red/20 text-slate-300 hover:text-cinema-red border border-white/10 text-xs font-semibold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* When favorites exist, show toolbar */}
      {favoritesCount > 0 ? (
        <div className="space-y-6">
          {/* Controls Bar: Search inside favorites, Type filter, Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-cinema-850 border border-white/5">
            {/* Filter by keyword in favorites */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter saved titles..."
                className="w-full bg-cinema-900 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cinema-red"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Type Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-cinema-900 border border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cinema-red"
                >
                  <option value="all">All Types</option>
                  <option value="movie">Movies</option>
                  <option value="series">Series</option>
                  <option value="episode">Episodes</option>
                </select>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-cinema-900 border border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cinema-red"
                >
                  <option value="newest">Recently Saved</option>
                  <option value="title-asc">Title (A - Z)</option>
                  <option value="year-desc">Release Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid of Favorite Movies */}
          {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredFavorites.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-cinema-850/50 rounded-2xl border border-white/5">
              <p className="text-slate-400 text-sm">
                No saved movies match your active filter "{searchTerm || filterType}".
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                className="mt-3 text-xs text-cinema-red font-semibold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State Design */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto glass-panel rounded-3xl border border-white/5">
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-3xl bg-cinema-red/10 border border-cinema-red/25 flex items-center justify-center text-cinema-red shadow-glow-red">
              <Heart className="w-10 h-10 animate-pulse" />
            </div>
          </div>

          <h2 className="font-display font-bold text-2xl text-white mb-2">
            Your Watchlist is Empty
          </h2>

          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            You haven't saved any movies or series to your favorites yet. Browse the cinema catalog, explore trending titles, and click the heart icon on any poster to bookmark them here.
          </p>

          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cinema-red hover:bg-cinema-red-hover text-white font-semibold text-sm shadow-glow-red transition-all duration-200 active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Movies Now</span>
          </Link>
        </div>
      )}
    </div>
  );
}

