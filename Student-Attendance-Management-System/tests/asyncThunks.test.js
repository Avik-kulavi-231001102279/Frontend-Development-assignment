import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  fetchStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from '../src/features/students/studentsSlice';
import {
  fetchSubjects,
  addSubject,
} from '../src/features/subjects/subjectsSlice';
import {
  saveAttendance,
} from '../src/features/attendance/attendanceSlice';
import { mockStudentApi } from '../src/api/mockStudentApi';
import { mockSubjectApi } from '../src/api/mockSubjectApi';
import { mockAttendanceApi } from '../src/api/mockAttendanceApi';

describe('Redux Toolkit Async Thunks', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Students Async Thunks', () => {
    it('dispatches pending and fulfilled actions on successful fetchStudents', async () => {
      const mockData = [{ id: 'STU101', name: 'Sam Sample' }];
      vi.spyOn(mockStudentApi, 'getStudents').mockResolvedValueOnce(mockData);

      const dispatch = vi.fn();
      const thunk = fetchStudents();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe('students/fetchStudents/fulfilled');
      expect(result.payload).toEqual(mockData);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'students/fetchStudents/pending' }));
    });

    it('dispatches rejected action when addStudent encounters a duplicate student ID', async () => {
      vi.spyOn(mockStudentApi, 'createStudent').mockRejectedValueOnce(
        new Error('Student with ID "STU001" already exists in the system.')
      );

      const dispatch = vi.fn();
      const thunk = addStudent({ id: 'STU001', name: 'Duplicate Student' });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe('students/addStudent/rejected');
      expect(result.payload).toBe('Student with ID "STU001" already exists in the system.');
    });

    it('dispatches fulfilled action when addStudent succeeds', async () => {
      const created = { id: 'STU999', name: 'New Student', status: 'Active' };
      vi.spyOn(mockStudentApi, 'createStudent').mockResolvedValueOnce(created);

      const dispatch = vi.fn();
      const thunk = addStudent(created);
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe('students/addStudent/fulfilled');
      expect(result.payload).toEqual(created);
    });
  });

  describe('Subjects Async Thunks', () => {
    it('dispatches fulfilled action on successful fetchSubjects', async () => {
      const mockSubjects = [{ id: 'sub-1', code: 'CS101', name: 'Intro CS' }];
      vi.spyOn(mockSubjectApi, 'getSubjects').mockResolvedValueOnce(mockSubjects);

      const dispatch = vi.fn();
      const thunk = fetchSubjects();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe('subjects/fetchSubjects/fulfilled');
      expect(result.payload).toEqual(mockSubjects);
    });

    it('dispatches rejected action when addSubject has duplicate code and section', async () => {
      vi.spyOn(mockSubjectApi, 'createSubject').mockRejectedValueOnce(
        new Error('Subject with Code "CS101" for Section "A" already exists.')
      );

      const dispatch = vi.fn();
      const thunk = addSubject({ code: 'CS101', section: 'A' });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe('subjects/addSubject/rejected');
      expect(result.payload).toBe('Subject with Code "CS101" for Section "A" already exists.');
    });
  });

  describe('Attendance Async Thunks', () => {
    it('dispatches pending and fulfilled actions on successful saveAttendance batch', async () => {
      const entries = [
        { id: 'STU1_SUB1_2026-11-01', studentId: 'STU1', subjectId: 'SUB1', status: 'P' },
      ];
      vi.spyOn(mockAttendanceApi, 'saveAttendanceBatch').mockResolvedValueOnce(entries);

      const dispatch = vi.fn();
      const thunk = saveAttendance(entries);
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe('attendance/saveAttendance/fulfilled');
      expect(result.payload).toEqual(entries);
    });

    it('dispatches rejected action on failed saveAttendance batch', async () => {
      vi.spyOn(mockAttendanceApi, 'saveAttendanceBatch').mockRejectedValueOnce(
        new Error('Storage quota exceeded.')
      );

      const dispatch = vi.fn();
      const thunk = saveAttendance([]);
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.type).toBe('attendance/saveAttendance/rejected');
      expect(result.payload).toBe('Storage quota exceeded.');
    });
  });
});
