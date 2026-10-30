/**
 * Currency formatting utility supporting USD and INR
 */

export const formatPrice = (amount, currency = 'USD') => {
  const num = Number(amount) || 0;
  if (currency === 'INR') {
    // 1 USD approx 83 INR
    const inrValue = Math.round(num * 83);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(inrValue);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const calculateSavingsPercentage = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};
