import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, updateTask, deleteTask, completeTask } = useTasks();
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const foundTask = tasks.find(t => t.id === id);
    if (foundTask) {
      setTask(foundTask);
      setFormData(foundTask);
    }
  }, [id, tasks]);

  if (!task) {
    return (
      <div className="tasks-container">
        <div className="empty-state">
          <p>Task not found.</p>
          <button className="btn-primary" onClick={() => navigate('/tasks')} style={{marginTop: '1rem', border: 'none', cursor: 'pointer'}}>
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.header.trim() || !formData.description.trim()) {
      setError('Header and description are required.');
      return;
    }
    if (!formData.dueDate) {
      setError('Due Date is required.');
      return;
    }
    
    updateTask(id, formData);
    setIsEditing(false);
    setError('');
    showNotification('Task updated successfully', 'success');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
      showNotification('Task deleted successfully', 'success');
      navigate('/tasks');
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2 className="page-title">{isEditing ? 'Edit Task' : 'Task Details'}</h2>
        <button 
          className="auth-btn" 
          style={{ width: 'auto', backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', margin: 0 }} 
          onClick={() => navigate('/tasks')}
        >
          Back to Tasks
        </button>
      </div>

      <div className="auth-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {error && <div className="auth-error global">{error}</div>}
        
        {!isEditing ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{task.header}</h3>
              <div className="task-badges">
                <span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                <span className={`badge category-${task.category.toLowerCase()}`}>{task.category}</span>
                <span className={`badge status-${task.status.toLowerCase()}`}>{task.status}</span>
              </div>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</h4>
              <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap', marginTop: 0 }}>{task.description}</p>
            </div>
            
            <div className="dashboard-row" style={{ marginBottom: '2rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Raised Date</h4>
                <p style={{ margin: 0 }}>{new Date(task.raisedAt).toLocaleString()}</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Due Date</h4>
                <p style={{ margin: 0 }}>{new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Created By</h4>
                <p style={{ margin: 0 }}>{currentUser.fullName}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <button className="auth-btn" onClick={() => setIsEditing(true)}>Edit</button>
              {task.status !== 'Closed' && (
                <button 
                  className="auth-btn" 
                  style={{ backgroundColor: 'var(--success-color)' }}
                  onClick={() => completeTask(id)}
                >
                  Mark Completed
                </button>
              )}
              <button 
                className="auth-btn" 
                style={{ backgroundColor: 'var(--error-color)' }}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="form-group">
              <label>Task Header</label>
              <input type="text" name="header" value={formData.header} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="6"
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: '8px',
                  border: '1px solid var(--border-color)', backgroundColor: 'transparent',
                  color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical'
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
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="auth-btn">Save Changes</button>
              <button 
                type="button" 
                className="auth-btn" 
                style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} 
                onClick={() => { setIsEditing(false); setFormData(task); setError(''); }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
