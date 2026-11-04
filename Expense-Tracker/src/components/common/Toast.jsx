import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({
  message,
  type = 'success', // 'success' | 'error' | 'info'
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
      iconColor: 'text-emerald-500',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200',
      iconColor: 'text-rose-500',
    },
    info: {
      icon: Info,
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200',
      iconColor: 'text-indigo-500',
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md ${config.bgColor}`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
        <div className="flex-1 text-sm font-medium pr-2">{message}</div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;

