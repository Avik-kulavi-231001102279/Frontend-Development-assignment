import React, { useContext, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { parseISO, isBefore, startOfDay } from 'date-fns';
import { ListTodo, CheckCircle, Clock, AlertTriangle, Plus, Calendar, Bell } from 'lucide-react';
import { calculateTaskStatus } from '../utils/taskUtils';
import TaskCard from '../components/TaskCard';
import { ToastContext } from '../context/ToastContext';

const Dashboard = () => {
  const { tasks, fetchTasks, loading, updateTaskStatus, deleteTask } = useContext(TaskContext);
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleComplete = async (id) => {
    try {
      await updateTaskStatus(id, 'Completed');
      showToast('Task marked as completed', 'success');
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

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner"></div></div>;
  }

  const totalTasks = tasks.length;
  const statuses = tasks.map(t => calculateTaskStatus(t.dueDate, t.completedAt));
  
  const completedTasks = statuses.filter(s => s === 'Completed').length;
  const upcomingTasks = statuses.filter(s => s === 'Upcoming').length;
  const dueSoonTasks = statuses.filter(s => s === 'Raised').length;
  const dueTodayTasks = statuses.filter(s => s === 'Due Today').length;
  const overdueTasks = statuses.filter(s => s === 'Pending').length;

  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here's an overview of your tasks today.</p>
        </div>
        <button onClick={() => navigate('/tasks/add')} className="btn btn-primary hidden sm:inline-flex">
          <Plus size={18} /> Quick Add Task
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatsCard title="Total Tasks" value={totalTasks} icon={<ListTodo size={24} />} color="var(--primary)" />
        <StatsCard title="Upcoming" value={upcomingTasks} icon={<Calendar size={24} />} color="var(--primary)" />
        <StatsCard title="Due Soon" value={dueSoonTasks} icon={<Clock size={24} />} color="var(--warning)" />
        <StatsCard title="Due Today" value={dueTodayTasks} icon={<Bell size={24} />} color="var(--warning)" />
        <StatsCard title="Overdue" value={overdueTasks} icon={<AlertTriangle size={24} />} color="var(--danger)" />
        <StatsCard title="Completed" value={completedTasks} icon={<CheckCircle size={24} />} color="var(--secondary)" />
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Tasks</h2>
      
      {recentTasks.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '1rem' }}>No tasks found. Create your first task to get started.</p>
          <Link to="/tasks/add" className="btn btn-primary">
            <Plus size={18} /> Add Task
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {recentTasks.map(task => (
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

const StatsCard = ({ title, value, icon, color }) => (
  <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', backgroundColor: `${color}20`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{title}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{value}</p>
    </div>
  </div>
);

export default Dashboard;
