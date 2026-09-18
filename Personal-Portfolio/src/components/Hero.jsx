import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ArrowRight, Sparkles } from 'lucide-react';
import '../styles/Hero.css';

function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    /* Trigger entrance animations after mount */
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollTo = (e, target) => {
    e.preventDefault();
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <div className="hero__container">
        {/* Left content */}
        <div className={`hero__content ${loaded ? 'hero__content--visible' : ''}`}>
          {/* Status badge */}
          <div className="hero__badge">
            <Sparkles size={14} />
            <span>Available for Opportunities</span>
          </div>

          <p className="hero__greeting">Hi, I'm</p>

          <h1 className="hero__name">
            <span className="hero__name-first">Avik</span>
            <span className="hero__name-last">Kulavi</span>
          </h1>

          <p className="hero__title">
            <span className="hero__title-dot"></span>
            BCA Student
            <span className="hero__title-sep">•</span>
            Web Developer
          </p>

          <p className="hero__description">
            Passionate about building modern web applications and crafting
            clean, interactive user experiences. Currently pursuing BCA at
            Techno India University, Kolkata.
          </p>

          {/* CTA Buttons */}
          <div className="hero__cta">
            <a href="#projects" className="btn btn--primary" onClick={(e) => handleScrollTo(e, '#projects')}>
              View Projects
              <ArrowRight size={16} className="btn__icon" />
            </a>
            <a href="#contact" className="btn btn--outline" onClick={(e) => handleScrollTo(e, '#contact')}>
              Contact Me
            </a>
          </div>

          {/* Social links */}
          <div className="hero__socials">
            <a href="https://github.com/Avik-kulavi-231001102279" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hero__social-link">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/avik-kulavi/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hero__social-link">
              <Linkedin size={20} />
            </a>
            <a href="mailto:avikkulavi2005@outlook.com" aria-label="Email" className="hero__social-link">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Right – Profile visual */}
        <div className={`hero__visual ${loaded ? 'hero__visual--visible' : ''}`}>
          <div className="hero__image-wrapper">
            <div className="hero__image-glow" aria-hidden="true"></div>
            <div className="hero__image-ring" aria-hidden="true"></div>
            <img
              src="/7bf7218f-492b-4157-8d73-9fcbe7a77c6b.jpg"
              alt="Avik Kulavi – BCA Student and Web Developer"
              className="hero__image"
              width="380"
              height="380"
            />
          </div>
          {/* Floating decorative cards */}
          <div className="hero__float-card hero__float-card--1" aria-hidden="true">
            <span>⚛️</span> React.js
          </div>
          <div className="hero__float-card hero__float-card--2" aria-hidden="true">
            <span>🚀</span> Full Stack
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-indicator" aria-hidden="true">
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-wheel"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
