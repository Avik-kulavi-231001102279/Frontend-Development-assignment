import React from 'react';

/**
 * Attendify - Executive Statistics Card
 */
export const StatsCard = ({
  title,
  value,
  subtitle,
  subtext,
  icon: Icon,
  variant = 'default',
  trend,
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          iconBg: 'rgba(16, 185, 129, 0.12)',
          iconColor: '#10B981',
          accent: '#10B981',
        };
      case 'danger':
        return {
          iconBg: 'rgba(239, 68, 68, 0.12)',
          iconColor: '#EF4444',
          accent: '#EF4444',
        };
      case 'warning':
        return {
          iconBg: 'rgba(245, 158, 11, 0.12)',
          iconColor: '#F59E0B',
          accent: '#F59E0B',
        };
      case 'info':
        return {
          iconBg: 'rgba(59, 130, 246, 0.12)',
          iconColor: '#3B82F6',
          accent: '#3B82F6',
        };
      case 'primary':
      default:
        return {
          iconBg: 'var(--brand-primary-light)',
          iconColor: 'var(--brand-primary)',
          accent: 'var(--brand-primary)',
        };
    }
  };

  const v = getVariantStyles();

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '1.35rem 1.5rem',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="stats-card"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-muted)',
            }}
          >
            {title}
          </span>
          <div
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              marginTop: '0.35rem',
            }}
          >
            {value !== undefined && value !== null ? value : 0}
          </div>
        </div>
        {Icon && (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: v.iconBg,
              color: v.iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      {((subtitle || subtext) || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {trend && (
            <span style={{ fontWeight: 700, color: v.accent }}>
              {trend}
            </span>
          )}
          {(subtitle || subtext) && <span>{subtitle || subtext}</span>}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
