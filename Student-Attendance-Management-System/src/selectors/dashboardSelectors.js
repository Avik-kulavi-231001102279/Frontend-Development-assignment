/**
 * Attendify - Memoized Dashboard Selectors
 * Aggregates live statistics for summary cards, charts, and alert tables
 */

import { createSelector } from '@reduxjs/toolkit';
import { selectAllStudents, selectTotalStudentsCount } from './studentSelectors';
import {
  selectAllAttendanceRecords,
  selectAttendanceThreshold,
  selectStudentsBelowThreshold,
  selectAllStudentsAttendanceStats,
} from './attendanceSelectors';
import { selectSubjectsState } from './attendanceSelectors';
import { calculateAttendanceStats } from '../utils/attendanceCalculations';
import { formatDate } from '../utils/dateUtils';

/**
 * 8 Live Summary Cards statistics
 */
export const selectDashboardSummaryCards = createSelector(
  [
    selectTotalStudentsCount,
    selectAllAttendanceRecords,
    selectStudentsBelowThreshold,
    selectAttendanceThreshold,
  ],
  (totalStudents, records, lowAttendanceStudents, threshold) => {
    let presentCount = 0;
    let absentCount = 0;
    let plCount = 0;
    let eCount = 0;
    let lateCount = 0;

    records.forEach((r) => {
      if (r.status === 'P') {
        presentCount += 1;
        if (r.isLate) lateCount += 1;
      } else if (r.status === 'A') {
        absentCount += 1;
      } else if (r.status === 'PL') {
        plCount += 1;
      } else if (r.status === 'E') {
        eCount += 1;
      }
    });

    const overallStats = calculateAttendanceStats(
      {
        present: presentCount,
        absent: absentCount,
        pl: plCount,
        e: eCount,
        late: lateCount,
      },
      threshold
    );

    return {
      totalEnrolled: totalStudents,
      totalStudents,
      totalPresent: presentCount,
      totalAbsent: absentCount,
      totalInternshipPlaced: plCount,
      totalInternship: plCount,
      totalOfficialEngagement: eCount,
      totalLate: lateCount,
      overallPercentage: overallStats.percentage,
      formattedPercentage: overallStats.formattedPercentage,
      overallPercentageFormatted: overallStats.formattedPercentage,
      lowAttendanceCount: lowAttendanceStudents.length,
      studentsBelowThreshold: lowAttendanceStudents.length,
      threshold,
    };
  }
);

/**
 * Attendance Status Distribution Donut Chart Data
 */
export const selectStatusDistributionChartData = createSelector(
  [selectAllAttendanceRecords],
  (records) => {
    let p = 0;
    let a = 0;
    let pl = 0;
    let e = 0;

    records.forEach((r) => {
      if (r.status === 'P') p++;
      else if (r.status === 'A') a++;
      else if (r.status === 'PL') pl++;
      else if (r.status === 'E') e++;
    });

    const total = p + a + pl + e;
    if (total === 0) {
      return [
        { name: 'Present (P)', value: 0, color: '#10B981' },
        { name: 'Absent (A)', value: 0, color: '#EF4444' },
        { name: 'Internship Placed (PL)', value: 0, color: '#F59E0B' },
        { name: 'Official Engagement (E)', value: 0, color: '#3B82F6' },
      ];
    }

    return [
      { name: 'Present (P)', value: p, color: '#10B981' },
      { name: 'Absent (A)', value: a, color: '#EF4444' },
      { name: 'Internship Placed (PL)', value: pl, color: '#F59E0B' },
      { name: 'Official Engagement (E)', value: e, color: '#3B82F6' },
    ];
  }
);

/**
 * Daily Attendance Trend Area Chart Data
 */
export const selectDailyTrendChartData = createSelector(
  [selectAllAttendanceRecords, selectAttendanceThreshold],
  (records, threshold) => {
    const dateMap = {};

    records.forEach((r) => {
      if (!dateMap[r.date]) {
        dateMap[r.date] = { present: 0, absent: 0, pl: 0, e: 0, late: 0 };
      }
      if (r.status === 'P') {
        dateMap[r.date].present += 1;
        if (r.isLate) dateMap[r.date].late += 1;
      } else if (r.status === 'A') {
        dateMap[r.date].absent += 1;
      } else if (r.status === 'PL') {
        dateMap[r.date].pl += 1;
      } else if (r.status === 'E') {
        dateMap[r.date].e += 1;
      }
    });

    const sortedDates = Object.keys(dateMap).sort();

    return sortedDates.map((date) => {
      const stats = calculateAttendanceStats(dateMap[date], threshold);
      return {
        date,
        formattedDate: formatDate(date),
        percentage: stats.percentage !== null ? stats.percentage : 0,
        present: stats.present,
        absent: stats.absent,
        late: stats.late,
        total: stats.totalSessions,
      };
    });
  }
);

/**
 * Subject-wise Attendance Bar Chart Data
 */
export const selectSubjectAttendanceChartData = createSelector(
  [selectAllAttendanceRecords, selectSubjectsState, selectAttendanceThreshold],
  (records, subjectsState, threshold) => {
    const subjects = subjectsState.items || [];
    const subjectMap = {};
    subjects.forEach((s) => {
      subjectMap[s.id] = s;
    });

    const recordMap = {};
    records.forEach((r) => {
      if (!recordMap[r.subjectId]) {
        recordMap[r.subjectId] = { present: 0, absent: 0, pl: 0, e: 0, late: 0 };
      }
      if (r.status === 'P') recordMap[r.subjectId].present++;
      else if (r.status === 'A') recordMap[r.subjectId].absent++;
      else if (r.status === 'PL') recordMap[r.subjectId].pl++;
      else if (r.status === 'E') recordMap[r.subjectId].e++;
    });

    return subjects.map((sub) => {
      const counts = recordMap[sub.id] || { present: 0, absent: 0, pl: 0, e: 0, late: 0 };
      const stats = calculateAttendanceStats(counts, threshold);
      return {
        id: sub.id,
        subjectCode: sub.code,
        subjectName: sub.name,
        department: sub.department,
        semester: sub.semester,
        percentage: stats.percentage !== null ? stats.percentage : 0,
        formattedPercentage: stats.formattedPercentage,
        present: stats.present,
        absent: stats.absent,
        totalSessions: stats.totalSessions,
      };
    });
  }
);

/**
 * Department-wise Attendance Comparison Chart Data
 */
export const selectDepartmentComparisonChartData = createSelector(
  [selectAllStudents, selectAllAttendanceRecords, selectAttendanceThreshold],
  (students, records, threshold) => {
    const studentDeptMap = {};
    const deptStudentCounts = {};

    students.forEach((s) => {
      studentDeptMap[s.id] = s.department;
      deptStudentCounts[s.department] = (deptStudentCounts[s.department] || 0) + 1;
    });

    const deptRecords = {};
    records.forEach((r) => {
      const dept = studentDeptMap[r.studentId] || 'Other';
      if (!deptRecords[dept]) {
        deptRecords[dept] = { present: 0, absent: 0, pl: 0, e: 0, late: 0 };
      }
      if (r.status === 'P') deptRecords[dept].present++;
      else if (r.status === 'A') deptRecords[dept].absent++;
      else if (r.status === 'PL') deptRecords[dept].pl++;
      else if (r.status === 'E') deptRecords[dept].e++;
    });

    return Object.keys(deptStudentCounts).map((dept) => {
      const counts = deptRecords[dept] || { present: 0, absent: 0, pl: 0, e: 0, late: 0 };
      const stats = calculateAttendanceStats(counts, threshold);
      return {
        department: dept,
        studentCount: deptStudentCounts[dept],
        percentage: stats.percentage !== null ? stats.percentage : 0,
        formattedPercentage: stats.formattedPercentage,
        present: stats.present,
        absent: stats.absent,
      };
    });
  }
);

/**
 * Monthly Attendance Overview Chart Data
 */
export const selectMonthlyAttendanceChartData = createSelector(
  [selectAllAttendanceRecords, selectAttendanceThreshold],
  (records, threshold) => {
    const monthMap = {};

    records.forEach((r) => {
      const monthKey = r.date.substring(0, 7); // 'YYYY-MM'
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { present: 0, absent: 0, pl: 0, e: 0, late: 0 };
      }
      if (r.status === 'P') monthMap[monthKey].present++;
      else if (r.status === 'A') monthMap[monthKey].absent++;
      else if (r.status === 'PL') monthMap[monthKey].pl++;
      else if (r.status === 'E') monthMap[monthKey].e++;
    });

    const sortedMonths = Object.keys(monthMap).sort();

    return sortedMonths.map((m) => {
      const stats = calculateAttendanceStats(monthMap[m], threshold);
      const [year, month] = m.split('-');
      const monthName = new Date(Number(year), Number(month) - 1, 1).toLocaleString('en-US', {
        month: 'short',
      });

      return {
        month: `${monthName} ${year}`,
        present: stats.present,
        absent: stats.absent,
        percentage: stats.percentage !== null ? stats.percentage : 0,
        totalSessions: stats.totalSessions,
      };
    });
  }
);

/**
 * Recent Attendance Sessions for the dashboard list
 */
export const selectRecentAttendanceSessions = createSelector(
  [selectAllAttendanceRecords, selectSubjectsState],
  (records, subjectsState) => {
    const subjects = subjectsState.items || [];
    const subMap = {};
    subjects.forEach((s) => {
      subMap[s.id] = s;
    });

    const sessionMap = {};
    records.forEach((r) => {
      const key = `${r.subjectId}_${r.date}`;
      if (!sessionMap[key]) {
        sessionMap[key] = {
          subjectId: r.subjectId,
          subjectCode: r.subjectCode,
          date: r.date,
          records: [],
        };
      }
      sessionMap[key].records.push(r);
    });

    const sessions = Object.values(sessionMap).map((sess) => {
      const sub = subMap[sess.subjectId] || {};
      const present = sess.records.filter((r) => r.status === 'P').length;
      const absent = sess.records.filter((r) => r.status === 'A').length;
      const pl = sess.records.filter((r) => r.status === 'PL').length;
      const e = sess.records.filter((r) => r.status === 'E').length;
      const late = sess.records.filter((r) => r.isLate).length;
      const stats = calculateAttendanceStats({ present, absent, pl, e, late });

      return {
        key: `${sess.subjectId}_${sess.date}`,
        subjectId: sess.subjectId,
        subjectCode: sub.code || sess.subjectCode,
        subjectName: sub.name || 'Academic Course',
        department: sub.department,
        semester: sub.semester,
        section: sub.section,
        date: sess.date,
        formattedDate: formatDate(sess.date),
        totalStudents: sess.records.length,
        present,
        absent,
        late,
        percentage: stats.percentage,
        formattedPercentage: stats.formattedPercentage,
      };
    });

    // Sort by date descending
    return sessions.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }
);
