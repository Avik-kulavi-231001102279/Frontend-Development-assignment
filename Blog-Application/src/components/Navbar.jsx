import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { PenSquare, Sun, Moon, Menu, X, Compass, PlusCircle, Info, Home as HomeIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-icon-box">
            <PenSquare size={20} className="brand-icon" />
          </div>
          <span className="brand-name">
            Blog<span className="brand-accent">Sphere</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <HomeIcon size={16} />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/blogs"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Compass size={16} />
            <span>Explore Blogs</span>
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Info size={16} />
            <span>About</span>
          </NavLink>
        </nav>

        {/* Right Action Controls */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Create Blog Button */}
          <Link to="/create" className="btn btn-primary btn-navbar-cta">
            <PlusCircle size={16} />
            <span>Create Blog</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={closeMobileMenu}>
          <nav
            className="mobile-menu-drawer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile navigation"
          >
            <div className="mobile-menu-header">
              <span className="brand-name">Blog<span className="brand-accent">Sphere</span></span>
              <button
                type="button"
                className="mobile-close-btn"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-nav-links">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <HomeIcon size={18} />
                <span>Home</span>
              </NavLink>
              <NavLink
                to="/blogs"
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Compass size={18} />
                <span>Explore Blogs</span>
              </NavLink>
              <NavLink
                to="/create"
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <PlusCircle size={18} />
                <span>Create Blog</span>
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Info size={18} />
                <span>About</span>
              </NavLink>
            </div>

            <div className="mobile-menu-footer">
              <button
                type="button"
                className="btn btn-secondary mobile-theme-btn"
                onClick={toggleTheme}
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                <span>{theme === 'light' ? 'Dark Theme' : 'Light Theme'}</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

