import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { TaskContext } from '../context/TaskContext';
import { ToastContext } from '../context/ToastContext';
import TaskCard from '../components/TaskCard';
import { Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tasks = () => {
  const { tasks, fetchTasks, loading, updateTaskStatus, deleteTask } = useContext(TaskContext);
  const { showToast } = useContext(ToastContext);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: ''
  });

  // Debounce search using vanilla JS (replaces lodash debounce)
  const debounceTimerRef = useRef(null);
  const debouncedFetch = useCallback(
    (currentFilters) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        const queryParams = new URLSearchParams();
        if (currentFilters.search) queryParams.append('search', currentFilters.search);
        if (currentFilters.status) queryParams.append('status', currentFilters.status);
        if (currentFilters.priority) queryParams.append('priority', currentFilters.priority);
        if (currentFilters.category) queryParams.append('category', currentFilters.category);
        
        fetchTasks(`?${queryParams.toString()}`);
      }, 500);
    },
    [fetchTasks]
  );

  useEffect(() => {
    debouncedFetch(filters);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters, debouncedFetch]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleComplete = async (id) => {
    try {
      await updateTaskStatus(id, 'Completed');
      showToast('Task marked as completed', 'success');
      // Refetch to apply filters correctly if needed
      debouncedFetch(filters); 
    } catch (err) {
      showToast('Failed to complete task', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        showToast('Task deleted successfully', 'success');
      } catch (err) {
        showToast('Failed to delete task', 'error');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>My Tasks</h1>
        <Link to="/tasks/add" className="btn btn-primary">
          <Plus size={18} /> <span className="hidden sm:inline">Add Task</span>
        </Link>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          
          <div style={{ flex: '1 1 250px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              name="search"
              placeholder="Search tasks..." 
              value={filters.search}
              onChange={handleFilterChange}
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: '1 1 auto' }}>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="form-input" style={{ width: 'auto', flex: 1 }}>
              <option value="">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Raised">Raised</option>
              <option value="Due Today">Due Today</option>
              <option value="Pending">Pending (Overdue)</option>
              <option value="Completed">Completed</option>
            </select>

            <select name="priority" value={filters.priority} onChange={handleFilterChange} className="form-input" style={{ width: 'auto', flex: 1 }}>
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select name="category" value={filters.category} onChange={handleFilterChange} className="form-input" style={{ width: 'auto', flex: 1 }}>
              <option value="">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner"></div></div>
      ) : tasks.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Filter size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No tasks found</h3>
          <p>Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {tasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onComplete={handleComplete} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
