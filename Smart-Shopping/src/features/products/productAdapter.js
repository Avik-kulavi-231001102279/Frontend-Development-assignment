import { createEntityAdapter } from '@reduxjs/toolkit';

/**
 * Normalized entity adapter for products.
 * Sorts products by id in default ascending order.
 */
export const productsAdapter = createEntityAdapter({
  selectId: (product) => product.id,
  sortComparer: (a, b) => a.id - b.id,
});

export const initialProductEntityState = productsAdapter.getInitialState({
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  categories: [],
  categoriesStatus: 'idle',
  categoriesError: null,
  selectedProduct: null,
  productDetailsStatus: 'idle',
  productDetailsError: null,
  // Filtering & Sorting state
  searchTerm: '',
  selectedCategory: 'all',
  sortBy: 'featured', // 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'alpha-asc' | 'alpha-desc'
  priceRange: [0, 1000],
  minRating: 0,
});
