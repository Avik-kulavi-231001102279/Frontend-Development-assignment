import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { ToastContext } from '../context/ToastContext';
import TaskForm from '../components/TaskForm';
import { ArrowLeft } from 'lucide-react';

const AddTask = () => {
  const { addTask } = useContext(TaskContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await addTask(formData);
      showToast('Task created successfully', 'success');
      navigate('/tasks');
    } catch (err) {
      showToast(err.message || 'Failed to create task', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Add New Task</h1>
      </div>
      
      <TaskForm onSubmit={handleSubmit} onCancel={() => navigate('/tasks')} />
    </div>
  );
};

export default AddTask;
