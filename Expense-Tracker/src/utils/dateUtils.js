/**
 * Date utility helpers for SpendWise
 */

/**
 * Returns today's date in YYYY-MM-DD string format
 */
export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format a YYYY-MM-DD date string into human friendly format e.g. "Nov 4, 2026"
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return dateString;

  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

/**
 * Format date for header e.g. "Wednesday, 4 November 2026"
 */
export const formatHeaderDate = (date = new Date()) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Get current year and month in YYYY-MM
 */
export const getCurrentYearMonth = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Check if a date string (YYYY-MM-DD) falls in the current month
 */
export const isCurrentMonth = (dateString) => {
  if (!dateString) return false;
  const currentYM = getCurrentYearMonth();
  return dateString.startsWith(currentYM);
};

/**
 * Check if a date string is today
 */
export const isToday = (dateString) => {
  return dateString === getTodayDateString();
};

/**
 * Get month label from YYYY-MM (e.g. "2026-11" -> "November 2026")
 */
export const getMonthLabel = (yearMonthStr) => {
  if (!yearMonthStr) return '';
  const [year, month] = yearMonthStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
};

/**
 * Get short month label from YYYY-MM (e.g. "2026-11" -> "Nov 2026")
 */
export const getShortMonthLabel = (yearMonthStr) => {
  if (!yearMonthStr) return '';
  const [year, month] = yearMonthStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(date);
};

