/**
 * CSV Export utility for SpendWise transactions
 */

/**
 * Escapes a cell value for CSV format (RFC 4180)
 * Wraps values in quotes if they contain commas, quotes, or newlines
 */
const escapeCsvCell = (val) => {
  if (val === null || val === undefined) return '""';
  const stringVal = String(val);
  // If string contains double quotes, commas, or line breaks, quote it and escape quotes
  if (/[",\n\r]/.test(stringVal)) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }
  return `"${stringVal}"`;
};

/**
 * Generates and downloads a CSV file from an array of transactions
 * @param {Array} transactions - Array of transaction objects
 * @param {string} customFilename - Optional filename prefix/suffix
 */
export const exportTransactionsToCSV = (transactions = [], customFilename = '') => {
  if (!transactions || transactions.length === 0) {
    throw new Error('No transactions available to export.');
  }

  const headers = [
    'Transaction ID',
    'Title',
    'Amount',
    'Type',
    'Category',
    'Date',
    'Payment Method',
    'Description',
  ];

  const rows = transactions.map((tx) => [
    escapeCsvCell(tx.id || ''),
    escapeCsvCell(tx.title || ''),
    escapeCsvCell(Number(tx.amount || 0).toFixed(2)),
    escapeCsvCell((tx.type || '').toUpperCase()),
    escapeCsvCell(tx.category || ''),
    escapeCsvCell(tx.date || ''),
    escapeCsvCell(tx.paymentMethod || ''),
    escapeCsvCell(tx.description || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  // Create blob with UTF-8 BOM so Excel opens it with correct encoding
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = customFilename
    ? `spendwise-${customFilename}.csv`
    : `spendwise-transactions-${dateStr}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return fileName;
};

