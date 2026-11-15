// CSV Export utility for Orderly

export const exportOrdersToCSV = (orders, customFilename) => {
  if (!orders || orders.length === 0) {
    alert('No orders available to export for the current filters.');
    return;
  }

  const headers = [
    'Order ID',
    'Date',
    'Customer Name',
    'Customer Email',
    'Product',
    'Category',
    'Amount ($)',
    'Status',
    'Payment Method',
    'Payment Status',
    'Shipping State/City',
    'Tracking Number',
  ];

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  };

  const rows = orders.map((order) => [
    escapeCSV(order.id),
    escapeCSV(order.date),
    escapeCSV(order.customer?.name || ''),
    escapeCSV(order.customer?.email || ''),
    escapeCSV(order.product),
    escapeCSV(order.category),
    escapeCSV(order.amount.toFixed(2)),
    escapeCSV(order.status),
    escapeCSV(order.paymentMethod || ''),
    escapeCSV(order.paymentStatus || ''),
    escapeCSV(`${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''}`),
    escapeCSV(order.trackingNumber || ''),
  ]);

  const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  // UTF-8 BOM for Microsoft Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const now = new Date().toISOString().split('T')[0];
  const filename = customFilename || `orderly_orders_export_${now}.csv`;

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

