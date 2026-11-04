/**
 * Currency configuration and formatting helpers
 */

export const CURRENCY_CONFIG = {
  INR: {
    code: 'INR',
    symbol: '₹',
    locale: 'en-IN',
    label: 'Indian Rupee (INR ₹)',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
    label: 'US Dollar (USD $)',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    locale: 'de-DE',
    label: 'Euro (EUR €)',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    locale: 'en-GB',
    label: 'British Pound (GBP £)',
  },
};

/**
 * Format an amount with currency symbol and appropriate locale separators.
 * @param {number} amount
 * @param {string} currencyCode - 'INR', 'USD', etc.
 * @param {boolean} showDecimals - Whether to enforce 2 decimal places
 * @returns {string} Formatted string
 */
export const formatCurrency = (amount, currencyCode = 'INR', showDecimals = true) => {
  const num = Number(amount) || 0;
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.INR;

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(num);
  } catch (error) {
    // Fallback if Intl fails
    const sign = num < 0 ? '-' : '';
    const abs = Math.abs(num).toFixed(showDecimals ? 2 : 0);
    return `${sign}${config.symbol}${abs}`;
  }
};

/**
 * Get just the symbol for a given currency code
 */
export const getCurrencySymbol = (currencyCode = 'INR') => {
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.INR;
  return config.symbol;
};

