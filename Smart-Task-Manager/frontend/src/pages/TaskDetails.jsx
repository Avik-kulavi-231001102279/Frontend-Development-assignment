import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { ToastContext } from '../context/ToastContext';
import { ArrowLeft, Edit, Trash2, CheckCircle } from 'lucide-react';
import { calculateTaskStatus, getRelativeDueInfo, formatDate, formatDateTime } from '../utils/taskUtils';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTask, updateTaskStatus, deleteTask } = useContext(TaskContext);
  const { showToast } = useContext(ToastContext);
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTask(id);
        setTask(data);
      } catch (err) {
        showToast('Failed to load task details', 'error');
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, getTask, navigate, showToast]);

  const handleComplete = async () => {
    try {
      const updated = await updateTaskStatus(id, 'Completed');
      setTask(updated);
      showToast('Task marked as completed', 'success');
    } catch (err) {
      showToast('Failed to complete task', 'error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        showToast('Task deleted successfully', 'success');
        navigate('/tasks');
      } catch (err) {
        showToast('Failed to delete task', 'error');
      }
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner"></div></div>;
  if (!task) return null;

  const status = calculateTaskStatus(task.dueDate, task.completedAt);
  const relativeInfo = getRelativeDueInfo(task.dueDate, task.completedAt);
  const isCompleted = !!task.completedAt;
  const isOverdue = status === 'Pending';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Task Details</h1>
      </div>

      <div className="glass-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{task.title}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className={`badge badge-${status.replace(' ', '-').toLowerCase()}`}>{status}</span>
            {isOverdue && <span className="badge badge-overdue" style={{ animation: 'pulse 2s infinite' }}>Overdue</span>}
          </div>
        </div>

        <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2.5rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {task.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '3rem', padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '0.75rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Priority</span>
            <span className={`priority-${task.priority.toLowerCase()}`} style={{ fontSize: '1.125rem' }}>{task.priority.toUpperCase()}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Category</span>
            <span style={{ fontWeight: 500, fontSize: '1.125rem' }}>{task.category.toUpperCase()}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Due Date</span>
            <span style={{ fontWeight: 500, fontSize: '1.125rem', color: isOverdue ? 'var(--danger)' : 'inherit' }}>
              {formatDate(task.dueDate)}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Raised On</span>
            <span style={{ fontWeight: 500, fontSize: '1.125rem' }}>
              {formatDateTime(task.createdAt)}
            </span>
          </div>
        </div>

        <div style={{ padding: '1rem', backgroundColor: isCompleted ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', marginBottom: '2.5rem', textAlign: 'center', fontWeight: 500, color: isCompleted ? 'var(--secondary)' : 'var(--text-muted)' }}>
          {relativeInfo}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to={`/tasks/${task._id}/edit`} className="btn btn-primary" style={{ flex: 1, minWidth: '150px', display: 'flex', justifyContent: 'center' }}>
            <Edit size={18} /> Edit Task
          </Link>
          {!isCompleted && (
            <button onClick={handleComplete} className="btn btn-outline" style={{ flex: 1, minWidth: '150px', color: 'var(--secondary)', borderColor: 'var(--secondary)', display: 'flex', justifyContent: 'center' }}>
              <CheckCircle size={18} /> Mark Complete
            </button>
          )}
          <button onClick={handleDelete} className="btn btn-outline" style={{ flex: 1, minWidth: '150px', color: 'var(--danger)', borderColor: 'var(--danger)', display: 'flex', justifyContent: 'center' }}>
            <Trash2 size={18} /> Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
