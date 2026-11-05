import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, SearchX, PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';

export default function EmptyState({
  type = 'empty', // 'empty' | 'search' | 'error' | 'offline'
  title,
  description,
  actionText,
  actionLink,
  onAction
}) {
  let DefaultIcon = BookOpen;
  let defaultTitle = 'No blogs available';
  let defaultDesc = 'There are no blog posts published yet. Be the first to share your thoughts!';

  if (type === 'search') {
    DefaultIcon = SearchX;
    defaultTitle = 'No matching blogs found';
    defaultDesc = 'We could not find any blogs matching your criteria. Try adjusting your search keywords or filter category.';
  } else if (type === 'error' || type === 'offline') {
    DefaultIcon = AlertCircle;
    defaultTitle = 'Unable to connect to BlogSphere API';
    defaultDesc = 'JSON Server is currently unavailable. Please verify that the mock server is running on http://localhost:3000.';
  }

  const finalTitle = title || defaultTitle;
  const finalDesc = description || defaultDesc;

  return (
    <div className="empty-state-wrapper">
      <div className={`empty-state-icon ${type}`}>
        <DefaultIcon size={40} />
      </div>
      <h3 className="empty-state-title">{finalTitle}</h3>
      <p className="empty-state-desc">{finalDesc}</p>

      <div className="empty-state-actions">
        {onAction && (
          <button type="button" className="btn btn-secondary" onClick={onAction}>
            <RefreshCw size={16} />
            <span>{actionText || 'Retry'}</span>
          </button>
        )}
        {actionLink && (
          <Link to={actionLink} className="btn btn-primary">
            <PlusCircle size={16} />
            <span>{actionText || 'Create a Blog'}</span>
          </Link>
        )}
      </div>
    </div>
  );
}

