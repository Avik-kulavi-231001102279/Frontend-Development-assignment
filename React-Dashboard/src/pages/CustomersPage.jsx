import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import {
  Users,
  Search,
  X,
  UserCheck,
  Award,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { mockCustomers } from '../data/mockCustomers';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useOrderFilters } from '../context/FilterContext';
import { useNavigate } from 'react-router-dom';

export const CustomersPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { setSearchTerm } = useOrderFilters();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return mockCustomers;
    const term = search.toLowerCase().trim();
    return mockCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.location.toLowerCase().includes(term)
    );
  }, [search]);

  const totalSpentAll = useMemo(() => {
    return mockCustomers.reduce((acc, c) => acc + c.totalSpent, 0);
  }, []);

  const averageCustomerValue = totalSpentAll / mockCustomers.length;

  const topCustomer = useMemo(() => {
    return [...mockCustomers].sort((a, b) => b.totalSpent - a.totalSpent)[0];
  }, []);

  const handleViewCustomerOrders = (customerName) => {
    setSearchTerm(customerName);
    navigate('/orders');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className="fade-in">
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Customer Directory
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Overview of customer accounts, lifetime purchasing volume, and engagement.
        </Typography>
      </Box>

      {/* Customer Stat Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        <Card
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: isDark ? '#111827' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: 'rgba(99, 102, 241, 0.12)',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={18} />
            </Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Registered Customers
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {mockCustomers.length} Active
          </Typography>
        </Card>

        <Card
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: isDark ? '#111827' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DollarSign size={18} />
            </Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Average Lifetime Value
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {formatCurrency(averageCustomerValue)}
          </Typography>
        </Card>

        <Card
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: isDark ? '#111827' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: 'rgba(245, 158, 11, 0.12)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={18} />
            </Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Top Spender
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {topCustomer?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {formatCurrency(topCustomer?.totalSpent)} total spend
          </Typography>
        </Card>
      </Box>

      {/* Customers Table with Search */}
      <Card
        sx={{
          borderRadius: 3,
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
          bgcolor: isDark ? '#111827' : '#ffffff',
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
          }}
        >
          <TextField
            size="small"
            placeholder="Search customers by name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch('')}>
                    <X size={14} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{ maxWidth: 360 }}
          />

          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Showing {filteredCustomers.length} customers
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Orders</TableCell>
                <TableCell align="right">Total Spent</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={customer.avatar}
                          alt={customer.name}
                          sx={{ width: 36, height: 36 }}
                        >
                          {customer.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {customer.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {customer.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {customer.email}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {customer.phone}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MapPin size={13} color={isDark ? '#9ca3af' : '#64748b'} />
                        <Typography variant="body2">{customer.location}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={customer.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          bgcolor:
                            customer.status === 'VIP'
                              ? 'rgba(99, 102, 241, 0.15)'
                              : 'rgba(16, 185, 129, 0.15)',
                          color: customer.status === 'VIP' ? '#6366f1' : '#10b981',
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {customer.totalOrders}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {formatCurrency(customer.totalSpent)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatDate(customer.joinedDate)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewCustomerOrders(customer.name)}
                        endIcon={<ExternalLink size={12} />}
                        sx={{ fontSize: '0.75rem', py: 0.4 }}
                      >
                        Orders
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>
    </Box>
  );
};

export default CustomersPage;

