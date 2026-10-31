import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { logout, rehydrateAuth } from '../src/features/auth/authSlice';
import cartReducer, { addToCart } from '../src/features/cart/cartSlice';
import preferenceReducer, { toggleTheme } from '../src/features/preferences/preferenceSlice';
import orderReducer from '../src/features/orders/orderSlice';
import productReducer from '../src/features/products/productSlice';
import { persistenceMiddleware } from '../src/middleware/persistenceMiddleware';
import { simulateLogin } from '../src/features/auth/authThunks';
import { STORAGE_KEYS, loadFromStorage } from '../src/utils/localStorage';

describe('Comprehensive Logout Flow & Persistence Tests', () => {
  let store;

  const createTestStore = () =>
    configureStore({
      reducer: {
        auth: authReducer,
        cart: cartReducer,
        preferences: preferenceReducer,
        orders: orderReducer,
        products: productReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(persistenceMiddleware),
    });

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    store = createTestStore();
  });

  it('Scenario 1: Login → Logout clears Redux auth and LocalStorage session', async () => {
    // 1. User logs in
    await store.dispatch(
      simulateLogin({ email: 'demo@shopsphere.com', password: 'password123' })
    );

    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.user).toBeDefined();
    expect(localStorage.getItem(STORAGE_KEYS.AUTH)).not.toBeNull();

    // 2. User clicks Logout
    store.dispatch(logout());

    // Redux auth state is cleared
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.token).toBeNull();

    // LocalStorage auth session is completely removed
    expect(localStorage.getItem(STORAGE_KEYS.AUTH)).toBeNull();
  });

  it('Scenario 2: Login → Refresh → Logout removes persisted session', async () => {
    // 1. User logs in
    await store.dispatch(
      simulateLogin({ email: 'demo@shopsphere.com', password: 'password123' })
    );

    // 2. Simulate page refresh by reading from LocalStorage
    const storedAuth = loadFromStorage(STORAGE_KEYS.AUTH);
    expect(storedAuth).toBeDefined();
    expect(storedAuth.token).toBeDefined();

    // Rehydrate a store simulating app restart
    const refreshedStore = createTestStore();
    refreshedStore.dispatch(rehydrateAuth());
    expect(refreshedStore.getState().auth.isAuthenticated).toBe(true);

    // 3. User logs out on refreshed session
    refreshedStore.dispatch(logout());

    expect(refreshedStore.getState().auth.isAuthenticated).toBe(false);
    expect(localStorage.getItem(STORAGE_KEYS.AUTH)).toBeNull();
  });

  it('Scenario 3 & 4: Logout → Refresh the page does not restore previous session', async () => {
    // 1. User logs in
    await store.dispatch(
      simulateLogin({ email: 'demo@shopsphere.com', password: 'password123' })
    );

    // 2. User logs out
    store.dispatch(logout());
    expect(localStorage.getItem(STORAGE_KEYS.AUTH)).toBeNull();

    // 3. Simulate page refresh after logout
    const refreshedAuth = loadFromStorage(STORAGE_KEYS.AUTH);
    expect(refreshedAuth).toBeNull();

    // Store rehydration remains unauthenticated
    const newStore = createTestStore();
    newStore.dispatch(rehydrateAuth());
    expect(newStore.getState().auth.isAuthenticated).toBe(false);
    expect(newStore.getState().auth.user).toBeNull();
  });

  it('Scenario 5: Logout does NOT clear the shopping cart or user preferences', async () => {
    // Add cart item
    store.dispatch(
      addToCart({
        product: {
          id: 101,
          title: 'Premium Wireless Headphones',
          price: 4999,
        },
        quantity: 1,
      })
    );

    // Change preference
    store.dispatch(toggleTheme());

    // User logs in
    await store.dispatch(
      simulateLogin({ email: 'demo@shopsphere.com', password: 'password123' })
    );

    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().preferences.theme).toBe('dark');

    // User logs out
    store.dispatch(logout());

    // Cart items and preferences are preserved
    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().preferences.theme).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEYS.CART)).not.toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.PREFERENCES)).not.toBeNull();

    // Only auth is cleared
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(localStorage.getItem(STORAGE_KEYS.AUTH)).toBeNull();
  });

  it('Scenario 6: Protected page access blocked when logged out', () => {
    // With store in logged-out state
    store.dispatch(logout());

    const isAuth = store.getState().auth.isAuthenticated;
    expect(isAuth).toBe(false);

    // Any attempt to access protected resource confirms unauthenticated status
    expect(store.getState().auth.token).toBeNull();
    expect(store.getState().auth.user).toBeNull();
  });
});
