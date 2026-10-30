import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ message = 'Loading...', size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
      <Loader2
        className={`${sizeClasses[size] || sizeClasses.md} text-indigo-600 dark:text-indigo-400 animate-spin`}
      />
      {message && (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
