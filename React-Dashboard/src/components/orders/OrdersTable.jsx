import React, { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import {
  Eye,
  MoreVertical,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useOrderFilters } from '../../context/FilterContext';

export const OrdersTable = ({
  orders,
  title = 'Recent Orders',
  subtitle = 'Manage and inspect recent customer purchases',
  initialRowsPerPage = 5,
  showPagination = true,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { setSelectedOrder, updateOrderStatus, resetFilters } = useOrderFilters();

  // Sorting state
  const [orderBy, setOrderBy] = useState('date');
  const [orderDirection, setOrderDirection] = useState('desc');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  // Status Menu state
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [activeMenuOrder, setActiveMenuOrder] = useState(null);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenMenu = (event, order) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setActiveMenuOrder(order);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setActiveMenuOrder(null);
  };

  const handleStatusChange = (newStatus) => {
    if (activeMenuOrder) {
      updateOrderStatus(activeMenuOrder.id, newStatus);
    }
    handleCloseMenu();
  };

  // Sort logic
  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort((a, b) => {
      let valA, valB;

      switch (orderBy) {
        case 'id':
          valA = a.id;
          valB = b.id;
          break;
        case 'customer':
          valA = a.customer.name.toLowerCase();
          valB = b.customer.name.toLowerCase();
          break;
        case 'product':
          valA = a.product.toLowerCase();
          valB = b.product.toLowerCase();
          break;
        case 'category':
          valA = a.category.toLowerCase();
          valB = b.category.toLowerCase();
          break;
        case 'amount':
          valA = Number(a.amount);
          valB = Number(b.amount);
          break;
        case 'status':
          valA = a.status.toLowerCase();
          valB = b.status.toLowerCase();
          break;
        case 'date':
        default:
          valA = new Date(a.date).getTime();
          valB = new Date(b.date).getTime();
          break;
      }

      if (valA < valB) return orderDirection === 'asc' ? -1 : 1;
      if (valA > valB) return orderDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [orders, orderBy, orderDirection]);

  // Paginated orders
  const paginatedOrders = useMemo(() => {
    if (!showPagination) return sortedOrders.slice(0, rowsPerPage);
    const start = page * rowsPerPage;
    return sortedOrders.slice(start, start + rowsPerPage);
  }, [sortedOrders, page, rowsPerPage, showPagination]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
        background: isDark
          ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(17, 24, 39, 0.8) 100%)'
          : '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Table Header Section */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1.5,
          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
            {subtitle}
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Total {orders.length} order{orders.length === 1 ? '' : 's'}
        </Typography>
      </Box>

      {/* Table Container */}
      <TableContainer sx={{ minHeight: 280, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('id')}
                >
                  Order ID
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'customer'}
                  direction={orderBy === 'customer' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('customer')}
                >
                  Customer
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'product'}
                  direction={orderBy === 'product' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('product')}
                >
                  Product & Category
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('date')}
                >
                  Date
                </TableSortLabel>
              </TableCell>

              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'amount'}
                  direction={orderBy === 'amount' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('amount')}
                >
                  Amount
                </TableSortLabel>
              </TableCell>

              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>

              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 6, textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      <ShoppingBag size={24} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      No orders found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
                      No orders match your active filter criteria. Try adjusting your search term, date range, or category.
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RotateCcw size={14} />}
                      onClick={resetFilters}
                      sx={{ mt: 1 }}
                    >
                      Reset All Filters
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  hover
                  onClick={() => setSelectedOrder(order)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {/* Order ID */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: 'primary.main',
                      }}
                    >
                      {order.id}
                    </Typography>
                  </TableCell>

                  {/* Customer */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={order.customer.avatar}
                        alt={order.customer.name}
                        sx={{ width: 32, height: 32, fontSize: '0.85rem' }}
                      >
                        {order.customer.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {order.customer.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {order.customer.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Product & Category */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                        maxWidth: 240,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {order.product}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                      }}
                    >
                      {order.category}
                    </Typography>
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatDate(order.date)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {order.time || '12:00'}
                    </Typography>
                  </TableCell>

                  {/* Amount */}
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {formatCurrency(order.amount)}
                    </Typography>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell align="center">
                    <StatusBadge status={order.status} size="small" />
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title="View Order Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => setSelectedOrder(order)}
                          sx={{
                            bgcolor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
                          }}
                        >
                          <Eye size={15} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Update Status">
                        <IconButton
                          size="small"
                          onClick={(e) => handleOpenMenu(e, order)}
                        >
                          <MoreVertical size={15} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      {showPagination && sortedOrders.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={sortedOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
          }}
        />
      )}

      {/* Quick Status Change Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            minWidth: 160,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            CHANGE STATUS
          </Typography>
        </Box>
        <MenuItem onClick={() => handleStatusChange('Completed')}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', mr: 1.5 }} />
          Completed
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Processing')}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3b82f6', mr: 1.5 }} />
          Processing
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Pending')}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b', mr: 1.5 }} />
          Pending
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Cancelled')}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444', mr: 1.5 }} />
          Cancelled
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default OrdersTable;

