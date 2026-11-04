import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Sun,
  Moon,
  Coins,
  Download,
  Trash2,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertTriangle,
  User,
  Sparkles,
} from 'lucide-react';
import {
  selectTheme,
  selectCurrency,
  selectUserName,
  setTheme,
  setCurrency,
  updateSettingsAsync,
  resetAllDataAsync,
} from '../features/settings/settingsSlice';
import {
  clearAllTransactionsAsync,
  loadSampleTransactionsAsync,
} from '../features/transactions/transactionSlice';
import { selectAllTransactions } from '../features/transactions/transactionSelectors';
import { CURRENCY_CONFIG } from '../utils/formatCurrency';
import { exportTransactionsToCSV } from '../utils/exportCSV';
import ConfirmDialog from '../components/common/ConfirmDialog';

export const Settings = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const currency = useSelector(selectCurrency);
  const userName = useSelector(selectUserName);
  const transactions = useSelector(selectAllTransactions);

  const [nameInput, setNameInput] = useState(userName);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'clear_tx' | 'reset_all'
    title: '',
    message: '',
  });

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  const handleCurrencyChange = (newCurrency) => {
    dispatch(setCurrency(newCurrency));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    dispatch(updateSettingsAsync({ userName: nameInput.trim() }));
  };

  const handleExportAll = () => {
    try {
      exportTransactionsToCSV(transactions, 'all-transactions');
    } catch (err) {
      alert(err.message || 'Export failed.');
    }
  };

  const handleLoadSample = () => {
    dispatch(loadSampleTransactionsAsync());
  };

  const handleConfirmAction = async () => {
    if (confirmModal.type === 'clear_tx') {
      await dispatch(clearAllTransactionsAsync());
    } else if (confirmModal.type === 'reset_all') {
      await dispatch(resetAllDataAsync());
      window.location.reload();
    }
    setConfirmModal({ isOpen: false, type: null, title: '', message: '' });
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Application Settings
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Customize display preferences, global currency, and manage offline data
        </p>
      </div>

      {/* 1. Appearance / Theme */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sun className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Theme & Appearance</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose between modern clean light mode or high-contrast dark mode
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Light Mode Button */}
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-slate-800 text-amber-600">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Light Mode
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Bright, crisp interface for day time productivity
              </p>
            </div>
          </button>

          {/* Dark Mode Button */}
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-800 text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Dark Mode
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Deep slate colors easy on the eyes in low light
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Global Currency */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Currency Preferences</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select your preferred currency. All dashboards, summary cards, and charts will immediately adapt.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {Object.entries(CURRENCY_CONFIG).map(([code, item]) => {
            const isSelected = currency === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleCurrencyChange(code)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {item.symbol}
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {code}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. User Profile */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Account Profile</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your personal profile identifier for receipts and reports
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            placeholder="Your Name"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex-shrink-0"
          >
            Save Profile
          </button>
        </form>
      </div>

      {/* 4. Data Management & LocalStorage */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Data Management & LocalStorage</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Export backups, reload demo showcase records, or erase stored records
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Export All Transactions */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Export All Transactions
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Download a clean CSV spreadsheet containing all {transactions.length} transactions.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportAll}
              className="mt-4 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Download Full CSV</span>
            </button>
          </div>

          {/* Load Sample Demo Data */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Load Sample Demo Data
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Populate your ledger with a diverse collection of sample transactions to explore charts.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLoadSample}
              className="mt-4 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Load Sample Data</span>
            </button>
          </div>

          {/* Clear Transactions */}
          <div className="p-4 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-rose-700 dark:text-rose-300">
                Clear All Transactions
              </h4>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1">
                Delete all transaction records from local storage. Categories and settings remain intact.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  type: 'clear_tx',
                  title: 'Clear All Transactions?',
                  message: `This will permanently delete all ${transactions.length} transaction entries from your browser storage. This cannot be undone.`,
                })
              }
              className="mt-4 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Transactions</span>
            </button>
          </div>

          {/* Factory Reset */}
          <div className="p-4 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-rose-700 dark:text-rose-300">
                Reset Application Data
              </h4>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1">
                Completely reset SpendWise back to default installation state, restoring sample data and default categories.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  type: 'reset_all',
                  title: 'Reset Application to Defaults?',
                  message:
                    'All custom categories, budgets, and settings will be restored to their original default states.',
                })
              }
              className="mt-4 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Entire App</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, type: null, title: '', message: '' })
        }
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Yes, Proceed"
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  );
};

export default Settings;

