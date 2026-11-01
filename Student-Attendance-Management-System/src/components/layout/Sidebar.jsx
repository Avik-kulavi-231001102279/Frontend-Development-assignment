import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  FileSpreadsheet,
  BarChart3,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/**
 * Attendify - Professional Collapsible Academic Sidebar
 */
export const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const navSections = [
    {
      heading: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      heading: 'ACADEMIC MANAGEMENT',
      items: [
        { label: 'Students', path: '/students', icon: Users },
        { label: 'Subjects', path: '/subjects', icon: BookOpen },
        { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
      ],
    },
    {
      heading: 'ANALYTICS',
      items: [
        { label: 'Reports', path: '/reports', icon: FileSpreadsheet },
        { label: 'Attendance Analytics', path: '/analytics', icon: BarChart3 },
      ],
    },
    {
      heading: 'SYSTEM',
      items: [
        { label: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 90,
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside
        style={{
          width: isCollapsed ? '80px' : '260px',
          height: '100vh',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'width var(--transition-normal), transform var(--transition-normal)',
          transform: isOpen ? 'translateX(0)' : undefined,
        }}
        className={`attendify-sidebar ${isOpen ? 'open' : ''}`}
      >
        {/* Brand Header */}
        <div
          style={{
            height: '70px',
            padding: isCollapsed ? '0 1rem' : '0 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              }}
            >
              <GraduationCap size={22} color="#FFFFFF" />
            </div>
            {!isCollapsed && (
              <div>
                <span
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    fontFamily: 'var(--font-display)',
                    color: '#FFFFFF',
                    display: 'block',
                    lineHeight: 1.1,
                  }}
                >
                  ATTENDIFY
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: '#94A3B8',
                    letterSpacing: '0.04em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  Academic Portal
                </span>
              </div>
            )}
          </div>

          {/* Close for mobile */}
          <button
            onClick={onClose}
            className="mobile-close-btn"
            style={{
              display: 'none',
              color: '#94A3B8',
              padding: '4px',
            }}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav
          style={{
            flex: 1,
            padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {navSections.map((sec, idx) => (
            <div key={idx}>
              {!isCollapsed && (
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#64748B',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '0 0.75rem',
                    marginBottom: '0.45rem',
                  }}
                >
                  {sec.heading}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      title={isCollapsed ? item.label : undefined}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        gap: '0.75rem',
                        padding: isCollapsed ? '0.65rem' : '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.88rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#FFFFFF' : '#94A3B8',
                        backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                        transition: 'all var(--transition-fast)',
                        textDecoration: 'none',
                      })}
                    >
                      <Icon size={19} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Desktop Collapse Toggle Footer */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
          }}
        >
          {!isCollapsed && (
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Attendify v1.0
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            style={{
              color: '#94A3B8',
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
