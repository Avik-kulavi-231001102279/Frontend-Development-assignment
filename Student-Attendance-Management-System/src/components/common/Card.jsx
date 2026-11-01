import React from 'react';

/**
 * Attendify - Standard Card Container
 */
export const Card = ({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  className = '',
  style = {},
  bodyStyle = {},
  noPadding = false,
  ...props
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        transition: 'box-shadow var(--transition-fast), border-color var(--transition-fast)',
        ...style,
      }}
      className={`attendify-card ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {Icon && (
              <div
                style={{
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} />
              </div>
            )}
            <div>
              {title && (
                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    margin: '2px 0 0 0',
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div
        style={{
          padding: noPadding ? 0 : '1.5rem',
          ...bodyStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
