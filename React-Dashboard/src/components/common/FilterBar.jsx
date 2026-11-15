import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import {
  Search,
  X,
  Filter,
  RotateCcw,
  Download,
  Calendar,
  Layers,
  Activity,
} from 'lucide-react';
import { CATEGORIES, ORDER_STATUSES } from '../../data/mockOrders';
import { useOrderFilters } from '../../context/FilterContext';
import { exportOrdersToCSV } from '../../utils/exportUtils';

export const FilterBar = ({ showExport = true }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const {
    filters,
    isFiltered,
    orders,
    filteredOrders,
    setSearchTerm,
    setCategory,
    setStatus,
    setDateRange,
    setCustomDates,
    resetFilters,
  } = useOrderFilters();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleDatePresetChange = (e) => {
    setDateRange(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setCustomDates(e.target.value, filters.endDate);
  };

  const handleEndDateChange = (e) => {
    setCustomDates(filters.startDate, e.target.value);
  };

  const handleExport = () => {
    exportOrdersToCSV(filteredOrders);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        borderRadius: 3,
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
        background: isDark
          ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%)'
          : '#ffffff',
      }}
    >
      {/* Top Header Row of Filter Bar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
              color: 'primary.main',
            }}
          >
            <Filter size={16} />
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Filter & Search
          </Typography>

          <Chip
            label={`${filteredOrders.length} of ${orders.length} orders`}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
              color: 'text.secondary',
              ml: 0.5,
            }}
          />
        </Box>

        {/* Action Buttons: Reset & Export */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isFiltered && (
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={resetFilters}
              startIcon={<RotateCcw size={14} />}
              sx={{
                borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'error.main',
                  color: 'error.main',
                  bgcolor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                },
              }}
            >
              Reset Filters
            </Button>
          )}

          {showExport && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleExport}
              startIcon={<Download size={14} />}
              disabled={filteredOrders.length === 0}
            >
              Export CSV
            </Button>
          )}
        </Box>
      </Box>

      {/* Main Filter Controls Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 1.5,
        }}
      >
        {/* 1. Global Search */}
        <TextField
          size="small"
          placeholder="Search by ID, customer, item..."
          value={filters.searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} color={isDark ? '#9ca3af' : '#64748b'} />
              </InputAdornment>
            ),
            endAdornment: filters.searchTerm ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch} edge="end">
                  <X size={14} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
            },
          }}
        />

        {/* 2. Date Range Presets */}
        <TextField
          select
          size="small"
          value={filters.dateRange}
          onChange={handleDatePresetChange}
          label="Date Range"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Calendar size={16} color={isDark ? '#9ca3af' : '#64748b'} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
            },
          }}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="7days">Last 7 Days</MenuItem>
          <MenuItem value="30days">Last 30 Days</MenuItem>
          <MenuItem value="90days">Last 90 Days</MenuItem>
          <MenuItem value="custom">Custom Date Range</MenuItem>
        </TextField>

        {/* 3. Category Filter */}
        <TextField
          select
          size="small"
          value={filters.category}
          onChange={(e) => setCategory(e.target.value)}
          label="Category"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Layers size={16} color={isDark ? '#9ca3af' : '#64748b'} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
            },
          }}
        >
          {CATEGORIES.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        {/* 4. Order Status Filter */}
        <TextField
          select
          size="small"
          value={filters.status}
          onChange={(e) => setStatus(e.target.value)}
          label="Status"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Activity size={16} color={isDark ? '#9ca3af' : '#64748b'} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
            },
          }}
        >
          {ORDER_STATUSES.map((st) => (
            <MenuItem key={st} value={st}>
              {st}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Custom Date Pickers when Date Range === 'custom' */}
      {filters.dateRange === 'custom' && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            mt: 2,
            pt: 2,
            borderTop: `1px dashed ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            Custom Range:
          </Typography>
          <TextField
            type="date"
            size="small"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate}
            onChange={handleStartDateChange}
            sx={{ width: 180 }}
          />
          <TextField
            type="date"
            size="small"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate}
            onChange={handleEndDateChange}
            sx={{ width: 180 }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default FilterBar;

