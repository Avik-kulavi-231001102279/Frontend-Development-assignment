import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Toast } from '../common/Toast';
import { clearStudentSuccess, clearStudentError } from '../../features/students/studentsSlice';
import { clearSubjectSuccess, clearSubjectError } from '../../features/subjects/subjectsSlice';
import { clearAttendanceSuccess, clearAttendanceError } from '../../features/attendance/attendanceSlice';

/**
 * Attendify - Main Dashboard Layout
 */
export const AppLayout = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Synchronize theme with data-theme attribute on documentElement
  const theme = useSelector((state) => state.preferences?.theme || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toast notifications from active slices
  const studentSuccess = useSelector((state) => state.students.successMessage);
  const studentError = useSelector((state) => state.students.error);
  const subjectSuccess = useSelector((state) => state.subjects.successMessage);
  const subjectError = useSelector((state) => state.subjects.error);
  const attendanceSuccess = useSelector((state) => state.attendance.successMessage);
  const attendanceError = useSelector((state) => state.attendance.error);

  const activeMessage =
    studentSuccess ||
    subjectSuccess ||
    attendanceSuccess ||
    studentError ||
    subjectError ||
    attendanceError;

  const isErrorMessage = Boolean(studentError || subjectError || attendanceError);

  const handleDismissToast = () => {
    dispatch(clearStudentSuccess());
    dispatch(clearStudentError());
    dispatch(clearSubjectSuccess());
    dispatch(clearSubjectError());
    dispatch(clearAttendanceSuccess());
    dispatch(clearAttendanceError());
  };

  const marginLeftDesktop = sidebarCollapsed ? '80px' : '260px';

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', width: '100%' }}>
      {/* Dynamic CSS for responsive sidebar margin */}
      <style>{`
        .main-content-wrapper {
          margin-left: 0;
          transition: margin-left var(--transition-normal);
        }
        @media (min-width: 1024px) {
          .main-content-wrapper {
            margin-left: ${marginLeftDesktop} !important;
          }
        }
        @media (max-width: 1023px) {
          .mobile-hamburger {
            display: flex !important;
          }
          .attendify-sidebar {
            transform: translateX(-100%);
          }
          .attendify-sidebar.open {
            transform: translateX(0) !important;
          }
          .mobile-close-btn {
            display: flex !important;
          }
        }
        @media (min-width: 1024px) {
          .mobile-hamburger {
            display: none !important;
          }
          .mobile-close-btn {
            display: none !important;
          }
        }
      `}</style>

      {/* Collapsible Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className="main-content-wrapper"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <Topbar onToggleSidebar={() => setSidebarOpen(true)} />

        <main style={{ flex: 1, padding: '1.75rem', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      {/* Global Action Toasts */}
      {activeMessage && (
        <Toast
          message={activeMessage}
          type={isErrorMessage ? 'error' : 'success'}
          onClose={handleDismissToast}
        />
      )}
    </div>
  );
};

export default AppLayout;
