import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Edit3,
  Trash2,
  Share2,
  Bookmark,
  Check,
  AlertTriangle,
  PlayCircle
} from 'lucide-react';
import { blogService } from '../services/api';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';
import VideoPlayer from '../components/VideoPlayer';
import Loading from '../components/Loading';
import BlogCard from '../components/BlogCard';
import {
  formatDate,
  getReadingTime,
  getCategoryBadgeClass,
  DEFAULT_FALLBACK_IMAGE
} from '../utils/helpers';

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image fallback state
  const [imgSrc, setImgSrc] = useState(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Copied link state
  const [isCopied, setIsCopied] = useState(false);

  // Fetch blog data
  useEffect(() => {
    let isMounted = true;

    async function fetchBlogData() {
      setLoading(true);
      setError(null);
      try {
        const data = await blogService.getBlogById(id);
        if (isMounted) {
          setBlog(data);
          setImgSrc(data.image || DEFAULT_FALLBACK_IMAGE);

          // Fetch related blogs from same category
          try {
            const all = await blogService.getAllBlogs();
            if (isMounted) {
              const others = all.filter(
                (b) => String(b.id) !== String(id) && b.category === data.category
              );
              setRelatedBlogs(others.slice(0, 3));
            }
          } catch {
            // Non-critical, ignore
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.status === 404
              ? 'The requested blog post was not found or has been removed.'
              : 'Failed to load blog post. Please check your network connection.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchBlogData();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle Share link
  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        toast.success('Blog link copied to clipboard!');
        setTimeout(() => setIsCopied(false), 3000);
      } else {
        toast.info('Share URL: ' + window.location.href);
      }
    } catch {
      toast.error('Could not copy link to clipboard');
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!blog) return;
    setIsDeleting(true);
    try {
      await blogService.deleteBlog(blog.id);
      toast.success('Blog post deleted successfully.');
      setIsDeleteModalOpen(false);
      navigate('/blogs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete blog post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container details-page-loading">
        <Loading type="details" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container details-error-container">
        <div className="error-card">
          <AlertTriangle size={42} className="error-icon" />
          <h2 className="error-title">Blog Post Unavailable</h2>
          <p className="error-message">{error || 'Could not find the requested blog.'}</p>
          <div className="error-actions">
            <Link to="/blogs" className="btn btn-primary">
              <ArrowLeft size={16} />
              <span>Back to All Blogs</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const readingTime = getReadingTime(blog.content);
  const formattedDate = formatDate(blog.createdAt);
  const badgeClass = getCategoryBadgeClass(blog.category);

  // Split content paragraphs cleanly
  const paragraphs = (blog.content || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="blog-details-root">
      {/* Top Back & Action Breadcrumb */}
      <div className="details-top-bar">
        <div className="container top-bar-inner">
          <Link to="/blogs" className="btn-back">
            <ArrowLeft size={16} />
            <span>Back to Blogs</span>
          </Link>

          <div className="details-quick-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleShare}
              title="Share blog link"
            >
              {isCopied ? <Check size={15} /> : <Share2 size={15} />}
              <span>{isCopied ? 'Copied' : 'Share'}</span>
            </button>

            <Link
              to={`/edit/${blog.id}`}
              className="btn btn-secondary btn-sm"
              title="Edit this blog post"
            >
              <Edit3 size={15} />
              <span>Edit</span>
            </Link>

            <button
              type="button"
              className="btn btn-danger-outline btn-sm"
              onClick={() => setIsDeleteModalOpen(true)}
              title="Delete this blog post"
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <div className="container details-main-container">
        {/* Article Header */}
        <header className="details-header">
          <div className="details-category-wrap">
            <span className={`category-badge ${badgeClass}`}>
              {blog.category || 'General'}
            </span>
          </div>

          <h1 className="details-title">{blog.title}</h1>

          <div className="details-meta-bar">
            <div className="author-card-snippet">
              <div className="author-avatar-badge" aria-hidden="true">
                {(blog.author || 'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="author-name">{blog.author || 'Anonymous'}</span>
                <span className="author-role">Published Contributor</span>
              </div>
            </div>

            <div className="details-stats-group">
              <span className="meta-stat">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </span>
              <span className="meta-separator">•</span>
              <span className="meta-stat">
                <Clock size={14} />
                <span>{readingTime}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="details-hero-image-wrap">
          <img
            src={imgSrc || DEFAULT_FALLBACK_IMAGE}
            alt={blog.title}
            className="details-hero-image"
            onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
          />
        </div>

        {/* Formatted Content Body */}
        <div className="details-content-body">
          {paragraphs.map((p, index) => {
            // Optional special styling for lead paragraph
            const isLead = index === 0;
            return (
              <p key={index} className={isLead ? 'lead-paragraph' : 'body-paragraph'}>
                {p}
              </p>
            );
          })}
        </div>

        {/* Embedded Video Player if present */}
        {blog.video && (
          <VideoPlayer videoUrl={blog.video} title={`${blog.title} video media`} />
        )}

        {/* Bottom Author Bio & Action Box */}
        <div className="details-author-bio-box">
          <div className="author-avatar-large">
            {(blog.author || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="bio-content">
            <h4 className="bio-name">Written by {blog.author}</h4>
            <p className="bio-text">
              Passionate writer and contributor on BlogSphere, sharing technical deep-dives, industry perspectives, and creative narratives.
            </p>
          </div>
          <div className="bio-actions">
            <Link to={`/edit/${blog.id}`} className="btn btn-secondary">
              <Edit3 size={16} />
              <span>Edit Article</span>
            </Link>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Related Posts Section */}
        {relatedBlogs.length > 0 && (
          <section className="details-related-section">
            <h3 className="related-title">More in {blog.category}</h3>
            <div className="blogs-grid">
              {relatedBlogs.map((rel) => (
                <BlogCard key={rel.id} blog={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This will permanently remove it from db.json."
        blogTitle={blog.title}
        confirmText="Yes, Delete Post"
        cancelText="Keep Post"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        isProcessing={isDeleting}
      />
    </article>
  );
}

