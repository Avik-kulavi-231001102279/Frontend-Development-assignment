import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Film,
  RotateCcw,
  SlidersHorizontal,
  X,
  Sparkles,
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import Pagination from '../components/Pagination';
import ErrorMessage from '../components/ErrorMessage';
import { searchMovies } from '../services/movieApi';
import { useDebounce } from '../hooks/useDebounce';
import {
  getStoredSearchHistory,
  addSearchHistoryTerm,
  clearStoredSearchHistory,
  removeSearchHistoryTerm,
} from '../utils/localStorage';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || '';
  const initialYear = searchParams.get('year') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // Local inputs
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Debounced query with 500ms delay
  const debouncedQuery = useDebounce(searchInput, 500);

  // API State
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search History State
  const [searchHistory, setSearchHistory] = useState(getStoredSearchHistory);

  // AbortController ref to cancel outdated pending requests (Search Optimization & Race Condition Prevention)
  const abortControllerRef = useRef(null);

  // Synchronize when URL searchParams change directly (e.g. back/forward navigation)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const t = searchParams.get('type') || '';
    const y = searchParams.get('year') || '';
    const p = parseInt(searchParams.get('page') || '1', 10);

    if (q !== searchInput) setSearchInput(q);
    if (t !== selectedType) setSelectedType(t);
    if (y !== selectedYear) setSelectedYear(y);
    if (p !== currentPage) setCurrentPage(p);
  }, [searchParams]);

  // Main search execution function
  const executeSearch = useCallback(
    async (query, page, type, year) => {
      const cleanQuery = (query || '').trim();

      // Enforce minimum 2 characters
      if (cleanQuery.length < 2) {
        setMovies([]);
        setTotalResults(0);
        setTotalPages(0);
        setLoading(false);
        setError(null);
        return;
      }

      // Cancel any in-flight request to prevent race conditions & outdated responses
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this specific request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const result = await searchMovies({
          query: cleanQuery,
          page,
          type,
          year,
          signal: controller.signal,
        });

        // If request was canceled, don't update state
        if (controller.signal.aborted) return;

        if (result.error) {
          setMovies([]);
          setTotalResults(0);
          setTotalPages(0);
          setError(result.error);
        } else {
          setMovies(result.movies);
          setTotalResults(result.totalResults);
          setTotalPages(result.totalPages);
          setError(null);

          // Save valid search to search history
          const updatedHistory = addSearchHistoryTerm(cleanQuery);
          setSearchHistory(updatedHistory);
        }
      } catch (err) {
        if (controller.signal.aborted) {
          // Normal cancellation from newer query; ignore
          return;
        }
        setError(err.message || 'Failed to search movies.');
        setMovies([]);
        setTotalResults(0);
        setTotalPages(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  // Trigger search when debouncedQuery, type, year, or page changes
  useEffect(() => {
    // Check if URL parameters actually differ before updating
    const currentQ = searchParams.get('q') || '';
    const currentT = searchParams.get('type') || '';
    const currentY = searchParams.get('year') || '';
    const currentP = searchParams.get('page') || '1';

    const targetQ = debouncedQuery.trim();
    const targetT = selectedType;
    const targetY = selectedYear;
    const targetP = currentPage.toString();

    const needsUrlUpdate =
      currentQ !== targetQ ||
      currentT !== targetT ||
      currentY !== targetY ||
      (currentPage > 1 ? currentP !== targetP : searchParams.has('page'));

    if (needsUrlUpdate) {
      const params = {};
      if (targetQ) params.q = targetQ;
      if (targetT) params.type = targetT;
      if (targetY) params.year = targetY;
      if (currentPage > 1) params.page = targetP;
      setSearchParams(params, { replace: true });
    }

    executeSearch(debouncedQuery, currentPage, selectedType, selectedYear);

    // Cleanup abort controller on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery, selectedType, selectedYear, currentPage, executeSearch, searchParams, setSearchParams]);

  // When input query changes, reset to page 1
  const handleQueryChange = (val) => {
    setSearchInput(val);
    setCurrentPage(1);
  };

  const handleTypeChange = (val) => {
    setSelectedType(val);
    setCurrentPage(1);
  };

  const handleYearChange = (val) => {
    setSelectedYear(val);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSelectHistory = (term) => {
    setSearchInput(term);
    setCurrentPage(1);
  };

  const handleClearHistory = () => {
    clearStoredSearchHistory();
    setSearchHistory([]);
  };

  const handleRemoveHistoryItem = (term) => {
    const updated = removeSearchHistoryTerm(term);
    setSearchHistory(updated);
  };

  const handleResetFilters = () => {
    setSelectedType('');
    setSelectedYear('');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedType !== '' || selectedYear !== '';

  return (
    <div className="min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header section with SearchBar */}
      <div className="space-y-6 mb-8">
        <div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mb-2">
            Explore & Search
          </h1>
          <p className="text-sm text-slate-400">
            Real-time debounced search powered by OMDb API with live type and year filtering.
          </p>
        </div>

        {/* Search Bar Component */}
        <SearchBar
          query={searchInput}
          onQueryChange={handleQueryChange}
          type={selectedType}
          onTypeChange={handleTypeChange}
          year={selectedYear}
          onYearChange={handleYearChange}
          searchHistory={searchHistory}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
          onRemoveHistoryItem={handleRemoveHistoryItem}
          loading={loading}
          showFilters={true}
        />

        {/* Quick Filter Status & Active Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            {searchInput.trim().length >= 2 ? (
              <span className="text-slate-300">
                Searching for <strong className="text-white">"{searchInput.trim()}"</strong>
              </span>
            ) : (
              <span className="text-slate-400 italic">
                Type at least 2 characters to search...
              </span>
            )}

            {selectedType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cinema-red/15 border border-cinema-red/40 text-cinema-red font-medium">
                Type: {selectedType.toUpperCase()}
                <button
                  onClick={() => handleTypeChange('')}
                  className="hover:text-white ml-0.5"
                  aria-label="Remove type filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedYear && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cinema-gold/15 border border-cinema-gold/40 text-cinema-gold font-medium">
                Year: {selectedYear}
                <button
                  onClick={() => handleYearChange('')}
                  className="hover:text-white ml-0.5"
                  aria-label="Remove year filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-white underline ml-2 transition-colors"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Result counter badge */}
          {totalResults > 0 && !loading && (
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-cinema-850 border border-white/10 text-slate-300">
              {totalResults.toLocaleString()} titles found
            </div>
          )}
        </div>
      </div>

      {/* Main Results View */}
      {searchInput.trim().length < 2 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass-panel rounded-3xl border border-white/5 my-8">
          <div className="w-16 h-16 rounded-2xl bg-cinema-800/80 border border-slate-700/60 flex items-center justify-center text-cinema-red mb-4 shadow-xl">
            <Film className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="font-display font-bold text-xl text-white mb-2">
            Start Your Movie Discovery
          </h3>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Enter a movie title, franchise, or show name above to see detailed results from the OMDb database.
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-lg">
            {['Inception', 'Interstellar', 'The Dark Knight', 'Avengers', 'Breaking Bad', 'Stranger Things'].map(
              (sample) => (
                <button
                  key={sample}
                  onClick={() => handleQueryChange(sample)}
                  className="px-3 py-1.5 rounded-xl bg-cinema-800 hover:bg-cinema-red text-slate-300 hover:text-white text-xs border border-white/5 transition-all"
                >
                  {sample}
                </button>
              )
            )}
          </div>
        </div>
      ) : (
        <>
          <MovieGrid
            movies={movies}
            loading={loading}
            error={error}
            skeletonCount={10}
            emptyMessage={`No movies found matching "${searchInput}". Try adjusting your query or filters.`}
            onRetry={() =>
              executeSearch(debouncedQuery, currentPage, selectedType, selectedYear)
            }
          />

          {/* Pagination */}
          {!loading && !error && movies.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </>
      )}
    </div>
  );
}
