import { describe, it, expect } from 'vitest';
import {
  selectCartItemCount,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartTax,
  selectCartShipping,
  selectCartFinalTotal,
} from '../src/features/cart/cartSelectors';

describe('cartSelectors calculations', () => {
  it('should calculate total items count correctly', () => {
    const rootState = {
      cart: {
        items: [
          { id: 1, price: 100, quantity: 2 },
          { id: 2, price: 50, quantity: 3 },
        ],
        appliedCoupon: null,
      },
    };

    expect(selectCartItemCount(rootState)).toBe(5);
  });

  it('should calculate subtotal correctly: sum(price * quantity)', () => {
    const rootState = {
      cart: {
        items: [
          { id: 1, price: 100, quantity: 2 }, // 200
          { id: 2, price: 49.99, quantity: 1 }, // 49.99
        ],
        appliedCoupon: null,
      },
    };

    expect(selectCartSubtotal(rootState)).toBe(249.99);
  });

  it('should calculate percentage discount correctly with WELCOME10 (10%)', () => {
    const rootState = {
      cart: {
        items: [{ id: 1, price: 200, quantity: 1 }],
        appliedCoupon: {
          code: 'WELCOME10',
          discountType: 'percentage',
          value: 10,
          minOrder: 0,
        },
      },
    };

    expect(selectCartDiscount(rootState)).toBe(20);
  });

  it('should enforce minOrder constraint on discounts', () => {
    const rootState = {
      cart: {
        items: [{ id: 1, price: 30, quantity: 1 }], // subtotal = 30
        appliedCoupon: {
          code: 'SHOPSPHERE20',
          discountType: 'percentage',
          value: 20,
          minOrder: 50, // requires 50
        },
      },
    };

    // Subtotal 30 is less than minOrder 50 -> discount is 0
    expect(selectCartDiscount(rootState)).toBe(0);
  });

  it('should calculate 5% tax on taxable amount (subtotal - discount)', () => {
    const rootState = {
      cart: {
        items: [{ id: 1, price: 100, quantity: 1 }], // subtotal = 100
        appliedCoupon: {
          code: 'WELCOME10',
          discountType: 'percentage',
          value: 10,
          minOrder: 0,
        }, // discount = 10 -> taxable = 90
      },
    };

    // 5% of 90 = 4.5
    expect(selectCartTax(rootState)).toBe(4.5);
  });

  it('should calculate shipping correctly (free over 100 or standard 10)', () => {
    const orderUnder100 = {
      cart: {
        items: [{ id: 1, price: 80, quantity: 1 }],
        appliedCoupon: null,
      },
    };
    expect(selectCartShipping(orderUnder100)).toBe(10);

    const orderOver100 = {
      cart: {
        items: [{ id: 1, price: 150, quantity: 1 }],
        appliedCoupon: null,
      },
    };
    expect(selectCartShipping(orderOver100)).toBe(0);

    const orderWithFreeShipCoupon = {
      cart: {
        items: [{ id: 1, price: 50, quantity: 1 }],
        appliedCoupon: { discountType: 'free_shipping' },
      },
    };
    expect(selectCartShipping(orderWithFreeShipCoupon)).toBe(0);
  });

  it('should verify formula: Final Total = Subtotal - Discount + Tax + Shipping', () => {
    // Example:
    // Subtotal: 200
    // Discount: 20 (10% of 200)
    // Taxable: 180 -> Tax (5% of 180) = 9
    // Shipping: 0 (subtotal >= 100)
    // Final Total: 200 - 20 + 9 + 0 = 189
    const rootState = {
      cart: {
        items: [{ id: 1, price: 100, quantity: 2 }],
        appliedCoupon: {
          code: 'WELCOME10',
          discountType: 'percentage',
          value: 10,
          minOrder: 0,
        },
      },
    };

    const subtotal = selectCartSubtotal(rootState);
    const discount = selectCartDiscount(rootState);
    const tax = selectCartTax(rootState);
    const shipping = selectCartShipping(rootState);
    const finalTotal = selectCartFinalTotal(rootState);

    expect(subtotal).toBe(200);
    expect(discount).toBe(20);
    expect(tax).toBe(9);
    expect(shipping).toBe(0);
    expect(finalTotal).toBe(189);
    expect(finalTotal).toBe(subtotal - discount + tax + shipping);
  });
});
