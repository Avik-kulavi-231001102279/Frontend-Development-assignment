import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Calendar,
  Filter,
  Download,
  Activity,
  PieChart as PieIcon,
  Percent,
} from 'lucide-react';
import { selectAllTransactions } from '../features/transactions/transactionSelectors';
import { selectCurrency } from '../features/settings/settingsSlice';
import { formatCurrency } from '../utils/formatCurrency';
import {
  calculateCategoryWiseExpenses,
  calculateMonthlyComparison,
  calculateDailyExpenseTrend,
} from '../utils/calculations';
import { getCurrentYearMonth, getMonthLabel } from '../utils/dateUtils';
import { exportTransactionsToCSV } from '../utils/exportCSV';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import IncomeExpenseBarChart from '../components/charts/IncomeExpenseBarChart';
import ExpenseLineChart from '../components/charts/ExpenseLineChart';

export const Analytics = () => {
  const transactions = useSelector(selectAllTransactions);
  const currencyCode = useSelector(selectCurrency);

  const [timeframe, setTimeframe] = useState('all'); // 'all' | 'this_month' | 'last_month' | 'this_year'

  const currentYM = getCurrentYearMonth();
  const [currentYear, currentMonth] = currentYM.split('-').map(Number);

  // Filter transactions based on selected timeframe
  const filteredTransactions = useMemo(() => {
    if (timeframe === 'all') return transactions;

    return transactions.filter((tx) => {
      const txDate = tx.date || '';
      if (timeframe === 'this_month') {
        return txDate.startsWith(currentYM);
      }
      if (timeframe === 'last_month') {
        const lastMonthDate = new Date(currentYear, currentMonth - 2, 1);
        const lastYM = `${lastMonthDate.getFullYear()}-${String(
          lastMonthDate.getMonth() + 1
        ).padStart(2, '0')}`;
        return txDate.startsWith(lastYM);
      }
      if (timeframe === 'this_year') {
        return txDate.startsWith(`${currentYear}-`);
      }
      return true;
    });
  }, [transactions, timeframe, currentYM, currentYear, currentMonth]);

  // Dynamic metrics based on filtered transactions
  const metrics = useMemo(() => {
    let income = 0;
    let expense = 0;
    const catMap = {};
    const dateExpenseMap = {};

    filteredTransactions.forEach((tx) => {
      const amt = Number(tx.amount || 0);
      if (tx.type === 'income') {
        income += amt;
      } else if (tx.type === 'expense') {
        expense += amt;
        const cat = tx.category || 'Other';
        catMap[cat] = (catMap[cat] || 0) + amt;

        const d = tx.date;
        if (d) {
          dateExpenseMap[d] = (dateExpenseMap[d] || 0) + amt;
        }
      }
    });

    const netSavings = income - expense;
    const savingsRate = income > 0 ? Math.max(((netSavings / income) * 100), 0).toFixed(1) : 0;

    // Highest category
    let highestCat = { name: 'None', amount: 0 };
    Object.entries(catMap).forEach(([name, amount]) => {
      if (amount > highestCat.amount) {
        highestCat = { name, amount };
      }
    });

    // Average daily expense
    const distinctDays = Object.keys(dateExpenseMap).length || 1;
    const avgDailyExpense = expense / distinctDays;

    return {
      income,
      expense,
      netSavings,
      savingsRate,
      highestCat,
      avgDailyExpense,
    };
  }, [filteredTransactions]);

  // Dynamic charts
  const categoryChartData = useMemo(() => {
    return calculateCategoryWiseExpenses(filteredTransactions);
  }, [filteredTransactions]);

  const monthlyChartData = useMemo(() => {
    return calculateMonthlyComparison(transactions, 6);
  }, [transactions]);

  const dailyTrendData = useMemo(() => {
    return calculateDailyExpenseTrend(transactions, currentYM);
  }, [transactions, currentYM]);

  const handleExport = () => {
    try {
      exportTransactionsToCSV(filteredTransactions, `analytics-${timeframe}`);
    } catch (e) {
      alert(e.message || 'Export failed.');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Analytics & Reports
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Deep dive into your cashflow trends, category distributions, and metrics
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('this_month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'this_month'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('last_month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'last_month'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Last Month
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('this_year')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'this_year'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              This Year
            </button>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Income */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
            Total Income
          </span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(metrics.income, currencyCode)}
          </span>
        </div>

        {/* Total Expenses */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
            Total Expenses
          </span>
          <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
            {formatCurrency(metrics.expense, currencyCode)}
          </span>
        </div>

        {/* Net Savings */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
            Net Savings
          </span>
          <span
            className={`text-xl font-bold ${
              metrics.netSavings >= 0
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-rose-500'
            }`}
          >
            {formatCurrency(metrics.netSavings, currencyCode)}
          </span>
        </div>

        {/* Savings Rate */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
            Savings Rate
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            {metrics.savingsRate}%
          </span>
        </div>

        {/* Average Daily Expense */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
            Avg Daily Expense
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(metrics.avgDailyExpense, currencyCode)}
          </span>
        </div>

        {/* Top Expense Category */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
            Top Category
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
            {metrics.highestCat.name}
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Pie Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              <span>Category-wise Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution of expenses for selected period
            </p>
          </div>
          <div className="py-2">
            <ExpensePieChart data={categoryChartData} height={320} />
          </div>
        </div>

        {/* Monthly Comparison Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Monthly Income vs Expense Trend</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Six-month trailing cashflow comparison
            </p>
          </div>
          <div className="py-2">
            <IncomeExpenseBarChart data={monthlyChartData} height={320} />
          </div>
        </div>
      </div>

      {/* Daily Expense Trend Line Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            <span>Daily Cashflow Fluctuation ({getMonthLabel(currentYM)})</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor day-to-day spending spikes and income receipts
          </p>
        </div>
        <ExpenseLineChart data={dailyTrendData} height={320} />
      </div>
    </div>
  );
};

export default Analytics;

