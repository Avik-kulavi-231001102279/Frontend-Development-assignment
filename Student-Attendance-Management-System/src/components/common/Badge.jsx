import React from 'react';

/**
 * Attendify - Status Badge Component
 * Visual indicators for P, A, PL, E, Late, and Student status
 */
export const Badge = ({
  status,
  label,
  size = 'md',
  isLate = false,
  lateTime = null,
  style = {},
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'P':
      case 'Present':
        return {
          bg: 'var(--status-p-bg)',
          color: 'var(--status-p-text)',
          border: 'var(--status-p-border)',
          text: 'Present',
        };
      case 'A':
      case 'Absent':
        return {
          bg: 'var(--status-a-bg)',
          color: 'var(--status-a-text)',
          border: 'var(--status-a-border)',
          text: 'Absent',
        };
      case 'PL':
      case 'Internship Placed':
        return {
          bg: 'var(--status-pl-bg)',
          color: 'var(--status-pl-text)',
          border: 'var(--status-pl-border)',
          text: 'Internship Placed',
        };
      case 'E':
      case 'Official Engagement':
        return {
          bg: 'var(--status-e-bg)',
          color: 'var(--status-e-text)',
          border: 'var(--status-e-border)',
          text: 'Official Engagement',
        };
      case 'Active':
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          color: '#059669',
          border: 'rgba(16, 185, 129, 0.3)',
          text: 'Active',
        };
      case 'Inactive':
        return {
          bg: 'rgba(100, 116, 139, 0.15)',
          color: '#64748B',
          border: 'rgba(100, 116, 139, 0.3)',
          text: 'Inactive',
        };
      case 'Late':
        return {
          bg: 'rgba(217, 119, 6, 0.15)',
          color: '#D97706',
          border: 'rgba(217, 119, 6, 0.35)',
          text: lateTime ? `Late (${lateTime})` : 'Late',
        };
      default:
        return {
          bg: 'var(--bg-hover)',
          color: 'var(--text-secondary)',
          border: 'var(--border-light)',
          text: label || status,
        };
    }
  };

  const config = getBadgeConfig();
  const displayText = label || config.text;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          borderRadius: 'var(--radius-full)',
          padding: size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.65rem',
          fontSize: size === 'sm' ? '0.72rem' : '0.78rem',
          backgroundColor: config.bg,
          color: config.color,
          border: `1px solid ${config.border}`,
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
          ...style,
        }}
        className={`attendify-badge ${className}`}
      >
        {displayText}
      </span>
      {isLate && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontWeight: 700,
            borderRadius: 'var(--radius-full)',
            padding: size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.65rem',
            fontSize: size === 'sm' ? '0.72rem' : '0.78rem',
            backgroundColor: 'rgba(245, 158, 11, 0.18)',
            color: '#B45309',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            whiteSpace: 'nowrap',
          }}
          title={lateTime ? `Late arrival recorded at ${lateTime}` : 'Late arrival'}
        >
          {lateTime ? `Late (${lateTime})` : 'Late'}
        </span>
      )}
    </span>
  );
};

export default Badge;
