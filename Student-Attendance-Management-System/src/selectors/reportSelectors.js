/**
 * Attendify - Memoized Report Selectors
 * Joins attendance records with student and subject metadata for multi-dimensional reporting
 */

import { createSelector } from '@reduxjs/toolkit';
import { selectAllStudents } from './studentSelectors';
import { selectAllAttendanceRecords, selectAttendanceThreshold } from './attendanceSelectors';
import { selectSubjectsState } from './attendanceSelectors';
import { selectFiltersState } from './studentSelectors';
import { calculateStudentAttendanceFromRecords } from '../utils/attendanceCalculations';

export const STATUS_LABELS = {
  P: 'Present',
  A: 'Absent',
  PL: 'Internship Placed',
  E: 'Official Engagement',
};

/**
 * Enriches attendance records with full student and subject data
 */
export const selectEnrichedAttendanceRecords = createSelector(
  [selectAllAttendanceRecords, selectAllStudents, selectSubjectsState],
  (records, students, subjectsState) => {
    const studentMap = {};
    students.forEach((s) => {
      studentMap[s.id] = s;
    });

    const subjectMap = {};
    (subjectsState.items || []).forEach((sub) => {
      subjectMap[sub.id] = sub;
    });

    return records.map((r) => {
      const student = studentMap[r.studentId] || {
        name: 'Unknown Student',
        department: 'N/A',
        semester: 'N/A',
        section: 'N/A',
      };
      const subject = subjectMap[r.subjectId] || {
        code: r.subjectCode || 'N/A',
        name: 'Academic Course',
        department: 'N/A',
        semester: 'N/A',
        section: 'N/A',
      };

      return {
        ...r,
        studentName: student.name,
        department: student.department || subject.department,
        semester: student.semester || subject.semester,
        section: student.section || subject.section,
        subjectCode: subject.code || r.subjectCode,
        subjectName: subject.name,
        statusFull: STATUS_LABELS[r.status] || r.status,
      };
    });
  }
);

/**
 * Filtered attendance report records based on current filter state
 */
export const selectFilteredReportRecords = createSelector(
  [
    selectEnrichedAttendanceRecords,
    selectFiltersState,
    selectAllAttendanceRecords,
    selectAttendanceThreshold,
  ],
  (enrichedRecords, filters, allRecords, threshold) => {
    // Precalculate student cumulative percentages
    const studentRecordsMap = {};
    allRecords.forEach((r) => {
      if (!studentRecordsMap[r.studentId]) studentRecordsMap[r.studentId] = [];
      studentRecordsMap[r.studentId].push(r);
    });

    const studentPercentageMap = {};
    Object.keys(studentRecordsMap).forEach((id) => {
      const stats = calculateStudentAttendanceFromRecords(studentRecordsMap[id], threshold);
      studentPercentageMap[id] = stats;
    });

    return enrichedRecords
      .filter((r) => {
        // Student ID filter
        if (filters.studentId && r.studentId !== filters.studentId) {
          return false;
        }

        // Subject filter
        if (filters.subjectCode && r.subjectCode !== filters.subjectCode) {
          return false;
        }

        // Department filter
        if (filters.department && r.department !== filters.department) {
          return false;
        }

        // Semester filter
        if (filters.semester && String(r.semester) !== String(filters.semester)) {
          return false;
        }

        // Section filter
        if (filters.section && r.section !== filters.section) {
          return false;
        }

        // Status filter
        if (filters.status && r.status !== filters.status) {
          return false;
        }

        // Date range filters
        if (filters.startDate && r.date < filters.startDate) {
          return false;
        }
        if (filters.endDate && r.date > filters.endDate) {
          return false;
        }

        // Search query (Student Name, Student ID, or Subject Code)
        if (filters.search) {
          const q = filters.search.trim().toLowerCase();
          const matchName = r.studentName.toLowerCase().includes(q);
          const matchId = r.studentId.toLowerCase().includes(q);
          const matchSub = r.subjectCode.toLowerCase().includes(q);
          if (!matchName && !matchId && !matchSub) {
            return false;
          }
        }

        return true;
      })
      .map((r) => {
        const studentStats = studentPercentageMap[r.studentId] || {};
        return {
          ...r,
          percentage: studentStats.percentage,
          percentageFormatted: studentStats.formattedPercentage,
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }
);

/**
 * Filtered summary statistics for report header
 */
export const selectFilteredReportSummary = createSelector(
  [selectFilteredReportRecords, selectAttendanceThreshold],
  (records, threshold) => {
    return calculateStudentAttendanceFromRecords(records, threshold);
  }
);
