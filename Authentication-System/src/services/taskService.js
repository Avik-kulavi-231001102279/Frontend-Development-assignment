import { v4 as uuidv4 } from 'uuid';
import { calculateTaskStatus } from '../utils/dateUtils';

const TASKS_KEY = 'tasks';

export const taskService = {
  getAllTasks() {
    const tasks = localStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  },

  getUserTasks(userId) {
    let tasks = this.getAllTasks();
    let hasChanges = false;

    // Dynamically update statuses for active tasks based on current date
    tasks = tasks.map(task => {
      if (task.userId === userId) {
        const newStatus = calculateTaskStatus(task.dueDate, task.status === 'Completed');
        if (task.status !== newStatus) {
          hasChanges = true;
          return { ...task, status: newStatus };
        }
      }
      return task;
    });

    if (hasChanges) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }

    return tasks.filter(task => task.userId === userId);
  },

  saveTask(task) {
    const tasks = this.getAllTasks();
    const existingIndex = tasks.findIndex(t => t.id === task.id);
    
    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }
    
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return task;
  },

  createTask(taskData, userId) {
    const newTask = {
      id: uuidv4(),
      userId,
      raisedAt: new Date().toISOString(),
      completedAt: null,
      ...taskData,
      status: calculateTaskStatus(taskData.dueDate, false)
    };
    
    return this.saveTask(newTask);
  },

  updateTask(id, updates) {
    const tasks = this.getAllTasks();
    const existingIndex = tasks.findIndex(t => t.id === id);
    
    if (existingIndex === -1) {
      throw new Error('Task not found');
    }
    
    const existingTask = tasks[existingIndex];
    const updatedTask = { ...existingTask, ...updates };
    
    // Recalculate status in case dueDate was updated
    updatedTask.status = calculateTaskStatus(updatedTask.dueDate, updatedTask.status === 'Completed');
    
    tasks[existingIndex] = updatedTask;
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return updatedTask;
  },

  completeTask(id) {
    const tasks = this.getAllTasks();
    const existingIndex = tasks.findIndex(t => t.id === id);
    if (existingIndex === -1) throw new Error('Task not found');
    
    tasks[existingIndex].status = 'Completed';
    tasks[existingIndex].completedAt = new Date().toISOString();
    
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return tasks[existingIndex];
  },

  deleteTask(id) {
    const tasks = this.getAllTasks();
    const filteredTasks = tasks.filter(t => t.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
  }
};
