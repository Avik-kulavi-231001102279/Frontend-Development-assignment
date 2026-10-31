import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, STORAGE_KEYS } from '../../utils/localStorage';

// Supported promo coupons with validation rules
export const AVAILABLE_COUPONS = {
  WELCOME10: { code: 'WELCOME10', discountType: 'percentage', value: 10, minOrder: 0, description: '10% off your entire order' },
  SHOPSPHERE20: { code: 'SHOPSPHERE20', discountType: 'percentage', value: 20, minOrder: 50, description: '20% off on eligible orders' },
  SAVE15: { code: 'SAVE15', discountType: 'fixed', value: 15, minOrder: 60, description: 'Flat ₹15 off on eligible orders' },
  FREESHIP: { code: 'FREESHIP', discountType: 'free_shipping', value: 0, minOrder: 30, description: 'Free Express Shipping' },
};

const persistedCart = loadFromStorage(STORAGE_KEYS.CART, {
  items: [],
  appliedCoupon: null,
});

const initialState = {
  items: Array.isArray(persistedCart?.items) ? persistedCart.items : [],
  appliedCoupon: persistedCart?.appliedCoupon || null,
  couponError: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const qtyToAdd = Math.max(1, Number(quantity) || 1);

      const existingIndex = state.items.findIndex((item) => item.id === product.id);

      if (existingIndex >= 0) {
        // Prevent duplicates - increment existing product quantity
        state.items[existingIndex].quantity += qtyToAdd;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: Number(product.price) || 0,
          image: product.image,
          category: product.category,
          quantity: qtyToAdd,
        });
      }
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // If reduced below 1, remove item
          state.items = state.items.filter((i) => i.id !== id);
        }
      }
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const parsedQty = Number(quantity);
      if (isNaN(parsedQty) || parsedQty < 1) return; // Prevent invalid quantities

      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = Math.floor(parsedQty);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = null;
      state.couponError = null;
    },

    applyCoupon: (state, action) => {
      const rawCode = (action.payload || '').trim().toUpperCase();
      const coupon = AVAILABLE_COUPONS[rawCode];

      if (!coupon) {
        state.couponError = `Coupon code "${rawCode}" is invalid. Try WELCOME10 or SHOPSPHERE20.`;
        return;
      }

      state.appliedCoupon = coupon;
      state.couponError = null;
    },

    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.couponError = null;
    },

    clearCouponError: (state) => {
      state.couponError = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  clearCouponError,
} = cartSlice.actions;

export default cartSlice.reducer;
