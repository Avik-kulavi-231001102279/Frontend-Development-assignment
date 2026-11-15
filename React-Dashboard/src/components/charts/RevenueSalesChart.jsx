import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, DollarSign, Package } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: isDark ? '#1e293b' : '#ffffff',
          p: 1.75,
          borderRadius: 2,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          minWidth: 160,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            display: 'block',
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </Typography>

        {payload.map((entry, index) => {
          const isRevenue = entry.dataKey === 'revenue';
          return (
            <Box
              key={`item-${index}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                mb: index < payload.length - 1 ? 0.75 : 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: entry.color,
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  {entry.name}:
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {isRevenue ? formatCurrency(entry.value) : `${formatNumber(entry.value)} units`}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  }
  return null;
};

export const RevenueSalesChart = ({ data }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [activeMetric, setActiveMetric] = useState('both'); // 'both', 'revenue', 'sales'

  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const hasData = Array.isArray(data) && data.length > 0;

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
      {/* Chart Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1.5,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                bgcolor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={18} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
              Revenue & Sales Trends
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
            Time-series analysis of incoming revenue and units sold
          </Typography>
        </Box>

        {/* Metric View Switcher */}
        <ButtonGroup size="small" variant="outlined" sx={{ borderRadius: 2 }}>
          <Button
            variant={activeMetric === 'both' ? 'contained' : 'outlined'}
            onClick={() => setActiveMetric('both')}
            sx={{ px: 1.5 }}
          >
            All
          </Button>
          <Button
            variant={activeMetric === 'revenue' ? 'contained' : 'outlined'}
            onClick={() => setActiveMetric('revenue')}
            startIcon={<DollarSign size={13} />}
            sx={{ px: 1.5 }}
          >
            Revenue
          </Button>
          <Button
            variant={activeMetric === 'sales' ? 'contained' : 'outlined'}
            onClick={() => setActiveMetric('sales')}
            startIcon={<Package size={13} />}
            sx={{ px: 1.5 }}
          >
            Sales
          </Button>
        </ButtonGroup>
      </Box>

      {/* Chart Area */}
      <Box sx={{ width: '100%', height: 320, mt: 'auto' }}>
        {!hasData ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              No trend data available for current filter selection.
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="formattedDate"
                stroke={textColor}
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: gridColor }}
                dy={8}
              />
              <YAxis
                yAxisId="left"
                stroke={textColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              {activeMetric === 'both' && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}`}
                />
              )}
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 16, fontSize: 12 }}
              />

              {(activeMetric === 'both' || activeMetric === 'revenue') && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue ($)"
                  stroke="#6366f1"
                  strokeWidth={2.8}
                  dot={{ r: 3.5, fill: '#6366f1', strokeWidth: 1 }}
                  activeDot={{ r: 6, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
                />
              )}

              {(activeMetric === 'both' || activeMetric === 'sales') && (
                <Line
                  yAxisId={activeMetric === 'both' ? 'right' : 'left'}
                  type="monotone"
                  dataKey="sales"
                  name="Units Sold"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  strokeDasharray={activeMetric === 'both' ? '4 4' : undefined}
                  dot={{ r: 3.5, fill: '#10b981', strokeWidth: 1 }}
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Card>
  );
};

export default RevenueSalesChart;

