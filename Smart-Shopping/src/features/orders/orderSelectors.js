import { createSelector } from '@reduxjs/toolkit';

export const selectAllOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrderLoading = (state) => state.orders.loading;
export const selectOrderError = (state) => state.orders.error;

/**
 * Memoized selector: Select a single order by order ID
 */
export const selectOrderById = createSelector(
  [selectAllOrders, (_, orderId) => orderId],
  (orders, orderId) => orders.find((o) => o.id === orderId) || null
);

/**
 * Memoized selector: Get recent orders sorted newest first
 */
export const selectRecentOrders = createSelector(
  [selectAllOrders],
  (orders) => {
    return [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
);
