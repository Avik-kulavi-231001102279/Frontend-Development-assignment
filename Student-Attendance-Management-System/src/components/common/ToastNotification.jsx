import React from 'react';
import { Toast } from './Toast';

/**
 * Attendify - ToastNotification Component
 * Floating notification alert for success, error, and status notifications
 */
export const ToastNotification = (props) => {
  return <Toast {...props} />;
};

export default ToastNotification;
