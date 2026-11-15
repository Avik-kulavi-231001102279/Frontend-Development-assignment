import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme } from '@mui/material/styles';
import {
  TrendingUp,
  Percent,
  RefreshCcw,
  Users2,
  DollarSign,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { useOrderFilters } from '../context/FilterContext';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';
import FilterBar from '../components/common/FilterBar';
import RevenueSalesChart from '../components/charts/RevenueSalesChart';
import OrderStatusPieChart from '../components/charts/OrderStatusPieChart';
import StatCard from '../components/common/StatCard';

export const AnalyticsPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const {
    filteredOrders,
    metrics,
    timelineData,
    statusDistribution,
  } = useOrderFilters();

  // Category revenue aggregates
  const categoryStats = useMemo(() => {
    const map = {};
    let totalCatRevenue = 0;

    filteredOrders.forEach((o) => {
      if (o.status !== 'Cancelled') {
        if (!map[o.category]) map[o.category] = { category: o.category, revenue: 0, count: 0 };
        map[o.category].revenue += o.amount;
        map[o.category].count += 1;
        totalCatRevenue += o.amount;
      }
    });

    return Object.values(map)
      .map((item) => ({
        ...item,
        percentage: totalCatRevenue > 0 ? Math.round((item.revenue / totalCatRevenue) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  const cancelledCount = statusDistribution.find((s) => s.name === 'Cancelled')?.value || 0;
  const returnRate = metrics.ordersCount > 0 ? (cancelledCount / metrics.ordersCount) * 100 : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="fade-in">
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Business Analytics & Intelligence
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Comprehensive metrics, financial trends, and category performance analysis.
        </Typography>
      </Box>

      {/* Advanced Performance Metric Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        <StatCard
          title="Average Order Value"
          value={formatCurrency(metrics.averageOrderValue)}
          icon={DollarSign}
          trend="+6.8%"
          trendPositive={true}
          subtitle="per completed order"
          color="#6366f1"
          bgColor="rgba(99, 102, 241, 0.12)"
        />

        <StatCard
          title="Gross Margin Est."
          value="64.5%"
          icon={Percent}
          trend="+2.1%"
          trendPositive={true}
          subtitle="based on catalog costs"
          color="#10b981"
          bgColor="rgba(16, 185, 129, 0.12)"
        />

        <StatCard
          title="Cancellation / Return Rate"
          value={formatPercent(returnRate, false)}
          icon={RefreshCcw}
          trend="-1.4%"
          trendPositive={true}
          subtitle="orders cancelled"
          color="#ef4444"
          bgColor="rgba(239, 68, 68, 0.12)"
        />

        <StatCard
          title="Customer Repeat Rate"
          value="42.8%"
          icon={Users2}
          trend="+3.2%"
          trendPositive={true}
          subtitle="multi-order customers"
          color="#0ea5e9"
          bgColor="rgba(14, 165, 233, 0.12)"
        />
      </Box>

      {/* Filter Bar */}
      <FilterBar showExport={true} />

      {/* Trend Charts */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
        }}
      >
        <Box sx={{ minHeight: 380 }}>
          <RevenueSalesChart data={timelineData} />
        </Box>
        <Box sx={{ minHeight: 380 }}>
          <OrderStatusPieChart data={statusDistribution} />
        </Box>
      </Box>

      {/* Category Performance Matrix */}
      <Card
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: 3,
          bgcolor: isDark ? '#111827' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Revenue Contribution by Category
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Breakdown of product volume and recognized revenue across active filters
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {categoryStats.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No categories match the active filter criteria.
            </Typography>
          ) : (
            categoryStats.map((item) => (
              <Box key={item.category}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 0.75,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {item.category}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      ({item.count} orders)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {formatCurrency(item.revenue)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, minWidth: 40, textAlign: 'right' }}>
                      {item.percentage}%
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%)',
                    },
                  }}
                />
              </Box>
            ))
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default AnalyticsPage;

