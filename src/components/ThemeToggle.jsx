import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

function ThemeToggle() {
  const { state, dispatch } = useApp();

  const toggleTheme = () => {
    dispatch({
      type: 'SET_THEME',
      payload: state.theme === 'light' ? 'dark' : 'light'
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {state.theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}

export default ThemeToggle;