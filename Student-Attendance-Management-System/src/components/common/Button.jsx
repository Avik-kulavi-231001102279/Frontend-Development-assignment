import React from 'react';

/**
 * Attendify - Standard Button Component
 * Supports variants: primary, secondary, danger, outline, ghost
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-hover)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-light)',
        };
      case 'danger':
        return {
          backgroundColor: '#EF4444',
          color: '#FFFFFF',
          border: '1px solid #DC2626',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--brand-primary)',
          border: '1px solid var(--brand-primary)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid transparent',
        };
      case 'primary':
      default:
        return {
          backgroundColor: 'var(--brand-primary)',
          color: '#FFFFFF',
          border: '1px solid var(--brand-primary)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '0.4rem 0.75rem', fontSize: '0.82rem', gap: '0.35rem' };
      case 'lg':
        return { padding: '0.75rem 1.5rem', fontSize: '1rem', gap: '0.6rem' };
      case 'md':
      default:
        return { padding: '0.55rem 1rem', fontSize: '0.9rem', gap: '0.5rem' };
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        borderRadius: 'var(--radius-md)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      className={`attendify-btn ${className}`}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'btn-spin 0.6s linear infinite',
            marginRight: children ? '0.4rem' : '0',
          }}
        />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 16} />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 16} />}
      <style>{`@keyframes btn-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </button>
  );
};

export default Button;
