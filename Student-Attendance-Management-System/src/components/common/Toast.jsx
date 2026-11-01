import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

/**
 * Attendify - Floating Toast Notification
 */
export const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.9rem 1.25rem',
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
        borderLeft: `5px solid ${isError ? '#EF4444' : '#10B981'}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-xl)',
        maxWidth: '420px',
        color: 'var(--text-primary)',
        animation: 'slide-up 0.25s ease-out',
      }}
    >
      <div style={{ color: isError ? '#EF4444' : '#10B981', display: 'flex' }}>
        {isError ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
      </div>
      <div style={{ fontSize: '0.9rem', fontWeight: 500, flex: 1, lineHeight: 1.4 }}>
        {message}
      </div>
      <button
        onClick={onClose}
        style={{ color: 'var(--text-muted)', display: 'flex', padding: '2px' }}
        aria-label="Dismiss message"
      >
        <X size={16} />
      </button>
      <style>{`@keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
};

export default Toast;
