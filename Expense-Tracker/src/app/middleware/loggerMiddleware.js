/**
 * Custom Redux Middleware for logging actions and state changes
 * Academic & debugging requirement
 */
export const loggerMiddleware = (storeAPI) => (next) => (action) => {
  if (process.env.NODE_ENV !== 'production') {
    const prevState = storeAPI.getState();
    const result = next(action);
    const nextState = storeAPI.getState();

    // Group logging for neat console output
    console.groupCollapsed(`%cAction: %c${action.type}`, 'color: #6366f1; font-weight: bold;', 'color: #059669; font-weight: bold;');
    console.log('%cPayload:', 'color: #d97706; font-weight: bold;', action.payload);
    console.log('%cPrev State:', 'color: #64748b;', prevState);
    console.log('%cNext State:', 'color: #3b82f6;', nextState);
    console.groupEnd();

    return result;
  }
  return next(action);
};

