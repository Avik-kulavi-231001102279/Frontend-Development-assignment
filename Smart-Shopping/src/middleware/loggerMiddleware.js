/**
 * Custom Redux Logger Middleware
 * Logs actions, previous state, next state, and specialized tracking for Cart, Auth, and Checkout.
 * Sanitizes sensitive fields like passwords.
 */

// Helper to mask sensitive fields in objects
const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(sanitizeData);

  const sanitized = { ...data };
  const sensitiveKeys = ['password', 'confirmPassword', 'cvv', 'cardNumber', 'token'];

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      sanitized[key] = '******** [REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }
  return sanitized;
};

export const loggerMiddleware = (store) => (next) => (action) => {
  // If in pure test environment without console grouping, simply forward
  if (typeof console === 'undefined') {
    return next(action);
  }

  const prevState = store.getState();
  const safeAction = {
    type: action.type,
    payload: sanitizeData(action.payload),
  };

  // Activity categorizer
  const isCartAction = action.type?.startsWith('cart/');
  const isAuthAction = action.type?.startsWith('auth/');
  const isOrderAction = action.type?.startsWith('orders/');

  const badgeColor = isCartAction
    ? '#10b981' // emerald
    : isAuthAction
    ? '#3b82f6' // blue
    : isOrderAction
    ? '#8b5cf6' // purple
    : '#64748b'; // slate

  const activityTag = isCartAction
    ? '🛒 [CART ACTIVITY]'
    : isAuthAction
    ? '🔐 [AUTH ACTIVITY]'
    : isOrderAction
    ? '📦 [CHECKOUT ACTIVITY]'
    : '⚡ [REDUX ACTION]';

  // Log grouped action info in browser console
  try {
    if (console.groupCollapsed) {
      console.groupCollapsed(
        `%c${activityTag} %c${action.type} %c@ ${new Date().toLocaleTimeString()}`,
        `color: ${badgeColor}; font-weight: bold;`,
        'color: #0f172a; font-weight: bold;',
        'color: #94a3b8; font-weight: normal;'
      );
      console.log('%cPrev State:', 'color: #94a3b8; font-weight: bold;', prevState);
      console.log('%cAction:', 'color: #0284c7; font-weight: bold;', safeAction);
    }
  } catch {
    // Graceful fallback for non-browser/restricted environments
  }

  const result = next(action);
  const nextState = store.getState();

  try {
    if (console.groupCollapsed) {
      console.log('%cNext State:', 'color: #16a34a; font-weight: bold;', nextState);
      console.groupEnd();
    }
  } catch {
    // Fallback
  }

  return result;
};
