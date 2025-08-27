import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { validateEmail, validateRequired } from '../lib/validators';
import { loadFromStorage } from '../lib/storage';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch, showToast } = useApp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Check against stored users
    const users = loadFromStorage('jat_users') || [];
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    
    if (user) {
      dispatch({
        type: 'LOGIN',
        payload: {
          user: { name: user.name, email: user.email, companyName: user.companyName },
          role: user.role
        }
      });
      showToast(`Welcome back, ${user.name}!`);
      navigate(user.role === 'user' ? '/user' : '/company');
    } else {
      setErrors({ general: 'Invalid email or password' });
    }
  };

  const handleDemoLogin = (role) => {
    const demoUser = {
      name: 'Hafiz Faizan',
      email: role === 'user' ? 'demo-user@example.com' : 'demo-company@example.com',
      role: role,
      ...(role === 'company' && { companyName: 'Demo Company' })
    };

    dispatch({
      type: 'LOGIN',
      payload: {
        user: demoUser,
        role: role
      }
    });
    showToast(`Welcome, ${demoUser.name}! (Demo ${role})`);
    navigate(role === 'user' ? '/user' : '/company');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            <Briefcase className="h-8 w-8" />
            <span className="text-2xl font-bold">JobTracker</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                    errors.password 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Try Demo Login</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('user')}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Demo User
              </button>
              <button
                onClick={() => handleDemoLogin('company')}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Demo Company
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;