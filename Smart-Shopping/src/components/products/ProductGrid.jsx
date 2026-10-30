import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../common/SkeletonLoader';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';
import { ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';

export const ProductGrid = ({
  products = [],
  loading = false,
  error = null,
  onRetry,
  viewMode = 'grid',
  itemsPerPage = 12,
  enablePagination = true,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your filters, price range, or search keyword.',
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div
        className={
          viewMode === 'list'
            ? 'flex flex-col gap-4'
            : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
        }
      >
        {Array.from({ length: itemsPerPage > 8 ? 8 : itemsPerPage }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load products" message={error} onRetry={onRetry} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={emptyTitle}
        description={emptyDescription}
        actionText="Reset Filters"
        onAction={onRetry}
      />
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const validPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const startIndex = (validPage - 1) * itemsPerPage;
  const currentProducts = enablePagination
    ? products.slice(startIndex, startIndex + itemsPerPage)
    : products;

  return (
    <div className="space-y-8">
      {/* Products Container */}
      <div
        className={
          viewMode === 'list'
            ? 'flex flex-col gap-4'
            : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
        }
      >
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </div>

      {/* Pagination Controls */}
      {enablePagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
            <span className="font-semibold">
              {Math.min(startIndex + itemsPerPage, products.length)}
            </span>{' '}
            of <span className="font-semibold">{products.length}</span> products
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validPage === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNum = index + 1;
              const isActive = pageNum === validPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
