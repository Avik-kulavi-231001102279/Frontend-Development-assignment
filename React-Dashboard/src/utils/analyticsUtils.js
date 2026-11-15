// Analytics utilities for Orderly

export const calculateSummaryMetrics = (orders) => {
  if (!Array.isArray(orders) || orders.length === 0) {
    return {
      revenue: 0,
      sales: 0,
      ordersCount: 0,
      customersCount: 0,
      recentOrdersCount: 0,
      averageOrderValue: 0,
    };
  }

  let totalRevenue = 0;
  let totalUnitsSold = 0;
  const uniqueCustomers = new Set();
  let recentCount = 0;

  const now = new Date('2026-11-14T23:59:59');
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  orders.forEach((order) => {
    // Only count non-cancelled in total recognized revenue or count all with status disclaimer
    if (order.status !== 'Cancelled') {
      totalRevenue += Number(order.amount) || 0;
    }

    // Sum quantities of items
    if (order.items && Array.isArray(order.items)) {
      const itemsQty = order.items.reduce((sum, item) => sum + (item.qty || 1), 0);
      totalUnitsSold += itemsQty;
    } else {
      totalUnitsSold += 1;
    }

    if (order.customer?.email) {
      uniqueCustomers.add(order.customer.email);
    } else if (order.customer?.name) {
      uniqueCustomers.add(order.customer.name);
    }

    const orderDate = new Date(order.date);
    if (orderDate >= sevenDaysAgo && orderDate <= now) {
      recentCount += 1;
    }
  });

  const validOrdersCount = orders.filter((o) => o.status !== 'Cancelled').length;
  const aov = validOrdersCount > 0 ? totalRevenue / validOrdersCount : 0;

  return {
    revenue: totalRevenue,
    sales: totalUnitsSold,
    ordersCount: orders.length,
    customersCount: uniqueCustomers.size,
    recentOrdersCount: recentCount,
    averageOrderValue: aov,
  };
};

// Generates time-series data for the LineChart
export const getTimelineChartData = (orders) => {
  if (!Array.isArray(orders) || orders.length === 0) return [];

  const grouped = {};

  orders.forEach((order) => {
    const d = order.date;
    if (!grouped[d]) {
      grouped[d] = {
        date: d,
        revenue: 0,
        sales: 0,
        orderCount: 0,
      };
    }

    if (order.status !== 'Cancelled') {
      grouped[d].revenue += Number(order.amount) || 0;
    }

    const qty = order.items?.reduce((acc, i) => acc + (i.qty || 1), 0) || 1;
    grouped[d].sales += qty;
    grouped[d].orderCount += 1;
  });

  // Sort dates chronologically ascending
  const sorted = Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));

  return sorted.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    revenue: Number(item.revenue.toFixed(2)),
  }));
};

// Generates distribution data for the PieChart
export const getStatusDistribution = (orders) => {
  const counts = {
    Completed: 0,
    Processing: 0,
    Pending: 0,
    Cancelled: 0,
  };

  if (Array.isArray(orders)) {
    orders.forEach((o) => {
      const statusKey = o.status;
      if (counts[statusKey] !== undefined) {
        counts[statusKey] += 1;
      }
    });
  }

  const total = orders?.length || 0;

  const STATUS_CONFIG = [
    { name: 'Completed', color: '#10b981', gradient: ['#34d399', '#10b981'] },
    { name: 'Processing', color: '#3b82f6', gradient: ['#60a5fa', '#2563eb'] },
    { name: 'Pending', color: '#f59e0b', gradient: ['#fbbf24', '#d97706'] },
    { name: 'Cancelled', color: '#ef4444', gradient: ['#f87171', '#dc2626'] },
  ];

  return STATUS_CONFIG.map((cfg) => {
    const value = counts[cfg.name] || 0;
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    return {
      name: cfg.name,
      value,
      percentage,
      color: cfg.color,
      gradient: cfg.gradient,
    };
  });
};

