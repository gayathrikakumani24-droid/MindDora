import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors border border-slate-200/50 dark:border-slate-800/50 shadow-sm"
      aria-label="Toggle Theme Mode"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 animate-pulse" />
      ) : (
        <Sun className="h-5 w-5 animate-spin-slow" />
      )}
    </button>
  );
};

export default ThemeToggle;
