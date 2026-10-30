import { createSelector } from '@reduxjs/toolkit';

// Raw cart state selectors
export const selectCartState = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectAppliedCoupon = (state) => state.cart.appliedCoupon;
export const selectCouponError = (state) => state.cart.couponError;

/**
 * Memoized selector: Total number of individual items in cart (sum of quantities)
 */
export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + (item.quantity || 0), 0)
);

/**
 * Memoized selector: Cart Subtotal
 * Sum of (item.price * item.quantity)
 */
export const selectCartSubtotal = createSelector(
  [selectCartItems],
  (items) => {
    const raw = items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    );
    return Math.round(raw * 100) / 100;
  }
);

/**
 * Memoized selector: Cart Discount
 * Based on applied promo coupon and minimum order amount
 */
export const selectCartDiscount = createSelector(
  [selectCartSubtotal, selectAppliedCoupon],
  (subtotal, coupon) => {
    if (!coupon || subtotal <= 0) return 0;

    // Check min order constraint
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return 0;
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.value;
    }

    // Ensure discount never exceeds subtotal
    discount = Math.min(discount, subtotal);
    return Math.round(discount * 100) / 100;
  }
);

/**
 * Memoized selector: Cart Shipping
 * Standard $10 shipping, free for orders above $100 or when FREESHIP coupon applied
 */
export const selectCartShipping = createSelector(
  [selectCartSubtotal, selectAppliedCoupon],
  (subtotal, coupon) => {
    if (subtotal <= 0) return 0;
    if (coupon?.discountType === 'free_shipping') return 0;
    if (subtotal >= 100) return 0; // Free shipping over $100
    return 10.0;
  }
);

/**
 * Memoized selector: Cart Tax
 * Calculated as 5% of (Subtotal - Discount)
 */
export const selectCartTax = createSelector(
  [selectCartSubtotal, selectCartDiscount],
  (subtotal, discount) => {
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.05; // 5% tax
    return Math.round(tax * 100) / 100;
  }
);

/**
 * Memoized selector: Final Cart Total
 * Formula: Final Total = Subtotal - Discount + Tax + Shipping
 */
export const selectCartFinalTotal = createSelector(
  [
    selectCartSubtotal,
    selectCartDiscount,
    selectCartTax,
    selectCartShipping,
  ],
  (subtotal, discount, tax, shipping) => {
    if (subtotal <= 0) return 0;
    const finalTotal = subtotal - discount + tax + shipping;
    return Math.max(0, Math.round(finalTotal * 100) / 100);
  }
);

/**
 * Memoized selector: Check if a specific product is already in the cart
 */
export const selectIsProductInCart = createSelector(
  [selectCartItems, (_, productId) => productId],
  (items, productId) => items.some((item) => item.id === productId)
);

/**
 * Memoized selector: Quantity of a specific product in the cart
 */
export const selectProductQuantityInCart = createSelector(
  [selectCartItems, (_, productId) => productId],
  (items, productId) => {
    const found = items.find((item) => item.id === productId);
    return found ? found.quantity : 0;
  }
);
