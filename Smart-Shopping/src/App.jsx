import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme } from './features/preferences/preferenceSlice';
import { fetchProducts, fetchCategories } from './features/products/productThunks';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ToastNotification from './components/common/ToastNotification';
import AppRoutes from './routes/AppRoutes';

export const App = () => {
  const theme = useSelector(selectTheme);
  const location = useLocation();
  const dispatch = useDispatch();

  // Synchronize document dark class for Tailwind v4 and html styling
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Scroll to top upon navigating to a new route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Initial eager data load from Fake Store API
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Sticky Global Navigation */}
      <Navbar />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AppRoutes />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Toast Notification Container */}
      <ToastNotification />
    </div>
  );
};

export default App;
