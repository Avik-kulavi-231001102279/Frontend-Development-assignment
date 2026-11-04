import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Menu,
  Search,
  Calendar,
  Bell,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { formatHeaderDate } from '../../utils/dateUtils';
import { selectBudgetProgress } from '../../features/transactions/transactionSelectors';
import { setSearchQuery } from '../../features/filters/filterSlice';
import useTheme from '../../hooks/useTheme';

export const Header = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();
  const budgetProgress = useSelector(selectBudgetProgress);
  const searchQuery = useSelector((state) => state.filters.searchQuery);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Dynamic Page Title
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Financial Dashboard';
      case '/transactions':
        return 'Transactions History';
      case '/categories':
        return 'Category Management';
      case '/analytics':
        return 'Analytics & Reports';
      case '/budget':
        return 'Budget Management';
      case '/settings':
        return 'Application Settings';
      default:
        return 'SpendWise';
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    dispatch(setSearchQuery(val));
    // If not on transactions page and user searches, navigate to transactions page so they see live results
    if (location.pathname !== '/transactions' && val.trim().length > 0) {
      navigate('/transactions');
    }
  };

  const clearSearch = () => {
    dispatch(setSearchQuery(''));
  };

  // Build notifications array dynamically based on budget alerts
  const notifications = [];
  if (budgetProgress.isBudgetExceeded) {
    notifications.push({
      id: 'notif-exceeded',
      title: 'Budget Exceeded!',
      message: `You have spent ${budgetProgress.budgetPercentage}% of your monthly budget.`,
      type: 'danger',
      time: 'Attention needed',
    });
  } else if (budgetProgress.isBudgetWarning) {
    notifications.push({
      id: 'notif-warning',
      title: 'Budget Alert (80%+)',
      message: `You have utilized ${budgetProgress.budgetPercentage}% of your monthly limit.`,
      type: 'warning',
      time: 'Approaching limit',
    });
  }

  // General healthy status notice if no warning
  if (notifications.length === 0) {
    notifications.push({
      id: 'notif-ok',
      title: 'Budget On Track',
      message: `You've utilized ${budgetProgress.budgetPercentage}% of your monthly budget. Keep it up!`,
      type: 'success',
      time: 'Current month',
    });
  }

  const hasAlert = budgetProgress.isBudgetWarning || budgetProgress.isBudgetExceeded;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left section: Hamburger (mobile) + Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-none">
              {getPageTitle(location.pathname)}
            </h1>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatHeaderDate()}</span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search transactions, categories, notes..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Theme Toggle + Notification + User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {hasAlert && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                      Notifications & Alerts
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium">
                      {notifications.length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-3 ${
                          notif.type === 'danger'
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
                            : notif.type === 'warning'
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {notif.type === 'danger' || notif.type === 'warning' ? (
                          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold">{notif.title}</p>
                          <p className="mt-0.5 opacity-90">{notif.message}</p>
                          <span className="block mt-1 text-[10px] text-slate-400">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigate('/budget');
                      }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Manage Budget & Limits →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Profile Section */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              AM
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                Alex Morgan
              </span>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                Personal Plan
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

