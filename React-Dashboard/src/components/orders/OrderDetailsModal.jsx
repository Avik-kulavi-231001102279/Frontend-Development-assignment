import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import {
  X,
  CreditCard,
  Truck,
  MapPin,
  User,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useOrderFilters } from '../../context/FilterContext';

export const OrderDetailsModal = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { selectedOrder, setSelectedOrder, updateOrderStatus } = useOrderFilters();

  if (!selectedOrder) return null;

  const handleClose = () => {
    setSelectedOrder(null);
  };

  const handleStatusChange = (e) => {
    updateOrderStatus(selectedOrder.id, e.target.value);
  };

  // Calculations
  const subtotal = selectedOrder.amount;
  const shippingFee = subtotal > 150 ? 0 : 15.0;
  const estimatedTax = subtotal * 0.08;
  const grandTotal = subtotal + shippingFee + estimatedTax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      open={Boolean(selectedOrder)}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundImage: 'none',
          bgcolor: isDark ? '#111827' : '#ffffff',
          border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
        },
      }}
    >
      {/* Modal Header */}
      <DialogTitle
        sx={{
          p: { xs: 2, sm: 2.5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontFamily: 'monospace',
              color: 'primary.main',
              letterSpacing: '-0.02em',
            }}
          >
            {selectedOrder.id}
          </Typography>
          <StatusBadge status={selectedOrder.status} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <Calendar size={14} />
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              {formatDate(selectedOrder.date)} at {selectedOrder.time || '14:30'}
            </Typography>
          </Box>
        </Box>

        <IconButton size="small" onClick={handleClose} sx={{ color: 'text.secondary' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      {/* Modal Content */}
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Quick Status Updater Strip */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Order Lifecycle State
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Modify order fulfillment status instantly
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Order Status</InputLabel>
            <Select
              value={selectedOrder.status}
              label="Order Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* 2-Column Info Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2.5,
            mb: 3,
          }}
        >
          {/* Customer Details */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <User size={16} color={isDark ? '#818cf8' : '#4f46e5'} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Customer Information
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Avatar
                src={selectedOrder.customer.avatar}
                alt={selectedOrder.customer.name}
                sx={{ width: 44, height: 44 }}
              >
                {selectedOrder.customer.name[0]}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {selectedOrder.customer.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  {selectedOrder.customer.email}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {selectedOrder.customer.phone || '+1 (555) 019-2831'}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Delivery & Shipping */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Truck size={16} color={isDark ? '#818cf8' : '#4f46e5'} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Shipping & Delivery
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
              {selectedOrder.shippingMethod || 'Standard Ground Delivery'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
              Tracking: <strong style={{ fontFamily: 'monospace' }}>{selectedOrder.trackingNumber || 'TRK-98102381'}</strong>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city},{' '}
              {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zip},{' '}
              {selectedOrder.shippingAddress?.country}
            </Typography>
          </Paper>
        </Box>

        {/* Payment Details Card */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                bgcolor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CreditCard size={18} />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Payment Method
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {selectedOrder.paymentMethod || 'Credit Card •••• 4242'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Payment Status
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: selectedOrder.paymentStatus === 'Refunded' ? 'error.main' : 'success.main',
              }}
            >
              {selectedOrder.paymentStatus || 'Paid in Full'}
            </Typography>
          </Box>
        </Paper>

        {/* Order Items List */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Package size={16} color={isDark ? '#818cf8' : '#4f46e5'} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Purchased Items ({selectedOrder.items?.length || 1})
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
              overflow: 'hidden',
            }}
          >
            {(selectedOrder.items && selectedOrder.items.length > 0
              ? selectedOrder.items
              : [{ name: selectedOrder.product, qty: 1, price: selectedOrder.amount }]
            ).map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom:
                    idx < (selectedOrder.items?.length || 1) - 1
                      ? `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
                      : 'none',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Category: {selectedOrder.category} • Qty: {item.qty} × {formatCurrency(item.price)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {formatCurrency(item.price * item.qty)}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>

        {/* Financial Breakdown */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: 2,
            borderRadius: 2,
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Subtotal:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatCurrency(subtotal)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Estimated Shipping:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Taxes (8%):
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatCurrency(estimatedTax)}
            </Typography>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Grand Total:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
              {formatCurrency(grandTotal)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      {/* Modal Actions */}
      <DialogActions
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
          justifyContent: 'space-between',
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Printer size={15} />}
          onClick={handlePrint}
        >
          Print Invoice
        </Button>
        <Button variant="contained" onClick={handleClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;

