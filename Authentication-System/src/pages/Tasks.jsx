import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useNotification } from '../context/NotificationContext';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import '../styles/tasks.css';

const Tasks = () => {
  const { tasks, deleteTask, completeTask } = useTasks();
  const { showNotification } = useNotification();
  
  const [filters, setFilters] = useState({
    search: '',
    priority: 'All',
    category: 'All',
    category: 'All',
    status: 'All'
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
      showNotification('Task deleted successfully', 'success');
    }
  };

  const handleComplete = (id) => {
    completeTask(id);
    showNotification('Task marked as completed', 'success');
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Exclude completed tasks from active tasks view
    result = result.filter(t => t.status !== 'Completed');

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        t => t.header.toLowerCase().includes(searchLower) || 
             t.description.toLowerCase().includes(searchLower)
      );
    }

    // Dropdown filters
    if (filters.priority !== 'All') {
      result = result.filter(t => t.priority === filters.priority);
    }
    if (filters.category !== 'All') {
      result = result.filter(t => t.category === filters.category);
    }
    if (filters.status !== 'All') {
      result = result.filter(t => t.status === filters.status);
    }

    // Default sort by due date instead of arbitrary sort state
    result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return result;
  }, [tasks, filters]);

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2 className="page-title">My Tasks</h2>
        <Link to="/tasks/add" className="btn-primary">Add New Task</Link>
      </div>

      <TaskFilters filters={filters} onFilterChange={setFilters} />

      <div className="tasks-list">
        {filteredAndSortedTasks.length > 0 ? (
          filteredAndSortedTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>{tasks.length === 0 ? "No tasks found. Create your first task!" : "No matching tasks found."}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
