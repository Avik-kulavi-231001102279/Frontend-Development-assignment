import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCategories,
  selectSelectedCategory,
  selectPriceRange,
  selectMinRating,
  selectSearchTerm,
  selectFilteredProducts,
  selectAllProducts,
} from '../../features/products/productSelectors';
import {
  setSelectedCategory,
  setPriceRange,
  setMinRating,
  setSearchTerm,
  resetFilters,
} from '../../features/products/productSlice';
import { selectCurrency } from '../../features/preferences/preferenceSlice';
import { formatPrice } from '../../utils/currency';
import { Filter, RotateCcw, Star, Search, Check } from 'lucide-react';

export const FilterSidebar = ({ className = '', onCloseMobile }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectSelectedCategory);
  const priceRange = useSelector(selectPriceRange) || [0, 1000];
  const minRating = useSelector(selectMinRating) || 0;
  const searchTerm = useSelector(selectSearchTerm) || '';
  const filteredProducts = useSelector(selectFilteredProducts);
  const allProducts = useSelector(selectAllProducts);
  const currency = useSelector(selectCurrency);

  const handleCategoryChange = (cat) => {
    dispatch(setSelectedCategory(cat));
  };

  const handlePriceChange = (e) => {
    const maxVal = Number(e.target.value);
    dispatch(setPriceRange([priceRange[0], maxVal]));
  };

  const handleRatingChange = (rating) => {
    dispatch(setMinRating(rating));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    priceRange[1] < 1000 ||
    priceRange[0] > 0 ||
    minRating > 0 ||
    searchTerm.trim() !== '';

  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Filters
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      {/* Total Filtered Count Badge */}
      <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 font-medium flex items-center justify-between">
        <span>Matching Products:</span>
        <span className="font-bold text-indigo-600 dark:text-indigo-400">
          {filteredProducts.length} of {allProducts.length}
        </span>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Keyword Search
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            placeholder="Filter by title..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium capitalize flex items-center justify-between transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat}</span>
              {selectedCategory.toLowerCase() === cat.toLowerCase() && (
                <Check className="w-3.5 h-3.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Max Price
          </label>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {formatPrice(priceRange[1], currency)}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="1000"
          step="10"
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>{formatPrice(10, currency)}</span>
          <span>{formatPrice(1000, currency)}</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Minimum Rating
        </label>
        <div className="space-y-1.5">
          {[
            { rate: 0, label: 'All Ratings' },
            { rate: 4, label: '4★ & Above' },
            { rate: 3, label: '3★ & Above' },
            { rate: 2, label: '2★ & Above' },
          ].map((item) => (
            <button
              key={item.rate}
              onClick={() => handleRatingChange(item.rate)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                minRating === item.rate
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Star
                  className={`w-3.5 h-3.5 ${
                    item.rate > 0
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {minRating === item.rate && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs"
        >
          Apply Filters
        </button>
      )}
    </aside>
  );
};

export default FilterSidebar;
