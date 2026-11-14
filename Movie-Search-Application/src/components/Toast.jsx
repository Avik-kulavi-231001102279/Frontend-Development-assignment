import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { CheckCircle2, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useFavorites();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-fade-in ${
              isSuccess
                ? 'bg-cinema-900/95 dark:bg-cinema-900/95 border-emerald-500/40 text-slate-100'
                : 'bg-cinema-900/95 dark:bg-cinema-900/95 border-cinema-red/40 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Info className="w-5 h-5 text-cinema-red shrink-0" />
              )}
              <p className="text-sm font-medium truncate">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

