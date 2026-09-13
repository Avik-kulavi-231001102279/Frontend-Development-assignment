import React, { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { ToastContext } from '../context/ToastContext';
import TaskCard from '../components/TaskCard';
import { Search, CheckSquare } from 'lucide-react';

const CompletedTasks = () => {
  const { tasks, fetchTasks, loading, deleteTask, updateTaskStatus } = useContext(TaskContext);
  const { showToast } = useContext(ToastContext);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTasks('?status=Completed');
  }, [fetchTasks]);

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

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(search.toLowerCase()) || 
    task.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckSquare size={32} color="var(--secondary)" /> Completed Tasks
        </h1>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search completed tasks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner"></div></div>
      ) : filteredTasks.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No completed tasks yet.</h3>
          <p>Get to work and start completing those tasks!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredTasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onComplete={() => {}} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
