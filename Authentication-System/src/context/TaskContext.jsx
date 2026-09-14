import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { currentUser } = useAuth();

  const loadTasks = useCallback(() => {
    if (currentUser) {
      const userTasks = taskService.getUserTasks(currentUser.id);
      setTasks(userTasks);
    } else {
      setTasks([]);
    }
  }, [currentUser]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = (taskData) => {
    if (!currentUser) return null;
    const newTask = taskService.createTask(taskData, currentUser.id);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    try {
      const updatedTask = taskService.updateTask(id, updates);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      return { success: true, task: updatedTask };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteTask = (id) => {
    taskService.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completeTask = (id) => {
    try {
      const updatedTask = taskService.completeTask(id);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      return { success: true, task: updatedTask };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    refreshTasks: loadTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
