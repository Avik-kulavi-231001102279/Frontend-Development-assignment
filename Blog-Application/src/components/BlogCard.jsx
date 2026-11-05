import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import {
  formatDate,
  getReadingTime,
  getCategoryBadgeClass,
  DEFAULT_FALLBACK_IMAGE
} from '../utils/helpers';

export default function BlogCard({ blog }) {
  const [imageSrc, setImageSrc] = useState(blog.image || DEFAULT_FALLBACK_IMAGE);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(DEFAULT_FALLBACK_IMAGE);
    }
  };

  // Generate clean excerpt from content
  const getExcerpt = (text, maxLength = 135) => {
    if (!text) return '';
    const clean = text.replace(/(\r\n|\n|\r)/gm, ' ').trim();
    if (clean.length <= maxLength) return clean;
    return clean.slice(0, maxLength).trim() + '...';
  };

  const readingTime = getReadingTime(blog.content);
  const formattedDate = formatDate(blog.createdAt);
  const badgeClass = getCategoryBadgeClass(blog.category);

  return (
    <article className="blog-card" tabIndex={0}>
      <Link to={`/blogs/${blog.id}`} className="blog-card-media-link" tabIndex={-1} aria-hidden="true">
        <div className="blog-card-image-wrap">
          <img
            src={imageSrc}
            alt={blog.title}
            className="blog-card-image"
            loading="lazy"
            onError={handleImageError}
          />
          <span className={`category-badge ${badgeClass}`}>
            {blog.category || 'General'}
          </span>
        </div>
      </Link>

      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span className="meta-item">
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </span>
          <span className="meta-separator">•</span>
          <span className="meta-item">
            <Clock size={13} />
            <span>{readingTime}</span>
          </span>
        </div>

        <h3 className="blog-card-title">
          <Link to={`/blogs/${blog.id}`} title={blog.title}>
            {blog.title}
          </Link>
        </h3>

        <p className="blog-card-excerpt">
          {getExcerpt(blog.content)}
        </p>

        <div className="blog-card-footer">
          <div className="blog-author-info">
            <div className="author-avatar-badge" aria-hidden="true">
              {(blog.author || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="author-details">
              <span className="author-name">{blog.author || 'Anonymous'}</span>
              <span className="author-role">Author</span>
            </div>
          </div>

          <Link to={`/blogs/${blog.id}`} className="btn-read-more" aria-label={`Read more about ${blog.title}`}>
            <span>Read More</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

