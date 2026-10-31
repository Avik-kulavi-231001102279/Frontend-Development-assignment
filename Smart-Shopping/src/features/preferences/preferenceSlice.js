import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, STORAGE_KEYS } from '../../utils/localStorage';

// Detect initial system color scheme
const getInitialTheme = () => {
  const saved = loadFromStorage(STORAGE_KEYS.PREFERENCES, null);
  if (saved?.theme) return saved.theme;
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const persisted = loadFromStorage(STORAGE_KEYS.PREFERENCES, {});

const initialState = {
  theme: getInitialTheme(),
  viewMode: persisted?.viewMode || 'grid', // 'grid' | 'list'
  currency: 'INR', // Indian Rupee (INR - ₹) mandatory
  toasts: [], // Array of { id, message, type: 'success' | 'error' | 'info', duration }
};

export const preferenceSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload; // 'grid' or 'list'
    },
    setCurrency: (state, action) => {
      state.currency = action.payload; // 'USD' or 'INR'
    },
    addToast: (state, action) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      const { message, type = 'info', duration = 3500 } = action.payload;
      state.toasts.push({ id, message, type, duration });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setViewMode,
  setCurrency,
  addToast,
  removeToast,
} = preferenceSlice.actions;

// Selectors
export const selectTheme = (state) => state.preferences.theme;
export const selectViewMode = (state) => state.preferences.viewMode;
export const selectCurrency = (state) => state.preferences.currency;
export const selectToasts = (state) => state.preferences.toasts;

export default preferenceSlice.reducer;
