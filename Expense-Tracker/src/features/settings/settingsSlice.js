import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageService, DEFAULT_SETTINGS } from '../../services/storageService';

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      return storageService.getSettings();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch settings');
    }
  }
);

export const updateSettingsAsync = createAsyncThunk(
  'settings/updateSettingsAsync',
  async (newSettings, { getState, rejectWithValue }) => {
    try {
      const current = getState().settings;
      const updated = {
        theme: newSettings.theme || current.theme,
        currency: newSettings.currency || current.currency,
        userName: newSettings.userName !== undefined ? newSettings.userName : current.userName,
        enableNotifications: newSettings.enableNotifications !== undefined ? newSettings.enableNotifications : current.enableNotifications,
      };
      storageService.setSettings(updated);
      return updated;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update settings');
    }
  }
);

export const resetAllDataAsync = createAsyncThunk(
  'settings/resetAllDataAsync',
  async (_, { rejectWithValue }) => {
    try {
      storageService.resetAllData();
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reset all data');
    }
  }
);

const savedSettings = storageService.getSettings() || DEFAULT_SETTINGS;

const initialState = {
  theme: savedSettings.theme || 'light',
  currency: savedSettings.currency || 'INR',
  userName: savedSettings.userName || 'Alex Morgan',
  enableNotifications: savedSettings.enableNotifications !== false,
  status: 'idle',
  error: null,
  successMessage: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      storageService.setSettings({
        theme: state.theme,
        currency: state.currency,
        userName: state.userName,
        enableNotifications: state.enableNotifications,
      });
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      storageService.setSettings({
        theme: state.theme,
        currency: state.currency,
        userName: state.userName,
        enableNotifications: state.enableNotifications,
      });
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
      storageService.setSettings({
        theme: state.theme,
        currency: state.currency,
        userName: state.userName,
        enableNotifications: state.enableNotifications,
      });
    },
    clearSettingsStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.theme = action.payload.theme;
        state.currency = action.payload.currency;
        state.userName = action.payload.userName;
        state.enableNotifications = action.payload.enableNotifications;
      })
      .addCase(updateSettingsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSettingsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.theme = action.payload.theme;
        state.currency = action.payload.currency;
        state.userName = action.payload.userName;
        state.enableNotifications = action.payload.enableNotifications;
        state.successMessage = 'Settings saved successfully!';
      })
      .addCase(updateSettingsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(resetAllDataAsync.fulfilled, (state) => {
        state.theme = DEFAULT_SETTINGS.theme;
        state.currency = DEFAULT_SETTINGS.currency;
        state.userName = DEFAULT_SETTINGS.userName;
        state.status = 'succeeded';
        state.successMessage = 'All application data has been reset to defaults!';
      });
  },
});

export const { toggleTheme, setTheme, setCurrency, clearSettingsStatus } = settingsSlice.actions;

export const selectTheme = (state) => state.settings.theme;
export const selectCurrency = (state) => state.settings.currency;
export const selectUserName = (state) => state.settings.userName;
export const selectSettingsState = (state) => state.settings;

export default settingsSlice.reducer;

