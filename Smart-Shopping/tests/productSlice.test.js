import { describe, it, expect } from 'vitest';
import productReducer, {
  setSearchTerm,
  setSelectedCategory,
  setSortBy,
  setPriceRange,
  setMinRating,
  resetFilters,
  addProductEntity,
  updateProductEntity,
  removeProductEntity,
} from '../src/features/products/productSlice';
import { initialProductEntityState } from '../src/features/products/productAdapter';
import { fetchProducts } from '../src/features/products/productThunks';

describe('productSlice and entity adapter', () => {
  const sampleProducts = [
    { id: 1, title: 'Item 1', price: 50, category: 'electronics' },
    { id: 2, title: 'Item 2', price: 100, category: 'jewelery' },
  ];

  it('should return initial normalized state', () => {
    const state = productReducer(undefined, { type: 'unknown' });
    expect(state.ids).toEqual([]);
    expect(state.entities).toEqual({});
    expect(state.status).toBe('idle');
    expect(state.searchTerm).toBe('');
    expect(state.selectedCategory).toBe('all');
  });

  it('should handle addProductEntity using createEntityAdapter', () => {
    const newProduct = { id: 10, title: 'New Product', price: 29.99 };
    const nextState = productReducer(initialProductEntityState, addProductEntity(newProduct));

    expect(nextState.ids).toContain(10);
    expect(nextState.entities[10].title).toBe('New Product');
  });

  it('should handle updateProductEntity using createEntityAdapter', () => {
    let state = productReducer(
      initialProductEntityState,
      addProductEntity({ id: 10, title: 'Old Title', price: 29.99 })
    );

    state = productReducer(
      state,
      updateProductEntity({ id: 10, changes: { title: 'Updated Title' } })
    );

    expect(state.entities[10].title).toBe('Updated Title');
  });

  it('should handle removeProductEntity using createEntityAdapter', () => {
    let state = productReducer(
      initialProductEntityState,
      addProductEntity({ id: 10, title: 'Product 10' })
    );
    expect(state.ids).toContain(10);

    state = productReducer(state, removeProductEntity(10));
    expect(state.ids).not.toContain(10);
  });

  it('should update filters and sort options', () => {
    let state = productReducer(initialProductEntityState, setSearchTerm('phone'));
    expect(state.searchTerm).toBe('phone');

    state = productReducer(state, setSelectedCategory('electronics'));
    expect(state.selectedCategory).toBe('electronics');

    state = productReducer(state, setSortBy('price-asc'));
    expect(state.sortBy).toBe('price-asc');

    state = productReducer(state, setPriceRange([50, 300]));
    expect(state.priceRange).toEqual([50, 300]);

    state = productReducer(state, setMinRating(4));
    expect(state.minRating).toBe(4);

    state = productReducer(state, resetFilters());
    expect(state.searchTerm).toBe('');
    expect(state.selectedCategory).toBe('all');
    expect(state.sortBy).toBe('featured');
    expect(state.priceRange).toEqual([0, 1000]);
    expect(state.minRating).toBe(0);
  });

  it('should handle fetchProducts extraReducers (pending, fulfilled, rejected)', () => {
    // 1. Pending
    const pendingState = productReducer(
      initialProductEntityState,
      fetchProducts.pending('req_1')
    );
    expect(pendingState.status).toBe('loading');
    expect(pendingState.error).toBeNull();

    // 2. Fulfilled
    const fulfilledState = productReducer(
      pendingState,
      fetchProducts.fulfilled(sampleProducts, 'req_1')
    );
    expect(fulfilledState.status).toBe('succeeded');
    expect(fulfilledState.ids).toEqual([1, 2]);
    expect(fulfilledState.entities[1].title).toBe('Item 1');

    // 3. Rejected
    const rejectedState = productReducer(
      pendingState,
      fetchProducts.rejected(new Error('Network error'), 'req_1', undefined, 'API Error')
    );
    expect(rejectedState.status).toBe('failed');
    expect(rejectedState.error).toBe('API Error');
  });
});
