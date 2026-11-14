import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Star,
  Clock,
  Calendar,
  Film,
  Award,
  Globe,
  MapPin,
  Users,
  User,
  PenTool,
  DollarSign,
  Share2,
  ExternalLink,
  ShieldCheck,
  Tv,
} from 'lucide-react';
import { getMovieDetailsById } from '../services/movieApi';
import { useFavorites } from '../context/FavoritesContext';
import { SkeletonMovieDetails } from '../components/SkeletonCard';
import ErrorMessage from '../components/ErrorMessage';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchDetails() {
      if (!id) return;

      setLoading(true);
      setError(null);
      setImageError(false);

      try {
        const data = await getMovieDetailsById(id, 'full');
        if (isMounted) {
          setMovie(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load movie details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDetails();
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <SkeletonMovieDetails />;
  }

  if (error || !movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <ErrorMessage
          title="Movie Details Unavailable"
          message={error || 'Unable to retrieve information for this movie.'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const {
    Title = 'Untitled',
    Year = 'N/A',
    Rated = 'N/A',
    Released = 'N/A',
    Runtime = 'N/A',
    Genre = '',
    Director = 'N/A',
    Writer = 'N/A',
    Actors = 'N/A',
    Plot = 'No synopsis available.',
    Language = 'N/A',
    Country = 'N/A',
    Awards = 'N/A',
    Poster,
    Ratings = [],
    Metascore,
    imdbRating,
    imdbVotes,
    imdbID,
    Type = 'movie',
    BoxOffice,
    Production,
  } = movie;

  const favorited = isFavorite(imdbID);
  const hasPoster = Poster && Poster !== 'N/A' && !imageError;
  const genres = Genre ? Genre.split(',').map((g) => g.trim()) : [];

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `CineScope – ${Title}`,
          text: `Check out ${Title} (${Year}) on CineScope!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      // User dismissed share
    }
  };

  return (
    <div className="relative min-h-screen pb-16">
      {/* Background ambient backdrop glow */}
      {hasPoster && (
        <div className="absolute top-0 inset-x-0 h-96 overflow-hidden pointer-events-none opacity-20 filter blur-3xl scale-125 z-0">
          <img src={Poster} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 z-10">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cinema-850 hover:bg-cinema-700 text-slate-200 hover:text-white text-sm font-semibold border border-white/10 transition-all shadow-sm active:scale-95"
            aria-label="Back to search"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Share link button */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-cinema-850 hover:bg-cinema-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Share movie"
              aria-label="Share movie link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copied && (
              <span className="text-xs font-semibold text-emerald-400 bg-cinema-900 border border-emerald-500/30 px-2 py-1 rounded-md">
                Link copied!
              </span>
            )}

            {/* External IMDb Link */}
            <a
              href={`https://www.imdb.com/title/${imdbID}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cinema-gold/10 hover:bg-cinema-gold/20 text-cinema-gold border border-cinema-gold/30 text-xs font-bold transition-colors"
              title="View on IMDb"
            >
              <span>IMDb</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Poster Column (Left) */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-cinema-900 group">
              {hasPoster ? (
                <img
                  src={Poster}
                  alt={Title}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-cinema-900 text-slate-500">
                  <Film className="w-16 h-16 mb-4 text-slate-600" />
                  <span className="text-sm font-semibold text-slate-400">{Title}</span>
                  <span className="text-xs text-slate-500 mt-1 uppercase">No Poster Available</span>
                </div>
              )}

              {/* Type Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-white">
                  {Type}
                </span>
              </div>
            </div>

            {/* Add to Favorites Prominent Button */}
            <button
              onClick={() => toggleFavorite(movie)}
              type="button"
              className={`w-full max-w-sm mt-5 py-3.5 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl ${
                favorited
                  ? 'bg-cinema-red text-white shadow-glow-red hover:bg-cinema-red-hover'
                  : 'bg-cinema-800 hover:bg-cinema-700 text-slate-100 border border-white/10 hover:border-cinema-red/50'
              }`}
            >
              <Heart
                className={`w-5 h-5 transition-transform duration-200 ${
                  favorited ? 'fill-white scale-110' : ''
                }`}
              />
              <span>{favorited ? 'In Your Watchlist (Remove)' : 'Add to Watchlist'}</span>
            </button>
          </div>

          {/* Info Details Column (Right) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Title & Header Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {genres.map((g) => (
                  <Link
                    key={g}
                    to={`/search?q=${encodeURIComponent(g)}`}
                    className="px-3 py-1 rounded-full bg-cinema-850 hover:bg-cinema-red hover:text-white border border-white/10 text-xs font-semibold text-slate-300 transition-colors"
                  >
                    {g}
                  </Link>
                ))}
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                {Title}
              </h1>

              {/* Meta row: Year, Rated, Runtime, Released */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  <Calendar className="w-3.5 h-3.5 text-cinema-red" />
                  {Year}
                </span>

                <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cinema-red" />
                  {Rated}
                </span>

                <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  <Clock className="w-3.5 h-3.5 text-cinema-red" />
                  {Runtime}
                </span>

                <span className="text-slate-500 font-mono text-xs">
                  ID: {imdbID}
                </span>
              </div>
            </div>

            {/* Ratings Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* IMDb Rating */}
              <div className="p-4 rounded-2xl bg-cinema-850 border border-white/5 flex flex-col justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-cinema-gold fill-cinema-gold" />
                  IMDb Rating
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-cinema-gold">
                    {imdbRating && imdbRating !== 'N/A' ? imdbRating : '—'}
                  </span>
                  <span className="text-xs text-slate-400">/ 10</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1">
                  {imdbVotes && imdbVotes !== 'N/A' ? `${imdbVotes} votes` : 'No votes recorded'}
                </span>
              </div>

              {/* Metascore */}
              <div className="p-4 rounded-2xl bg-cinema-850 border border-white/5 flex flex-col justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Metascore
                </span>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-2xl font-black ${
                      Number(Metascore) >= 60
                        ? 'text-emerald-400'
                        : Number(Metascore) >= 40
                        ? 'text-amber-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {Metascore && Metascore !== 'N/A' ? Metascore : '—'}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1">Critic reviews</span>
              </div>

              {/* Box Office / Type */}
              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-cinema-850 border border-white/5 flex flex-col justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Box Office
                </span>
                <span className="text-xl font-bold text-slate-100 truncate">
                  {BoxOffice && BoxOffice !== 'N/A' ? BoxOffice : 'Undisclosed'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">Cumulative Gross</span>
              </div>
            </div>

            {/* Synopsis / Plot */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-lg text-white">
                Storyline & Synopsis
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal bg-cinema-850/50 p-5 rounded-2xl border border-white/5">
                {Plot}
              </p>
            </div>

            {/* Cast & Crew Grid */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-white">
                Cast & Production Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Director */}
                <div className="p-4 rounded-2xl bg-cinema-850/80 border border-white/5 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-cinema-800 text-cinema-red shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Director
                    </span>
                    <span className="text-sm font-medium text-slate-100">{Director}</span>
                  </div>
                </div>

                {/* Writers */}
                <div className="p-4 rounded-2xl bg-cinema-850/80 border border-white/5 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-cinema-800 text-cinema-red shrink-0">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Writer(s)
                    </span>
                    <span className="text-sm font-medium text-slate-100">{Writer}</span>
                  </div>
                </div>

                {/* Starring Actors */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-cinema-850/80 border border-white/5 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-cinema-800 text-cinema-red shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Starring Actors
                    </span>
                    <span className="text-sm font-medium text-slate-100">{Actors}</span>
                  </div>
                </div>

                {/* Language & Country */}
                <div className="p-4 rounded-2xl bg-cinema-850/80 border border-white/5 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-cinema-800 text-cinema-red shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Spoken Languages
                    </span>
                    <span className="text-sm font-medium text-slate-100">{Language}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cinema-850/80 border border-white/5 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-cinema-800 text-cinema-red shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Country of Origin
                    </span>
                    <span className="text-sm font-medium text-slate-100">{Country}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Awards & Honors */}
            {Awards && Awards !== 'N/A' && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-cinema-850 to-cinema-850 border border-amber-500/20 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-cinema-gold shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-cinema-gold mb-1">
                    Recognition & Honors
                  </h4>
                  <p className="text-sm text-slate-200 font-medium">{Awards}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

