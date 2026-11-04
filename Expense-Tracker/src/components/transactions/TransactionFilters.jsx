import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchQuery,
  setTypeFilter,
  setCategoryFilter,
  setPaymentMethodFilter,
  setDateRange,
  setSortBy,
  clearFilters,
} from '../../features/filters/filterSlice';
import { selectAllCategories } from '../../features/categories/categorySlice';
import { PAYMENT_METHODS } from './TransactionForm';
import {
  Search,
  Filter,
  RotateCcw,
  Download,
  Calendar,
  ArrowUpDown,
  X,
} from 'lucide-react';

export const TransactionFilters = ({
  onExportCSV,
  totalResultsCount = 0,
}) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const categories = useSelector(selectAllCategories);

  // Check if any filter is active
  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.paymentMethod !== 'all' ||
    filters.startDate !== '' ||
    filters.endDate !== '' ||
    filters.sortBy !== 'latest';

  const handleClear = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      {/* Top row: Search input + Results Badge + CSV Export + Clear Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search by title, note, or category..."
            className="w-full pl-10 pr-9 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => dispatch(setSearchQuery(''))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
          <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {totalResultsCount} {totalResultsCount === 1 ? 'record' : 'records'}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          {onExportCSV && (
            <button
              type="button"
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
              title="Export visible transactions to CSV"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Selects Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        {/* Type */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => dispatch(setTypeFilter(e.target.value))}
            className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
            className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 truncate"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Payment Method
          </label>
          <select
            value={filters.paymentMethod}
            onChange={(e) => dispatch(setPaymentMethodFilter(e.target.value))}
            className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
          >
            <option value="all">All Methods</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              dispatch(
                setDateRange({
                  startDate: e.target.value,
                  endDate: filters.endDate,
                })
              )
            }
            className="w-full px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              dispatch(
                setDateRange({
                  startDate: filters.startDate,
                  endDate: e.target.value,
                })
              )
            }
            className="w-full px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Sort Order
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;

