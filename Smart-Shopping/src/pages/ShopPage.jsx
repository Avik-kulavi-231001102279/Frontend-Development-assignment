import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../features/products/productThunks';
import {
  selectFilteredAndSortedProducts,
  selectProductsStatus,
  selectProductsError,
  selectAllProducts,
} from '../features/products/productSelectors';
import {
  setSearchTerm,
  setSelectedCategory,
} from '../features/products/productSlice';
import { selectViewMode } from '../features/preferences/preferenceSlice';
import FilterSidebar from '../components/products/FilterSidebar';
import SortDropdown from '../components/products/SortDropdown';
import ProductGrid from '../components/products/ProductGrid';
import { SlidersHorizontal, X } from 'lucide-react';

export const ShopPage = () => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const products = useSelector(selectFilteredAndSortedProducts);
  const allProducts = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const viewMode = useSelector(selectViewMode);

  // Sync URL search parameters if passed
  useEffect(() => {
    const querySearch = searchParams.get('search');
    const queryCategory = searchParams.get('category');

    if (querySearch !== null) {
      dispatch(setSearchTerm(querySearch));
    }
    if (queryCategory !== null) {
      dispatch(setSelectedCategory(queryCategory));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (allProducts.length === 0 && status === 'idle') {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [dispatch, allProducts.length, status]);

  const handleRetry = () => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  };

  const isLoading = status === 'loading';

  return (
    <div className="space-y-8 pb-16">
      {/* Page Title & Breadcrumb header */}
      <div className="py-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore All Products
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Browse our full inventory fetched live from Fake Store API with real-time filtering and sorting.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <FilterSidebar />
        </div>

        {/* Products Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Mobile filter button, Product count, Sort dropdown */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Found <strong className="text-slate-900 dark:text-white">{products.length}</strong> items
              </span>
            </div>

            <SortDropdown />
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={products}
            loading={isLoading}
            error={error}
            onRetry={handleRetry}
            viewMode={viewMode}
            itemsPerPage={12}
            enablePagination={true}
          />
        </div>
      </div>

      {/* Mobile Filters Modal Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto space-y-4 z-10">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-sm uppercase">Filter Products</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar onCloseMobile={() => setMobileFilterOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
