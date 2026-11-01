import React from 'react';
import { Database, AlertCircle, FileSearch, Users } from 'lucide-react';
import { Button } from './Button';

/**
 * Attendify - Visual Empty Dataset Placeholder
 */
export const EmptyState = ({
  icon: Icon = Database,
  title = 'No Records Found',
  description = 'There is currently no data matching your criteria.',
  actionText,
  actionIcon,
  onAction,
  compact = false,
}) => {
  return (
    <div
      style={{
        padding: compact ? '2rem 1rem' : '3.5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? '0.75rem' : '1.25rem',
        width: '100%',
      }}
    >
      <div
        style={{
          width: compact ? '48px' : '64px',
          height: compact ? '48px' : '64px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--bg-hover)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-light)',
        }}
      >
        <Icon size={compact ? 24 : 32} />
      </div>

      <div style={{ maxWidth: '460px' }}>
        <h4
          style={{
            fontSize: compact ? '1rem' : '1.15rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 0.35rem 0',
          }}
        >
          {title}
        </h4>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.45,
          }}
        >
          {description}
        </p>
      </div>

      {actionText && onAction && (
        <Button
          variant="primary"
          size={compact ? 'sm' : 'md'}
          icon={actionIcon}
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
