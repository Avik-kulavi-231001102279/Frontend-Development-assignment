import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';

// Pages
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import AddTask from '../pages/AddTask';
import TaskDetails from '../pages/TaskDetails';
import EditTask from '../pages/EditTask';
import CompletedTasks from '../pages/CompletedTasks';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* All routes with Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="tasks">
          <Route index element={<Tasks />} />
          <Route path="add" element={<AddTask />} />
          <Route path="completed" element={<CompletedTasks />} />
          <Route path=":id" element={<TaskDetails />} />
          <Route path=":id/edit" element={<EditTask />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
