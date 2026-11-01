/**
 * Attendify - Filters Redux Slice
 * Manages global and component-level search, filtering, and date range parameters
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  department: '',
  semester: '',
  section: '',
  search: '',
  studentId: '',
  subjectCode: '',
  startDate: '',
  endDate: '',
  status: '',
  date: '',
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    setFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
    setSearchQuery: (state, action) => {
      state.search = action.payload;
    },
    setSearchFilter: (state, action) => {
      state.search = action.payload;
    },
    setDepartmentFilter: (state, action) => {
      state.department = action.payload;
    },
    setSemesterFilter: (state, action) => {
      state.semester = action.payload;
    },
    setSectionFilter: (state, action) => {
      state.section = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.status = action.payload;
    },
    setDateRangeFilter: (state, action) => {
      const { startDate, endDate } = action.payload || {};
      if (startDate !== undefined) state.startDate = startDate;
      if (endDate !== undefined) state.endDate = endDate;
    },
    setStudentIdFilter: (state, action) => {
      state.studentId = action.payload;
    },
    setSubjectCodeFilter: (state, action) => {
      state.subjectCode = action.payload;
    },
    resetFilters: () => {
      return { ...initialState };
    },
  },
});

export const {
  setFilter,
  setFilters,
  setSearchQuery,
  setSearchFilter,
  setDepartmentFilter,
  setSemesterFilter,
  setSectionFilter,
  setStatusFilter,
  setDateRangeFilter,
  setStudentIdFilter,
  setSubjectCodeFilter,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
