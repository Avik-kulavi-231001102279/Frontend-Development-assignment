import React from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, Github, Twitter, Linkedin, Heart, ExternalLink } from 'lucide-react';
import { CATEGORIES } from '../utils/helpers';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-root">
      <div className="footer-top">
        <div className="footer-container">
          {/* Brand info */}
          <div className="footer-column brand-col">
            <Link to="/" className="footer-brand">
              <div className="brand-icon-box">
                <PenSquare size={18} className="brand-icon" />
              </div>
              <span className="brand-name">
                Blog<span className="brand-accent">Sphere</span>
              </span>
            </Link>
            <p className="footer-tagline">
              A modern, high-performance blog publishing and knowledge-sharing platform built with React, Vite, Axios, and REST architecture.
            </p>
            <div className="footer-tech-tags">
              <span className="tech-tag">React 18</span>
              <span className="tech-tag">Vite</span>
              <span className="tech-tag">Axios</span>
              <span className="tech-tag">JSON Server</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/blogs">Explore Blogs</Link></li>
              <li><Link to="/create">Create New Post</Link></li>
              <li><Link to="/about">About Platform</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-column">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <Link to={`/blogs?category=${encodeURIComponent(cat)}`}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Connect */}
          <div className="footer-column">
            <h4 className="footer-heading">Stay Connected</h4>
            <p className="footer-subtext">
              Subscribe to the curated weekly newsletter for engineering insights and creative perspectives.
            </p>
            <form className="footer-newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to BlogSphere updates!'); }}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="footer-newsletter-input"
                aria-label="Email subscription input"
              />
              <button type="submit" className="btn btn-primary footer-newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            © {currentYear} <strong>BlogSphere</strong>. Designed and developed with{' '}
            <Heart size={14} className="heart-icon" /> for Academic & Professional Demonstration.
          </p>
          <div className="footer-social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

