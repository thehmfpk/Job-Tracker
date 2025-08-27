import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Briefcase, User, LogOut, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';

function Header({ showSearch, onSearch, searchTerm }) {
  const { state, dispatch, showToast } = useApp();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    showToast('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={state.role === 'user' ? '/user' : '/company'} className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">JobTracker</span>
          </Link>

          {/* Desktop Search */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <SearchBar 
                onSearch={onSearch} 
                searchTerm={searchTerm}
                placeholder={state.role === 'user' ? 'Search applications...' : 'Search jobs...'}
              />
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">{state.user?.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{state.user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{state.user?.email}</p>
                    {state.user?.companyName && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{state.user.companyName}</p>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            {showSearch && (
              <div className="mb-4">
                <SearchBar 
                  onSearch={onSearch} 
                  searchTerm={searchTerm}
                  placeholder={state.role === 'user' ? 'Search applications...' : 'Search jobs...'}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{state.user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{state.user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;