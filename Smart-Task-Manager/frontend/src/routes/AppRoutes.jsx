import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import AddTask from '../pages/AddTask';
import TaskDetails from '../pages/TaskDetails';
import EditTask from '../pages/EditTask';
import CompletedTasks from '../pages/CompletedTasks';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes with Layout */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="tasks">
          <Route index element={<Tasks />} />
          <Route path="add" element={<AddTask />} />
          <Route path="completed" element={<CompletedTasks />} />
          <Route path=":id" element={<TaskDetails />} />
          <Route path=":id/edit" element={<EditTask />} />
        </Route>
        
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
