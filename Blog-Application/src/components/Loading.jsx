import React from 'react';

export default function Loading({ type = 'cards', count = 6 }) {
  if (type === 'spinner') {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p className="spinner-text">Loading content...</p>
      </div>
    );
  }

  if (type === 'details') {
    return (
      <div className="details-skeleton-container">
        <div className="skeleton skeleton-hero-img"></div>
        <div className="details-skeleton-meta">
          <div className="skeleton skeleton-badge"></div>
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-title-short"></div>
          <div className="skeleton skeleton-author-row"></div>
        </div>
        <div className="details-skeleton-body">
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line-short"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line"></div>
        </div>
      </div>
    );
  }

  // Default: Card skeletons grid
  return (
    <div className="blogs-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="blog-card-skeleton">
          <div className="skeleton skeleton-card-image"></div>
          <div className="skeleton-card-content">
            <div className="skeleton skeleton-badge-sm"></div>
            <div className="skeleton skeleton-card-title"></div>
            <div className="skeleton skeleton-card-title-sub"></div>
            <div className="skeleton skeleton-card-excerpt"></div>
            <div className="skeleton skeleton-card-excerpt-sub"></div>
            <div className="skeleton-card-footer">
              <div className="skeleton skeleton-avatar"></div>
              <div className="skeleton skeleton-meta-text"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

