import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useNotification } from '../context/NotificationContext';

const AddTask = () => {
  const [formData, setFormData] = useState({
    header: '',
    description: '',
    priority: 'Medium',
    category: 'Academic',
    dueDate: '' 
  });
  const [error, setError] = useState('');
  
  const { addTask } = useTasks();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.header.trim()) {
      setError('Task Header is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Task Description is required');
      return;
    }
    if (!formData.dueDate) {
      setError('Due Date is required');
      return;
    }

    const newTask = addTask(formData);
    if (newTask) {
      showNotification('Task added successfully', 'success');
      navigate('/tasks');
    } else {
      setError('Failed to create task. Please try again.');
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2 className="page-title">Add New Task</h2>
      </div>

      <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {error && <div className="auth-error global">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Task Header</label>
            <input 
              type="text" 
              name="header" 
              value={formData.header} 
              onChange={handleChange} 
              placeholder="E.g., Complete Assignment 7"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Task details..."
              rows="4"
              style={{
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="dashboard-row" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)'
              }}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)'
              }}>
                <option value="Academic">Academic</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
          </div>

          <div className="dashboard-row" style={{ gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Due Date <span style={{color: 'var(--error-color)'}}>*</span></label>
              <input 
                type="date" 
                name="dueDate" 
                value={formData.dueDate} 
                onChange={handleChange} 
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="auth-btn">Create Task</button>
            <button type="button" className="auth-btn" style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} onClick={() => navigate('/tasks')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
