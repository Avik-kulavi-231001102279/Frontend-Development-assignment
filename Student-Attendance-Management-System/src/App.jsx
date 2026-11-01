import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppLayout } from './components/layout/AppLayout';

// Direct Page Imports
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import SubjectsPage from './pages/SubjectsPage';
import AttendancePage from './pages/AttendancePage';
import ReportsPage from './pages/ReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

/**
 * Attendify - Main Application Component & Routing
 * Pure frontend academic attendance management architecture
 */
export const App = () => {
  const theme = useSelector((state) => state.preferences?.theme || 'light');

  // Synchronize HTML theme attribute on mount and state changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Routes>
      {/* All Application Pages enclosed in AppLayout with Sidebar & Topbar */}
      <Route element={<AppLayout />}>
        {/* Index redirects to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Primary Functional Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Catch-all route redirects to Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
