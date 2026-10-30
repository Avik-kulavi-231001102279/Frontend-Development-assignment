import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, toggleTheme } from '../../features/preferences/preferenceSlice';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ className = '' }) => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={`relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all active:scale-90 cursor-pointer shadow-sm ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-90 duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 animate-in spin-in-90 duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
