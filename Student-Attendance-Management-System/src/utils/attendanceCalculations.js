/**
 * Attendify - Centralized Attendance Calculation Policy
 * 
 * Strict Academic Formula:
 * Countable Sessions = Present (P) + Absent (A)
 * Attendance Percentage = (Present (P) / Countable Sessions) * 100
 * 
 * Rules:
 * 1. Present contributes to numerator and denominator.
 * 2. Absent contributes only to denominator.
 * 3. Internship Placed (PL) is EXCLUDED from countable sessions.
 * 4. Official Engagement (E) is EXCLUDED from countable sessions.
 * 5. Late students are counted as Present (Late is an attribute of Present).
 * 6. If countable sessions are 0, return null (displayed as 'N/A').
 * 7. Default attendance threshold: 45%.
 * 8. Students with 'N/A' must NOT appear in low-attendance warnings.
 */

export const DEFAULT_ATTENDANCE_THRESHOLD = 45;

/**
 * Checks if a percentage is strictly below the attendance threshold
 * Rule: Students with null/undefined percentage (N/A) MUST NOT appear in low attendance warnings!
 */
export const isLowAttendance = (percentage, threshold = DEFAULT_ATTENDANCE_THRESHOLD) => {
  if (percentage === null || percentage === undefined) {
    return false;
  }
  return Number(percentage) < Number(threshold);
};

/**
 * Formats attendance percentage to 1 decimal place or N/A
 */
export const formatAttendancePercentage = (percentage) => {
  if (percentage === null || percentage === undefined) {
    return 'N/A';
  }
  return `${Number(percentage).toFixed(1)}%`;
};

/**
 * Calculates attendance metrics given counts of statuses
 * @param {Object} counts - { present, absent, pl, e, late, internship, officialEngagement }
 * @returns {Object} { countableSessions, percentage, formattedPercentage, isLowAttendance }
 */
export const calculateAttendanceStats = (
  { present = 0, absent = 0, pl = 0, e = 0, late = 0, internship = 0, officialEngagement = 0 } = {},
  threshold = DEFAULT_ATTENDANCE_THRESHOLD
) => {
  const pCount = Number(present) || 0;
  const aCount = Number(absent) || 0;
  const plCount = Number(pl || internship) || 0;
  const eCount = Number(e || officialEngagement) || 0;
  const lateCount = Number(late) || 0;

  const totalSessions = pCount + aCount + plCount + eCount;
  const countableSessions = pCount + aCount;

  if (countableSessions === 0) {
    return {
      totalSessions,
      countableSessions: 0,
      present: pCount,
      absent: aCount,
      pl: plCount,
      e: eCount,
      internship: plCount,
      officialEngagement: eCount,
      late: lateCount,
      percentage: null,
      formattedPercentage: 'N/A',
      isLowAttendance: false,
      threshold,
    };
  }

  const percentage = Number(((pCount / countableSessions) * 100).toFixed(2));
  const isLow = isLowAttendance(percentage, threshold);

  return {
    totalSessions,
    countableSessions,
    present: pCount,
    absent: aCount,
    pl: plCount,
    e: eCount,
    internship: plCount,
    officialEngagement: eCount,
    late: lateCount,
    percentage,
    formattedPercentage: formatAttendancePercentage(percentage),
    isLowAttendance: isLow,
    threshold,
  };
};

/**
 * Calculates attendance metrics for a list of attendance records
 * @param {Array} records - Array of attendance records
 * @param {number} threshold - Configurable threshold percentage (default 45%)
 */
export const calculateStudentAttendanceFromRecords = (
  records = [],
  threshold = DEFAULT_ATTENDANCE_THRESHOLD
) => {
  let present = 0;
  let absent = 0;
  let pl = 0;
  let e = 0;
  let late = 0;

  records.forEach((rec) => {
    const status = rec.status;
    if (status === 'P') {
      present += 1;
      if (rec.isLate) {
        late += 1;
      }
    } else if (status === 'A') {
      absent += 1;
    } else if (status === 'PL') {
      pl += 1;
    } else if (status === 'E') {
      e += 1;
    }
  });

  return calculateAttendanceStats({ present, absent, pl, e, late }, threshold);
};

/**
 * Aggregates attendance statistics across an entire group or cohort
 * @param {Array} attendanceRecords
 * @param {number} threshold
 */
export const calculateCohortAttendance = (
  attendanceRecords = [],
  threshold = DEFAULT_ATTENDANCE_THRESHOLD
) => {
  return calculateStudentAttendanceFromRecords(attendanceRecords, threshold);
};
