import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, removeFromStorage, STORAGE_KEYS } from '../../utils/localStorage';
import { simulateLogin, simulateRegistration } from './authThunks';

export const getInitialAuthState = () => {
  const persistedAuth = loadFromStorage(STORAGE_KEYS.AUTH, null);
  return {
    user: persistedAuth?.user || null,
    token: persistedAuth?.token || null,
    isAuthenticated: Boolean(persistedAuth?.token),
    loading: false,
    error: null,
  };
};

const initialState = getInitialAuthState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      removeFromStorage(STORAGE_KEYS.AUTH);
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem(STORAGE_KEYS.AUTH);
        sessionStorage.removeItem('token');
      } catch {
        // Safe fallback in test environments
      }
    },
    rehydrateAuth: (state) => {
      const persistedAuth = loadFromStorage(STORAGE_KEYS.AUTH, null);
      state.user = persistedAuth?.user || null;
      state.token = persistedAuth?.token || null;
      state.isAuthenticated = Boolean(persistedAuth?.token);
      state.loading = false;
      state.error = null;
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // simulateLogin
    builder
      .addCase(simulateLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(simulateLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(simulateLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      });

    // simulateRegistration
    builder
      .addCase(simulateRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(simulateRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(simulateRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
        state.isAuthenticated = false;
      });
  },
});

export const { logout, rehydrateAuth, updateProfile, clearAuthError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
