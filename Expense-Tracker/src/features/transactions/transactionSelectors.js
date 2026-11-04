import { createSelector } from '@reduxjs/toolkit';
import {
  calculateFinancialSummaries,
  calculateCategoryWiseExpenses,
  calculateMonthlyComparison,
  calculateDailyExpenseTrend,
} from '../../utils/calculations';
import { getCurrentYearMonth } from '../../utils/dateUtils';

// Base selectors
export const selectTransactionsState = (state) => state.transactions;
export const selectAllTransactions = (state) => state.transactions.transactions;
export const selectTransactionStatus = (state) => state.transactions.status;
export const selectTransactionError = (state) => state.transactions.error;
export const selectTransactionLastMessage = (state) => state.transactions.lastActionMessage;

export const selectFilters = (state) => state.filters;
export const selectBudget = (state) => state.budget;

/**
 * Filtered transactions selector combining search, category, type, paymentMethod, dateRange, and sorting
 */
export const selectFilteredTransactions = createSelector(
  [selectAllTransactions, selectFilters],
  (transactions, filters) => {
    let result = [...transactions];

    // Search query filter (matches title or description or category)
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (tx) =>
          tx.title.toLowerCase().includes(q) ||
          (tx.description && tx.description.toLowerCase().includes(q)) ||
          tx.category.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter((tx) => tx.type === filters.type);
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((tx) => tx.category === filters.category);
    }

    // Payment method filter
    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      result = result.filter((tx) => tx.paymentMethod === filters.paymentMethod);
    }

    // Date range filter
    if (filters.startDate) {
      result = result.filter((tx) => tx.date >= filters.startDate);
    }
    if (filters.endDate) {
      result = result.filter((tx) => tx.date <= filters.endDate);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        result.sort((a, b) => Number(b.amount) - Number(a.amount));
        break;
      case 'lowest':
        result.sort((a, b) => Number(a.amount) - Number(b.amount));
        break;
      case 'latest':
      default:
        // Sort by date desc, then by createdAt desc
        result.sort((a, b) => {
          const dateDiff = new Date(b.date) - new Date(a.date);
          if (dateDiff !== 0) return dateDiff;
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        });
        break;
    }

    return result;
  }
);

/**
 * Summary metrics selector
 */
export const selectFinancialSummaries = createSelector(
  [selectAllTransactions, selectBudget],
  (transactions, budgetState) => {
    return calculateFinancialSummaries(transactions, budgetState.monthlyLimit);
  }
);

// Individual memoized summary metrics
export const selectTotalBalance = createSelector(
  [selectFinancialSummaries],
  (summaries) => summaries.totalBalance
);

export const selectTotalIncome = createSelector(
  [selectFinancialSummaries],
  (summaries) => summaries.totalIncome
);

export const selectTotalExpenses = createSelector(
  [selectFinancialSummaries],
  (summaries) => summaries.totalExpenses
);

export const selectMonthlySavings = createSelector(
  [selectFinancialSummaries],
  (summaries) => summaries.monthlySavings
);

export const selectTodayExpenses = createSelector(
  [selectFinancialSummaries],
  (summaries) => summaries.todayExpenses
);

export const selectHighestSpendingCategory = createSelector(
  [selectFinancialSummaries],
  (summaries) => summaries.highestSpendingCategory
);

export const selectBudgetProgress = createSelector(
  [selectFinancialSummaries],
  (summaries) => ({
    monthlyBudget: summaries.monthlyBudget,
    currentMonthExpenses: summaries.currentMonthExpenses,
    budgetPercentage: summaries.budgetPercentage,
    remainingBudget: summaries.remainingBudget,
    isBudgetWarning: summaries.isBudgetWarning,
    isBudgetExceeded: summaries.isBudgetExceeded,
  })
);

/**
 * Recent transactions (top 5 latest)
 */
export const selectRecentTransactions = createSelector(
  [selectAllTransactions],
  (transactions) => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }
);

/**
 * Category-wise expenses distribution for Pie Chart
 */
export const selectCategoryWiseExpenses = createSelector(
  [selectAllTransactions],
  (transactions) => calculateCategoryWiseExpenses(transactions, 'all')
);

export const selectCurrentMonthCategoryExpenses = createSelector(
  [selectAllTransactions],
  (transactions) => calculateCategoryWiseExpenses(transactions, 'current_month')
);

/**
 * Monthly comparison (Income vs Expense) for Bar Chart
 */
export const selectMonthlyReports = createSelector(
  [selectAllTransactions],
  (transactions) => calculateMonthlyComparison(transactions, 6)
);

/**
 * Daily expense trends for Line Chart (current month)
 */
export const selectDailyExpenseTrends = createSelector(
  [selectAllTransactions],
  (transactions) => calculateDailyExpenseTrend(transactions, getCurrentYearMonth())
);

