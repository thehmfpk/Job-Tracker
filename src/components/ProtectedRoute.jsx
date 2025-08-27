import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function ProtectedRoute({ children, role }) {
  const { state } = useApp();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && state.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;