import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-cinema-850 border border-white/10 flex items-center justify-center text-cinema-red shadow-2xl">
          <Film className="w-12 h-12" />
        </div>
      </div>

      <span className="font-mono text-sm uppercase tracking-widest text-cinema-red font-bold mb-2">
        Error 404 • Cut!
      </span>

      <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
        Scene Not Found
      </h1>

      <p className="text-slate-400 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
        The cinematic feature you are looking for has been moved, removed, or never existed in our reel.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cinema-red hover:bg-cinema-red-hover text-white text-sm font-semibold shadow-glow-red transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cinema-850 hover:bg-cinema-750 text-slate-200 border border-white/10 text-sm font-semibold transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Search Cinema</span>
        </Link>
      </div>
    </div>
  );
}

