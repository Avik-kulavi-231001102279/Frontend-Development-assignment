import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  User,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { toggleTheme } from '../../features/preferences/preferencesSlice';

/**
 * Attendify - Professional Top Navigation Bar
 */
export const Navbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useSelector((state) => state.preferences?.theme || 'light');
  const institutionName = useSelector(
    (state) => state.preferences?.institutionName || 'Attendify Institute of Technology'
  );

  const [notificationOpen, setNotificationOpen] = useState(false);

  // Derive human-readable page title from pathname
  const getPageTitle = (path) => {
    if (path.startsWith('/dashboard')) return 'Executive Dashboard';
    if (path.startsWith('/students')) return 'Student Directory & Management';
    if (path.startsWith('/subjects')) return 'Academic Subjects & Courses';
    if (path.startsWith('/attendance')) return 'Classroom Attendance Operations';
    if (path.startsWith('/reports')) return 'Attendance Reporting & Exports';
    if (path.startsWith('/analytics')) return 'Attendance Analytics & Trends';
    if (path.startsWith('/settings')) return 'System Settings & Configurations';
    return 'Attendance Management';
  };

  const currentDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.45rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-hover)',
            color: 'var(--text-primary)',
          }}
          className="mobile-hamburger"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {getPageTitle(location.pathname)}
          </h2>
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '2px',
            }}
          >
            <Calendar size={13} />
            <span>{currentDateFormatted}</span>
            <span style={{ color: 'var(--border-light)' }}>•</span>
            <span style={{ fontWeight: 500 }}>{institutionName}</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-hover)',
            color: theme === 'dark' ? '#FBBF24' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-light)',
            transition: 'all var(--transition-fast)',
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Notifications Icon with popover */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-hover)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-light)',
              position: 'relative',
            }}
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '8px',
                height: '8px',
                backgroundColor: '#EF4444',
                borderRadius: '50%',
              }}
            />
          </button>

          {notificationOpen && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '300px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                padding: '1rem',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Notifications</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--brand-primary)' }}>Live Sync</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.5rem 0' }}>
                All academic records and attendance states are actively synchronized in LocalStorage.
              </div>
            </div>
          )}
        </div>

        <div style={{ width: '1px', height: '26px', backgroundColor: 'var(--border-light)' }} />

        {/* User Profile Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-hover)',
            border: '1px solid var(--border-light)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--brand-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={16} />
          </div>
          <div className="navbar-user-text" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              Academic Admin
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <ShieldCheck size={11} /> Faculty Portal
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
