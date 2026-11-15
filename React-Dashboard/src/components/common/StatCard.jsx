import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendPositive = true,
  subtitle = 'vs last 30 days',
  color = '#6366f1',
  bgColor = 'rgba(99, 102, 241, 0.1)',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
        background: isDark
          ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(17, 24, 39, 0.9) 100%)'
          : '#ffffff',
        backdropFilter: 'blur(8px)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: isDark
            ? '0 12px 24px -10px rgba(0, 0, 0, 0.8)'
            : '0 12px 24px -10px rgba(99, 102, 241, 0.15)',
          borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
        },
      }}
    >
      {/* Top accent light bar on hover */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          bgcolor: color,
          opacity: 0.8,
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'text.secondary',
              display: 'block',
              mb: 0.75,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.9rem' },
            }}
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: bgColor,
            color: color,
            flexShrink: 0,
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.08)',
            },
          }}
        >
          {Icon && <Icon size={24} strokeWidth={2.2} />}
        </Box>
      </Box>

      {/* Footer / Trend */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 1, borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'}` }}>
        {trend !== undefined && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: '6px',
              bgcolor: trendPositive
                ? isDark
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(16, 185, 129, 0.12)'
                : isDark
                ? 'rgba(239, 68, 68, 0.2)'
                : 'rgba(239, 68, 68, 0.12)',
              color: trendPositive ? (isDark ? '#34d399' : '#059669') : isDark ? '#f87171' : '#dc2626',
            }}
          >
            {trendPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
              {trend}
            </Typography>
          </Box>
        )}
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Card>
  );
};

export default StatCard;

