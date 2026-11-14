import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Film,
  Search,
  Sparkles,
  TrendingUp,
  Star,
  Play,
  Clock,
  Heart,
  Compass,
  Award,
  ChevronRight,
  Flame,
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import {
  getCuratedMovies,
  getMovieDetailsById,
} from '../services/movieApi';
import {
  getStoredSearchHistory,
  clearStoredSearchHistory,
  removeSearchHistoryTerm,
} from '../utils/localStorage';
import { useFavorites } from '../context/FavoritesContext';

export default function Home() {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchHistory, setSearchHistory] = useState(getStoredSearchHistory);

  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [discoveryMovies, setDiscoveryMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('trending'); // 'trending' | 'classics' | 'scifi'

  // Load curated movies on mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      setLoading(true);
      try {
        // Spotlight movie (Inception or Dune)
        const spotlight = await getMovieDetailsById('tt1375666', 'full');
        if (isMounted) {
          setFeaturedMovie(spotlight);
        }

        // Curated Discovery list
        const curated = await getCuratedMovies();
        if (isMounted) {
          setDiscoveryMovies(curated);
        }
      } catch (err) {
        console.error('Failed to load initial curated movies:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (term) => {
    const q = term || searchQuery;
    if (q.trim().length >= 2) {
      let url = `/search?q=${encodeURIComponent(q.trim())}`;
      if (selectedType) url += `&type=${selectedType}`;
      if (selectedYear) url += `&year=${selectedYear}`;
      navigate(url);
    }
  };

  const handleSelectHistory = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleClearHistory = () => {
    clearStoredSearchHistory();
    setSearchHistory([]);
  };

  const handleRemoveHistoryItem = (term) => {
    const updated = removeSearchHistoryTerm(term);
    setSearchHistory(updated);
  };

  const popularSuggestions = [
    { label: 'Batman', query: 'Batman' },
    { label: 'Marvel', query: 'Avengers' },
    { label: 'Sci-Fi', query: 'Interstellar' },
    { label: 'Harry Potter', query: 'Harry Potter' },
    { label: 'Star Wars', query: 'Star Wars' },
    { label: 'Lord of the Rings', query: 'Lord of the Rings' },
    { label: 'Spider-Man', query: 'Spider-Man' },
    { label: 'Matrix', query: 'Matrix' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cinematic Hero Section */}
      <section className="relative w-full overflow-hidden border-b border-white/10 bg-gradient-to-b from-cinema-900 via-cinema-950 to-cinema-950">
        {/* Background Ambient Glow & Poster Texture */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cinema-red/15 rounded-full blur-[140px]" />
          <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cinema-red/15 border border-cinema-red/30 text-cinema-red text-xs sm:text-sm font-semibold mb-6 shadow-glow-red animate-fade-in">
              <Flame className="w-4 h-4 text-cinema-red animate-pulse" />
              <span>Explore Over 200,000+ Movies & Series</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-white mb-6 leading-none">
              Your Gateway to <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cinema-red via-red-500 to-amber-500">
                Cinematic Wonder
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-300 mb-10 max-w-2xl font-normal leading-relaxed">
              Discover blockbusters, critically acclaimed gems, and trending series. Check live IMDb ratings, detailed cast info, and build your ultimate personal watchlist.
            </p>

            {/* Hero Search Bar */}
            <div className="w-full max-w-2xl mb-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchSubmit();
                }}
              >
                <SearchBar
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                  type={selectedType}
                  onTypeChange={setSelectedType}
                  year={selectedYear}
                  onYearChange={setSelectedYear}
                  searchHistory={searchHistory}
                  onSelectHistory={handleSelectHistory}
                  onClearHistory={handleClearHistory}
                  onRemoveHistoryItem={handleRemoveHistoryItem}
                  placeholder="Search movies, TV shows, actors, directors..."
                  showFilters={true}
                />
              </form>
            </div>

            {/* Quick Suggestions Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cinema-gold" />
                Popular:
              </span>
              {popularSuggestions.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSearchSubmit(item.query)}
                  className="px-3 py-1 rounded-full bg-cinema-850/80 hover:bg-cinema-red hover:text-white border border-slate-700/60 hover:border-cinema-red text-slate-300 transition-all duration-200"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Body Discovery Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 flex-1">
        {/* Spotlight Featured Movie Section */}
        {featuredMovie && (
          <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-cinema-900 via-cinema-850 to-cinema-950 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-12">
              {/* Featured Poster */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-56 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 group">
                  <img
                    src={featuredMovie.Poster}
                    alt={featuredMovie.Title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-cinema-red text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-glow-red uppercase tracking-wider">
                    Spotlight
                  </div>
                </div>
              </div>

              {/* Featured Meta Info */}
              <div className="lg:col-span-8 space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    {featuredMovie.Genre}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {featuredMovie.Year}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-medium">
                    {featuredMovie.Runtime}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-medium">
                    {featuredMovie.Rated}
                  </span>
                </div>

                <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                  {featuredMovie.Title}
                </h2>

                {/* Rating & Awards */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cinema-gold/10 border border-cinema-gold/30 text-cinema-gold font-bold">
                    <Star className="w-4 h-4 fill-cinema-gold" />
                    <span>{featuredMovie.imdbRating} / 10</span>
                    <span className="text-xs font-normal text-slate-400 ml-1">
                      ({featuredMovie.imdbVotes} votes)
                    </span>
                  </div>

                  {featuredMovie.Awards && featuredMovie.Awards !== 'N/A' && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <Award className="w-4 h-4 text-cinema-gold shrink-0" />
                      <span>{featuredMovie.Awards}</span>
                    </div>
                  )}
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {featuredMovie.Plot}
                </p>

                {/* Cast info */}
                <div className="text-xs text-slate-400 space-y-1 pt-1">
                  <div>
                    <span className="text-slate-200 font-medium">Director: </span>
                    {featuredMovie.Director}
                  </div>
                  <div>
                    <span className="text-slate-200 font-medium">Starring: </span>
                    {featuredMovie.Actors}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    to={`/movie/${featuredMovie.imdbID}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cinema-red hover:bg-cinema-red-hover text-white font-semibold text-sm shadow-glow-red transition-all duration-200 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>View Movie Details</span>
                  </Link>

                  <button
                    onClick={() => toggleFavorite(featuredMovie)}
                    type="button"
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      isFavorite(featuredMovie.imdbID)
                        ? 'bg-cinema-red/20 text-cinema-red border-cinema-red shadow-glow-red'
                        : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite(featuredMovie.imdbID)
                          ? 'fill-cinema-red text-cinema-red'
                          : ''
                      }`}
                    />
                    <span>
                      {isFavorite(featuredMovie.imdbID)
                        ? 'In Watchlist'
                        : 'Add to Watchlist'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recently Searched Movies Section (if any exists) */}
        {searchHistory && searchHistory.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-cinema-red" />
                <h3 className="font-display font-bold text-xl text-white">
                  Recently Searched
                </h3>
              </div>
              <button
                onClick={handleClearHistory}
                className="text-xs text-slate-400 hover:text-cinema-red transition-colors"
              >
                Clear History
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectHistory(item)}
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-cinema-850 hover:bg-cinema-700 border border-white/5 hover:border-cinema-red/50 text-sm text-slate-200 hover:text-white transition-all shadow-sm"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cinema-red" />
                  <span>{item}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Curated Discovery Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-cinema-red text-xs font-bold uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Handpicked for you</span>
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                Featured & Masterpieces
              </h3>
            </div>

            <Link
              to="/search?q=movie"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cinema-red hover:text-red-400 transition-colors self-start sm:self-auto"
            >
              <span>Explore All Titles</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <SkeletonGrid count={8} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {discoveryMovies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

