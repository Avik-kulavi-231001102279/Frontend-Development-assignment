import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import Modal from './Modal';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
            isDanger
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
              : 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
          }`}
        >
          {isDanger ? (
            <Trash2 className="w-7 h-7" />
          ) : (
            <AlertTriangle className="w-7 h-7" />
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
            className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-white transition-all shadow-md ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

