import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiList, FiPlusSquare, FiCheckSquare, FiLogOut, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import '../styles/layout.css';

const Layout = ({ children }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <>{children}</>; // No layout for unauthenticated pages
  }

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-logo">Smart Task Manager</div>
        <div className="mobile-actions">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
          <button onClick={() => setSidebarOpen(true)} className="menu-btn">
            <FiMenu />
          </button>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Task Manager</h2>
          <button onClick={() => setSidebarOpen(false)} className="close-btn">
            <FiX />
          </button>
        </div>

        <div className="user-profile">
          <div className="avatar">{currentUser?.fullName?.charAt(0) || 'U'}</div>
          <div className="user-info">
            <p className="user-name">{currentUser?.fullName}</p>
            <p className="user-email">@{currentUser?.username}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" onClick={() => setSidebarOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
            <FiHome /> Dashboard
          </NavLink>
          <NavLink to="/tasks" end onClick={() => setSidebarOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
            <FiList /> All Tasks
          </NavLink>
          <NavLink to="/tasks/add" onClick={() => setSidebarOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
            <FiPlusSquare /> Add Task
          </NavLink>
          <NavLink to="/tasks/completed" onClick={() => setSidebarOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
            <FiCheckSquare /> Completed
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="theme-toggle desktop-theme-toggle">
            {theme === 'light' ? <><FiMoon /> Dark Mode</> : <><FiSun /> Light Mode</>}
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="desktop-header">
          <h1>Welcome, {currentUser?.fullName?.split(' ')[0]}</h1>
        </header>
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
