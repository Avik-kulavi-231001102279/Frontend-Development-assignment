import React, { createContext, useContext, useState, useMemo } from 'react';
import { mockOrders } from '../data/mockOrders';
import { filterOrders } from '../utils/filterUtils';
import { calculateSummaryMetrics, getTimelineChartData, getStatusDistribution } from '../utils/analyticsUtils';

const FilterContext = createContext();

const initialFilters = {
  searchTerm: '',
  category: 'All Categories',
  status: 'All Statuses',
  dateRange: 'all', // 'all', '7days', '30days', '90days', 'custom'
  startDate: '',
  endDate: '',
};

export const FilterProvider = ({ children }) => {
  const [orders, setOrders] = useState(mockOrders);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedOrder, setSelectedOrder] = useState(null); // For Details Modal

  // Check if any filter is active
  const isFiltered = useMemo(() => {
    return (
      Boolean(filters.searchTerm.trim()) ||
      filters.category !== 'All Categories' ||
      filters.status !== 'All Statuses' ||
      filters.dateRange !== 'all' ||
      Boolean(filters.startDate) ||
      Boolean(filters.endDate)
    );
  }, [filters]);

  // Compute filtered orders
  const filteredOrders = useMemo(() => {
    return filterOrders(orders, filters);
  }, [orders, filters]);

  // Derived analytics
  const metrics = useMemo(() => {
    return calculateSummaryMetrics(filteredOrders);
  }, [filteredOrders]);

  const timelineData = useMemo(() => {
    return getTimelineChartData(filteredOrders);
  }, [filteredOrders]);

  const statusDistribution = useMemo(() => {
    return getStatusDistribution(filteredOrders);
  }, [filteredOrders]);

  // Filter setters
  const setSearchTerm = (term) => {
    setFilters((prev) => ({ ...prev, searchTerm: term }));
  };

  const setCategory = (cat) => {
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  const setStatus = (stat) => {
    setFilters((prev) => ({ ...prev, status: stat }));
  };

  const setDateRange = (range) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: range,
      // Clear custom dates if selecting a preset
      ...(range !== 'custom' ? { startDate: '', endDate: '' } : {}),
    }));
  };

  const setCustomDates = (start, end) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: 'custom',
      startDate: start,
      endDate: end,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Status changer for an order (e.g. from table or modal)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <FilterContext.Provider
      value={{
        orders,
        filters,
        isFiltered,
        filteredOrders,
        metrics,
        timelineData,
        statusDistribution,
        selectedOrder,
        setSelectedOrder,
        setSearchTerm,
        setCategory,
        setStatus,
        setDateRange,
        setCustomDates,
        resetFilters,
        updateOrderStatus,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useOrderFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useOrderFilters must be used within a FilterProvider');
  }
  return context;
};

