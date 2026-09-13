import React, { createContext, useState, useCallback } from 'react';
import api from '../services/api';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (queryParams = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tasks${queryParams}`);
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const getTask = async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      setTasks((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      setTasks((prev) => prev.map((t) => (t._id === id ? response.data : t)));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const response = await api.patch(`/tasks/${id}/status`, { status });
      setTasks((prev) => prev.map((t) => (t._id === id ? response.data : t)));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        getTask,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
