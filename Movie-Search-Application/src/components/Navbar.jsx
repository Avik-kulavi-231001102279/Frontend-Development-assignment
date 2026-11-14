import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Heart, Search, Menu, X, Compass } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { favoritesCount } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickQuery.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(quickQuery.trim())}`);
      setQuickQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-cinema-red text-white shadow-glow-red font-semibold'
        : 'text-slate-300 dark:text-slate-300 hover:text-white hover:bg-white/10 dark:hover:bg-cinema-800'
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
      isActive
        ? 'bg-cinema-red text-white font-semibold'
        : 'text-slate-300 hover:bg-white/10'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cinema-red via-cinema-red-deep to-black p-0.5 shadow-glow-red group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-cinema-900 rounded-[10px] flex items-center justify-center">
                <Film className="w-5 h-5 text-cinema-red group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white flex items-center">
                Cine<span className="text-cinema-red">Scope</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-slate-400 -mt-1">
                Movie Discovery
              </span>
            </div>
          </Link>

          {/* Desktop Search Quick Bar */}
          <form
            onSubmit={handleQuickSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Quick search movies, series..."
                className="w-full pl-10 pr-4 py-2 bg-cinema-850/70 border border-slate-700/60 rounded-full text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cinema-red focus:ring-1 focus:ring-cinema-red transition-all"
              />
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" end className={navLinkClasses}>
              <Film className="w-4 h-4" />
              <span>Home</span>
            </NavLink>

            <NavLink to="/search" className={navLinkClasses}>
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </NavLink>

            <NavLink to="/favorites" className={navLinkClasses}>
              <Heart className="w-4 h-4" />
              <span>Watchlist</span>
              {favoritesCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-white text-cinema-red shadow">
                  {favoritesCount}
                </span>
              )}
            </NavLink>

            <div className="h-6 w-px bg-slate-700/60 mx-1" />

            <ThemeToggle />
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-cinema-800 transition-colors focus:outline-none focus:ring-2 focus:ring-cinema-red"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-6 animate-fade-in">
          {/* Mobile Quick Search */}
          <form onSubmit={handleQuickSearch} className="mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search movies, series..."
                className="w-full pl-10 pr-4 py-2.5 bg-cinema-850/90 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cinema-red focus:ring-1 focus:ring-cinema-red"
              />
            </div>
          </form>

          <nav className="flex flex-col gap-2">
            <NavLink
              to="/"
              end
              className={mobileNavLinkClasses}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                <Film className="w-5 h-5 text-cinema-red" />
                <span>Home</span>
              </span>
            </NavLink>

            <NavLink
              to="/search"
              className={mobileNavLinkClasses}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-cinema-red" />
                <span>Search & Discover</span>
              </span>
            </NavLink>

            <NavLink
              to="/favorites"
              className={mobileNavLinkClasses}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-cinema-red" />
                <span>My Watchlist</span>
              </span>
              {favoritesCount > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cinema-red text-white">
                  {favoritesCount}
                </span>
              )}
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

