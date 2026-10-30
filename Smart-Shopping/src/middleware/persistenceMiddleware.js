import { saveToStorage, STORAGE_KEYS } from '../utils/localStorage';

/**
 * Custom Redux Persistence Middleware
 * Synchronizes specific slices to LocalStorage upon relevant action dispatches.
 */
export const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  const type = action.type || '';

  // Synchronize Cart
  if (type.startsWith('cart/')) {
    saveToStorage(STORAGE_KEYS.CART, {
      items: state.cart.items,
      appliedCoupon: state.cart.appliedCoupon,
    });
  }

  // Synchronize Authentication
  if (type.startsWith('auth/')) {
    if (state.auth.isAuthenticated && state.auth.token) {
      saveToStorage(STORAGE_KEYS.AUTH, {
        user: state.auth.user,
        token: state.auth.token,
      });
    } else {
      saveToStorage(STORAGE_KEYS.AUTH, null);
    }
  }

  // Synchronize Orders
  if (type.startsWith('orders/')) {
    saveToStorage(STORAGE_KEYS.ORDERS, state.orders.orders);
  }

  // Synchronize Preferences (Theme, ViewMode, Currency)
  if (type.startsWith('preferences/')) {
    saveToStorage(STORAGE_KEYS.PREFERENCES, {
      theme: state.preferences.theme,
      viewMode: state.preferences.viewMode,
      currency: state.preferences.currency,
    });
  }

  return result;
};
