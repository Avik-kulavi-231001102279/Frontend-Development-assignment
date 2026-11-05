import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, PlusCircle, RefreshCw, Layers } from 'lucide-react';
import { useBlogs } from '../hooks/useBlogs';
import BlogCard from '../components/BlogCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { CATEGORIES } from '../utils/helpers';

export default function Blogs() {
  const { blogs, loading, error, isOffline, fetchBlogs } = useBlogs();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL search params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'oldest' | 'title-asc' | 'title-desc'

  // Sync state if URL query params change externally
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlSearch !== null) setSearchTerm(urlSearch);
  }, [searchParams]);

  // Update URL params smoothly when filter/search changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    const newParams = new URLSearchParams(searchParams);
    if (!val) {
      newParams.delete('search');
    } else {
      newParams.set('search', val);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleClearSearch = () => {
    handleSearchChange('');
  };

  const handleResetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('latest');
    setSearchParams({}, { replace: true });
  };

  // Compute category count breakdown
  const categoryCounts = useMemo(() => {
    const counts = { total: blogs.length };
    CATEGORIES.forEach((cat) => {
      counts[cat] = blogs.filter((b) => b.category === cat).length;
    });
    return counts;
  }, [blogs]);

  // Filter and sort blogs
  const filteredAndSortedBlogs = useMemo(() => {
    let result = [...blogs];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (b) => (b.category || '').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query (title, author, content)
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter((b) => {
        const titleMatch = (b.title || '').toLowerCase().includes(query);
        const authorMatch = (b.author || '').toLowerCase().includes(query);
        const contentMatch = (b.content || '').toLowerCase().includes(query);
        const categoryMatch = (b.category || '').toLowerCase().includes(query);
        return titleMatch || authorMatch || contentMatch || categoryMatch;
      });
    }

    // Sort results
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();

      if (sortBy === 'latest') {
        return dateB - dateA;
      }
      if (sortBy === 'oldest') {
        return dateA - dateB;
      }
      if (sortBy === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'title-desc') {
        return (b.title || '').localeCompare(a.title || '');
      }
      return 0;
    });

    return result;
  }, [blogs, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="blogs-page-root">
      {/* Page Header */}
      <section className="blogs-header-section">
        <div className="container">
          <div className="blogs-header-inner">
            <div>
              <span className="section-eyebrow">Explore Publications</span>
              <h1 className="blogs-header-title">All Blog Posts</h1>
              <p className="blogs-header-subtitle">
                Browse our complete collection of stories, tutorials, and deep-dive articles.
              </p>
            </div>
            <Link to="/create" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>Create Blog</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container blogs-main-container">
        {/* Offline Banner if JSON Server offline */}
        {isOffline && (
          <div className="offline-notice-banner">
            <div className="banner-inner">
              <span><strong>Server Notice:</strong> JSON Server is offline. Please start it with <code>npm run server</code>.</span>
              <button className="btn btn-sm btn-secondary" onClick={fetchBlogs}>
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* Search & Filter Controls Bar */}
        <div className="blogs-toolbar-card">
          <div className="toolbar-top-row">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
              placeholder="Search by title, author name, or content..."
            />

            <div className="toolbar-sort-wrap">
              <ArrowUpDown size={16} className="sort-icon" />
              <label htmlFor="blog-sort" className="visually-hidden">Sort blogs by</label>
              <select
                id="blog-sort"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Sort: Latest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="title-asc">Title: A to Z</option>
                <option value="title-desc">Title: Z to A</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="toolbar-categories-row">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
              categoryCounts={categoryCounts}
            />
          </div>

          {/* Stats & Active Filter Status Bar */}
          <div className="toolbar-status-row">
            <span className="results-counter">
              Showing <strong>{filteredAndSortedBlogs.length}</strong> of{' '}
              <strong>{blogs.length}</strong> {blogs.length === 1 ? 'blog post' : 'blog posts'}
              {(selectedCategory !== 'All' || searchTerm.trim()) && (
                <span className="filtered-indicator"> (filtered)</span>
              )}
            </span>

            {(selectedCategory !== 'All' || searchTerm.trim()) && (
              <button
                type="button"
                className="btn-text-link"
                onClick={handleResetAllFilters}
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Blog Posts Display */}
        {loading ? (
          <Loading type="cards" count={6} />
        ) : error && isOffline ? (
          <EmptyState
            type="offline"
            title="JSON Server Not Responding"
            description="The REST backend is unreachable. Make sure you run 'npm run server' in your terminal."
            actionText="Try Reconnecting"
            onAction={fetchBlogs}
          />
        ) : blogs.length === 0 ? (
          <EmptyState
            type="empty"
            title="No blogs available"
            description="The BlogSphere database is currently empty. Be the first to publish a new post!"
            actionText="Publish Your First Blog"
            actionLink="/create"
          />
        ) : filteredAndSortedBlogs.length === 0 ? (
          <EmptyState
            type="search"
            title="No matching blogs found"
            description={`No articles found matching "${searchTerm || selectedCategory}". Try searching for different keywords or resetting filters.`}
            actionText="Clear All Filters"
            onAction={handleResetAllFilters}
          />
        ) : (
          <div className="blogs-grid">
            {filteredAndSortedBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

