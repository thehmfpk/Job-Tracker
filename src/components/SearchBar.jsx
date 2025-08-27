import React from 'react';
import { Search } from 'lucide-react';

function SearchBar({ onSearch, searchTerm, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        value={searchTerm || ''}
        onChange={(e) => onSearch && onSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
    </div>
  );
}

export default SearchBar;