import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const statusConfig = {
  Completed: {
    bgLight: 'rgba(16, 185, 129, 0.12)',
    bgDark: 'rgba(16, 185, 129, 0.2)',
    textLight: '#047857',
    textDark: '#34d399',
    dot: '#10b981',
    pulse: false,
  },
  Processing: {
    bgLight: 'rgba(59, 130, 246, 0.12)',
    bgDark: 'rgba(59, 130, 246, 0.2)',
    textLight: '#1d4ed8',
    textDark: '#60a5fa',
    dot: '#3b82f6',
    pulse: true,
  },
  Pending: {
    bgLight: 'rgba(245, 158, 11, 0.12)',
    bgDark: 'rgba(245, 158, 11, 0.2)',
    textLight: '#b45309',
    textDark: '#fbbf24',
    dot: '#f59e0b',
    pulse: false,
  },
  Cancelled: {
    bgLight: 'rgba(239, 68, 68, 0.12)',
    bgDark: 'rgba(239, 68, 68, 0.2)',
    textLight: '#b91c1c',
    textDark: '#f87171',
    dot: '#ef4444',
    pulse: false,
  },
};

export const StatusBadge = ({ status, size = 'medium' }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const cfg = statusConfig[status] || statusConfig.Pending;

  const isSmall = size === 'small';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? 0.75 : 1,
        px: isSmall ? 1.25 : 1.75,
        py: isSmall ? 0.35 : 0.6,
        borderRadius: '9999px',
        bgcolor: isDark ? cfg.bgDark : cfg.bgLight,
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}`,
        transition: 'all 0.15s ease-in-out',
        userSelect: 'none',
      }}
    >
      <Box
        component="span"
        className={cfg.pulse ? 'pulse-live' : ''}
        sx={{
          width: isSmall ? 6 : 7,
          height: isSmall ? 6 : 7,
          borderRadius: '50%',
          bgcolor: cfg.dot,
          flexShrink: 0,
        }}
      />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          fontSize: isSmall ? '0.72rem' : '0.8rem',
          color: isDark ? cfg.textDark : cfg.textLight,
          lineHeight: 1,
          letterSpacing: '0.01em',
        }}
      >
        {status}
      </Typography>
    </Box>
  );
};

export default StatusBadge;

