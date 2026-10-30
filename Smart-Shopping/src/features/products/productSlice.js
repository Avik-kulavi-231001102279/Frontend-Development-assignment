import { createSlice } from '@reduxjs/toolkit';
import { productsAdapter, initialProductEntityState } from './productAdapter';
import {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  fetchProductsByCategory,
} from './productThunks';

const productSlice = createSlice({
  name: 'products',
  initialState: initialProductEntityState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setMinRating: (state, action) => {
      state.minRating = action.payload;
    },
    resetFilters: (state) => {
      state.searchTerm = '';
      state.selectedCategory = 'all';
      state.sortBy = 'featured';
      state.priceRange = [0, 1000];
      state.minRating = 0;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.productDetailsStatus = 'idle';
      state.productDetailsError = null;
    },
    // Entity CRUD operations demonstrated via adapter
    addProductEntity: (state, action) => {
      productsAdapter.addOne(state, action.payload);
    },
    updateProductEntity: (state, action) => {
      productsAdapter.updateOne(state, action.payload);
    },
    removeProductEntity: (state, action) => {
      productsAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        productsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });

    // fetchProductById
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.productDetailsStatus = 'loading';
        state.productDetailsError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetailsStatus = 'succeeded';
        state.productDetailsError = null;
        state.selectedProduct = action.payload;
        // Also ensure it is present in the normalized adapter state
        productsAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productDetailsStatus = 'failed';
        state.productDetailsError = action.payload || action.error.message;
      });

    // fetchCategories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = 'loading';
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        state.categoriesError = null;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.categoriesError = action.payload || action.error.message;
      });

    // fetchProductsByCategory
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.selectedCategory = action.payload.category;
        // Upsert all fetched products into the entity adapter
        productsAdapter.upsertMany(state, action.payload.products);
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  setSearchTerm,
  setSelectedCategory,
  setSortBy,
  setPriceRange,
  setMinRating,
  resetFilters,
  clearSelectedProduct,
  addProductEntity,
  updateProductEntity,
  removeProductEntity,
} = productSlice.actions;

export default productSlice.reducer;
