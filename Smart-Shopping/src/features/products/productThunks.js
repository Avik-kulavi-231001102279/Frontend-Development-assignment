import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

/**
 * Async Thunk to fetch all products from Fake Store API
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getProducts();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

/**
 * Async Thunk to fetch a single product by ID
 */
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.getProductById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || `Failed to fetch product ${id}`);
    }
  }
);

/**
 * Async Thunk to fetch all categories
 */
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getCategories();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

/**
 * Async Thunk to fetch products by specific category
 */
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const data = await api.getProductsByCategory(category);
      return { category, products: data };
    } catch (error) {
      return rejectWithValue(error.message || `Failed to fetch category ${category}`);
    }
  }
);
