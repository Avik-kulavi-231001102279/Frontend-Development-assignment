/**
 * Attendify - Memoized Student Selectors
 */

import { createSelector } from '@reduxjs/toolkit';

export const selectStudentsState = (state) => state.students;
export const selectFiltersState = (state) => state.filters;

export const selectAllStudents = createSelector(
  [selectStudentsState],
  (students) => students.items || []
);

export const selectStudentLoading = createSelector(
  [selectStudentsState],
  (students) => students.loading
);

export const selectStudentError = createSelector(
  [selectStudentsState],
  (students) => students.error
);

export const selectStudentSuccessMessage = createSelector(
  [selectStudentsState],
  (students) => students.successMessage
);

export const selectSelectedStudent = createSelector(
  [selectStudentsState],
  (students) => students.selectedStudent
);

export const selectTotalStudentsCount = createSelector(
  [selectAllStudents],
  (students) => students.length
);

export const selectActiveStudentsCount = createSelector(
  [selectAllStudents],
  (students) => students.filter((s) => s.status === 'Active').length
);

/**
 * Filtered students based on search query, department, semester, section, and status
 */
export const selectFilteredStudents = createSelector(
  [selectAllStudents, selectFiltersState],
  (students, filters) => {
    return students.filter((student) => {
      // Search by ID or Name
      if (filters.search) {
        const query = filters.search.trim().toLowerCase();
        const nameMatch = student.name.toLowerCase().includes(query);
        const idMatch = student.id.toLowerCase().includes(query);
        if (!nameMatch && !idMatch) return false;
      }

      // Department filter
      if (filters.department && student.department !== filters.department) {
        return false;
      }

      // Semester filter
      if (filters.semester && String(student.semester) !== String(filters.semester)) {
        return false;
      }

      // Section filter
      if (filters.section && student.section !== filters.section) {
        return false;
      }

      // Status filter
      if (filters.status && student.status !== filters.status) {
        return false;
      }

      return true;
    });
  }
);

export const selectUniqueDepartments = createSelector(
  [selectAllStudents],
  (students) => {
    const depts = new Set(students.map((s) => s.department));
    return Array.from(depts).sort();
  }
);

export const selectUniqueSemesters = createSelector(
  [selectAllStudents],
  (students) => {
    const sems = new Set(students.map((s) => s.semester));
    return Array.from(sems).sort((a, b) => a - b);
  }
);

export const selectUniqueSections = createSelector(
  [selectAllStudents],
  (students) => {
    const secs = new Set(students.map((s) => s.section));
    return Array.from(secs).sort();
  }
);
