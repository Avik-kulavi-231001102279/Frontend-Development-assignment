import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Github, ExternalLink, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-cinema-950 border-t border-white/10 dark:border-white/10 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cinema-red to-black p-0.5 shadow-glow-red">
                <div className="w-full h-full bg-cinema-900 rounded-[10px] flex items-center justify-center">
                  <Film className="w-5 h-5 text-cinema-red" />
                </div>
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Cine<span className="text-cinema-red">Scope</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              CineScope is a premium movie discovery and exploration platform powered by the OMDb API.
              Browse millions of movies, TV shows, and series, inspect detailed film metrics, and curate your personalized watchlist.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="px-2 py-1 rounded bg-cinema-800 text-slate-300 border border-slate-700/50">React 18</span>
              <span className="px-2 py-1 rounded bg-cinema-800 text-slate-300 border border-slate-700/50">Vite</span>
              <span className="px-2 py-1 rounded bg-cinema-800 text-slate-300 border border-slate-700/50">Tailwind CSS</span>
              <span className="px-2 py-1 rounded bg-cinema-800 text-slate-300 border border-slate-700/50">OMDb API</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-slate-200 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cinema-red" />
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-slate-400 hover:text-white transition-colors">
                  Explore & Search
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-slate-400 hover:text-white transition-colors">
                  My Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Source & External */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-slate-200 mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.omdbapi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  OMDb API Service
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.imdb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  IMDb Database
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <span className="text-xs text-slate-500 block mt-2">
                  Movie data, posters, and ratings provided by Open Movie Database (OMDb).
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} CineScope. Academic Frontend Demonstration Project.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-cinema-red fill-cinema-red inline" />
            <span>for cinema enthusiasts.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

