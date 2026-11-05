import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Layers,
  ShieldCheck,
  Zap,
  Calendar,
  Clock,
  User
} from 'lucide-react';
import { useBlogs } from '../hooks/useBlogs';
import BlogCard from '../components/BlogCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { CATEGORIES, formatDate, getReadingTime, getCategoryBadgeClass, DEFAULT_FALLBACK_IMAGE } from '../utils/helpers';

export default function Home() {
  const { blogs, loading, error, isOffline, fetchBlogs } = useBlogs();
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/blogs');
    }
  };

  // Sort blogs by createdAt descending
  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  const featuredBlog = sortedBlogs[0] || null;
  const latestBlogs = sortedBlogs.slice(1, 5);

  return (
    <div className="home-page-root">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="offline-notice-banner">
          <div className="container banner-inner">
            <span><strong>Server Notice:</strong> JSON Server is offline. Please start it with <code>npm run server</code> to load live posts.</span>
            <button className="btn btn-sm btn-secondary" onClick={fetchBlogs}>Retry</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-ambient-glow" aria-hidden="true" />
        <div className="hero-container">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>Modern SaaS Blogging Platform</span>
          </div>

          <h1 className="hero-title">
            Ideas Worth <span className="highlight-text">Sharing.</span>
          </h1>

          <p className="hero-subtitle">
            BlogSphere is a next-generation platform for engineers, creators, and thinkers.
            Discover in-depth engineering guides, explore diverse stories, and publish your own perspective.
          </p>

          {/* Hero Search Bar */}
          <form className="hero-search-form" onSubmit={handleHeroSearchSubmit}>
            <div className="hero-search-input-wrap">
              <Search className="hero-search-icon" size={20} />
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search articles by title, author, or keyword..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                aria-label="Search articles"
              />
            </div>
            <button type="submit" className="btn btn-primary hero-search-btn">
              <span>Search</span>
            </button>
          </form>

          {/* CTA Action Buttons */}
          <div className="hero-cta-group">
            <Link to="/blogs" className="btn btn-primary btn-lg">
              <Compass size={18} />
              <span>Explore Blogs</span>
            </Link>
            <Link to="/create" className="btn btn-secondary btn-lg">
              <PlusCircle size={18} />
              <span>Create Blog</span>
            </Link>
          </div>

          {/* Key metrics / social proof pills */}
          <div className="hero-stats-row">
            <div className="stat-item">
              <span className="stat-number">{blogs.length}</span>
              <span className="stat-label">Published Articles</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">8</span>
              <span className="stat-label">Core Categories</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">1000</span>
              <span className="stat-label">Words Max Limit</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">REST CRUD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Explorer Section */}
      <section className="section-categories">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Discover by Subject</span>
              <h2 className="section-title">Explore Categories</h2>
            </div>
            <Link to="/blogs" className="section-action-link">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((cat) => {
              const count = blogs.filter(b => b.category === cat).length;
              return (
                <Link
                  key={cat}
                  to={`/blogs?category=${encodeURIComponent(cat)}`}
                  className="category-card"
                >
                  <div className="category-card-inner">
                    <span className={`category-tag ${getCategoryBadgeClass(cat)}`}>
                      {cat}
                    </span>
                    <span className="category-card-count">
                      {count} {count === 1 ? 'article' : 'articles'}
                    </span>
                  </div>
                  <ArrowRight size={16} className="category-arrow" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Blog Section */}
      {loading ? (
        <section className="section-featured">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Article</h2>
            </div>
            <div className="skeleton skeleton-featured-banner"></div>
          </div>
        </section>
      ) : featuredBlog ? (
        <section className="section-featured">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-eyebrow">Handpicked Story</span>
                <h2 className="section-title">Featured Article</h2>
              </div>
            </div>

            <div className="featured-card">
              <div className="featured-image-wrapper">
                <img
                  src={featuredBlog.image || DEFAULT_FALLBACK_IMAGE}
                  alt={featuredBlog.title}
                  className="featured-image"
                  onError={(e) => { e.target.src = DEFAULT_FALLBACK_IMAGE; }}
                />
                <span className={`category-badge ${getCategoryBadgeClass(featuredBlog.category)}`}>
                  {featuredBlog.category}
                </span>
              </div>

              <div className="featured-content">
                <div className="featured-meta">
                  <span className="meta-item">
                    <Calendar size={14} />
                    <span>{formatDate(featuredBlog.createdAt)}</span>
                  </span>
                  <span className="meta-separator">•</span>
                  <span className="meta-item">
                    <Clock size={14} />
                    <span>{getReadingTime(featuredBlog.content)}</span>
                  </span>
                </div>

                <h3 className="featured-title">
                  <Link to={`/blogs/${featuredBlog.id}`}>
                    {featuredBlog.title}
                  </Link>
                </h3>

                <p className="featured-excerpt">
                  {featuredBlog.content.slice(0, 220)}...
                </p>

                <div className="featured-footer">
                  <div className="author-info">
                    <div className="author-avatar-badge">
                      {(featuredBlog.author || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="author-name">{featuredBlog.author}</div>
                      <div className="author-role">Featured Author</div>
                    </div>
                  </div>

                  <Link to={`/blogs/${featuredBlog.id}`} className="btn btn-primary">
                    <span>Read Article</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Latest Blog Posts Section */}
      <section className="section-latest">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Fresh Perspectives</span>
              <h2 className="section-title">Latest Articles</h2>
            </div>
            <Link to="/blogs" className="section-action-link">
              <span>Browse All Blogs</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <Loading type="cards" count={4} />
          ) : latestBlogs.length > 0 ? (
            <div className="blogs-grid">
              {latestBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <EmptyState
              title="No Articles Published Yet"
              description="Get started by writing the very first story on BlogSphere!"
              actionText="Create First Blog"
              actionLink="/create"
            />
          ) : (
            <div className="blogs-grid">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Value Props / Platform highlights */}
      <section className="section-highlights">
        <div className="container">
          <div className="highlights-header text-center">
            <span className="section-eyebrow">Why BlogSphere</span>
            <h2 className="section-title">Crafted for Quality Content</h2>
            <p className="section-subtitle">
              Built from the ground up with strict academic architecture and modern SaaS design patterns.
            </p>
          </div>

          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-icon-box">
                <ShieldCheck size={24} />
              </div>
              <h3 className="highlight-card-title">1000-Word Guardrail</h3>
              <p className="highlight-card-desc">
                Concise writing is powerful writing. Our live word counter and validation ensure content stays focused and digestible.
              </p>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon-box">
                <Zap size={24} />
              </div>
              <h3 className="highlight-card-title">Axios & REST Architecture</h3>
              <p className="highlight-card-desc">
                Clean API abstraction decoupling frontend components from network calls via an asynchronous JSON Server REST backend.
              </p>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon-box">
                <Layers size={24} />
              </div>
              <h3 className="highlight-card-title">Rich Multimedia Support</h3>
              <p className="highlight-card-desc">
                Seamlessly embed YouTube, Vimeo, and direct videos alongside high-resolution featured images with automatic fallbacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="section-cta">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <h2 className="cta-title">Ready to share your voice with the world?</h2>
              <p className="cta-desc">
                Publish your insights, tutorials, and life stories on BlogSphere in minutes with our streamlined editor.
              </p>
              <div className="cta-actions">
                <Link to="/create" className="btn btn-primary btn-lg">
                  <PlusCircle size={18} />
                  <span>Write a Story</span>
                </Link>
                <Link to="/about" className="btn btn-outline btn-lg">
                  <span>Learn More</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

