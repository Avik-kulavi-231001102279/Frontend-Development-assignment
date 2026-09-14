import React from 'react';

const TaskFilters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="task-filters-container">
      <div className="search-group">
        <input
          type="text"
          name="search"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={handleChange}
          className="search-input"
        />
      </div>
      
      <div className="filter-group">
        <select name="priority" value={filters.priority} onChange={handleChange}>
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="All">All Categories</option>
          <option value="Academic">Academic</option>
          <option value="Personal">Personal</option>
        </select>
        
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="All">All Statuses</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Raised">Raised</option>
          <option value="Due Today">Due Today</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
