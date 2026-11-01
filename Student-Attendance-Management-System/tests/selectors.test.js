import { describe, it, expect } from 'vitest';
import {
  selectFilteredStudents,
  selectUniqueDepartments,
  selectUniqueSemesters,
  selectUniqueSections,
} from '../src/selectors/studentSelectors';
import {
  selectAllStudentsAttendanceStats,
  selectStudentsBelowThreshold,
  selectStudentAttendanceProfile,
} from '../src/selectors/attendanceSelectors';
import {
  selectDashboardSummaryCards,
  selectStatusDistributionChartData,
  selectDailyTrendChartData,
} from '../src/selectors/dashboardSelectors';

describe('Memoized Reselect Selectors', () => {
  const mockState = {
    students: {
      items: [
        { id: 'STU001', name: 'Alice Adams', department: 'Computer Science', semester: 4, section: 'A', status: 'Active' },
        { id: 'STU002', name: 'Bob Baker', department: 'Computer Science', semester: 4, section: 'B', status: 'Active' },
        { id: 'STU003', name: 'Charlie Clark', department: 'Electronics', semester: 6, section: 'A', status: 'Inactive' },
        { id: 'STU004', name: 'Diana Davis', department: 'Computer Science', semester: 4, section: 'A', status: 'Active' },
      ],
      loading: false,
      error: null,
    },
    subjects: {
      items: [
        { id: 'SUB1', code: 'CS301', name: 'Data Structures', department: 'Computer Science', semester: 4, section: 'A' },
      ],
      loading: false,
      error: null,
    },
    attendance: {
      records: [
        // STU001: 4 Present, 1 Absent = 4/5 = 80%
        { studentId: 'STU001', subjectId: 'SUB1', date: '2026-10-25', status: 'P', isLate: false },
        { studentId: 'STU001', subjectId: 'SUB1', date: '2026-10-26', status: 'P', isLate: true },
        { studentId: 'STU001', subjectId: 'SUB1', date: '2026-10-27', status: 'P', isLate: false },
        { studentId: 'STU001', subjectId: 'SUB1', date: '2026-10-28', status: 'P', isLate: false },
        { studentId: 'STU001', subjectId: 'SUB1', date: '2026-10-29', status: 'A', isLate: false },

        // STU002: 1 Present, 4 Absent = 1/5 = 20% (< 45% -> Low Attendance!)
        { studentId: 'STU002', subjectId: 'SUB1', date: '2026-10-25', status: 'A', isLate: false },
        { studentId: 'STU002', subjectId: 'SUB1', date: '2026-10-26', status: 'A', isLate: false },
        { studentId: 'STU002', subjectId: 'SUB1', date: '2026-10-27', status: 'A', isLate: false },
        { studentId: 'STU002', subjectId: 'SUB1', date: '2026-10-28', status: 'A', isLate: false },
        { studentId: 'STU002', subjectId: 'SUB1', date: '2026-10-29', status: 'P', isLate: false },

        // STU003: 2 PL, 1 E = 0 countable sessions = N/A -> MUST NOT BE IN LOW ATTENDANCE!
        { studentId: 'STU003', subjectId: 'SUB1', date: '2026-10-25', status: 'PL' },
        { studentId: 'STU003', subjectId: 'SUB1', date: '2026-10-26', status: 'PL' },
        { studentId: 'STU003', subjectId: 'SUB1', date: '2026-10-27', status: 'E' },
      ],
      draftAttendance: {},
      initialDraftAttendance: {},
      activeSession: {},
      loading: false,
      saving: false,
      error: null,
    },
    preferences: {
      threshold: 45,
      theme: 'light',
    },
    filters: {
      search: '',
      department: '',
      semester: '',
      section: '',
      status: '',
    },
  };

  it('filters students by search query (name or ID)', () => {
    const searchState = {
      ...mockState,
      filters: { ...mockState.filters, search: 'charlie' },
    };
    const result = selectFilteredStudents(searchState);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('STU003');

    const searchIdState = {
      ...mockState,
      filters: { ...mockState.filters, search: 'STU001' },
    };
    const idResult = selectFilteredStudents(searchIdState);
    expect(idResult).toHaveLength(1);
    expect(idResult[0].name).toBe('Alice Adams');
  });

  it('filters students by multi-criteria (department, semester, section, status)', () => {
    const multiState = {
      ...mockState,
      filters: {
        ...mockState.filters,
        department: 'Computer Science',
        semester: '4',
        section: 'A',
        status: 'Active',
      },
    };
    const result = selectFilteredStudents(multiState);
    // STU001 and STU004 match
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.id)).toEqual(['STU001', 'STU004']);
  });

  it('derives unique departments, semesters, and sections', () => {
    expect(selectUniqueDepartments(mockState)).toEqual(['Computer Science', 'Electronics']);
    expect(selectUniqueSemesters(mockState)).toEqual([4, 6]);
    expect(selectUniqueSections(mockState)).toEqual(['A', 'B']);
  });

  it('calculates individual student attendance statistics accurately', () => {
    const statsMap = selectAllStudentsAttendanceStats(mockState);
    expect(statsMap['STU001'].percentage).toBe(80.0);
    expect(statsMap['STU001'].late).toBe(1);
    expect(statsMap['STU001'].isLowAttendance).toBe(false);

    expect(statsMap['STU002'].percentage).toBe(20.0);
    expect(statsMap['STU002'].isLowAttendance).toBe(true);

    expect(statsMap['STU003'].percentage).toBeNull();
    expect(statsMap['STU003'].formattedPercentage).toBe('N/A');
    expect(statsMap['STU003'].isLowAttendance).toBe(false);
  });

  it('identifies low attendance students while strictly excluding N/A students', () => {
    const lowStudents = selectStudentsBelowThreshold(mockState);
    // STU002 (20%) is below 45% threshold with 5 countable sessions
    // STU003 has 0 countable sessions (N/A) and MUST NOT appear!
    expect(lowStudents).toHaveLength(1);
    expect(lowStudents[0].student.id).toBe('STU002');
  });

  it('computes live executive dashboard summary cards from Redux state', () => {
    const summary = selectDashboardSummaryCards(mockState);
    expect(summary.totalStudents).toBe(4);
    expect(summary.totalPresent).toBe(5); // STU001: 4 + STU002: 1
    expect(summary.totalAbsent).toBe(5);  // STU001: 1 + STU002: 4
    expect(summary.totalInternship).toBe(2);
    expect(summary.totalOfficialEngagement).toBe(1);
    expect(summary.totalLate).toBe(1);
    expect(summary.studentsBelowThreshold).toBe(1);
    // Total countable = 5 + 5 = 10, total present = 5 -> 50.0%
    expect(summary.overallPercentage).toBe(50.0);
    expect(summary.overallPercentageFormatted).toBe('50.0%');
  });

  it('builds student profile with subject breakdown and history', () => {
    const profile = selectStudentAttendanceProfile('STU001')(mockState);
    expect(profile).not.toBeNull();
    expect(profile.student.name).toBe('Alice Adams');
    expect(profile.overallStats.percentage).toBe(80.0);
    expect(profile.overallStats.late).toBe(1);
    expect(profile.subjectBreakdown).toHaveLength(1);
    expect(profile.subjectBreakdown[0].subjectCode).toBe('CS301');
    expect(profile.history).toHaveLength(5);
  });
});
