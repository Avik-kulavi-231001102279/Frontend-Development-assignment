import React from 'react';

/**
 * Attendify - Loading Skeleton Component
 */
export const LoadingSkeleton = ({ type = 'table', count = 3, height = '40px' }) => {
  const items = Array.from({ length: count });

  if (type === 'cards') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {items.map((_, i) => (
          <div
            key={i}
            style={{
              height: '110px',
              backgroundColor: 'var(--bg-hover)',
              borderRadius: 'var(--radius-lg)',
              animation: 'pulse 1.5s infinite ease-in-out',
            }}
          />
        ))}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.25; } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {items.map((_, i) => (
        <div
          key={i}
          style={{
            height,
            backgroundColor: 'var(--bg-hover)',
            borderRadius: 'var(--radius-md)',
            animation: 'pulse 1.5s infinite ease-in-out',
          }}
        />
      ))}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.25; } }`}</style>
    </div>
  );
};

export default LoadingSkeleton;
