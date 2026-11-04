import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  selectExpenseCategories,
  selectIncomeCategories,
} from '../../features/categories/categorySlice';
import { selectCurrency } from '../../features/settings/settingsSlice';
import { getCurrencySymbol } from '../../utils/formatCurrency';
import { getTodayDateString } from '../../utils/dateUtils';
import {
  DollarSign,
  Calendar,
  CreditCard,
  FileText,
  Tag,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

export const PAYMENT_METHODS = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Cash',
  'Other',
];

export const TransactionForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const expenseCategories = useSelector(selectExpenseCategories);
  const incomeCategories = useSelector(selectIncomeCategories);
  const currencyCode = useSelector(selectCurrency);
  const currencySymbol = getCurrencySymbol(currencyCode);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: getTodayDateString(),
    paymentMethod: 'UPI',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        type: initialData.type || 'expense',
        category: initialData.category || '',
        date: initialData.date || getTodayDateString(),
        paymentMethod: initialData.paymentMethod || 'UPI',
        description: initialData.description || '',
      });
    } else {
      // Default category according to current type
      const defaultCat =
        formData.type === 'expense'
          ? expenseCategories[0]?.name || 'Food & Dining'
          : incomeCategories[0]?.name || 'Salary';
      setFormData((prev) => ({
        ...prev,
        category: defaultCat,
      }));
    }
  }, [initialData, expenseCategories, incomeCategories]);

  // When type changes, adjust available categories
  const handleTypeChange = (newType) => {
    const availableCategories =
      newType === 'expense' ? expenseCategories : incomeCategories;
    const defaultCategory = availableCategories[0]?.name || '';

    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: defaultCategory,
    }));

    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    const parsedAmount = Number(formData.amount);
    if (!formData.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  const currentCategoryList =
    formData.type === 'expense' ? expenseCategories : incomeCategories;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle: Income vs Expense */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
            formData.type === 'expense'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Expense</span>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
            formData.type === 'income'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Income</span>
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
          Transaction Title *
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: null });
            }}
            placeholder="e.g. Grocery Supermarket, Freelance Project"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
              errors.title
                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            }`}
          />
        </div>
        {errors.title && (
          <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>
        )}
      </div>

      {/* Amount & Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Amount ({currencySymbol}) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="any"
              min="0.01"
              value={formData.amount}
              onChange={(e) => {
                setFormData({ ...formData, amount: e.target.value });
                if (errors.amount) setErrors({ ...errors, amount: null });
              }}
              placeholder="0.00"
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                errors.amount
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Category *
          </label>
          <div className="relative">
            <select
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                if (errors.category) setErrors({ ...errors, category: null });
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              {currentCategoryList.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.category}</p>
          )}
        </div>
      </div>

      {/* Date & Payment Method */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Date *
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                if (errors.date) setErrors({ ...errors, date: null });
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          {errors.date && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.date}</p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Payment Method
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) =>
              setFormData({ ...formData, paymentMethod: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description / Notes */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
          Description (Optional)
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Add details, bill numbers, or context..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting
            ? 'Saving...'
            : initialData
            ? 'Update Transaction'
            : 'Save Transaction'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;

