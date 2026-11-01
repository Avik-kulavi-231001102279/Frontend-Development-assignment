/**
 * Attendify - Central Redux Store
 * Features 5 independent slices, custom logger middleware, and HTML5 LocalStorage persistence
 */

import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from '../features/students/studentsSlice';
import subjectsReducer from '../features/subjects/subjectsSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import filtersReducer from '../features/filters/filtersSlice';
import preferencesReducer from '../features/preferences/preferencesSlice';
import loggerMiddleware from './middleware/loggerMiddleware';
import { loadState, saveState, resetDemoData } from '../utils/storage';

// Hydrate state from LocalStorage or initialize with seed data
const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    subjects: subjectsReducer,
    attendance: attendanceReducer,
    filters: filtersReducer,
    preferences: preferencesReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Safe check for actions and state
        ignoredPaths: ['attendance.activeSession'],
      },
    }).concat(loggerMiddleware),
  devTools: Boolean(
    import.meta.env?.DEV ??
    (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production')
  ),
});

// Subscribe to store updates to persist changes into browser LocalStorage
store.subscribe(() => {
  saveState(store.getState());
});

/**
 * Resets the application state to the default seed dataset
 */
export const resetStore = () => {
  const initialData = resetDemoData();
  // Update state directly by dispatching reset actions
  store.dispatch({ type: 'students/setStudentItems', payload: initialData.students.items });
  store.dispatch({ type: 'subjects/setSubjectItems', payload: initialData.subjects.items });
  store.dispatch({ type: 'attendance/setAttendanceRecords', payload: initialData.attendance.records });
  store.dispatch({ type: 'preferences/resetPreferences' });
  store.dispatch({ type: 'filters/resetFilters' });
};

export default store;
