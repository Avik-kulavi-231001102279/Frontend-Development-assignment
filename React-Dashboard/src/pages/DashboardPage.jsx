import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useOrderFilters } from '../context/FilterContext';
import { formatCurrency, formatNumber } from '../utils/formatters';
import StatCard from '../components/common/StatCard';
import FilterBar from '../components/common/FilterBar';
import RevenueSalesChart from '../components/charts/RevenueSalesChart';
import OrderStatusPieChart from '../components/charts/OrderStatusPieChart';
import OrdersTable from '../components/orders/OrdersTable';

export const DashboardPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const {
    metrics,
    timelineData,
    statusDistribution,
    filteredOrders,
    resetFilters,
  } = useOrderFilters();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="fade-in">
      {/* Dashboard Overview Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                fontSize: { xs: '1.5rem', sm: '1.85rem' },
              }}
            >
              Order Management Overview
            </Typography>
            <Box
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                alignItems: 'center',
                gap: 0.5,
                px: 1.25,
                py: 0.35,
                borderRadius: '6px',
                bgcolor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                color: 'primary.main',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              <Sparkles size={13} />
              Realtime
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Welcome back! Here is what's happening across your store orders and revenue today.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="inherit"
          size="small"
          onClick={resetFilters}
          startIcon={<RefreshCw size={14} />}
          sx={{
            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
            },
          }}
        >
          Refresh Overview
        </Button>
      </Box>

      {/* Five Summary Widgets */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          gap: 2,
        }}
      >
        {/* 1. Revenue */}
        <StatCard
          title="Total Revenue"
          value={formatCurrency(metrics.revenue)}
          icon={DollarSign}
          trend="+14.2%"
          trendPositive={true}
          subtitle="vs previous period"
          color="#6366f1"
          bgColor="rgba(99, 102, 241, 0.12)"
        />

        {/* 2. Sales (Units) */}
        <StatCard
          title="Total Units Sold"
          value={`${formatNumber(metrics.sales)} units`}
          icon={Package}
          trend="+8.5%"
          trendPositive={true}
          subtitle="vs previous period"
          color="#10b981"
          bgColor="rgba(16, 185, 129, 0.12)"
        />

        {/* 3. Orders Count */}
        <StatCard
          title="Total Orders"
          value={formatNumber(metrics.ordersCount)}
          icon={ShoppingBag}
          trend="+12.0%"
          trendPositive={true}
          subtitle="filtered orders"
          color="#0ea5e9"
          bgColor="rgba(14, 165, 233, 0.12)"
        />

        {/* 4. Customers Count */}
        <StatCard
          title="Customers"
          value={formatNumber(metrics.customersCount)}
          icon={Users}
          trend="+5.4%"
          trendPositive={true}
          subtitle="unique buyers"
          color="#8b5cf6"
          bgColor="rgba(139, 92, 246, 0.12)"
        />

        {/* 5. Recent Orders (7 Days) */}
        <StatCard
          title="Recent Orders"
          value={formatNumber(metrics.recentOrdersCount)}
          icon={Clock}
          trend="Past 7 days"
          trendPositive={true}
          subtitle="active pipeline"
          color="#f59e0b"
          bgColor="rgba(245, 158, 11, 0.12)"
        />
      </Box>

      {/* Filter and Search Bar */}
      <FilterBar showExport={true} />

      {/* Charts Section: Line Chart & Pie Chart */}
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

      {/* Recent Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        title="Recent Orders"
        subtitle="Chronological list of customer orders matching active filters"
        initialRowsPerPage={5}
        showPagination={true}
      />
    </Box>
  );
};

export default DashboardPage;

