import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageService, DEFAULT_BUDGET } from '../../services/storageService';
import { getCurrentYearMonth } from '../../utils/dateUtils';

export const fetchBudget = createAsyncThunk(
  'budget/fetchBudget',
  async (_, { rejectWithValue }) => {
    try {
      const data = storageService.getBudget();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch budget');
    }
  }
);

export const updateBudgetAsync = createAsyncThunk(
  'budget/updateBudgetAsync',
  async ({ monthlyLimit, month }, { rejectWithValue }) => {
    try {
      const limit = Number(monthlyLimit);
      if (isNaN(limit) || limit <= 0) {
        throw new Error('Monthly budget must be a positive number.');
      }

      const budgetData = {
        monthlyLimit: limit,
        month: month || getCurrentYearMonth(),
        updatedAt: new Date().toISOString(),
      };

      storageService.setBudget(budgetData);
      return budgetData;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update budget');
    }
  }
);

const savedBudget = storageService.getBudget() || DEFAULT_BUDGET;

const initialState = {
  monthlyLimit: savedBudget.monthlyLimit || 25000,
  month: savedBudget.month || getCurrentYearMonth(),
  status: 'idle',
  error: null,
  successMessage: null,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearBudgetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
    },
    setBudgetMonth: (state, action) => {
      state.month = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.monthlyLimit = action.payload.monthlyLimit;
        state.month = action.payload.month || state.month;
      })
      .addCase(updateBudgetAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateBudgetAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monthlyLimit = action.payload.monthlyLimit;
        state.month = action.payload.month;
        state.successMessage = 'Monthly budget updated successfully!';
      })
      .addCase(updateBudgetAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearBudgetStatus, setBudgetMonth } = budgetSlice.actions;

export const selectBudgetLimit = (state) => state.budget.monthlyLimit;
export const selectBudgetMonth = (state) => state.budget.month;
export const selectBudgetState = (state) => state.budget;

export default budgetSlice.reducer;

