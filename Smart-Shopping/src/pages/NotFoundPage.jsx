import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import { Home, Compass, AlertCircle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <div className="space-y-2">
        <span className="text-4xl sm:text-6xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
          404
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          The page you are looking for doesn't exist or has been moved to a new URL.
        </p>
      </div>

      <div className="w-full">
        <SearchBar placeholder="Search for products instead..." />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
        >
          <span>Explore Shop</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
