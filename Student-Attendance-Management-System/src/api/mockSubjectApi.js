/**
 * Attendify - Mock Subject API Service
 * Simulates asynchronous requests with duplicate Subject Code validation
 */

import { loadState, saveState } from '../utils/storage';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockSubjectApi = {
  /**
   * Fetches all subjects
   */
  async getSubjects() {
    await delay(120);
    const state = loadState();
    return [...state.subjects.items];
  },

  /**
   * Creates a new subject with duplicate code validation
   */
  async createSubject(subjectData) {
    await delay(180);
    const state = loadState();
    const existing = state.subjects.items.find(
      (s) =>
        s.code.toLowerCase() === subjectData.code.trim().toLowerCase() &&
        s.section.toUpperCase() === subjectData.section.trim().toUpperCase()
    );
    if (existing) {
      throw new Error(`Subject with Code "${subjectData.code}" for Section "${subjectData.section}" already exists.`);
    }

    const newSubject = {
      ...subjectData,
      id: `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      code: subjectData.code.trim().toUpperCase(),
      section: subjectData.section.trim().toUpperCase(),
      creditUnits: Number(subjectData.creditUnits) || 3,
    };

    const updatedSubjects = [...state.subjects.items, newSubject];
    saveState({ ...state, subjects: { items: updatedSubjects } });
    return newSubject;
  },

  /**
   * Updates an existing subject
   */
  async updateSubject(id, subjectData) {
    await delay(160);
    const state = loadState();
    const index = state.subjects.items.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Cannot update: Subject with ID ${id} not found.`);
    }

    // Check duplicate code collision with another subject
    const duplicate = state.subjects.items.find(
      (s) =>
        s.id !== id &&
        s.code.toLowerCase() === subjectData.code.trim().toLowerCase() &&
        s.section.toUpperCase() === (subjectData.section || s.section).trim().toUpperCase()
    );
    if (duplicate) {
      throw new Error(`Subject code "${subjectData.code}" for Section "${subjectData.section}" is already taken.`);
    }

    const updated = {
      ...state.subjects.items[index],
      ...subjectData,
      id,
    };

    const updatedSubjects = [...state.subjects.items];
    updatedSubjects[index] = updated;
    saveState({ ...state, subjects: { items: updatedSubjects } });
    return updated;
  },

  /**
   * Deletes a subject by ID
   */
  async deleteSubject(id) {
    await delay(150);
    const state = loadState();
    const updatedSubjects = state.subjects.items.filter((s) => s.id !== id);
    saveState({ ...state, subjects: { items: updatedSubjects } });
    return { id, success: true };
  },
};

export default mockSubjectApi;
