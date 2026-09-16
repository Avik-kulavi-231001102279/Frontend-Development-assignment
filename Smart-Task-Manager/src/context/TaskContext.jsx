import React, { createContext, useState, useCallback } from 'react';

export const TaskContext = createContext();

const STORAGE_KEY = 'tasks';

// Helper: read tasks from LocalStorage
const readTasks = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Helper: write tasks to LocalStorage
const writeTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (queryParams = '') => {
    setLoading(true);
    setError(null);
    try {
      let allTasks = readTasks();

      // Parse query params for filtering
      const params = new URLSearchParams(queryParams.replace(/^\?/, ''));
      const status = params.get('status');
      const priority = params.get('priority');
      const category = params.get('category');
      const search = params.get('search');

      // Filter by priority
      if (priority) {
        allTasks = allTasks.filter((t) => t.priority === priority);
      }

      // Filter by category
      if (category) {
        allTasks = allTasks.filter((t) => t.category === category);
      }

      // Filter by status (replicating backend logic)
      if (status) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (status === 'Completed' || status === 'Closed') {
          allTasks = allTasks.filter((t) => t.completedAt != null);
        } else {
          // Only non-completed tasks
          allTasks = allTasks.filter((t) => t.completedAt == null);

          if (status === 'Upcoming') {
            const in5Days = new Date(today);
            in5Days.setDate(in5Days.getDate() + 5);
            allTasks = allTasks.filter((t) => new Date(t.dueDate) > in5Days);
          } else if (status === 'Raised') {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const in5Days = new Date(today);
            in5Days.setDate(in5Days.getDate() + 5);
            allTasks = allTasks.filter((t) => {
              const due = new Date(t.dueDate);
              return due >= tomorrow && due <= in5Days;
            });
          } else if (status === 'Due Today') {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            allTasks = allTasks.filter((t) => {
              const due = new Date(t.dueDate);
              return due >= today && due < tomorrow;
            });
          } else if (status === 'Pending') {
            allTasks = allTasks.filter((t) => new Date(t.dueDate) < today);
          }
        }
      }

      // Search by title or description
      if (search) {
        const searchLower = search.toLowerCase();
        allTasks = allTasks.filter(
          (t) =>
            t.title.toLowerCase().includes(searchLower) ||
            t.description.toLowerCase().includes(searchLower)
        );
      }

      // Sort by createdAt descending (newest first)
      allTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setTasks(allTasks);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const getTask = async (id) => {
    const allTasks = readTasks();
    const task = allTasks.find((t) => t._id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  };

  const addTask = async (taskData) => {
    const now = new Date().toISOString();
    const newTask = {
      _id: crypto.randomUUID(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      category: taskData.category,
      dueDate: taskData.dueDate,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    const allTasks = readTasks();
    allTasks.unshift(newTask);
    writeTasks(allTasks);

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = async (id, taskData) => {
    const allTasks = readTasks();
    const index = allTasks.findIndex((t) => t._id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }

    const updatedTask = {
      ...allTasks[index],
      title: taskData.title !== undefined ? taskData.title : allTasks[index].title,
      description: taskData.description !== undefined ? taskData.description : allTasks[index].description,
      priority: taskData.priority !== undefined ? taskData.priority : allTasks[index].priority,
      category: taskData.category !== undefined ? taskData.category : allTasks[index].category,
      dueDate: taskData.dueDate !== undefined ? taskData.dueDate : allTasks[index].dueDate,
      updatedAt: new Date().toISOString(),
    };

    allTasks[index] = updatedTask;
    writeTasks(allTasks);

    setTasks((prev) => prev.map((t) => (t._id === id ? updatedTask : t)));
    return updatedTask;
  };

  const updateTaskStatus = async (id, status) => {
    const allTasks = readTasks();
    const index = allTasks.findIndex((t) => t._id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }

    if (status === 'Completed' || status === 'Closed') {
      allTasks[index].completedAt = new Date().toISOString();
    }
    allTasks[index].updatedAt = new Date().toISOString();

    writeTasks(allTasks);

    const updatedTask = allTasks[index];
    setTasks((prev) => prev.map((t) => (t._id === id ? updatedTask : t)));
    return updatedTask;
  };

  const deleteTask = async (id) => {
    const allTasks = readTasks();
    const filtered = allTasks.filter((t) => t._id !== id);
    writeTasks(filtered);

    setTasks((prev) => prev.filter((t) => t._id !== id));
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
