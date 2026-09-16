import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, CheckCircle } from 'lucide-react';
import { calculateTaskStatus, getRelativeDueInfo, formatDate, formatDateTime } from '../utils/taskUtils';

const TaskCard = ({ task, onComplete, onDelete }) => {
  const status = calculateTaskStatus(task.dueDate, task.completedAt);
  const relativeInfo = getRelativeDueInfo(task.dueDate, task.completedAt);
  const isCompleted = !!task.completedAt;
  const isOverdue = status === 'Pending';

  return (
    <div className={`glass-card ${isCompleted ? 'completed-card' : ''}`} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)', margin: 0, flex: 1, paddingRight: '1rem', textDecoration: isCompleted ? 'line-through' : 'none', opacity: isCompleted ? 0.7 : 1 }}>
          {task.title}
        </h3>
        {isOverdue && <span className="badge badge-overdue" style={{ animation: 'pulse 2s infinite' }}>Overdue</span>}
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', opacity: isCompleted ? 0.7 : 1 }}>
        {task.description}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Priority</span>
          <span className={`priority-${task.priority.toLowerCase()}`}>{task.priority.toUpperCase()}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Category</span>
          <span style={{ fontWeight: 500 }}>{task.category.toUpperCase()}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Status</span>
          <span className={`badge badge-${status.replace(' ', '-').toLowerCase()}`}>{status}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Due Date</span>
          <span style={{ fontWeight: 500, color: isOverdue ? 'var(--danger)' : 'inherit' }}>
            {formatDate(task.dueDate)}
          </span>
        </div>
      </div>

      <div style={{ padding: '0.75rem', backgroundColor: isCompleted ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center', fontWeight: 500, color: isCompleted ? 'var(--secondary)' : 'var(--text-muted)' }}>
        {relativeInfo}
      </div>
      
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.7 }}>
        Raised: {formatDateTime(task.createdAt)}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <Link to={`/tasks/${task._id}`} className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', display: 'flex', justifyContent: 'center' }} title="View">
          <Eye size={16} />
        </Link>
        <Link to={`/tasks/${task._id}/edit`} className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', display: 'flex', justifyContent: 'center' }} title="Edit">
          <Edit size={16} />
        </Link>
        {!isCompleted && (
          <button onClick={() => onComplete(task._id)} className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', color: 'var(--secondary)', display: 'flex', justifyContent: 'center' }} title="Complete">
            <CheckCircle size={16} />
          </button>
        )}
        <button onClick={() => onDelete(task._id)} className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', color: 'var(--danger)', display: 'flex', justifyContent: 'center' }} title="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
