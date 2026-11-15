import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { useOrderFilters } from '../context/FilterContext';
import FilterBar from '../components/common/FilterBar';
import OrdersTable from '../components/orders/OrdersTable';
import { formatCurrency } from '../utils/formatters';

export const OrdersPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { filteredOrders, statusDistribution, metrics, setStatus } = useOrderFilters();

  const getStatusCount = (name) => {
    const found = statusDistribution.find((s) => s.name === name);
    return found ? found.value : 0;
  };

  const statusPills = [
    {
      name: 'All Statuses',
      label: 'All Orders',
      count: metrics.ordersCount,
      color: '#6366f1',
      icon: ShoppingBag,
    },
    {
      name: 'Completed',
      label: 'Completed',
      count: getStatusCount('Completed'),
      color: '#10b981',
      icon: CheckCircle2,
    },
    {
      name: 'Processing',
      label: 'Processing',
      count: getStatusCount('Processing'),
      color: '#3b82f6',
      icon: Clock,
    },
    {
      name: 'Pending',
      label: 'Pending',
      count: getStatusCount('Pending'),
      color: '#f59e0b',
      icon: AlertCircle,
    },
    {
      name: 'Cancelled',
      label: 'Cancelled',
      count: getStatusCount('Cancelled'),
      color: '#ef4444',
      icon: XCircle,
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="fade-in">
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Order Management
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Inspect, filter, search, and fulfill all inbound customer transactions.
        </Typography>
      </Box>

      {/* Status Quick Filter Cards Strip */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(5, 1fr)',
          },
          gap: 1.5,
        }}
      >
        {statusPills.map((pill) => {
          const Icon = pill.icon;
          return (
            <Paper
              key={pill.name}
              onClick={() => setStatus(pill.name)}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                cursor: 'pointer',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
                bgcolor: isDark ? '#111827' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: pill.color,
                  boxShadow: `0 8px 16px -4px ${pill.color}25`,
                },
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {pill.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.25 }}>
                  {pill.count}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  bgcolor: `${pill.color}15`,
                  color: pill.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} />
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* Filter Bar with Search, Category, Date, Status */}
      <FilterBar showExport={true} />

      {/* Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        title="All Orders Directory"
        subtitle="Full detailed list of orders with live status management"
        initialRowsPerPage={10}
        showPagination={true}
      />
    </Box>
  );
};

export default OrdersPage;

