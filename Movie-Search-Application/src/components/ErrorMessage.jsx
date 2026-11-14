import React from 'react';
import { AlertCircle, RefreshCw, SearchX, KeyRound } from 'lucide-react';

export default function ErrorMessage({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching movies.',
  onRetry,
  type = 'error', // 'error' | 'empty' | 'apikey'
}) {
  const isApiKeyError =
    type === 'apikey' ||
    message.toLowerCase().includes('api key') ||
    message.toLowerCase().includes('key not provided');

  const isEmpty = type === 'empty' || message.toLowerCase().includes('not found');

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-lg mx-auto animate-fade-in">
      <div className="relative mb-5">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl ${
            isApiKeyError
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : isEmpty
              ? 'bg-cinema-800/80 border-slate-700/60 text-slate-400'
              : 'bg-cinema-red/10 border-cinema-red/30 text-cinema-red'
          }`}
        >
          {isApiKeyError ? (
            <KeyRound className="w-8 h-8" />
          ) : isEmpty ? (
            <SearchX className="w-8 h-8" />
          ) : (
            <AlertCircle className="w-8 h-8" />
          )}
        </div>
      </div>

      <h3 className="font-display font-bold text-xl text-slate-100 mb-2">
        {isApiKeyError
          ? 'OMDb API Key Notice'
          : isEmpty
          ? 'No Results Found'
          : title}
      </h3>

      <p className="text-sm text-slate-400 mb-6 leading-relaxed">
        {isApiKeyError
          ? 'Please verify that your OMDb API key is configured in your .env file as VITE_OMDB_API_KEY. You can request a free key at omdbapi.com.'
          : message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cinema-red hover:bg-cinema-red-hover text-white text-sm font-semibold shadow-glow-red transition-all duration-200 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

