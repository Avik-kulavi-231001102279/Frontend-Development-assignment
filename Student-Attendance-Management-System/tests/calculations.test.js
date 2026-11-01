import { describe, it, expect } from 'vitest';
import {
  calculateAttendanceStats,
  calculateStudentAttendanceFromRecords,
  formatAttendancePercentage,
  isLowAttendance,
  DEFAULT_ATTENDANCE_THRESHOLD,
} from '../src/utils/attendanceCalculations';

describe('Attendance Calculation Engine', () => {
  it('correctly calculates basic Present and Absent attendance percentage', () => {
    // 8 Present, 2 Absent = 8 / 10 = 80.0%
    const stats = calculateAttendanceStats({ present: 8, absent: 2 });
    expect(stats.countableSessions).toBe(10);
    expect(stats.totalSessions).toBe(10);
    expect(stats.percentage).toBe(80.0);
    expect(stats.formattedPercentage).toBe('80.0%');
    expect(stats.isLowAttendance).toBe(false);
  });

  it('strictly excludes Internship Placed (PL) and Official Engagement (E) from countable sessions', () => {
    // 7 Present, 3 Absent, 5 PL, 4 E
    // Countable = 7 + 3 = 10
    // Percentage = (7 / 10) * 100 = 70.0%
    // Total sessions = 7 + 3 + 5 + 4 = 19
    const stats = calculateAttendanceStats({
      present: 7,
      absent: 3,
      internship: 5,
      officialEngagement: 4,
    });
    expect(stats.countableSessions).toBe(10);
    expect(stats.totalSessions).toBe(19);
    expect(stats.percentage).toBe(70.0);
    expect(stats.formattedPercentage).toBe('70.0%');
  });

  it('returns null and displays N/A when countable sessions are zero', () => {
    // Only PL and E records, or no records at all
    const statsNoRecords = calculateAttendanceStats({});
    expect(statsNoRecords.countableSessions).toBe(0);
    expect(statsNoRecords.percentage).toBeNull();
    expect(statsNoRecords.formattedPercentage).toBe('N/A');
    expect(statsNoRecords.isLowAttendance).toBe(false);

    const statsOnlyPLE = calculateAttendanceStats({ internship: 3, officialEngagement: 2 });
    expect(statsOnlyPLE.countableSessions).toBe(0);
    expect(statsOnlyPLE.percentage).toBeNull();
    expect(statsOnlyPLE.formattedPercentage).toBe('N/A');
    expect(statsOnlyPLE.isLowAttendance).toBe(false);
  });

  it('never flags students with N/A as low attendance warning', () => {
    expect(isLowAttendance(null, 45)).toBe(false);
    expect(isLowAttendance(undefined, 45)).toBe(false);
  });

  it('counts Late students as Present in attendance percentage calculations', () => {
    // 5 regular Present + 2 Late Present + 3 Absent
    // Total Present = 7, Countable = 7 + 3 = 10 -> 70.0%
    const records = [
      { status: 'P', isLate: false },
      { status: 'P', isLate: false },
      { status: 'P', isLate: false },
      { status: 'P', isLate: false },
      { status: 'P', isLate: false },
      { status: 'P', isLate: true, lateTime: '09:20 AM' },
      { status: 'P', isLate: true, lateTime: '09:15 AM' },
      { status: 'A' },
      { status: 'A' },
      { status: 'A' },
      { status: 'PL' },
      { status: 'E' },
    ];

    const stats = calculateStudentAttendanceFromRecords(records, 45);
    expect(stats.present).toBe(7);
    expect(stats.late).toBe(2);
    expect(stats.absent).toBe(3);
    expect(stats.internship).toBe(1);
    expect(stats.officialEngagement).toBe(1);
    expect(stats.countableSessions).toBe(10);
    expect(stats.totalSessions).toBe(12);
    expect(stats.percentage).toBe(70.0);
    expect(stats.isLowAttendance).toBe(false);
  });

  it('handles threshold boundary conditions precisely', () => {
    const threshold = 45;
    // Exactly at threshold: 45.0% is NOT low attendance
    expect(isLowAttendance(45.0, threshold)).toBe(false);
    expect(isLowAttendance(45.1, threshold)).toBe(false);

    // Below threshold: 44.9% IS low attendance
    expect(isLowAttendance(44.9, threshold)).toBe(true);
    expect(isLowAttendance(40.0, threshold)).toBe(true);
    expect(isLowAttendance(0.0, threshold)).toBe(true);
  });

  it('formats percentages accurately to one decimal place', () => {
    expect(formatAttendancePercentage(75.555)).toBe('75.6%');
    expect(formatAttendancePercentage(66.666)).toBe('66.7%');
    expect(formatAttendancePercentage(100)).toBe('100.0%');
    expect(formatAttendancePercentage(0)).toBe('0.0%');
    expect(formatAttendancePercentage(null)).toBe('N/A');
  });
});
