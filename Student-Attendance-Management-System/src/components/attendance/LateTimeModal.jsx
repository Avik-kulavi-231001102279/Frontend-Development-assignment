import React, { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Attendify - Late Arrival Time Recording Modal
 */
export const LateTimeModal = ({
  isOpen,
  onClose,
  onSave,
  studentName = '',
  initialTime = '09:15 AM',
}) => {
  const [time, setTime] = useState(initialTime || '09:15 AM');

  useEffect(() => {
    setTime(initialTime || '09:15 AM');
  }, [initialTime, isOpen]);

  if (!isOpen) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    onSave(time);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xl)',
          padding: '1.75rem',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Record Late Arrival</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                {studentName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)', display: 'flex', padding: '4px' }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleConfirm}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '0.45rem',
                color: 'var(--text-secondary)',
              }}
            >
              Class Arrival Time
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 09:20 AM"
              style={{ width: '100%' }}
              autoFocus
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Note: Late arrivals are marked Present with a timestamp badge.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Late Time
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LateTimeModal;
