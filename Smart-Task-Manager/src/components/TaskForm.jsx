import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskForm = ({ initialData, onSubmit, isEditing = false, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Personal',
    dueDate: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'Medium',
        category: initialData.category || 'Personal',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div className="form-group">
        <label className="form-label">Task Title</label>
        <input 
          type="text" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          className="form-input" 
          required 
          placeholder="Enter task title"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Task Description</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          className="form-input" 
          required 
          rows="4"
          placeholder="Enter task description"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className="form-input">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="form-input">
            <option value="Academic">Academic</option>
            <option value="Personal">Personal</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input 
            type="date" 
            name="dueDate" 
            value={formData.dueDate} 
            onChange={handleChange} 
            className="form-input" 
            required 
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          {isEditing ? 'Update Task' : 'Create Task'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-outline" style={{ flex: 1 }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
