import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from '../common/Toast';
import { clearTransactionStatus } from '../../features/transactions/transactionSlice';
import { clearCategoryStatus } from '../../features/categories/categorySlice';
import { clearBudgetStatus } from '../../features/budget/budgetSlice';
import { clearSettingsStatus } from '../../features/settings/settingsSlice';

export const MainLayout = () => {
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Redux toasts
  const txMsg = useSelector((state) => state.transactions.lastActionMessage);
  const txErr = useSelector((state) => state.transactions.error);
  const catMsg = useSelector((state) => state.categories.successMessage);
  const catErr = useSelector((state) => state.categories.error);
  const budgetMsg = useSelector((state) => state.budget.successMessage);
  const budgetErr = useSelector((state) => state.budget.error);
  const settingsMsg = useSelector((state) => state.settings.successMessage);
  const settingsErr = useSelector((state) => state.settings.error);

  const activeMessage = txMsg || catMsg || budgetMsg || settingsMsg;
  const activeError = txErr || catErr || budgetErr || settingsErr;

  const handleDismissToast = () => {
    dispatch(clearTransactionStatus());
    dispatch(clearCategoryStatus());
    dispatch(clearBudgetStatus());
    dispatch(clearSettingsStatus());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header onOpenMobileMenu={() => setIsMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/60 dark:border-slate-800/60">
          SpendWise – Personal Expense & Income Tracker &copy; {new Date().getFullYear()}. All financial data stored locally.
        </footer>
      </div>

      {/* Global Toast for Success and Error alerts */}
      {activeMessage && (
        <Toast
          message={activeMessage}
          type="success"
          onClose={handleDismissToast}
        />
      )}
      {activeError && (
        <Toast
          message={activeError}
          type="error"
          onClose={handleDismissToast}
        />
      )}
    </div>
  );
};

export default MainLayout;

