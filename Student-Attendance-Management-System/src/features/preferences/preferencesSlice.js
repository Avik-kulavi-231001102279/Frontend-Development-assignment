/**
 * Attendify - Preferences Redux Slice
 * Manages UI theme (light/dark), minimum attendance threshold, and institutional settings
 */

import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_PREFERENCES } from '../../data/seedData';

const initialState = {
  ...INITIAL_PREFERENCES,
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', action.payload);
      }
    },
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = nextTheme;
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', nextTheme);
      }
    },
    setThreshold: (state, action) => {
      const num = Number(action.payload);
      state.threshold = isNaN(num) || num <= 0 ? 45 : Math.min(100, num);
    },
    updatePreferences: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetPreferences: () => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', 'light');
      }
      return { ...INITIAL_PREFERENCES };
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setThreshold,
  updatePreferences,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
