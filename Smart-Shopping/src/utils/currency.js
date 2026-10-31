import { CURRENCY_CONFIG } from '../config/currency';

/**
 * Converts a USD price to Indian Rupees (INR) using the centralized conversion rate.
 * Rounds to 2 decimal places.
 *
 * @param {number|string} usdPrice - The raw USD price from Fake Store API
 * @param {number} rate - Configurable exchange rate (default: 83)
 * @returns {number} Converted INR price
 */
export const convertUsdToInr = (usdPrice, rate = CURRENCY_CONFIG.USD_TO_INR_RATE) => {
  const num = Number(usdPrice);
  if (isNaN(num)) return 0;
  return Math.round(num * rate * 100) / 100;
};

/**
 * Converts a raw Fake Store API product so its price is in INR.
 * Checks the `_inrConverted` flag to prevent duplicate conversion.
 *
 * @param {object} product - Product object
 * @returns {object} Normalized product with price in INR
 */
export const convertProductToInr = (product) => {
  if (!product || typeof product !== 'object') return product;
  if (product._inrConverted) return product;

  const rawPrice = Number(product.price) || 0;
  const inrPrice = convertUsdToInr(rawPrice);

  return {
    ...product,
    price: inrPrice,
    rawUsdPrice: rawPrice,
    currency: CURRENCY_CONFIG.CODE,
    _inrConverted: true,
  };
};

/**
 * Converts an array of raw Fake Store API products into INR.
 *
 * @param {Array} products - Array of product objects
 * @returns {Array} Array of products with prices in INR
 */
export const convertProductsListToInr = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(convertProductToInr);
};

/**
 * Formats any amount using Indian Number Formatting (e.g. ₹1,299.00).
 * Never displays USD, $, or dollar symbols.
 *
 * @param {number|string} amount - The numeric price in INR
 * @returns {string} Formatted Indian Rupee currency string
 */
export const formatPrice = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, {
    style: 'currency',
    currency: CURRENCY_CONFIG.CODE,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Calculates percentage savings between original and discounted prices.
 */
export const calculateSavingsPercentage = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export default {
  convertUsdToInr,
  convertProductToInr,
  convertProductsListToInr,
  formatPrice,
  calculateSavingsPercentage,
};
