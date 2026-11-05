import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => {
        let Icon = Info;
        let colorClass = 'toast-info';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          colorClass = 'toast-success';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClass = 'toast-error';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClass = 'toast-warning';
        }

        return (
          <div key={toast.id} className={`toast-item ${colorClass}`}>
            <div className="toast-icon">
              <Icon size={18} />
            </div>
            <div className="toast-content">{toast.message}</div>
            <button
              type="button"
              className="toast-close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

