import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSortBy } from '../../features/products/productSelectors';
import { setSortBy } from '../../features/products/productSlice';
import { selectViewMode, setViewMode } from '../../features/preferences/preferenceSlice';
import { ArrowUpDown, LayoutGrid, List } from 'lucide-react';

export const SortDropdown = () => {
  const dispatch = useDispatch();
  const currentSort = useSelector(selectSortBy) || 'featured';
  const viewMode = useSelector(selectViewMode) || 'grid';

  const sortOptions = [
    { value: 'featured', label: 'Featured & Popular' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'alpha-asc', label: 'Alphabetical: A to Z' },
    { value: 'alpha-desc', label: 'Alphabetical: Z to A' },
  ];

  return (
    <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
      {/* Sort Select */}
      <div className="relative flex items-center flex-1 sm:flex-initial">
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
        <select
          value={currentSort}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="w-full sm:w-56 pl-9 pr-8 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid / List View Toggle */}
      <div className="flex items-center p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 shrink-0">
        <button
          onClick={() => dispatch(setViewMode('grid'))}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            viewMode === 'grid'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
          aria-label="Grid view"
          title="Grid view"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          onClick={() => dispatch(setViewMode('list'))}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            viewMode === 'list'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
          aria-label="List view"
          title="List view"
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SortDropdown;
