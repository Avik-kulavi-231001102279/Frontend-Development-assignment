/**
 * Safe LocalStorage helpers with error resilience and serialization
 */

export const loadFromStorage = (key, fallback = null) => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return fallback;
    }
    return JSON.parse(serialized);
  } catch (err) {
    console.error(`Error loading key "${key}" from localStorage:`, err);
    return fallback;
  }
};

export const saveToStorage = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (err) {
    console.error(`Error saving key "${key}" to localStorage:`, err);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing key "${key}" from localStorage:`, err);
  }
};

export const STORAGE_KEYS = {
  CART: 'shopsphere_cart',
  AUTH: 'shopsphere_auth',
  ORDERS: 'shopsphere_orders',
  PREFERENCES: 'shopsphere_preferences',
  RECENT_SEARCHES: 'shopsphere_recent_searches',
};
