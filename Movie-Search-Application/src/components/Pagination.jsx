import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalResults = 0,
  onPageChange,
  loading = false,
}) {
  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
      onPageChange(page);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  // Generate pagination range with ellipses
  const getPageNumbers = () => {
    const delta = 2; // numbers on each side of current
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  const startItem = (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, totalResults);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 mt-6 border-t border-white/10 dark:border-white/10">
      {/* Results summary info */}
      <div className="text-xs sm:text-sm text-slate-400 text-center sm:text-left">
        Showing{' '}
        <span className="font-semibold text-slate-200">
          {startItem.toLocaleString()}–{endItem.toLocaleString()}
        </span>{' '}
        of <span className="font-semibold text-slate-200">{totalResults.toLocaleString()}</span>{' '}
        titles
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* First Page */}
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1 || loading}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-cinema-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="First Page"
          aria-label="Go to first page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-cinema-800 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-white/5"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`dot-${idx}`}
                  className="px-2 text-slate-500 text-sm select-none"
                >
                  •••
                </span>
              );
            }

            const isCurrent = p === currentPage;

            return (
              <button
                key={p}
                onClick={() => handlePageClick(p)}
                disabled={loading}
                className={`min-w-[36px] h-9 px-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isCurrent
                    ? 'bg-cinema-red text-white shadow-glow-red scale-105 pointer-events-none'
                    : 'text-slate-300 hover:text-white hover:bg-cinema-800 border border-transparent hover:border-white/10'
                }`}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Page ${p}`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-cinema-800 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-white/5"
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages || loading}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-cinema-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Last Page"
          aria-label="Go to last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

