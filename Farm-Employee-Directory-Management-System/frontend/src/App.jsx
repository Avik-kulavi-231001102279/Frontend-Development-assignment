import React, { useState, useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import Notification from './components/Notification';
import { Moon, Sun, PlusCircle, Search, Users } from 'lucide-react';
import './App.css';

const DEPARTMENTS = ['Agriculture', 'Livestock', 'Administration', 'Maintenance'];

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Employee management state
  const [showForm, setShowForm] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);

  // Search and Filter state
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [department, setDepartment] = useState('');

  // Notification state
  const [notification, setNotification] = useState({ message: '', isError: false });

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
  };

  const handleAddClick = () => {
    setEmployeeToEdit(null);
    setShowForm(true);
  };

  const handleEditOrDelete = (employee, action) => {
    if (action === 'edit') {
      setEmployeeToEdit(employee);
      setShowForm(true);
    } else if (action === 'delete') {
      showNotification('Employee deleted successfully.');
      setRefreshKey((prev) => prev + 1);
    } else if (action === 'error') {
      showNotification('Error deleting employee.', true);
    }
  };

  const handleFormSuccess = (message, isError = false) => {
    showNotification(message, isError);
    if (!isError) {
      setShowForm(false);
      setEmployeeToEdit(null);
      setRefreshKey((prev) => prev + 1);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEmployeeToEdit(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value === '') {
      setSearch('');
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🌾</span>
          <h1>Farm Employee Directory</h1>
        </div>
        <div className="navbar-actions">
          <div className="employee-count">
            <Users size={18} />
            <span>Total: <strong>{employeeCount}</strong></span>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-container">
        {/* Toolbar: Search, Filter, Add Button */}
        <div className="toolbar">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name or Employee ID..."
                value={searchInput}
                onChange={handleSearchChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <div className="filter-actions">
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <button className="btn btn-primary add-btn" onClick={handleAddClick}>
              <PlusCircle size={18} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Employee List */}
        <EmployeeList
          onEdit={handleEditOrDelete}
          refreshKey={refreshKey}
          search={search}
          department={department}
          onCountUpdate={setEmployeeCount}
        />
      </main>

      {/* Add/Edit Employee Modal (Conditional Rendering) */}
      {showForm && (
        <EmployeeForm
          employeeToEdit={employeeToEdit}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Notification (Conditional Rendering) */}
      {notification.message && (
        <Notification
          message={notification.message}
          isError={notification.isError}
          onClose={() => setNotification({ message: '', isError: false })}
        />
      )}
    </div>
  );
}

export default App;
