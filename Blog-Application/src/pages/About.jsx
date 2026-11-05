import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Zap,
  ShieldCheck,
  Code2,
  Database,
  Palette,
  Terminal,
  Cpu,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function About() {
  const techStack = [
    {
      name: 'React.js 18',
      desc: 'Component-driven frontend with React Hooks, Context API, and state isolation.',
      category: 'Frontend Framework'
    },
    {
      name: 'Vite 6',
      desc: 'Next-generation frontend tooling providing lightning-fast Hot Module Replacement.',
      category: 'Build Tool'
    },
    {
      name: 'Axios',
      desc: 'Promise-based HTTP client for all REST operations with robust timeout & error handling.',
      category: 'HTTP Client'
    },
    {
      name: 'JSON Server',
      desc: 'Zero-config full REST mock API server persisting all data directly to db.json.',
      category: 'REST Mock Backend'
    },
    {
      name: 'React Router v6',
      desc: 'Declarative, dynamic client-side routing with URL search param synchronizations.',
      category: 'Navigation'
    },
    {
      name: 'Lucide React',
      desc: 'Clean, consistent SVG icon set for modern SaaS interfaces.',
      category: 'UI Icons'
    }
  ];

  const highlights = [
    'Complete REST CRUD lifecycle (Create, Read, Update, Delete) via dedicated Axios client.',
    'Strict 1000-word content limit with live word counter and warning alerts.',
    'Rich media integration with YouTube, Vimeo, and direct video embeds.',
    'Comprehensive search across titles, authors, categories, and content keywords.',
    'Clean category filtering (8 predefined categories) with live count tags.',
    'Dual-theme architecture with seamless dark and light modes.',
    'Non-intrusive Toast notification system and accessible delete confirmation dialogs.',
    'Zero localStorage dependency for blog storage; 100% db.json persistence.'
  ];

  return (
    <div className="about-page-root">
      {/* Header */}
      <section className="about-hero-section">
        <div className="container">
          <div className="about-hero-badge">
            <Sparkles size={14} />
            <span>Academic & Portfolio Project</span>
          </div>
          <h1 className="about-hero-title">About BlogSphere</h1>
          <p className="about-hero-subtitle">
            A modern, production-grade blog management system demonstrating full-stack frontend design principles, clean REST API consumption, and intuitive user experiences.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container about-main-container">
        {/* Architecture & Mission Section */}
        <div className="about-section-card">
          <div className="about-card-header">
            <div className="about-icon-pill">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="about-card-title">Architecture & System Overview</h2>
              <p className="about-card-desc">Designed with clear boundaries between UI components, business hooks, and network services.</p>
            </div>
          </div>

          <div className="about-text-content">
            <p>
              <strong>BlogSphere</strong> is built to satisfy strict frontend engineering specifications while delivering a premium SaaS look and feel. Every blog post is managed through a central mock REST API powered by <code>json-server</code>, simulating real-world production client-server communication.
            </p>
            <p>
              The application strictly isolates API requests inside <code>src/services/api.js</code> using Axios, ensuring that React components remain purely presentational and reactive. Data is never cached or stored in browser storage (<code>localStorage</code> / <code>sessionStorage</code>), guaranteeing that all updates propagate cleanly across the server.
            </p>
          </div>
        </div>

        {/* Technology Stack Grid */}
        <div className="about-section-card">
          <div className="about-card-header">
            <div className="about-icon-pill">
              <Cpu size={22} />
            </div>
            <div>
              <h2 className="about-card-title">Technology Stack</h2>
              <p className="about-card-desc">Modern web tools selected for performance, maintainability, and clean code.</p>
            </div>
          </div>

          <div className="tech-stack-grid">
            {techStack.map((tech) => (
              <div key={tech.name} className="tech-card">
                <span className="tech-badge">{tech.category}</span>
                <h3 className="tech-name">{tech.name}</h3>
                <p className="tech-desc">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features List */}
        <div className="about-section-card">
          <div className="about-card-header">
            <div className="about-icon-pill">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="about-card-title">Core Project Highlights</h2>
              <p className="about-card-desc">Every requirement designed and verified for academic excellence.</p>
            </div>
          </div>

          <div className="features-checklist-grid">
            {highlights.map((item, idx) => (
              <div key={idx} className="checklist-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Action CTA */}
        <div className="about-cta-banner">
          <div className="about-cta-inner">
            <div>
              <h3 className="about-cta-title">Ready to explore the platform?</h3>
              <p className="about-cta-text">
                Read community articles or publish your own technical perspective right now.
              </p>
            </div>
            <div className="about-cta-buttons">
              <Link to="/blogs" className="btn btn-primary">
                <span>Browse All Blogs</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/create" className="btn btn-secondary">
                <span>Create a Blog</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

