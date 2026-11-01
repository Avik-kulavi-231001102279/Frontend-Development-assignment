/**
 * Attendify - Mock Attendance API Service
 * Handles attendance fetching, batch upserts, duplicate prevention, and late tracking
 * Compound Unique Key: `${studentId}_${subjectId}_${date}`
 */

import { loadState, saveState } from '../utils/storage';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAttendanceApi = {
  /**
   * Fetches all attendance records
   */
  async getAttendanceRecords() {
    await delay(120);
    const state = loadState();
    return [...state.attendance.records];
  },

  /**
   * Fetches existing attendance for a specific session (subjectId and date)
   */
  async getSessionAttendance(subjectId, date) {
    await delay(100);
    const state = loadState();
    return state.attendance.records.filter(
      (r) => r.subjectId === subjectId && r.date === date
    );
  },

  /**
   * Saves or updates a batch of attendance entries with strict duplicate prevention
   * @param {Array<Object>} attendanceEntries - Array of { studentId, subjectId, subjectCode, date, status, isLate, lateTime }
   */
  async saveAttendanceBatch(attendanceEntries = []) {
    await delay(200);
    const state = loadState();
    const existingRecords = [...state.attendance.records];

    attendanceEntries.forEach((entry) => {
      // Find existing index by compound key
      const matchIdx = existingRecords.findIndex(
        (r) =>
          r.studentId === entry.studentId &&
          r.subjectId === entry.subjectId &&
          r.date === entry.date
      );

      const recordToSave = {
        id: matchIdx !== -1 ? existingRecords[matchIdx].id : `att_${entry.studentId}_${entry.subjectId}_${entry.date}`,
        studentId: entry.studentId,
        subjectId: entry.subjectId,
        subjectCode: entry.subjectCode,
        date: entry.date,
        status: entry.status || 'P',
        isLate: Boolean(entry.isLate && (entry.status === 'P' || !entry.status)),
        lateTime: entry.isLate ? (entry.lateTime || '09:15 AM') : null,
        updatedAt: new Date().toISOString(),
      };

      if (matchIdx !== -1) {
        // Update in place without duplicating
        existingRecords[matchIdx] = recordToSave;
      } else {
        // Append new record
        existingRecords.push(recordToSave);
      }
    });

    saveState({ ...state, attendance: { records: existingRecords } });
    return existingRecords;
  },

  /**
   * Deletes attendance records for a specific session
   */
  async deleteSessionAttendance(subjectId, date) {
    await delay(150);
    const state = loadState();
    const filtered = state.attendance.records.filter(
      (r) => !(r.subjectId === subjectId && r.date === date)
    );
    saveState({ ...state, attendance: { records: filtered } });
    return { subjectId, date, success: true };
  },
};

export default mockAttendanceApi;
