import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  type: 'all', // 'all' | 'income' | 'expense'
  category: 'all',
  paymentMethod: 'all',
  startDate: '',
  endDate: '',
  sortBy: 'latest', // 'latest' | 'oldest' | 'highest' | 'lowest'
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setTypeFilter: (state, action) => {
      state.type = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.category = action.payload;
    },
    setPaymentMethodFilter: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate || '';
      state.endDate = action.payload.endDate || '';
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearFilters: () => {
      return initialState;
    },
  },
});

export const {
  setSearchQuery,
  setTypeFilter,
  setCategoryFilter,
  setPaymentMethodFilter,
  setDateRange,
  setSortBy,
  clearFilters,
} = filterSlice.actions;

export default filterSlice.reducer;

