import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle
};

const styles = {
  success: 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
};

function Toast() {
  const { state, dispatch } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (state.toast) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          dispatch({ type: 'HIDE_TOAST' });
        }, 300);
      }, 2700);

      return () => clearTimeout(timer);
    }
  }, [state.toast, dispatch]);

  if (!state.toast) return null;

  const Icon = icons[state.toast.type] || icons.success;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] ${
        styles[state.toast.type] || styles.success
      }`}>
        <Icon className="h-5 w-5 flex-shrink-0" />
        <p className="font-medium flex-1">{state.toast.message}</p>
        <button
          onClick={() => dispatch({ type: 'HIDE_TOAST' })}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default Toast;