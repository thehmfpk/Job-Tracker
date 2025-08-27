import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { validateEmail, validatePassword, validateRequired } from '../lib/validators';
import { loadFromStorage, saveToStorage } from '../lib/storage';
import { Briefcase, Eye, EyeOff, User, Building } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    companyName: ''
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
    
    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }
    
    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.role === 'company' && !validateRequired(formData.companyName)) {
      newErrors.companyName = 'Company name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Check if user already exists
    const users = loadFromStorage('jat_users') || [];
    if (users.find(u => u.email === formData.email)) {
      setErrors({ email: 'User with this email already exists' });
      return;
    }

    // Save new user
    const newUser = {
      id: crypto.randomUUID(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      ...(formData.role === 'company' && { companyName: formData.companyName }),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveToStorage('jat_users', users);

    // Login the user
    dispatch({
      type: 'LOGIN',
      payload: {
        user: { 
          name: newUser.name, 
          email: newUser.email,
          ...(newUser.companyName && { companyName: newUser.companyName })
        },
        role: newUser.role
      }
    });

    showToast(`Welcome to JobTracker, ${newUser.name}!`);
    navigate(newUser.role === 'user' ? '/user' : '/company');
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Join thousands of job seekers and companies</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    formData.role === 'user'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Job Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'company' }))}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    formData.role === 'company'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Building className="h-5 w-5" />
                  <span className="font-medium">Company</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {formData.role === 'company' ? 'Contact Name' : 'Full Name'}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.name 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Enter your name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            {formData.role === 'company' && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.companyName 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter company name"
                />
                {errors.companyName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyName}</p>}
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
                  placeholder="Enter your password (min 6 characters)"
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
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;