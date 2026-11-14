import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-cinema-950 text-slate-100 transition-colors duration-200">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Page Body */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Bottom Footer */}
            <Footer />

            {/* Floating Global Widgets */}
            <Toast />
            <ScrollToTop />
          </div>
        </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

