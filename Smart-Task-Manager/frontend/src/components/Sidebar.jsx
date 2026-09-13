import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { LayoutDashboard, ListTodo, PlusCircle, CheckSquare, User, LogOut, X } from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { logout } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logout successful', 'success');
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
        <span>TaskFlow</span>
        <button className="btn btn-outline lg:hidden" onClick={closeSidebar} style={{ padding: '0.25rem', border: 'none' }}>
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/tasks" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
          <ListTodo size={20} /> Tasks
        </NavLink>
        <NavLink to="/tasks/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
          <PlusCircle size={20} /> Add Task
        </NavLink>
        <NavLink to="/tasks/completed" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
          <CheckSquare size={20} /> Completed Tasks
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
          <User size={20} /> Profile
        </NavLink>
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
        <button onClick={handleLogout} className="nav-link" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
