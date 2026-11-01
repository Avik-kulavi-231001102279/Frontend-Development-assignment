/**
 * Attendify - Custom Redux Logger Middleware
 * Logs dispatched action types and sanitized payload summaries in development mode.
 * Suppressed in production to prevent sensitive data leaks and overhead.
 */

export const loggerMiddleware = (storeAPI) => (next) => (action) => {
  const isDev = Boolean(
    import.meta.env?.DEV ??
    (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production')
  );

  if (isDev) {
    // Sanitize any potential sensitive fields from the payload
    let sanitizedPayload = action.payload;
    if (sanitizedPayload && typeof sanitizedPayload === 'object') {
      sanitizedPayload = Array.isArray(sanitizedPayload)
        ? `[Array of ${sanitizedPayload.length} items]`
        : { ...sanitizedPayload };

      if (typeof sanitizedPayload === 'object' && !Array.isArray(sanitizedPayload)) {
        if (sanitizedPayload.password) sanitizedPayload.password = '***[REDACTED]***';
        if (sanitizedPayload.token) sanitizedPayload.token = '***[JWT_REDACTED]***';
      }
    }

    console.groupCollapsed(`%cRedux: ${action.type}`, 'color: #2563EB; font-weight: bold;');
    console.log('%cAction:', 'color: #64748B; font-weight: 600;', action.type);
    console.log('%cPayload:', 'color: #059669;', sanitizedPayload);
    console.log('%cNext State:', 'color: #7C3AED;', storeAPI.getState());
    console.groupEnd();
  }

  return next(action);
};

export default loggerMiddleware;
