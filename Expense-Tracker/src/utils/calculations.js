import { getCurrentYearMonth, isToday } from './dateUtils';

/**
 * Calculate basic summary metrics from transactions list
 */
export const calculateFinancialSummaries = (transactions = [], monthlyBudget = 25000) => {
  let totalIncome = 0;
  let totalExpenses = 0;
  let currentMonthIncome = 0;
  let currentMonthExpenses = 0;
  let todayExpenses = 0;

  const currentYM = getCurrentYearMonth();
  const categoryExpenseMap = {};

  transactions.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    const isExpense = tx.type === 'expense';
    const isIncome = tx.type === 'income';
    const txDate = tx.date || '';

    if (isIncome) {
      totalIncome += amount;
      if (txDate.startsWith(currentYM)) {
        currentMonthIncome += amount;
      }
    } else if (isExpense) {
      totalExpenses += amount;
      if (txDate.startsWith(currentYM)) {
        currentMonthExpenses += amount;
      }
      if (isToday(txDate)) {
        todayExpenses += amount;
      }

      // Track by category for all-time / current
      const catName = tx.category || 'Uncategorized';
      categoryExpenseMap[catName] = (categoryExpenseMap[catName] || 0) + amount;
    }
  });

  const totalBalance = totalIncome - totalExpenses;
  const monthlySavings = currentMonthIncome - currentMonthExpenses;

  // Find highest spending category
  let highestSpendingCategory = { name: 'None', amount: 0 };
  Object.entries(categoryExpenseMap).forEach(([name, amount]) => {
    if (amount > highestSpendingCategory.amount) {
      highestSpendingCategory = { name, amount };
    }
  });

  // Budget calculations
  const budget = Number(monthlyBudget) || 1;
  const budgetPercentage = Math.min(Math.round((currentMonthExpenses / budget) * 100), 999);
  const remainingBudget = Math.max(budget - currentMonthExpenses, 0);

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    monthlySavings,
    currentMonthIncome,
    currentMonthExpenses,
    todayExpenses,
    totalTransactions: transactions.length,
    highestSpendingCategory,
    monthlyBudget: budget,
    budgetPercentage,
    remainingBudget,
    isBudgetWarning: budgetPercentage >= 80 && budgetPercentage < 100,
    isBudgetExceeded: budgetPercentage >= 100,
  };
};

/**
 * Prepare Category-wise Expense distribution for Recharts Pie Chart
 */
export const calculateCategoryWiseExpenses = (transactions = [], periodFilter = 'all') => {
  const currentYM = getCurrentYearMonth();
  const filtered = transactions.filter((tx) => {
    if (tx.type !== 'expense') return false;
    if (periodFilter === 'current_month') {
      return (tx.date || '').startsWith(currentYM);
    }
    return true;
  });

  const catMap = {};
  let totalFilteredExpense = 0;

  filtered.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    const cat = tx.category || 'Other';
    catMap[cat] = (catMap[cat] || 0) + amount;
    totalFilteredExpense += amount;
  });

  const categoryColors = {
    'Food & Dining': '#f97316',
    'Shopping': '#ec4899',
    'Transportation': '#06b6d4',
    'Education': '#8b5cf6',
    'Healthcare': '#14b8a6',
    'Entertainment': '#a855f7',
    'Bills & Utilities': '#eab308',
    'Rent': '#3b82f6',
    'Travel': '#10b981',
    'Others': '#64748b',
    'Other': '#64748b',
  };

  const chartData = Object.entries(catMap).map(([name, value], index) => {
    const percentage = totalFilteredExpense > 0 ? ((value / totalFilteredExpense) * 100).toFixed(1) : 0;
    const fallbackColors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#06b6d4', '#14b8a6', '#f43f5e', '#64748b'];
    return {
      name,
      value,
      percentage: Number(percentage),
      color: categoryColors[name] || fallbackColors[index % fallbackColors.length],
    };
  });

  // Sort descending by value
  return chartData.sort((a, b) => b.value - a.value);
};

/**
 * Prepare Monthly Income vs Expense for Recharts Bar Chart
 * Groups by Month (e.g. Last 6 months)
 */
export const calculateMonthlyComparison = (transactions = [], monthsCount = 6) => {
  const monthsMap = {};

  // Generate list of the past N months including current month
  const today = new Date();
  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d);
    monthsMap[key] = {
      monthKey: key,
      month: label,
      income: 0,
      expense: 0,
      savings: 0,
    };
  }

  transactions.forEach((tx) => {
    const ym = (tx.date || '').substring(0, 7);
    if (monthsMap[ym]) {
      const amount = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        monthsMap[ym].income += amount;
      } else if (tx.type === 'expense') {
        monthsMap[ym].expense += amount;
      }
      monthsMap[ym].savings = monthsMap[ym].income - monthsMap[ym].expense;
    }
  });

  return Object.values(monthsMap);
};

/**
 * Prepare Daily Expense Trend for Line/Area Chart for a given month
 */
export const calculateDailyExpenseTrend = (transactions = [], targetYearMonth = null) => {
  const ym = targetYearMonth || getCurrentYearMonth();
  const [yearStr, monthStr] = ym.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  // Number of days in this month
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyMap = {};

  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = String(d).padStart(2, '0');
    const dateKey = `${ym}-${dayStr}`;
    dailyMap[dateKey] = {
      date: dateKey,
      day: d,
      displayDate: `${d} ${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(year, month - 1, 1))}`,
      expense: 0,
      income: 0,
    };
  }

  transactions.forEach((tx) => {
    const txDate = tx.date || '';
    if (txDate.startsWith(ym) && dailyMap[txDate]) {
      const amount = Number(tx.amount) || 0;
      if (tx.type === 'expense') {
        dailyMap[txDate].expense += amount;
      } else if (tx.type === 'income') {
        dailyMap[txDate].income += amount;
      }
    }
  });

  return Object.values(dailyMap);
};

