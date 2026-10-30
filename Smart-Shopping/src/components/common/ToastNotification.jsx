import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectToasts, removeToast } from '../../features/preferences/preferenceSlice';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastItem = ({ toast }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration || 3500);

    return () => clearTimeout(timer);
  }, [dispatch, toast.id, toast.duration]);

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-50 dark:bg-emerald-950/80',
      text: 'text-emerald-900 dark:text-emerald-200',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    error: {
      icon: AlertCircle,
      border: 'border-rose-500/30',
      bg: 'bg-rose-50 dark:bg-rose-950/80',
      text: 'text-rose-900 dark:text-rose-200',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
    info: {
      icon: Info,
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-50 dark:bg-indigo-950/80',
      text: 'text-indigo-900 dark:text-indigo-200',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
  };

  const config = typeConfig[toast.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 p-4 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 max-w-md w-full ${config.border} ${config.bg} ${config.text}`}
    >
      <Icon className={`w-5 h-5 shrink-0 ${config.iconColor}`} />
      <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-500"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastNotification = () => {
  const toasts = useSelector(selectToasts);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-auto"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastNotification;
