import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <AlertCircle size={24} />
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
