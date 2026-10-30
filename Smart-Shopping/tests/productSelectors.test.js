import { describe, it, expect } from 'vitest';
import {
  selectAllProducts,
  selectProductById,
  selectFilteredProducts,
  selectFilteredAndSortedProducts,
  selectProductsByCategory,
} from '../src/features/products/productSelectors';

describe('productSelectors memoized selectors', () => {
  const mockProductsState = {
    ids: [1, 2, 3, 4],
    entities: {
      1: { id: 1, title: 'Alpha Backpack', price: 100, category: "men's clothing", rating: { rate: 3.5, count: 10 }, description: 'Great bag' },
      2: { id: 2, title: 'Beta Gaming Monitor', price: 300, category: 'electronics', rating: { rate: 4.8, count: 50 }, description: 'High refresh display' },
      3: { id: 3, title: 'Gamma Gold Ring', price: 500, category: 'jewelery', rating: { rate: 4.2, count: 30 }, description: '18k gold ring' },
      4: { id: 4, title: 'Delta Casual Shirt', price: 25, category: "men's clothing", rating: { rate: 2.5, count: 5 }, description: 'Cotton shirt' },
    },
    searchTerm: '',
    selectedCategory: 'all',
    sortBy: 'featured',
    priceRange: [0, 1000],
    minRating: 0,
  };

  const rootState = {
    products: mockProductsState,
  };

  it('selectAllProducts returns all products array', () => {
    const all = selectAllProducts(rootState);
    expect(all).toHaveLength(4);
    expect(all[0].id).toBe(1);
  });

  it('selectProductById returns product matching specified ID', () => {
    const product = selectProductById(rootState, 2);
    expect(product).toBeDefined();
    expect(product.title).toBe('Beta Gaming Monitor');
  });

  it('selectFilteredProducts filters by category', () => {
    const state = {
      products: {
        ...mockProductsState,
        selectedCategory: 'electronics',
      },
    };

    const filtered = selectFilteredProducts(state);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Beta Gaming Monitor');
  });

  it('selectFilteredProducts filters by price range', () => {
    const state = {
      products: {
        ...mockProductsState,
        priceRange: [50, 200],
      },
    };

    const filtered = selectFilteredProducts(state);
    // 100 is between 50 and 200
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Alpha Backpack');
  });

  it('selectFilteredProducts filters by min rating', () => {
    const state = {
      products: {
        ...mockProductsState,
        minRating: 4.0,
      },
    };

    const filtered = selectFilteredProducts(state);
    // Monitor (4.8) and Ring (4.2)
    expect(filtered).toHaveLength(2);
    expect(filtered.map((p) => p.id)).toEqual([2, 3]);
  });

  it('selectFilteredProducts filters by search term', () => {
    const state = {
      products: {
        ...mockProductsState,
        searchTerm: 'gold',
      },
    };

    const filtered = selectFilteredProducts(state);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Gamma Gold Ring');
  });

  it('selectFilteredAndSortedProducts sorts by price-asc and price-desc', () => {
    const stateAsc = {
      products: {
        ...mockProductsState,
        sortBy: 'price-asc',
      },
    };
    const ascList = selectFilteredAndSortedProducts(stateAsc);
    expect(ascList[0].price).toBe(25);
    expect(ascList[ascList.length - 1].price).toBe(500);

    const stateDesc = {
      products: {
        ...mockProductsState,
        sortBy: 'price-desc',
      },
    };
    const descList = selectFilteredAndSortedProducts(stateDesc);
    expect(descList[0].price).toBe(500);
    expect(descList[descList.length - 1].price).toBe(25);
  });

  it('selectFilteredAndSortedProducts sorts by rating (highest first)', () => {
    const state = {
      products: {
        ...mockProductsState,
        sortBy: 'rating',
      },
    };
    const sorted = selectFilteredAndSortedProducts(state);
    expect(sorted[0].rating.rate).toBe(4.8);
    expect(sorted[sorted.length - 1].rating.rate).toBe(2.5);
  });

  it('selectProductsByCategory returns products for specific category parameter', () => {
    const result = selectProductsByCategory(rootState, "men's clothing");
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toEqual([1, 4]);
  });
});
