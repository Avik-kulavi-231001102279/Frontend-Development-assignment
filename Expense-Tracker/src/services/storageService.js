/**
 * Storage Service for SpendWise
 * Centralized, safe LocalStorage operations with corruption recovery
 */

export const STORAGE_KEYS = {
  TRANSACTIONS: 'spendwise_transactions',
  CATEGORIES: 'spendwise_categories',
  BUDGET: 'spendwise_budget',
  SETTINGS: 'spendwise_settings',
};

export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'cat-exp-1', name: 'Food & Dining', type: 'expense', color: '#f97316', icon: 'Utensils', isDefault: true },
  { id: 'cat-exp-2', name: 'Shopping', type: 'expense', color: '#ec4899', icon: 'ShoppingBag', isDefault: true },
  { id: 'cat-exp-3', name: 'Transportation', type: 'expense', color: '#06b6d4', icon: 'Car', isDefault: true },
  { id: 'cat-exp-4', name: 'Education', type: 'expense', color: '#8b5cf6', icon: 'GraduationCap', isDefault: true },
  { id: 'cat-exp-5', name: 'Healthcare', type: 'expense', color: '#14b8a6', icon: 'HeartPulse', isDefault: true },
  { id: 'cat-exp-6', name: 'Entertainment', type: 'expense', color: '#a855f7', icon: 'Film', isDefault: true },
  { id: 'cat-exp-7', name: 'Bills & Utilities', type: 'expense', color: '#eab308', icon: 'Zap', isDefault: true },
  { id: 'cat-exp-8', name: 'Rent', type: 'expense', color: '#3b82f6', icon: 'Home', isDefault: true },
  { id: 'cat-exp-9', name: 'Travel', type: 'expense', color: '#10b981', icon: 'Plane', isDefault: true },
  { id: 'cat-exp-10', name: 'Others', type: 'expense', color: '#64748b', icon: 'MoreHorizontal', isDefault: true },
];

export const DEFAULT_INCOME_CATEGORIES = [
  { id: 'cat-inc-1', name: 'Salary', type: 'income', color: '#10b981', icon: 'Briefcase', isDefault: true },
  { id: 'cat-inc-2', name: 'Freelancing', type: 'income', color: '#06b6d4', icon: 'Laptop', isDefault: true },
  { id: 'cat-inc-3', name: 'Business', type: 'income', color: '#3b82f6', icon: 'Building2', isDefault: true },
  { id: 'cat-inc-4', name: 'Investment', type: 'income', color: '#8b5cf6', icon: 'TrendingUp', isDefault: true },
  { id: 'cat-inc-5', name: 'Gift', type: 'income', color: '#ec4899', icon: 'Gift', isDefault: true },
  { id: 'cat-inc-6', name: 'Other Income', type: 'income', color: '#64748b', icon: 'Coins', isDefault: true },
];

export const ALL_DEFAULT_CATEGORIES = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
];

export const DEFAULT_BUDGET = {
  monthlyLimit: 25000,
  month: '2026-11',
};

export const DEFAULT_SETTINGS = {
  theme: 'light',
  currency: 'INR',
  userName: 'Alex Morgan',
  enableNotifications: true,
  createdAt: new Date().toISOString(),
};

/**
 * Generate sample transactions for testing / initial showcase
 */
export const getSampleTransactions = () => {
  return [
    {
      id: 'tx-seed-01',
      title: 'Tech Solutions Monthly Salary',
      amount: 65000,
      type: 'income',
      category: 'Salary',
      date: '2026-11-01',
      paymentMethod: 'Bank Transfer',
      description: 'Monthly direct deposit salary',
      createdAt: '2026-11-01T09:00:00.000Z',
    },
    {
      id: 'tx-seed-02',
      title: 'Apartment Monthly Rent',
      amount: 14000,
      type: 'expense',
      category: 'Rent',
      date: '2026-11-02',
      paymentMethod: 'UPI',
      description: 'Rent for 2BHK flat paid to landlord',
      createdAt: '2026-11-02T10:30:00.000Z',
    },
    {
      id: 'tx-seed-03',
      title: 'Weekly Grocery Supermarket',
      amount: 2850,
      type: 'expense',
      category: 'Food & Dining',
      date: '2026-11-02',
      paymentMethod: 'Debit Card',
      description: 'Vegetables, milk, fruits, and snacks',
      createdAt: '2026-11-02T18:15:00.000Z',
    },
    {
      id: 'tx-seed-04',
      title: 'UI/UX Freelance Milestone',
      amount: 18000,
      type: 'income',
      category: 'Freelancing',
      date: '2026-11-03',
      paymentMethod: 'Bank Transfer',
      description: 'Dashboard design completion payout',
      createdAt: '2026-11-03T14:00:00.000Z',
    },
    {
      id: 'tx-seed-05',
      title: 'Electricity & High-speed Wifi Bill',
      amount: 2150,
      type: 'expense',
      category: 'Bills & Utilities',
      date: '2026-11-03',
      paymentMethod: 'UPI',
      description: 'Combined monthly fiber & electric bill',
      createdAt: '2026-11-03T16:20:00.000Z',
    },
    {
      id: 'tx-seed-06',
      title: 'Fuel & Metro Transit Card Recharge',
      amount: 1500,
      type: 'expense',
      category: 'Transportation',
      date: '2026-11-04',
      paymentMethod: 'UPI',
      description: 'Weekly vehicle fuel and metro pass',
      createdAt: '2026-11-04T08:45:00.000Z',
    },
    {
      id: 'tx-seed-07',
      title: 'Weekend Dining & Cafe',
      amount: 1250,
      type: 'expense',
      category: 'Food & Dining',
      date: '2026-11-04',
      paymentMethod: 'Credit Card',
      description: 'Dinner with colleagues',
      createdAt: '2026-11-04T20:10:00.000Z',
    },
    // Past month (October 2026) entries for comparison charts
    {
      id: 'tx-seed-08',
      title: 'October Monthly Salary',
      amount: 65000,
      type: 'income',
      category: 'Salary',
      date: '2026-10-01',
      paymentMethod: 'Bank Transfer',
      description: 'October corporate salary',
      createdAt: '2026-10-01T09:00:00.000Z',
    },
    {
      id: 'tx-seed-09',
      title: 'Stock Dividend Payout',
      amount: 4500,
      type: 'income',
      category: 'Investment',
      date: '2026-10-15',
      paymentMethod: 'Bank Transfer',
      description: 'Quarterly equity dividend',
      createdAt: '2026-10-15T11:00:00.000Z',
    },
    {
      id: 'tx-seed-10',
      title: 'October Rent Payment',
      amount: 14000,
      type: 'expense',
      category: 'Rent',
      date: '2026-10-02',
      paymentMethod: 'UPI',
      description: 'October rent',
      createdAt: '2026-10-02T10:00:00.000Z',
    },
    {
      id: 'tx-seed-11',
      title: 'Festive Shopping & Clothes',
      amount: 6800,
      type: 'expense',
      category: 'Shopping',
      date: '2026-10-18',
      paymentMethod: 'Credit Card',
      description: 'Festival season apparel shopping',
      createdAt: '2026-10-18T17:30:00.000Z',
    },
    {
      id: 'tx-seed-12',
      title: 'Online Cloud Computing Course',
      amount: 3200,
      type: 'expense',
      category: 'Education',
      date: '2026-10-22',
      paymentMethod: 'Debit Card',
      description: 'Advanced certification course purchase',
      createdAt: '2026-10-22T12:00:00.000Z',
    },
    {
      id: 'tx-seed-13',
      title: 'Movie Premiere & Snacks',
      amount: 1100,
      type: 'expense',
      category: 'Entertainment',
      date: '2026-10-27',
      paymentMethod: 'UPI',
      description: 'Cinema tickets with friends',
      createdAt: '2026-10-27T19:30:00.000Z',
    },
  ];
};

/**
 * Storage Service safe wrapper
 */
export const storageService = {
  getItem: (key, defaultValue = null) => {
    try {
      const data = localStorage.getItem(key);
      if (data === null || data === undefined) {
        return defaultValue;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  // Transactions
  getTransactions: () => {
    const data = storageService.getItem(STORAGE_KEYS.TRANSACTIONS, null);
    if (!data || !Array.isArray(data)) {
      // Initialize with sample transactions on first run
      const initial = getSampleTransactions();
      storageService.setTransactions(initial);
      return initial;
    }
    return data;
  },

  setTransactions: (transactions) => {
    return storageService.setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
  },

  // Categories
  getCategories: () => {
    const data = storageService.getItem(STORAGE_KEYS.CATEGORIES, null);
    if (!data || !Array.isArray(data) || data.length === 0) {
      // Initialize default categories if none exist
      storageService.setCategories(ALL_DEFAULT_CATEGORIES);
      return ALL_DEFAULT_CATEGORIES;
    }
    return data;
  },

  setCategories: (categories) => {
    return storageService.setItem(STORAGE_KEYS.CATEGORIES, categories);
  },

  // Budget
  getBudget: () => {
    const data = storageService.getItem(STORAGE_KEYS.BUDGET, null);
    if (!data || typeof data !== 'object') {
      storageService.setBudget(DEFAULT_BUDGET);
      return DEFAULT_BUDGET;
    }
    return data;
  },

  setBudget: (budget) => {
    return storageService.setItem(STORAGE_KEYS.BUDGET, budget);
  },

  // Settings
  getSettings: () => {
    const data = storageService.getItem(STORAGE_KEYS.SETTINGS, null);
    if (!data || typeof data !== 'object') {
      storageService.setSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...data };
  },

  setSettings: (settings) => {
    return storageService.setItem(STORAGE_KEYS.SETTINGS, settings);
  },

  // Clear or Reset
  clearTransactions: () => {
    return storageService.setItem(STORAGE_KEYS.TRANSACTIONS, []);
  },

  resetAllData: () => {
    storageService.setTransactions(getSampleTransactions());
    storageService.setCategories(ALL_DEFAULT_CATEGORIES);
    storageService.setBudget(DEFAULT_BUDGET);
    storageService.setSettings(DEFAULT_SETTINGS);
    return true;
  },
};

