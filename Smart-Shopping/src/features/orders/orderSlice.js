import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, STORAGE_KEYS } from '../../utils/localStorage';
import { placeOrder } from './orderThunks';

// Sample pre-seeded historical order for realistic user experience
const sampleOrder = {
  id: 'ORD-2026-849201',
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  items: [
    {
      id: 1,
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      quantity: 1,
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      category: "men's clothing",
    },
    {
      id: 2,
      title: 'Mens Casual Premium Slim Fit T-Shirts',
      price: 22.3,
      quantity: 2,
      image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
      category: "men's clothing",
    },
  ],
  subtotal: 154.55,
  discount: 15.45,
  tax: 6.96,
  shipping: 0,
  totalAmount: 146.06,
  shippingAddress: {
    fullName: 'Alex Morgan',
    email: 'demo@shopsphere.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Suite 101',
    city: 'Springfield',
    state: 'Oregon',
    pinCode: '97477',
  },
  paymentMethod: 'Credit / Debit Card',
  paymentStatus: 'Paid',
  orderStatus: 'Shipped',
  estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
};

const persistedOrders = loadFromStorage(STORAGE_KEYS.ORDERS, [sampleOrder]);

const initialState = {
  orders: Array.isArray(persistedOrders) ? persistedOrders : [sampleOrder],
  currentOrder: null,
  loading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        order.orderStatus = status;
      }
      if (state.currentOrder?.id === orderId) {
        state.currentOrder.orderStatus = status;
      }
    },
    cancelOrder: (state, action) => {
      const orderId = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order && order.orderStatus !== 'Delivered') {
        order.orderStatus = 'Cancelled';
      }
      if (state.currentOrder?.id === orderId) {
        state.currentOrder.orderStatus = 'Cancelled';
      }
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders.unshift(action.payload); // Add newest order to top
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to place order';
      });
  },
});

export const {
  updateOrderStatus,
  cancelOrder,
  setCurrentOrder,
  clearCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
