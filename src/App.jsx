import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Landing from './routes/Landing';
import Login from './routes/Login';
import Signup from './routes/Signup';
import UserDashboard from './routes/user/UserDashboard';
import AddApplication from './routes/user/AddApplication';
import ApplicationDetails from './routes/user/ApplicationDetails';
import CompanyDashboard from './routes/company/CompanyDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/user" element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/user/add" element={
              <ProtectedRoute role="user">
                <AddApplication />
              </ProtectedRoute>
            } />
            <Route path="/user/app/:id" element={
              <ProtectedRoute role="user">
                <ApplicationDetails />
              </ProtectedRoute>
            } />
            
            <Route path="/company" element={
              <ProtectedRoute role="company">
                <CompanyDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toast />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;