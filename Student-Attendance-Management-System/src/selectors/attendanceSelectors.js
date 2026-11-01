/**
 * Attendify - Memoized Attendance Selectors
 * Derives statistical summaries, student profiles, and session analytics
 */

import { createSelector } from '@reduxjs/toolkit';
import { selectAllStudents } from './studentSelectors';
import {
  calculateAttendanceStats,
  calculateStudentAttendanceFromRecords,
  DEFAULT_ATTENDANCE_THRESHOLD,
} from '../utils/attendanceCalculations';

export const selectAttendanceState = (state) => state.attendance;
export const selectSubjectsState = (state) => state.subjects;
export const selectPreferencesState = (state) => state.preferences;

export const selectAllAttendanceRecords = createSelector(
  [selectAttendanceState],
  (attendance) => attendance.records || []
);

export const selectAttendanceLoading = createSelector(
  [selectAttendanceState],
  (attendance) => attendance.loading
);

export const selectAttendanceSaving = createSelector(
  [selectAttendanceState],
  (attendance) => attendance.saving
);

export const selectAttendanceError = createSelector(
  [selectAttendanceState],
  (attendance) => attendance.error
);

export const selectAttendanceSuccessMessage = createSelector(
  [selectAttendanceState],
  (attendance) => attendance.successMessage
);

export const selectActiveSession = createSelector(
  [selectAttendanceState],
  (attendance) => attendance.activeSession
);

export const selectDraftAttendance = createSelector(
  [selectAttendanceState],
  (attendance) => attendance.draftAttendance
);

export const selectAttendanceThreshold = createSelector(
  [selectPreferencesState],
  (preferences) => preferences.threshold || DEFAULT_ATTENDANCE_THRESHOLD
);

/**
 * Group attendance records by student ID
 */
export const selectAttendanceByStudentMap = createSelector(
  [selectAllAttendanceRecords],
  (records) => {
    const map = {};
    records.forEach((r) => {
      if (!map[r.studentId]) {
        map[r.studentId] = [];
      }
      map[r.studentId].push(r);
    });
    return map;
  }
);

/**
 * Map of studentId -> computed attendance statistics
 */
export const selectAllStudentsAttendanceStats = createSelector(
  [selectAllStudents, selectAttendanceByStudentMap, selectAttendanceThreshold],
  (students, attendanceMap, threshold) => {
    const statsMap = {};
    students.forEach((student) => {
      const records = attendanceMap[student.id] || [];
      statsMap[student.id] = {
        student,
        ...calculateStudentAttendanceFromRecords(records, threshold),
      };
    });
    return statsMap;
  }
);

/**
 * List of students below the configured attendance threshold
 * Rule: Students with N/A (0 countable sessions) MUST NOT appear in low attendance warnings!
 */
export const selectStudentsBelowThreshold = createSelector(
  [selectAllStudentsAttendanceStats],
  (statsMap) => {
    return Object.values(statsMap).filter(
      (item) => item.isLowAttendance && item.countableSessions > 0
    );
  }
);

/**
 * Returns detailed attendance profile for a specific student ID
 */
export const selectStudentAttendanceProfile = (studentId) =>
  createSelector(
    [selectAllStudents, selectAllAttendanceRecords, selectSubjectsState, selectAttendanceThreshold],
    (students, records, subjectsState, threshold) => {
      const student = students.find((s) => s.id === studentId);
      if (!student) return null;

      const studentRecords = records.filter((r) => r.studentId === studentId);
      const overallStats = calculateStudentAttendanceFromRecords(studentRecords, threshold);

      // Subject-wise attendance calculation
      const subjects = subjectsState.items || [];
      const subjectMap = {};
      subjects.forEach((sub) => {
        subjectMap[sub.id] = sub;
      });

      const subjectRecordsMap = {};
      studentRecords.forEach((r) => {
        if (!subjectRecordsMap[r.subjectId]) {
          subjectRecordsMap[r.subjectId] = [];
        }
        subjectRecordsMap[r.subjectId].push(r);
      });

      const subjectBreakdown = Object.keys(subjectRecordsMap).map((subId) => {
        const sub = subjectMap[subId] || { code: 'N/A', name: 'Unknown Subject' };
        const subRecords = subjectRecordsMap[subId];
        const subStats = calculateStudentAttendanceFromRecords(subRecords, threshold);
        return {
          subjectId: subId,
          subjectCode: sub.code,
          subjectName: sub.name,
          ...subStats,
        };
      });

      // Sorted daily attendance history (newest first)
      const sortedHistory = [...studentRecords].sort((a, b) => b.date.localeCompare(a.date));

      return {
        student,
        overallStats,
        subjectBreakdown,
        history: sortedHistory,
      };
    }
  );
