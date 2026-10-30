import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productThunks';
import {
  selectFilteredAndSortedProducts,
  selectProductsStatus,
  selectAllProducts,
} from '../features/products/productSelectors';
import { setSearchTerm } from '../features/products/productSlice';
import { selectViewMode } from '../features/preferences/preferenceSlice';
import ProductGrid from '../components/products/ProductGrid';
import SortDropdown from '../components/products/SortDropdown';
import SearchBar from '../components/common/SearchBar';
import { Search, ArrowLeft } from 'lucide-react';

export const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || searchParams.get('search') || '';

  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts);
  const matchedProducts = useSelector(selectFilteredAndSortedProducts);
  const status = useSelector(selectProductsStatus);
  const viewMode = useSelector(selectViewMode);

  useEffect(() => {
    dispatch(setSearchTerm(query));
    if (allProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, query, allProducts.length]);

  const isLoading = status === 'loading';

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb */}
      <div className="pt-2">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Products</span>
        </Link>
      </div>

      {/* Search Header */}
      <div className="py-6 border-b border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Search className="w-4 h-4" />
              <span>Search Results</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Results for &ldquo;<span className="text-indigo-600 dark:text-indigo-400">{query || 'All Items'}</span>&rdquo;
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Found <strong className="text-slate-900 dark:text-white">{matchedProducts.length}</strong> matching products
            </p>
          </div>

          <div className="w-full md:w-80">
            <SearchBar placeholder="Search something else..." />
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
        <span className="text-xs text-slate-500">
          Showing sorted search results
        </span>
        <SortDropdown />
      </div>

      {/* Product Results */}
      <ProductGrid
        products={matchedProducts}
        loading={isLoading}
        viewMode={viewMode}
        itemsPerPage={12}
        enablePagination={true}
        emptyTitle={`No results found for "${query}"`}
        emptyDescription="Please check the spelling or try searching for a different keyword like 'backpack', 'jacket', or 'gold'."
      />
    </div>
  );
};

export default SearchResultsPage;
