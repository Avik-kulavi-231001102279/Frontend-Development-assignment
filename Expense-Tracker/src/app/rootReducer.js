import { combineReducers } from '@reduxjs/toolkit';
import transactionReducer from '../features/transactions/transactionSlice';
import categoryReducer from '../features/categories/categorySlice';
import budgetReducer from '../features/budget/budgetSlice';
import settingsReducer from '../features/settings/settingsSlice';
import filterReducer from '../features/filters/filterSlice';

const rootReducer = combineReducers({
  transactions: transactionReducer,
  categories: categoryReducer,
  budget: budgetReducer,
  settings: settingsReducer,
  filters: filterReducer,
});

export default rootReducer;

