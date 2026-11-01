/**
 * Attendify - Students Redux Slice
 * Manages student entities with asynchronous CRUD thunks and local state
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mockStudentApi from '../../api/mockStudentApi';

// Async Thunks
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const data = await mockStudentApi.getStudents();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch students.');
    }
  }
);

export const addStudent = createAsyncThunk(
  'students/addStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const newStudent = await mockStudentApi.createStudent(studentData);
      return newStudent;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add student.');
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, studentData }, { rejectWithValue }) => {
    try {
      const updated = await mockStudentApi.updateStudent(id, studentData);
      return updated;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update student.');
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id, { rejectWithValue }) => {
    try {
      await mockStudentApi.deleteStudent(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete student.');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  successMessage: null,
  selectedStudent: null,
};

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    selectStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
    clearStudentError: (state) => {
      state.error = null;
    },
    clearStudentSuccess: (state) => {
      state.successMessage = null;
    },
    setStudentItems: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add
    builder
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.successMessage = `Student ${action.payload.name} (${action.payload.id}) registered successfully.`;
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update
    builder
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        if (state.selectedStudent?.id === action.payload.id) {
          state.selectedStudent = action.payload;
        }
        state.successMessage = `Student ${action.payload.name} updated successfully.`;
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete
    builder
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((s) => s.id !== action.payload);
        if (state.selectedStudent?.id === action.payload) {
          state.selectedStudent = null;
        }
        state.successMessage = 'Student record deleted successfully.';
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  selectStudent,
  setSelectedStudent,
  clearSelectedStudent,
  clearStudentError,
  clearStudentSuccess,
  setStudentItems,
} = studentsSlice.actions;

export default studentsSlice.reducer;
