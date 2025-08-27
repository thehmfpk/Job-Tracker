import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../lib/storage';
import { seedJobs, seedApplications } from '../lib/seeds';

const AppContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  role: null,
  applications: [],
  jobs: [],
  theme: 'light',
  toast: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        ...action.payload
      };
    
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        role: action.payload.role
      };
    
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        role: null
      };
    
    case 'ADD_APPLICATION':
      return {
        ...state,
        applications: [...state.applications, action.payload]
      };
    
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(app =>
          app.id === action.payload.id ? action.payload : app
        )
      };
    
    case 'DELETE_APPLICATION':
      return {
        ...state,
        applications: state.applications.filter(app => app.id !== action.payload)
      };
    
    case 'SET_APPLICATIONS':
      return {
        ...state,
        applications: action.payload
      };
    
    case 'ADD_JOB':
      return {
        ...state,
        jobs: [...state.jobs, action.payload]
      };
    
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job =>
          job.id === action.payload.id ? action.payload : job
        )
      };
    
    case 'DELETE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.payload)
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    
    case 'SHOW_TOAST':
      return {
        ...state,
        toast: action.payload
      };
    
    case 'HIDE_TOAST':
      return {
        ...state,
        toast: null
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const auth = loadFromStorage('jat_auth');
    const applications = loadFromStorage('jat_applications') || [];
    const jobs = loadFromStorage('jat_jobs') || seedJobs;
    const theme = loadFromStorage('jat_theme') || 'light';

    // Seed applications for demo if none exist
    const finalApplications = applications.length === 0 ? seedApplications : applications;

    dispatch({
      type: 'HYDRATE',
      payload: {
        isAuthenticated: auth?.isAuthenticated || false,
        user: auth?.user || null,
        role: auth?.role || null,
        applications: finalApplications,
        jobs,
        theme
      }
    });

    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Persist to localStorage on state changes
  useEffect(() => {
    if (state.isAuthenticated) {
      saveToStorage('jat_auth', {
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        role: state.role
      });
    }
  }, [state.isAuthenticated, state.user, state.role]);

  useEffect(() => {
    saveToStorage('jat_applications', state.applications);
  }, [state.applications]);

  useEffect(() => {
    saveToStorage('jat_jobs', state.jobs);
  }, [state.jobs]);

  useEffect(() => {
    saveToStorage('jat_theme', state.theme);
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const showToast = (message, type = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
    setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 3000);
  };

  return (
    <AppContext.Provider value={{ state, dispatch, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}