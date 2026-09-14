import React, { useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { FiCheckCircle, FiClock, FiAlertCircle, FiList, FiCalendar, FiSun } from 'react-icons/fi';
import '../styles/dashboard.css';

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className={`stat-card ${colorClass}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-details">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { tasks } = useTasks();

  const stats = useMemo(() => {
    const total = tasks.length;
    const upcoming = tasks.filter(t => t.status === 'Upcoming').length;
    const raised = tasks.filter(t => t.status === 'Raised').length;
    const dueToday = tasks.filter(t => t.status === 'Due Today').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const academic = tasks.filter(t => t.category === 'Academic').length;
    const personal = tasks.filter(t => t.category === 'Personal').length;

    return { total, upcoming, raised, dueToday, pending, completed, academic, personal };
  }, [tasks]);

  return (
    <div className="dashboard-container">
      <h2 className="page-title">Overview</h2>
      
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard 
          title="Total Tasks" 
          value={stats.total} 
          icon={<FiList />} 
          colorClass="primary" 
        />
        <StatCard 
          title="Upcoming" 
          value={stats.upcoming} 
          icon={<FiCalendar />} 
          colorClass="info" 
        />
        <StatCard 
          title="Due Soon" 
          value={stats.raised} 
          icon={<FiClock />} 
          colorClass="info" 
        />
        <StatCard 
          title="Due Today" 
          value={stats.dueToday} 
          icon={<FiSun />} 
          colorClass="warning" 
        />
        <StatCard 
          title="Overdue" 
          value={stats.pending} 
          icon={<FiAlertCircle />} 
          colorClass="danger" 
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          icon={<FiCheckCircle />} 
          colorClass="success" 
        />
      </div>

      <div className="dashboard-row">
        <div className="dashboard-card">
          <h3>Status Breakdown</h3>
          <div className="progress-bar-container">
            <div className="progress-label"><span>Upcoming</span> <span>{stats.upcoming}</span></div>
            <div className="progress-bg"><div className="progress-fill primary" style={{width: stats.total ? `${(stats.upcoming/stats.total)*100}%` : '0%'}}></div></div>

            <div className="progress-label mt-2"><span>Due Soon (Raised)</span> <span>{stats.raised}</span></div>
            <div className="progress-bg"><div className="progress-fill info" style={{width: stats.total ? `${(stats.raised/stats.total)*100}%` : '0%'}}></div></div>
            
            <div className="progress-label mt-2"><span>Due Today</span> <span>{stats.dueToday}</span></div>
            <div className="progress-bg"><div className="progress-fill warning" style={{width: stats.total ? `${(stats.dueToday/stats.total)*100}%` : '0%'}}></div></div>
            
            <div className="progress-label mt-2"><span>Overdue</span> <span>{stats.pending}</span></div>
            <div className="progress-bg"><div className="progress-fill danger" style={{width: stats.total ? `${(stats.pending/stats.total)*100}%` : '0%'}}></div></div>
            
            <div className="progress-label mt-2"><span>Completed</span> <span>{stats.completed}</span></div>
            <div className="progress-bg"><div className="progress-fill success" style={{width: stats.total ? `${(stats.completed/stats.total)*100}%` : '0%'}}></div></div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Category Breakdown</h3>
          <div className="category-stats">
            <div className="category-stat">
              <div className="cat-color academic"></div>
              <span>Academic</span>
              <strong>{stats.academic}</strong>
            </div>
            <div className="category-stat">
              <div className="cat-color personal"></div>
              <span>Personal</span>
              <strong>{stats.personal}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
