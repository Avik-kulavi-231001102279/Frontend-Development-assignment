import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useNotification } from '../context/NotificationContext';
import { FiTrash2, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import '../styles/tasks.css';

const CompletedTasks = () => {
  const { tasks, deleteTask } = useTasks();
  const { showNotification } = useNotification();
  
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this completed task?')) {
      deleteTask(id);
      showNotification('Completed task deleted', 'success');
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2 className="page-title">Completed Tasks</h2>
      </div>

      <div className="completed-tasks-list">
        {completedTasks.length > 0 ? (
          <div className="tasks-table-container">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Original Due Date</th>
                  <th>Raised Date</th>
                  <th>Completed Date & Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.map(task => (
                  <tr key={task.id}>
                    <td style={{ fontWeight: 500 }}>{task.header}</td>
                    <td><span className={`badge category-${task.category.toLowerCase()}`}>{task.category}</span></td>
                    <td><span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span></td>
                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td>{new Date(task.raisedAt).toLocaleDateString()}</td>
                    <td style={{ color: 'var(--success-color)', fontWeight: 500 }}>
                      {task.completedAt ? new Date(task.completedAt).toLocaleString() : 'N/A'}
                    </td>
                    <td>
                      <div className="task-actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
                        <Link to={`/tasks/${task.id}`} className="action-btn edit-btn" title="View">
                          <FiEye />
                        </Link>
                        <button 
                          className="action-btn delete-btn" 
                          onClick={() => handleDelete(task.id)}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No completed tasks yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTasks;
