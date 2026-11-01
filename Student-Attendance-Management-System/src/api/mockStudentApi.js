/**
 * Attendify - Mock Student API Service
 * Simulates asynchronous network requests with realistic delay and duplicate validation
 */

import { loadState, saveState } from '../utils/storage';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockStudentApi = {
  /**
   * Fetches all registered students
   */
  async getStudents() {
    await delay(120);
    const state = loadState();
    return [...state.students.items];
  },

  /**
   * Fetches single student by ID
   */
  async getStudentById(id) {
    await delay(100);
    const state = loadState();
    const student = state.students.items.find((s) => s.id === id);
    if (!student) {
      throw new Error(`Student with ID ${id} not found.`);
    }
    return { ...student };
  },

  /**
   * Creates a new student with duplicate ID validation
   */
  async createStudent(studentData) {
    await delay(180);
    const state = loadState();
    const existing = state.students.items.find(
      (s) => s.id.toLowerCase() === studentData.id.trim().toLowerCase()
    );
    if (existing) {
      throw new Error(`Student with ID "${studentData.id}" already exists in the system.`);
    }

    const newStudent = {
      ...studentData,
      id: studentData.id.trim().toUpperCase(),
      status: studentData.status || 'Active',
    };

    const updatedStudents = [...state.students.items, newStudent];
    saveState({ ...state, students: { items: updatedStudents } });
    return newStudent;
  },

  /**
   * Updates an existing student
   */
  async updateStudent(id, studentData) {
    await delay(160);
    const state = loadState();
    const index = state.students.items.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Cannot update: Student with ID ${id} does not exist.`);
    }

    const updated = {
      ...state.students.items[index],
      ...studentData,
      id, // Preserve immutable ID
    };

    const updatedStudents = [...state.students.items];
    updatedStudents[index] = updated;
    saveState({ ...state, students: { items: updatedStudents } });
    return updated;
  },

  /**
   * Deletes a student by ID
   */
  async deleteStudent(id) {
    await delay(150);
    const state = loadState();
    const updatedStudents = state.students.items.filter((s) => s.id !== id);
    saveState({ ...state, students: { items: updatedStudents } });
    return { id, success: true };
  },
};

export default mockStudentApi;
