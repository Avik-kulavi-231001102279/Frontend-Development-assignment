/**
 * Attendify - Robust LocalStorage Persistence Engine
 * Storage Key: attendify_state_v1
 */

import {
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_ATTENDANCE,
  INITIAL_PREFERENCES,
} from '../data/seedData';

export const STORAGE_KEY = 'attendify_state_v1';

/**
 * Returns the default initial application state
 */
export const getInitialAppState = () => ({
  students: {
    items: INITIAL_STUDENTS,
    loading: false,
    error: null,
  },
  subjects: {
    items: INITIAL_SUBJECTS,
    loading: false,
    error: null,
  },
  attendance: {
    records: INITIAL_ATTENDANCE,
    activeSession: {
      date: '',
      subjectId: '',
      subjectCode: '',
      semester: '',
      section: '',
      isLoaded: false,
    },
    draftAttendance: {},
    initialDraftAttendance: {},
    loading: false,
    saving: false,
    error: null,
    successMessage: null,
  },
  preferences: {
    ...INITIAL_PREFERENCES,
  },
  filters: {
    department: '',
    semester: '',
    section: '',
    search: '',
    studentId: '',
    subjectCode: '',
    startDate: '',
    endDate: '',
    status: '',
  },
});

/**
 * Loads persisted state from LocalStorage, or initializes with seed data if absent or corrupted
 */
export const loadState = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return getInitialAppState();
  }

  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      // First-time user: initialize with seed dataset
      const initialState = getInitialAppState();
      saveState(initialState);
      return initialState;
    }

    const parsed = JSON.parse(serialized);
    if (!parsed || typeof parsed !== 'object') {
      return getInitialAppState();
    }

    // Merge safely with initial defaults to guard against missing fields
    const defaultState = getInitialAppState();
    return {
      students: {
        ...defaultState.students,
        items: Array.isArray(parsed.students?.items)
          ? parsed.students.items
          : defaultState.students.items,
      },
      subjects: {
        ...defaultState.subjects,
        items: Array.isArray(parsed.subjects?.items)
          ? parsed.subjects.items
          : defaultState.subjects.items,
      },
      attendance: {
        ...defaultState.attendance,
        records: Array.isArray(parsed.attendance?.records)
          ? parsed.attendance.records
          : defaultState.attendance.records,
      },
      preferences: {
        ...defaultState.preferences,
        ...(parsed.preferences || {}),
      },
      filters: {
        ...defaultState.filters,
        ...(parsed.filters || {}),
      },
    };
  } catch (err) {
    console.error('[Attendify Storage] Error reading state from LocalStorage:', err);
    return getInitialAppState();
  }
};

/**
 * Debounced state persistence to LocalStorage
 */
let debounceTimer = null;

export const saveState = (state) => {
  if (typeof window === 'undefined' || !window.localStorage) return;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    try {
      const stateToPersist = {
        students: { items: state.students?.items || [] },
        subjects: { items: state.subjects?.items || [] },
        attendance: { records: state.attendance?.records || [] },
        preferences: state.preferences || {},
        filters: state.filters || {},
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (err) {
      console.warn('[Attendify Storage] Failed to serialize state to LocalStorage (quota exceeded or restricted):', err);
    }
  }, 200);
};

/**
 * Immediately resets state in LocalStorage to initial seed data
 */
export const resetDemoData = () => {
  if (typeof window === 'undefined' || !window.localStorage) return getInitialAppState();
  try {
    const initialState = getInitialAppState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  } catch (err) {
    console.error('[Attendify Storage] Error resetting demo data:', err);
    return getInitialAppState();
  }
};

/**
 * Provides storage diagnostics for the Settings page
 */
export const getStorageDiagnostics = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { isAvailable: false, usedBytes: 0, usedKb: '0.00', recordCounts: {} };
  }

  try {
    const serialized = localStorage.getItem(STORAGE_KEY) || '';
    const byteLength = new Blob([serialized]).size;
    const usedKb = (byteLength / 1024).toFixed(2);
    const parsed = serialized ? JSON.parse(serialized) : {};

    return {
      isAvailable: true,
      storageKey: STORAGE_KEY,
      usedBytes: byteLength,
      usedKb,
      recordCounts: {
        students: parsed.students?.items?.length || 0,
        subjects: parsed.subjects?.items?.length || 0,
        attendance: parsed.attendance?.records?.length || 0,
      },
    };
  } catch (e) {
    return { isAvailable: false, usedBytes: 0, usedKb: '0.00', recordCounts: {} };
  }
};
