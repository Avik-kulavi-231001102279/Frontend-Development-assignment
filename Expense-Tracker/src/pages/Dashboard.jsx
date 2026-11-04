import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  Clock,
  Layers,
  Award,
  AlertCircle,
  PieChart as PieIcon,
  BarChart3,
  Activity,
} from 'lucide-react';
import SummaryCard from '../components/dashboard/SummaryCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import IncomeExpenseBarChart from '../components/charts/IncomeExpenseBarChart';
import ExpenseLineChart from '../components/charts/ExpenseLineChart';
import TransactionModal from '../components/transactions/TransactionModal';
import {
  selectFinancialSummaries,
  selectRecentTransactions,
  selectCategoryWiseExpenses,
  selectMonthlyReports,
  selectDailyExpenseTrends,
} from '../features/transactions/transactionSelectors';
import { selectCurrency } from '../features/settings/settingsSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { getMonthLabel, getCurrentYearMonth } from '../utils/dateUtils';

export const Dashboard = () => {
  const summaries = useSelector(selectFinancialSummaries);
  const recentTransactions = useSelector(selectRecentTransactions);
  const categoryExpenses = useSelector(selectCategoryWiseExpenses);
  const monthlyReports = useSelector(selectMonthlyReports);
  const dailyTrends = useSelector(selectDailyExpenseTrends);
  const currencyCode = useSelector(selectCurrency);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const currentMonthLabel = getMonthLabel(getCurrentYearMonth());

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Greeting + Quick Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-indigo-100 mb-2">
            <span>{currentMonthLabel} Overview</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to SpendWise
          </h2>
          <p className="text-sm text-indigo-100 max-w-xl">
            Track your finances, monitor monthly budgets, and analyze spending patterns with real-time insights.
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 shadow-lg shadow-black/10 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Budget Warning Banner if approaching or exceeded */}
      {summaries.isBudgetExceeded && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-4 text-rose-800 dark:text-rose-200 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Monthly Budget Exceeded!</p>
              <p className="text-xs text-rose-600 dark:text-rose-300">
                You have spent {formatCurrency(summaries.currentMonthExpenses, currencyCode)} against your budget of {formatCurrency(summaries.monthlyBudget, currencyCode)} ({summaries.budgetPercentage}% used).
              </p>
            </div>
          </div>
        </div>
      )}

      {summaries.isBudgetWarning && !summaries.isBudgetExceeded && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between gap-4 text-amber-800 dark:text-amber-200 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Budget Warning (80%+ Reached)</p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                You have reached {summaries.budgetPercentage}% of your monthly budget limit. Remaining: {formatCurrency(summaries.remainingBudget, currencyCode)}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4 Primary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* 1. Total Balance */}
        <SummaryCard
          title="Total Balance"
          amount={summaries.totalBalance}
          icon={Wallet}
          variant="indigo"
          subtitle="Net cumulative balance"
          badge={summaries.totalBalance >= 0 ? 'Healthy' : 'Deficit'}
        />

        {/* 2. Total Income */}
        <SummaryCard
          title="Total Income"
          amount={summaries.totalIncome}
          icon={TrendingUp}
          variant="emerald"
          subtitle="All-time earnings"
          badge="Earnings"
        />

        {/* 3. Total Expenses */}
        <SummaryCard
          title="Total Expenses"
          amount={summaries.totalExpenses}
          icon={TrendingDown}
          variant="rose"
          subtitle="All-time expenditures"
          badge="Outflows"
        />

        {/* 4. Monthly Savings */}
        <SummaryCard
          title="Monthly Savings"
          amount={summaries.monthlySavings}
          icon={PiggyBank}
          variant="blue"
          subtitle={`${currentMonthLabel} net`}
          badge={summaries.monthlySavings >= 0 ? 'Surplus' : 'Deficit'}
        />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Expenses */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400">
              Today&apos;s Expenses
            </span>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {formatCurrency(summaries.todayExpenses, currencyCode)}
            </p>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-400">
              Total Transactions
            </span>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {summaries.totalTransactions} recorded
            </p>
          </div>
        </div>

        {/* Highest Spending Category */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold uppercase text-slate-400">
              Top Expense Category
            </span>
            <p className="text-base font-bold text-slate-900 dark:text-white truncate">
              {summaries.highestSpendingCategory.name}
            </p>
          </div>
        </div>

        {/* Monthly Budget Progress */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
            <span className="uppercase text-slate-400">Budget Used</span>
            <span
              className={
                summaries.isBudgetExceeded
                  ? 'text-rose-500 font-bold'
                  : summaries.isBudgetWarning
                  ? 'text-amber-500 font-bold'
                  : 'text-indigo-600 dark:text-indigo-400 font-bold'
              }
            >
              {summaries.budgetPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                summaries.isBudgetExceeded
                  ? 'bg-rose-500'
                  : summaries.isBudgetWarning
                  ? 'bg-amber-500'
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(summaries.budgetPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts Grid: A. Pie Chart & B. Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. Expense by Category – Pie Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                <span>Expense by Category</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Distribution breakdown across all categories
              </p>
            </div>
          </div>
          <div className="py-2">
            <ExpensePieChart data={categoryExpenses} height={290} />
          </div>
        </div>

        {/* B. Income vs Expense – Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Income vs Expense</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly financial comparison over time
              </p>
            </div>
          </div>
          <div className="py-2">
            <IncomeExpenseBarChart data={monthlyReports} height={290} />
          </div>
        </div>
      </div>

      {/* Row 3: C. Daily Expense Trend Line Chart & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* C. Daily Expense Trend – Line Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                <span>Daily Expense Trend</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Day-by-day expense activity for {currentMonthLabel}
              </p>
            </div>
          </div>
          <div className="py-2">
            <ExpenseLineChart data={dailyTrends} height={290} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-5">
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>

      {/* Add Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
