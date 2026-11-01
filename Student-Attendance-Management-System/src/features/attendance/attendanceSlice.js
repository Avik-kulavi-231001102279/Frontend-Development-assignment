/**
 * Attendify - Attendance Redux Slice
 * Manages confirmed attendance records, session drafts, batch operations, and late tracking
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mockAttendanceApi from '../../api/mockAttendanceApi';

// Async Thunks
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const data = await mockAttendanceApi.getAttendanceRecords();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch attendance records.');
    }
  }
);

export const saveAttendance = createAsyncThunk(
  'attendance/saveAttendance',
  async (entries, { rejectWithValue }) => {
    try {
      const data = await mockAttendanceApi.saveAttendanceBatch(entries);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to save attendance.');
    }
  }
);

export const deleteSessionAttendance = createAsyncThunk(
  'attendance/deleteSessionAttendance',
  async ({ subjectId, date }, { rejectWithValue }) => {
    try {
      await mockAttendanceApi.deleteSessionAttendance(subjectId, date);
      return { subjectId, date };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete attendance session.');
    }
  }
);

const initialState = {
  records: [],
  // Active session drafting state
  activeSession: {
    date: '',
    subjectId: '',
    subjectCode: '',
    semester: '',
    section: '',
    isLoaded: false,
  },
  // Map of studentId -> { status, isLate, lateTime }
  draftAttendance: {},
  initialDraftAttendance: {}, // For checking dirty/unsaved state
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setActiveSession: (state, action) => {
      state.activeSession = {
        ...state.activeSession,
        ...action.payload,
      };
    },
    // Initialize or load draft attendance for selected students
    initializeDraftAttendance: (state, action) => {
      const { students, existingRecords, date, subjectId, subjectCode } = action.payload;
      const draft = {};

      students.forEach((student) => {
        // Look for existing record for this student + subject + date
        const existing = existingRecords.find(
          (r) => r.studentId === student.id && r.subjectId === subjectId && r.date === date
        );

        if (existing) {
          draft[student.id] = {
            status: existing.status,
            isLate: Boolean(existing.isLate),
            lateTime: existing.lateTime || null,
          };
        } else {
          // Default to Present
          draft[student.id] = {
            status: 'P',
            isLate: false,
            lateTime: null,
          };
        }
      });

      state.draftAttendance = draft;
      state.initialDraftAttendance = JSON.parse(JSON.stringify(draft));
      state.activeSession.isLoaded = true;
    },

    // Change single student status
    setStudentStatus: (state, action) => {
      const { studentId, status } = action.payload;
      if (state.draftAttendance[studentId]) {
        state.draftAttendance[studentId].status = status;
        // If changed to anything other than Present, clear Late flag
        if (status !== 'P') {
          state.draftAttendance[studentId].isLate = false;
          state.draftAttendance[studentId].lateTime = null;
        }
      }
    },

    // Toggle or set Late arrival on a Present student
    setStudentLate: (state, action) => {
      const { studentId, isLate, lateTime } = action.payload;
      if (state.draftAttendance[studentId]) {
        // Late is an attribute of Present: ensure status is P
        state.draftAttendance[studentId].status = 'P';
        state.draftAttendance[studentId].isLate = isLate;
        state.draftAttendance[studentId].lateTime = isLate ? (lateTime || '09:15 AM') : null;
      }
    },

    // Mark all students Present in the draft
    markAllPresent: (state) => {
      Object.keys(state.draftAttendance).forEach((id) => {
        state.draftAttendance[id].status = 'P';
      });
    },

    // Mark all students Absent in the draft
    markAllAbsent: (state) => {
      Object.keys(state.draftAttendance).forEach((id) => {
        state.draftAttendance[id].status = 'A';
        state.draftAttendance[id].isLate = false;
        state.draftAttendance[id].lateTime = null;
      });
    },

    // Reset draft back to initial loaded state
    resetDraftChanges: (state) => {
      state.draftAttendance = JSON.parse(JSON.stringify(state.initialDraftAttendance));
    },

    clearAttendanceError: (state) => {
      state.error = null;
    },
    clearAttendanceSuccess: (state) => {
      state.successMessage = null;
    },
    setAttendanceRecords: (state, action) => {
      state.records = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Save batch
    builder
      .addCase(saveAttendance.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveAttendance.fulfilled, (state, action) => {
        state.saving = false;
        state.records = action.payload;
        // Synchronize initial draft to current draft since changes were committed
        state.initialDraftAttendance = JSON.parse(JSON.stringify(state.draftAttendance));
        state.successMessage = 'Attendance saved and synchronized successfully.';
      })
      .addCase(saveAttendance.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });

    // Delete session
    builder
      .addCase(deleteSessionAttendance.fulfilled, (state, action) => {
        state.records = state.records.filter(
          (r) => !(r.subjectId === action.payload.subjectId && r.date === action.payload.date)
        );
        state.successMessage = 'Session attendance records removed.';
      });
  },
});

export const {
  setActiveSession,
  initializeDraftAttendance,
  setStudentStatus,
  setStudentLate,
  markAllPresent,
  markAllAbsent,
  resetDraftChanges,
  clearAttendanceError,
  clearAttendanceSuccess,
  setAttendanceRecords,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
