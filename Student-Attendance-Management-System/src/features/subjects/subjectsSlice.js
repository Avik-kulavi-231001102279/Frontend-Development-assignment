/**
 * Attendify - Subjects Redux Slice
 * Manages academic subject entities with asynchronous CRUD thunks
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mockSubjectApi from '../../api/mockSubjectApi';

// Async Thunks
export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const data = await mockSubjectApi.getSubjects();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch subjects.');
    }
  }
);

export const addSubject = createAsyncThunk(
  'subjects/addSubject',
  async (subjectData, { rejectWithValue }) => {
    try {
      const newSubject = await mockSubjectApi.createSubject(subjectData);
      return newSubject;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add subject.');
    }
  }
);

export const updateSubject = createAsyncThunk(
  'subjects/updateSubject',
  async ({ id, subjectData }, { rejectWithValue }) => {
    try {
      const updated = await mockSubjectApi.updateSubject(id, subjectData);
      return updated;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update subject.');
    }
  }
);

export const deleteSubject = createAsyncThunk(
  'subjects/deleteSubject',
  async (id, { rejectWithValue }) => {
    try {
      await mockSubjectApi.deleteSubject(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete subject.');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  successMessage: null,
};

export const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    clearSubjectError: (state) => {
      state.error = null;
    },
    clearSubjectSuccess: (state) => {
      state.successMessage = null;
    },
    setSubjectItems: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add
    builder
      .addCase(addSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.successMessage = `Subject ${action.payload.code} (${action.payload.name}) added successfully.`;
      })
      .addCase(addSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update
    builder
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        state.successMessage = `Subject ${action.payload.code} updated successfully.`;
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete
    builder
      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((s) => s.id !== action.payload);
        state.successMessage = 'Subject deleted successfully.';
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubjectError, clearSubjectSuccess, setSubjectItems } = subjectsSlice.actions;

export default subjectsSlice.reducer;
