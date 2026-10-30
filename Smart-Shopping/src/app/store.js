import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import orderReducer from '../features/orders/orderSlice';
import preferenceReducer from '../features/preferences/preferenceSlice';
import { loggerMiddleware } from '../middleware/loggerMiddleware';
import { persistenceMiddleware } from '../middleware/persistenceMiddleware';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
    orders: orderReducer,
    preferences: preferenceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore date strings or custom serializable actions if any
        ignoredActionPaths: ['payload.timestamp', 'meta.arg'],
      },
    }).concat(loggerMiddleware, persistenceMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
