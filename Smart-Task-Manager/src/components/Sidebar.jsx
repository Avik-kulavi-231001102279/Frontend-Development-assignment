import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, PlusCircle, CheckSquare, X } from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
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
      </nav>
    </aside>
  );
};

export default Sidebar;
