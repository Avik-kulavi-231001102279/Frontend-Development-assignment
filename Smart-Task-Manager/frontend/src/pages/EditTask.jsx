import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { ToastContext } from '../context/ToastContext';
import TaskForm from '../components/TaskForm';
import { ArrowLeft } from 'lucide-react';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTask, updateTask } = useContext(TaskContext);
  const { showToast } = useContext(ToastContext);
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTask(id);
        setTask(data);
      } catch (err) {
        showToast('Failed to load task for editing', 'error');
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, getTask, navigate, showToast]);

  const handleSubmit = async (formData) => {
    try {
      await updateTask(id, formData);
      showToast('Task updated successfully', 'success');
      navigate(`/tasks/${id}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task', 'error');
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Edit Task</h1>
      </div>
      
      {task && (
        <TaskForm 
          initialData={task} 
          onSubmit={handleSubmit} 
          isEditing={true} 
          onCancel={() => navigate(`/tasks/${id}`)} 
        />
      )}
    </div>
  );
};

export default EditTask;
