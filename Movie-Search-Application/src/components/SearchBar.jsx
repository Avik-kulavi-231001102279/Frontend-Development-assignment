import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Filter,
  Calendar,
  Clock,
  Trash2,
  Film,
  Tv,
  Video,
  Sparkles,
} from 'lucide-react';

export default function SearchBar({
  query = '',
  onQueryChange,
  type = '',
  onTypeChange,
  year = '',
  onYearChange,
  searchHistory = [],
  onSelectHistory,
  onClearHistory,
  onRemoveHistoryItem,
  loading = false,
  placeholder = 'Search by movie or series title (min 2 letters)...',
  showFilters = true,
  className = '',
}) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    onQueryChange('');
  };

  const currentYear = new Date().getFullYear();
  // Quick year options for filter
  const yearOptions = [
    { value: '', label: 'All Years' },
    { value: `${currentYear}`, label: `${currentYear} (New)` },
    { value: `${currentYear - 1}`, label: `${currentYear - 1}` },
    { value: `${currentYear - 2}`, label: `${currentYear - 2}` },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2015', label: '2015' },
    { value: '2010', label: '2010' },
    { value: '2000', label: '2000' },
    { value: '1999', label: '1999' },
    { value: '1994', label: '1994' },
  ];

  return (
    <div ref={containerRef} className={`w-full relative ${className}`}>
      {/* Main Search Input Box */}
      <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-cinema-850/90 dark:bg-cinema-850/90 border border-slate-700/70 focus-within:border-cinema-red rounded-2xl p-2 md:p-2.5 shadow-2xl backdrop-blur-md transition-all duration-300 focus-within:shadow-glow-red">
        {/* Input field wrapper */}
        <div className="relative flex-1 flex items-center">
          <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm md:text-base font-normal focus:outline-none pr-10 py-1.5"
            aria-label="Search movies"
          />

          {/* Right Action Icons: Spinner or Clear */}
          <div className="absolute right-2 flex items-center gap-1.5">
            {loading && (
              <div className="w-4 h-4 border-2 border-cinema-red border-t-transparent rounded-full animate-spin" />
            )}

            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters inline (Type & Year) */}
        {showFilters && (
          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-700/60 md:pl-3">
            {/* Type Filter Select */}
            <div className="relative flex items-center flex-1 md:flex-none">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={type}
                onChange={(e) => onTypeChange(e.target.value)}
                className="w-full md:w-auto appearance-none bg-cinema-800/80 hover:bg-cinema-700/80 border border-slate-700/70 text-xs sm:text-sm text-slate-200 font-medium pl-9 pr-8 py-2 rounded-xl focus:outline-none focus:border-cinema-red transition-colors cursor-pointer"
                aria-label="Filter by content type"
              >
                <option value="">All Types</option>
                <option value="movie">Movies</option>
                <option value="series">Series</option>
                <option value="episode">Episodes</option>
              </select>
            </div>

            {/* Release Year Filter Input or Select */}
            <div className="relative flex items-center flex-1 md:flex-none">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="number"
                min="1888"
                max={currentYear + 5}
                value={year}
                onChange={(e) => onYearChange(e.target.value)}
                placeholder="Year"
                className="w-full md:w-24 bg-cinema-800/80 hover:bg-cinema-700/80 border border-slate-700/70 text-xs sm:text-sm text-slate-200 font-medium pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-cinema-red transition-colors"
                aria-label="Filter by release year"
              />
            </div>
          </div>
        )}
      </div>

      {/* Search History Dropdown */}
      {isFocused && searchHistory && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-cinema-900 border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-30 backdrop-blur-xl animate-fade-in">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 px-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cinema-red" />
              Recent Searches
            </span>
            {onClearHistory && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-xs text-slate-400 hover:text-cinema-red transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 p-1 max-h-48 overflow-y-auto">
            {searchHistory.map((item, index) => (
              <div
                key={index}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cinema-800 hover:bg-cinema-700 border border-slate-700/50 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <span
                  onClick={() => {
                    onSelectHistory(item);
                    setIsFocused(false);
                  }}
                  className="hover:underline flex items-center gap-1"
                >
                  <Search className="w-3 h-3 text-slate-400 group-hover:text-cinema-red" />
                  {item}
                </span>

                {onRemoveHistoryItem && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveHistoryItem(item);
                    }}
                    className="text-slate-500 hover:text-cinema-red p-0.5 rounded transition-colors"
                    aria-label={`Remove ${item} from search history`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

