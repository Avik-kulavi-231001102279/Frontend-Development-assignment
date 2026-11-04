import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  PieChart as PieIcon,
  Edit3,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  TrendingDown,
  DollarSign,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import {
  selectBudgetState,
  updateBudgetAsync,
} from '../features/budget/budgetSlice';
import {
  selectFinancialSummaries,
  selectAllTransactions,
} from '../features/transactions/transactionSelectors';
import { selectCurrency } from '../features/settings/settingsSlice';
import { formatCurrency, getCurrencySymbol } from '../utils/formatCurrency';
import { getMonthLabel, getCurrentYearMonth } from '../utils/dateUtils';
import Modal from '../components/common/Modal';

export const Budget = () => {
  const dispatch = useDispatch();
  const budgetState = useSelector(selectBudgetState);
  const summaries = useSelector(selectFinancialSummaries);
  const transactions = useSelector(selectAllTransactions);
  const currencyCode = useSelector(selectCurrency);
  const currencySymbol = getCurrencySymbol(currencyCode);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [budgetLimitInput, setBudgetLimitInput] = useState(
    budgetState.monthlyLimit
  );
  const [errorMsg, setErrorMsg] = useState('');

  const currentYM = getCurrentYearMonth();
  const currentMonthLabel = getMonthLabel(currentYM);

  // Current month expenses by category
  const currentMonthExpenses = transactions.filter(
    (tx) => tx.type === 'expense' && (tx.date || '').startsWith(currentYM)
  );

  const categoryBreakdown = {};
  currentMonthExpenses.forEach((tx) => {
    const cat = tx.category || 'Other';
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + Number(tx.amount || 0);
  });

  const sortedCategoryBreakdown = Object.entries(categoryBreakdown).sort(
    (a, b) => b[1] - a[1]
  );

  const handleOpenEdit = () => {
    setBudgetLimitInput(budgetState.monthlyLimit);
    setErrorMsg('');
    setIsEditModalOpen(true);
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    const parsed = Number(budgetLimitInput);
    if (!budgetLimitInput || isNaN(parsed) || parsed <= 0) {
      setErrorMsg('Please enter a valid monthly budget amount greater than zero.');
      return;
    }

    const res = await dispatch(
      updateBudgetAsync({
        monthlyLimit: parsed,
        month: currentYM,
      })
    );

    if (res.error) {
      setErrorMsg(res.error.message || 'Failed to update budget.');
      return;
    }

    setIsEditModalOpen(false);
  };

  const percentUsed = summaries.budgetPercentage;
  const isWarning = summaries.isBudgetWarning;
  const isExceeded = summaries.isBudgetExceeded;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Budget Management
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor monthly limits, track spending thresholds, and avoid overspending
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenEdit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Monthly Budget</span>
        </button>
      </div>

      {/* Warning/Exceeded Banners */}
      {isExceeded && (
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-4 text-rose-800 dark:text-rose-200 shadow-sm">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/60 rounded-xl text-rose-600 flex-shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base">Monthly Budget Exceeded!</h4>
            <p className="text-xs sm:text-sm mt-0.5 text-rose-700 dark:text-rose-300">
              You have exceeded your monthly allowance by{' '}
              <span className="font-bold">
                {formatCurrency(
                  summaries.currentMonthExpenses - summaries.monthlyBudget,
                  currencyCode
                )}
              </span>
              . You are currently at{' '}
              <span className="font-bold">{percentUsed}%</span> of your target.
            </p>
          </div>
        </div>
      )}

      {isWarning && !isExceeded && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-start gap-4 text-amber-800 dark:text-amber-200 shadow-sm">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/60 rounded-xl text-amber-600 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base">Spending Warning (80%+ Limit Reached)</h4>
            <p className="text-xs sm:text-sm mt-0.5 text-amber-700 dark:text-amber-300">
              You have utilized{' '}
              <span className="font-bold">{percentUsed}%</span> of your budget for{' '}
              {currentMonthLabel}. Only{' '}
              <span className="font-bold">
                {formatCurrency(summaries.remainingBudget, currencyCode)}
              </span>{' '}
              remains available.
            </p>
          </div>
        </div>
      )}

      {/* Main Budget Dashboard Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Target Period: {currentMonthLabel}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(summaries.monthlyBudget, currencyCode)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Total monthly expense ceiling
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                isExceeded
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : isWarning
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}
            >
              {isExceeded ? (
                <AlertOctagon className="w-4 h-4" />
              ) : isWarning ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>{percentUsed}% Used</span>
            </div>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Spent: {formatCurrency(summaries.currentMonthExpenses, currencyCode)}</span>
            <span>Limit: {formatCurrency(summaries.monthlyBudget, currencyCode)}</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 p-0.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isExceeded
                  ? 'bg-rose-500'
                  : isWarning
                  ? 'bg-amber-500'
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>
        </div>

        {/* 3 Metric Stats below Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Monthly Budget */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
              Monthly Budget
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(summaries.monthlyBudget, currencyCode)}
            </span>
          </div>

          {/* Total Spent */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
              Total Spent (This Month)
            </span>
            <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(summaries.currentMonthExpenses, currencyCode)}
            </span>
          </div>

          {/* Remaining Budget */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
              Remaining Budget
            </span>
            <span
              className={`text-xl font-bold ${
                summaries.remainingBudget > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              {formatCurrency(summaries.remainingBudget, currencyCode)}
            </span>
          </div>
        </div>
      </div>

      {/* Category-wise Monthly Spending Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Current Month Category Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Where your budget was spent during {currentMonthLabel}
          </p>
        </div>

        {sortedCategoryBreakdown.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">
            No expenses recorded yet in {currentMonthLabel}.
          </p>
        ) : (
          <div className="space-y-3.5 pt-2">
            {sortedCategoryBreakdown.map(([catName, spent]) => {
              const catPercent =
                summaries.monthlyBudget > 0
                  ? ((spent / summaries.monthlyBudget) * 100).toFixed(1)
                  : 0;
              return (
                <div key={catName} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">
                      {catName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">
                        {catPercent}% of budget
                      </span>
                      <span className="text-slate-900 dark:text-white font-bold">
                        {formatCurrency(spent, currencyCode)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${Math.min(catPercent, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Budget Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Set Monthly Expense Budget"
        subtitle="Specify the maximum amount you plan to spend this month"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Monthly Limit ({currencySymbol}) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="any"
                min="100"
                value={budgetLimitInput}
                onChange={(e) => {
                  setBudgetLimitInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="25000"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-semibold"
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errorMsg}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
            >
              Update Budget
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Budget;

