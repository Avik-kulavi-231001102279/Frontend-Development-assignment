import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearCart } from '../cart/cartSlice';

/**
 * Generate a unique, professional order number
 */
export const generateOrderId = () => {
  const prefix = 'ORD';
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${randomDigits}`;
};

/**
 * Async Thunk to place an order
 */
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderPayload, { dispatch, rejectWithValue }) => {
    try {
      // Simulate payment gateway & inventory reservation latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      const now = new Date();
      const estimatedDate = new Date();
      estimatedDate.setDate(now.getDate() + 4);

      const order = {
        id: generateOrderId(),
        createdAt: now.toISOString(),
        items: orderPayload.items || [],
        subtotal: orderPayload.subtotal,
        discount: orderPayload.discount,
        tax: orderPayload.tax,
        shipping: orderPayload.shipping,
        totalAmount: orderPayload.totalAmount,
        shippingAddress: orderPayload.shippingAddress,
        paymentMethod: orderPayload.paymentMethod,
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed', // 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
        estimatedDelivery: estimatedDate.toISOString(),
      };

      // Clear the shopping cart automatically upon successful order placement
      dispatch(clearCart());

      return order;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to place order');
    }
  }
);
