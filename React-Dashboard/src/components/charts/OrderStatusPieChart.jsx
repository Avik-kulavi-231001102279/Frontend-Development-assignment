import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

const CustomPieTooltip = ({ active, payload, isDark }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box
        sx={{
          bgcolor: isDark ? '#1e293b' : '#ffffff',
          p: 1.5,
          borderRadius: 2,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          minWidth: 140,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: data.color,
            }}
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {data.name}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Orders: <strong style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>{formatNumber(data.value)}</strong>
        </Typography>
        <Typography variant="caption" sx={{ color: data.color, fontWeight: 700 }}>
          {data.percentage}% of total
        </Typography>
      </Box>
    );
  }
  return null;
};

export const OrderStatusPieChart = ({ data }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const totalOrders = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card
      sx={{
        p: { xs: 2, sm: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
        background: isDark
          ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(17, 24, 39, 0.8) 100%)'
          : '#ffffff',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PieChartIcon size={18} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
            Order Status Breakdown
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
          Distribution across current active filters
        </Typography>
      </Box>

      {/* Donut Chart with Centered Total */}
      <Box sx={{ position: 'relative', width: '100%', height: 210, my: 'auto' }}>
        {totalOrders === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">No orders to display</Typography>
          </Box>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={2}
                  stroke={isDark ? '#111827' : '#ffffff'}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip isDark={isDark} />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Metric */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  lineHeight: 1.1,
                  color: 'text.primary',
                }}
              >
                {totalOrders}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Orders
              </Typography>
            </Box>
          </>
        )}
      </Box>

      {/* Breakdown Legend List */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1.25,
          pt: 2,
          mt: 1,
          borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
        }}
      >
        {data.map((item) => (
          <Box
            key={item.name}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1,
              borderRadius: 2,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: item.color,
                  flexShrink: 0,
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {item.name}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {item.value} <span style={{ opacity: 0.6 }}>({item.percentage}%)</span>
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default OrderStatusPieChart;

