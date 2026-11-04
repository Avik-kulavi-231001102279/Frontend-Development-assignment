import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';
import Settings from './pages/Settings';
import useTheme from './hooks/useTheme';
import { fetchTransactions } from './features/transactions/transactionSlice';
import { fetchCategories } from './features/categories/categorySlice';
import { fetchBudget } from './features/budget/budgetSlice';
import { fetchSettings } from './features/settings/settingsSlice';

export function App() {
  const dispatch = useDispatch();
  // Initializes and synchronizes dark/light theme on <html>
  useTheme();

  // Load initial data on startup using async thunks
  useEffect(() => {
    dispatch(fetchSettings());
    dispatch(fetchCategories());
    dispatch(fetchBudget());
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="categories" element={<Categories />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="budget" element={<Budget />} />
          <Route path="settings" element={<Settings />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

