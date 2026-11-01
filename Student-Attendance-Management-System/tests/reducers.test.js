import { describe, it, expect } from 'vitest';
import studentsReducer, {
  addStudent,
  updateStudent,
  deleteStudent,
  clearStudentSuccess,
} from '../src/features/students/studentsSlice';
import subjectsReducer, {
  addSubject,
  updateSubject,
  deleteSubject,
} from '../src/features/subjects/subjectsSlice';
import attendanceReducer, {
  initializeDraftAttendance,
  setStudentStatus,
  setStudentLate,
  markAllPresent,
  markAllAbsent,
  resetDraftChanges,
  saveAttendance,
} from '../src/features/attendance/attendanceSlice';

describe('Redux Reducers & State Mutations', () => {
  // Student Slice Tests
  describe('Students Reducer', () => {
    const initialState = {
      items: [
        { id: 'STU001', name: 'John Doe', department: 'Computer Science', semester: 4, section: 'A', status: 'Active' },
      ],
      loading: false,
      error: null,
      successMessage: null,
    };

    it('handles addStudent.fulfilled', () => {
      const newStudent = {
        id: 'STU002',
        name: 'Jane Smith',
        department: 'Electronics',
        semester: 4,
        section: 'B',
        status: 'Active',
      };
      const action = { type: addStudent.fulfilled.type, payload: newStudent };
      const state = studentsReducer(initialState, action);

      expect(state.items).toHaveLength(2);
      expect(state.items[1].name).toBe('Jane Smith');
      expect(state.successMessage).toContain('Jane Smith');
    });

    it('handles updateStudent.fulfilled', () => {
      const updated = {
        id: 'STU001',
        name: 'Johnathan Doe',
        department: 'Computer Science',
        semester: 4,
        section: 'A',
        status: 'Inactive',
      };
      const action = { type: updateStudent.fulfilled.type, payload: updated };
      const state = studentsReducer(initialState, action);

      expect(state.items[0].name).toBe('Johnathan Doe');
      expect(state.items[0].status).toBe('Inactive');
    });

    it('handles deleteStudent.fulfilled', () => {
      const action = { type: deleteStudent.fulfilled.type, payload: 'STU001' };
      const state = studentsReducer(initialState, action);

      expect(state.items).toHaveLength(0);
      expect(state.successMessage).toContain('deleted');
    });
  });

  // Subject Slice Tests
  describe('Subjects Reducer', () => {
    const initialState = {
      items: [
        { id: 'sub-1', code: 'CS301', name: 'Data Structures', department: 'Computer Science', semester: 4, section: 'A' },
      ],
      loading: false,
      error: null,
      successMessage: null,
    };

    it('handles addSubject.fulfilled', () => {
      const newSubject = {
        id: 'sub-2',
        code: 'CS302',
        name: 'Database Systems',
        department: 'Computer Science',
        semester: 4,
        section: 'A',
      };
      const action = { type: addSubject.fulfilled.type, payload: newSubject };
      const state = subjectsReducer(initialState, action);

      expect(state.items).toHaveLength(2);
      expect(state.items[1].code).toBe('CS302');
    });

    it('handles updateSubject.fulfilled', () => {
      const updated = {
        id: 'sub-1',
        code: 'CS301',
        name: 'Advanced Data Structures & Algorithms',
        department: 'Computer Science',
        semester: 4,
        section: 'A',
      };
      const action = { type: updateSubject.fulfilled.type, payload: updated };
      const state = subjectsReducer(initialState, action);

      expect(state.items[0].name).toBe('Advanced Data Structures & Algorithms');
    });

    it('handles deleteSubject.fulfilled', () => {
      const action = { type: deleteSubject.fulfilled.type, payload: 'sub-1' };
      const state = subjectsReducer(initialState, action);

      expect(state.items).toHaveLength(0);
    });
  });

  // Attendance Slice Tests
  describe('Attendance Reducer & Batch Operations', () => {
    const mockStudents = [
      { id: 'STU001', name: 'Student 1' },
      { id: 'STU002', name: 'Student 2' },
      { id: 'STU003', name: 'Student 3' },
    ];

    it('initializes session draft with default Present status or existing records', () => {
      const existingRecords = [
        { studentId: 'STU002', subjectId: 'SUB1', date: '2026-11-01', status: 'A', isLate: false },
      ];

      const state = attendanceReducer(
        undefined,
        initializeDraftAttendance({
          students: mockStudents,
          existingRecords,
          date: '2026-11-01',
          subjectId: 'SUB1',
          subjectCode: 'CS301',
        })
      );

      expect(state.draftAttendance['STU001'].status).toBe('P');
      expect(state.draftAttendance['STU002'].status).toBe('A');
      expect(state.draftAttendance['STU003'].status).toBe('P');
    });

    it('changes individual student status and clears late if marked absent', () => {
      // First initialize
      let state = attendanceReducer(
        undefined,
        initializeDraftAttendance({
          students: mockStudents,
          existingRecords: [],
          date: '2026-11-01',
          subjectId: 'SUB1',
        })
      );

      // Mark STU001 late
      state = attendanceReducer(
        state,
        setStudentLate({ studentId: 'STU001', isLate: true, lateTime: '09:20 AM' })
      );
      expect(state.draftAttendance['STU001'].isLate).toBe(true);

      // Now change status to Absent -> must clear late flag
      state = attendanceReducer(
        state,
        setStudentStatus({ studentId: 'STU001', status: 'A' })
      );
      expect(state.draftAttendance['STU001'].status).toBe('A');
      expect(state.draftAttendance['STU001'].isLate).toBe(false);
      expect(state.draftAttendance['STU001'].lateTime).toBeNull();
    });

    it('supports batch markAllPresent and markAllAbsent', () => {
      let state = attendanceReducer(
        undefined,
        initializeDraftAttendance({
          students: mockStudents,
          existingRecords: [],
          date: '2026-11-01',
          subjectId: 'SUB1',
        })
      );

      // Mark all absent
      state = attendanceReducer(state, markAllAbsent());
      expect(state.draftAttendance['STU001'].status).toBe('A');
      expect(state.draftAttendance['STU002'].status).toBe('A');
      expect(state.draftAttendance['STU003'].status).toBe('A');

      // Mark all present
      state = attendanceReducer(state, markAllPresent());
      expect(state.draftAttendance['STU001'].status).toBe('P');
      expect(state.draftAttendance['STU002'].status).toBe('P');
      expect(state.draftAttendance['STU003'].status).toBe('P');
    });

    it('resets draft changes back to initial loaded state', () => {
      const existingRecords = [
        { studentId: 'STU001', subjectId: 'SUB1', date: '2026-11-01', status: 'PL' },
      ];

      let state = attendanceReducer(
        undefined,
        initializeDraftAttendance({
          students: mockStudents,
          existingRecords,
          date: '2026-11-01',
          subjectId: 'SUB1',
        })
      );

      // Mutate
      state = attendanceReducer(state, setStudentStatus({ studentId: 'STU001', status: 'A' }));
      expect(state.draftAttendance['STU001'].status).toBe('A');

      // Reset
      state = attendanceReducer(state, resetDraftChanges());
      expect(state.draftAttendance['STU001'].status).toBe('PL');
    });

    it('updates attendance records in-place without duplicates on saveAttendance.fulfilled', () => {
      const initialState = {
        records: [
          { id: 'STU001_SUB1_2026-11-01', studentId: 'STU001', subjectId: 'SUB1', date: '2026-11-01', status: 'P' },
        ],
        draftAttendance: {},
        initialDraftAttendance: {},
        activeSession: {},
        loading: false,
        saving: false,
        error: null,
        successMessage: null,
      };

      // Upsert existing record with modified status and new record
      const action = {
        type: saveAttendance.fulfilled.type,
        payload: [
          { id: 'STU001_SUB1_2026-11-01', studentId: 'STU001', subjectId: 'SUB1', date: '2026-11-01', status: 'A' },
          { id: 'STU002_SUB1_2026-11-01', studentId: 'STU002', subjectId: 'SUB1', date: '2026-11-01', status: 'P' },
        ],
      };

      const state = attendanceReducer(initialState, action);
      expect(state.records).toHaveLength(2);
      expect(state.records.find((r) => r.studentId === 'STU001').status).toBe('A');
      expect(state.records.find((r) => r.studentId === 'STU002').status).toBe('P');
    });
  });
});
