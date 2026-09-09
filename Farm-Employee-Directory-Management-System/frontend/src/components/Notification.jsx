import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const Notification = ({ message, isError, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`notification ${isError ? 'notification-error' : 'notification-success'}`}>
      {isError ? <XCircle size={20} /> : <CheckCircle size={20} />}
      <span>{message}</span>
    </div>
  );
};

export default Notification;
