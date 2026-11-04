import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { loggerMiddleware } from './middleware/loggerMiddleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(loggerMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

