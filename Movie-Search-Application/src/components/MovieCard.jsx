import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Film, Tv, Video, Star, ExternalLink, Eye } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);

  if (!movie) return null;

  const {
    Title = 'Untitled',
    Year = 'Unknown',
    imdbID,
    Type = 'movie',
    Poster,
    imdbRating,
  } = movie;

  const favorited = isFavorite(imdbID);

  const hasPoster = Poster && Poster !== 'N/A' && !imageError;

  // Format type badge
  const getTypeBadge = (type) => {
    const lower = (type || 'movie').toLowerCase();
    switch (lower) {
      case 'series':
        return {
          label: 'Series',
          icon: Tv,
          className: 'bg-indigo-600/80 text-indigo-100 border-indigo-400/40',
        };
      case 'episode':
        return {
          label: 'Episode',
          icon: Video,
          className: 'bg-emerald-600/80 text-emerald-100 border-emerald-400/40',
        };
      default:
        return {
          label: 'Movie',
          icon: Film,
          className: 'bg-cinema-red/80 text-white border-cinema-red/40',
        };
    }
  };

  const badge = getTypeBadge(Type);
  const BadgeIcon = badge.icon;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <div className="group relative flex flex-col bg-cinema-850 dark:bg-cinema-850 rounded-2xl overflow-hidden border border-white/10 dark:border-white/10 shadow-cinema-card hover:shadow-cinema-card-hover hover:border-cinema-red/50 transition-all duration-300 transform hover:-translate-y-1.5 flex-1">
      {/* Poster Container with Aspect Ratio 2:3 */}
      <Link
        to={`/movie/${imdbID}`}
        className="relative w-full aspect-[2/3] bg-cinema-900 overflow-hidden block focus:outline-none"
      >
        {hasPoster ? (
          <img
            src={Poster}
            alt={Title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-cinema-800 to-cinema-900 border-b border-white/5">
            <Film className="w-12 h-12 text-slate-600 mb-2 group-hover:text-cinema-red transition-colors" />
            <span className="text-xs font-semibold text-slate-400 line-clamp-2 px-2">
              {Title}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
              No Poster Available
            </span>
          </div>
        )}

        {/* Gradient Overlay for Top & Bottom Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-950 via-transparent to-black/60 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase backdrop-blur-md border ${badge.className}`}
          >
            <BadgeIcon className="w-3 h-3" />
            {badge.label}
          </span>

          {/* Quick Favorite Heart Button */}
          <button
            onClick={handleFavoriteClick}
            type="button"
            className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 focus:outline-none ${
              favorited
                ? 'bg-cinema-red text-white border-cinema-red shadow-glow-red scale-105'
                : 'bg-black/50 text-white/80 border-white/20 hover:bg-black/80 hover:text-white hover:scale-110'
            }`}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                favorited ? 'fill-current' : ''
              }`}
            />
          </button>
        </div>

        {/* Floating Rating (if available) */}
        {imdbRating && imdbRating !== 'N/A' && (
          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-cinema-gold text-xs font-bold">
            <Star className="w-3 h-3 fill-cinema-gold text-cinema-gold" />
            <span>{imdbRating}</span>
          </div>
        )}
      </Link>

      {/* Movie Details Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-cinema-850">
        <div>
          {/* Release Year and IMDb ID */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium text-slate-300">{Year}</span>
            <span className="font-mono text-[11px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
              {imdbID}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/movie/${imdbID}`}
            className="block font-display font-semibold text-slate-100 group-hover:text-cinema-red text-sm sm:text-base leading-snug line-clamp-2 transition-colors"
            title={Title}
          >
            {Title}
          </Link>
        </div>

        {/* Card Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <Link
            to={`/movie/${imdbID}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-cinema-red text-slate-200 hover:text-white text-xs font-semibold border border-white/10 hover:border-cinema-red transition-all duration-200 focus:outline-none"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>

          <button
            onClick={handleFavoriteClick}
            type="button"
            className={`p-2 rounded-xl border text-xs font-medium transition-all duration-200 flex items-center justify-center ${
              favorited
                ? 'bg-cinema-red/15 text-cinema-red border-cinema-red/40 hover:bg-cinema-red/25'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
            aria-label={favorited ? 'In Watchlist' : 'Add to Watchlist'}
            title={favorited ? 'In Watchlist' : 'Add to Watchlist'}
          >
            <Heart
              className={`w-4 h-4 ${favorited ? 'fill-cinema-red text-cinema-red' : ''}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

