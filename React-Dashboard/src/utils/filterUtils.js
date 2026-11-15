// Filter utility for Orderly dashboard

export const filterOrders = (orders, filters) => {
  if (!Array.isArray(orders)) return [];
  const {
    searchTerm = '',
    category = 'All Categories',
    status = 'All Statuses',
    dateRange = 'all',
    startDate = '',
    endDate = '',
  } = filters || {};

  return orders.filter((order) => {
    // 1. Search filter: search ID, customer name, email, product, category
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      const matchId = order.id.toLowerCase().includes(term);
      const matchCustomer = order.customer.name.toLowerCase().includes(term);
      const matchEmail = order.customer.email.toLowerCase().includes(term);
      const matchProduct = order.product.toLowerCase().includes(term);
      const matchCategory = order.category.toLowerCase().includes(term);

      if (!matchId && !matchCustomer && !matchEmail && !matchProduct && !matchCategory) {
        return false;
      }
    }

    // 2. Category filter
    if (category && category !== 'All Categories') {
      if (order.category !== category) {
        return false;
      }
    }

    // 3. Status filter
    if (status && status !== 'All Statuses') {
      if (order.status.toLowerCase() !== status.toLowerCase()) {
        return false;
      }
    }

    // 4. Date Range filter
    if (order.date) {
      const orderDate = new Date(order.date);
      // Reference date: current date (2026-11-14) or latest order date
      const refDate = new Date('2026-11-14T23:59:59');

      if (dateRange === '7days') {
        const sevenDaysAgo = new Date(refDate);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        if (orderDate < sevenDaysAgo || orderDate > refDate) return false;
      } else if (dateRange === '30days') {
        const thirtyDaysAgo = new Date(refDate);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        if (orderDate < thirtyDaysAgo || orderDate > refDate) return false;
      } else if (dateRange === '90days') {
        const ninetyDaysAgo = new Date(refDate);
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        ninetyDaysAgo.setHours(0, 0, 0, 0);
        if (orderDate < ninetyDaysAgo || orderDate > refDate) return false;
      } else if (dateRange === 'custom') {
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (orderDate < start) return false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (orderDate > end) return false;
        }
      }
    }

    return true;
  });
};

