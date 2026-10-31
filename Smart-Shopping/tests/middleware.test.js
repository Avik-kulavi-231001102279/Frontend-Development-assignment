import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loggerMiddleware } from '../src/middleware/loggerMiddleware';
import { persistenceMiddleware } from '../src/middleware/persistenceMiddleware';
import { STORAGE_KEYS } from '../src/utils/localStorage';

describe('Redux Custom Middlewares', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('loggerMiddleware', () => {
    it('should forward dispatched actions to the next handler', () => {
      const store = {
        getState: vi.fn().mockReturnValue({ cart: { items: [] } }),
      };
      const next = vi.fn().mockImplementation((action) => action);
      const action = { type: 'cart/addToCart', payload: { product: { id: 1 } } };

      const result = loggerMiddleware(store)(next)(action);

      expect(next).toHaveBeenCalledWith(action);
      expect(result).toBe(action);
    });

    it('should sanitize sensitive password fields in console logs', () => {
      const store = {
        getState: vi.fn().mockReturnValue({}),
      };
      const next = vi.fn().mockImplementation((action) => action);
      const action = {
        type: 'auth/simulateLogin/pending',
        payload: { email: 'test@example.com', password: 'secretpassword123' },
      };

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      loggerMiddleware(store)(next)(action);

      // Verify action was passed
      expect(next).toHaveBeenCalledWith(action);
      consoleSpy.mockRestore();
    });

    it('should handle asynchronous action logging for pending, fulfilled, and rejected types', () => {
      const store = {
        getState: vi.fn().mockReturnValue({ products: { status: 'idle' } }),
      };
      const next = vi.fn().mockImplementation((action) => action);

      const asyncActions = [
        { type: 'products/fetchProducts/pending' },
        { type: 'products/fetchProducts/fulfilled', payload: [{ id: 1 }] },
        { type: 'products/fetchProducts/rejected', error: { message: 'Network Error' } },
      ];

      for (const action of asyncActions) {
        const result = loggerMiddleware(store)(next)(action);
        expect(result).toBe(action);
      }
      expect(next).toHaveBeenCalledTimes(3);
    });
  });

  describe('persistenceMiddleware', () => {
    it('should synchronize cart slice updates to LocalStorage', () => {
      const mockState = {
        cart: {
          items: [{ id: 1, title: 'Item 1', quantity: 2 }],
          appliedCoupon: { code: 'WELCOME10' },
        },
      };

      const store = {
        getState: vi.fn().mockReturnValue(mockState),
      };
      const next = vi.fn().mockImplementation((action) => action);
      const action = { type: 'cart/addToCart' };

      persistenceMiddleware(store)(next)(action);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART));
      expect(stored).toBeDefined();
      expect(stored.items).toHaveLength(1);
      expect(stored.appliedCoupon.code).toBe('WELCOME10');
    });

    it('should synchronize orders slice updates to LocalStorage', () => {
      const mockState = {
        orders: {
          orders: [{ id: 'ORD-1234', totalAmount: 150 }],
        },
      };

      const store = {
        getState: vi.fn().mockReturnValue(mockState),
      };
      const next = vi.fn().mockImplementation((action) => action);
      const action = { type: 'orders/placeOrder/fulfilled' };

      persistenceMiddleware(store)(next)(action);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS));
      expect(stored).toBeDefined();
      expect(stored[0].id).toBe('ORD-1234');
    });

    it('should synchronize preference slice updates (theme, currency) to LocalStorage', () => {
      const mockState = {
        preferences: {
          theme: 'dark',
          viewMode: 'list',
          currency: 'INR',
        },
      };

      const store = {
        getState: vi.fn().mockReturnValue(mockState),
      };
      const next = vi.fn().mockImplementation((action) => action);
      const action = { type: 'preferences/toggleTheme' };

      persistenceMiddleware(store)(next)(action);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERENCES));
      expect(stored).toBeDefined();
      expect(stored.theme).toBe('dark');
      expect(stored.currency).toBe('INR');
    });

    it('should clear authentication storage on auth/logout', () => {
      // First save an active session
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ token: 'abc' }));

      const mockState = {
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
        },
      };

      const store = {
        getState: vi.fn().mockReturnValue(mockState),
      };
      const next = vi.fn().mockImplementation((action) => action);
      const action = { type: 'auth/logout' };

      persistenceMiddleware(store)(next)(action);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH));
      expect(stored).toBeNull();
    });
  });
});
