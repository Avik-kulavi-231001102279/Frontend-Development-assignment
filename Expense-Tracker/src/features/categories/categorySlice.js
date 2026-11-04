import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageService, ALL_DEFAULT_CATEGORIES } from '../../services/storageService';
import { v4 as uuidv4 } from 'uuid';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return storageService.getCategories();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

export const addCategoryAsync = createAsyncThunk(
  'categories/addCategoryAsync',
  async (categoryData, { getState, rejectWithValue }) => {
    try {
      const { categories } = getState().categories;

      if (!categoryData.name || !categoryData.name.trim()) {
        throw new Error('Category name is required.');
      }

      const trimmedName = categoryData.name.trim();

      // Check if already exists for this type
      const exists = categories.some(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase() && c.type === categoryData.type
      );
      if (exists) {
        throw new Error(`Category "${trimmedName}" already exists for ${categoryData.type}.`);
      }

      const newCategory = {
        id: `cat-custom-${uuidv4()}`,
        name: trimmedName,
        type: categoryData.type || 'expense',
        color: categoryData.color || '#6366f1',
        icon: categoryData.icon || 'Folder',
        isDefault: false,
      };

      const updated = [...categories, newCategory];
      storageService.setCategories(updated);
      return newCategory;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add category');
    }
  }
);

export const updateCategoryAsync = createAsyncThunk(
  'categories/updateCategoryAsync',
  async ({ id, name, color, icon }, { getState, rejectWithValue }) => {
    try {
      if (!name || !name.trim()) {
        throw new Error('Category name is required.');
      }
      const { categories } = getState().categories;
      const index = categories.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error('Category not found.');
      }

      const updatedCategory = {
        ...categories[index],
        name: name.trim(),
        color: color || categories[index].color,
        icon: icon || categories[index].icon,
      };

      const updatedList = categories.map((c) => (c.id === id ? updatedCategory : c));
      storageService.setCategories(updatedList);
      return updatedCategory;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update category');
    }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  'categories/deleteCategoryAsync',
  async (categoryId, { getState, rejectWithValue }) => {
    try {
      const { categories } = getState().categories;
      const { transactions } = getState().transactions;

      const categoryToDelete = categories.find((c) => c.id === categoryId);
      if (!categoryToDelete) {
        throw new Error('Category not found.');
      }

      // Check if any transaction is using this category
      const inUseCount = transactions.filter((t) => t.category === categoryToDelete.name).length;
      if (inUseCount > 0) {
        throw new Error(
          `Cannot delete "${categoryToDelete.name}" because it is currently used by ${inUseCount} transaction(s). Reassign them first.`
        );
      }

      const updatedList = categories.filter((c) => c.id !== categoryId);
      storageService.setCategories(updatedList);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete category');
    }
  }
);

const initialState = {
  categories: storageService.getCategories() || ALL_DEFAULT_CATEGORIES,
  status: 'idle',
  error: null,
  successMessage: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
    },
    resetCategoriesToDefault: (state) => {
      state.categories = ALL_DEFAULT_CATEGORIES;
      storageService.setCategories(ALL_DEFAULT_CATEGORIES);
      state.successMessage = 'Categories reset to defaults.';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addCategoryAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories.push(action.payload);
        state.successMessage = `Category "${action.payload.name}" added successfully!`;
      })
      .addCase(addCategoryAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.categories.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.successMessage = `Category updated successfully!`;
      })
      .addCase(updateCategoryAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = state.categories.filter((c) => c.id !== action.payload);
        state.successMessage = 'Category deleted successfully!';
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCategoryStatus, resetCategoriesToDefault } = categorySlice.actions;

// Selectors
export const selectAllCategories = (state) => state.categories.categories;
export const selectExpenseCategories = (state) =>
  state.categories.categories.filter((c) => c.type === 'expense');
export const selectIncomeCategories = (state) =>
  state.categories.categories.filter((c) => c.type === 'income');
export const selectCategoryStatus = (state) => state.categories.status;
export const selectCategoryError = (state) => state.categories.error;
export const selectCategorySuccessMessage = (state) => state.categories.successMessage;

export default categorySlice.reducer;

