/**
 * Attendify - Professional CSV Export Utility
 * 
 * Complies with:
 * 1. RFC 4180 standard escaping (quotes inside fields escaped by doubling: "")
 * 2. Formula injection protection (cells starting with =, +, -, @ prepended with ')
 * 3. UTF-8 Byte Order Mark (BOM: \uFEFF) for perfect Excel/spreadsheet compatibility
 * 4. Browser download trigger using Blob & Object URL API
 */

/**
 * Sanitizes a field against CSV formula injection
 * @param {string|number} val
 * @returns {string}
 */
export const sanitizeCsvCell = (val) => {
  if (val === null || val === undefined) {
    return '';
  }
  let str = String(val);

  // Formula injection check: if first char is =, +, -, @, or tab/return, prepend single quote
  const dangerousChars = ['=', '+', '-', '@', '\t', '\r'];
  if (dangerousChars.includes(str.charAt(0))) {
    str = `'${str}`;
  }

  // RFC 4180 escaping: if contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (/[",\n\r]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`;
  }

  return str;
};

/**
 * Exports an array of records to a CSV file and triggers download in browser
 * @param {Array<Object>} records - Filtered records to export
 * @param {string} filename - Target file name
 */
export const exportAttendanceToCsv = (records = [], filename = 'Attendify_Attendance_Report.csv') => {
  const headers = [
    'Student ID',
    'Student Name',
    'Department',
    'Semester',
    'Section',
    'Subject Code',
    'Subject Name',
    'Attendance Date',
    'Attendance Status',
    'Late Arrival',
    'Attendance Percentage',
  ];

  const rows = records.map((r) => [
    sanitizeCsvCell(r.studentId),
    sanitizeCsvCell(r.studentName),
    sanitizeCsvCell(r.department),
    sanitizeCsvCell(r.semester),
    sanitizeCsvCell(r.section),
    sanitizeCsvCell(r.subjectCode),
    sanitizeCsvCell(r.subjectName),
    sanitizeCsvCell(r.date),
    sanitizeCsvCell(r.statusFull || r.status),
    sanitizeCsvCell(r.isLate ? (r.lateTime ? `Yes (${r.lateTime})` : 'Yes') : 'No'),
    sanitizeCsvCell(r.percentageFormatted || (r.percentage != null ? `${r.percentage}%` : 'N/A')),
  ]);

  const csvContent = [
    headers.map(sanitizeCsvCell).join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\r\n');

  // Prepend UTF-8 BOM
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
