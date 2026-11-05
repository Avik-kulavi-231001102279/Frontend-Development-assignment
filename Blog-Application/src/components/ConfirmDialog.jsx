import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this blog post? This action cannot be undone.',
  blogTitle = '',
  confirmText = 'Delete Blog',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isProcessing = false
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isProcessing) {
        onCancel();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel, isProcessing]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <button
          className="modal-close-btn"
          onClick={onCancel}
          disabled={isProcessing}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="modal-icon-wrapper danger">
          <AlertTriangle size={28} />
        </div>

        <div className="modal-body">
          <h3 id="confirm-title" className="modal-title">{title}</h3>
          <p className="modal-text">{message}</p>
          {blogTitle && (
            <div className="modal-item-preview">
              <span className="modal-item-label">Target Blog:</span>
              <span className="modal-item-name">"{blogTitle}"</span>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isProcessing}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

