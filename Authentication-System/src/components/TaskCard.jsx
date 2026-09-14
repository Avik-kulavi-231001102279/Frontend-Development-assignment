import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiCheckCircle, FiEye } from 'react-icons/fi';
import { getHumanReadableDue } from '../utils/dateUtils';

const TaskCard = ({ task, onDelete, onComplete }) => {
  const { id, header, description, priority, category, dueDate, status, raisedAt, completedAt } = task;

  return (
    <div className={`task-card status-${status.toLowerCase().replace(' ', '-')}`}>
      <div className="task-card-header">
        <h3 className="task-title">
          <Link to={`/tasks/${id}`}>{header}</Link>
        </h3>
        <div className="task-badges">
          <span className={`badge priority-${priority.toLowerCase()}`}>{priority}</span>
          <span className={`badge category-${category.toLowerCase()}`}>{category}</span>
          <span className={`badge status-${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
        </div>
      </div>
      
      <p className="task-description">{description}</p>
      
      <div className="task-card-footer">
        <div className="task-dates-info">
          <div className="task-date due-info" style={{ fontWeight: '500', color: status === 'Pending' ? 'var(--error-color)' : (status === 'Completed' ? 'var(--success-color)' : 'var(--text-primary)') }}>
            {getHumanReadableDue(dueDate, status, completedAt)}
          </div>
          <div className="task-date raised-info" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Raised: {new Date(raisedAt).toLocaleDateString()}
          </div>
        </div>
        <div className="task-actions">
          {status !== 'Completed' && (
            <button 
              className="action-btn complete-btn" 
              onClick={() => onComplete(id)}
              title="Mark Completed"
            >
              <FiCheckCircle />
            </button>
          )}
          <Link to={`/tasks/${id}`} className="action-btn edit-btn" title="View/Edit">
            <FiEye />
          </Link>
          <button 
            className="action-btn delete-btn" 
            onClick={() => onDelete(id)}
            title="Delete"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
