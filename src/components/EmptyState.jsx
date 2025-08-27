import React from 'react';

function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  actionText 
}) {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {action && actionText && (
        <button
          onClick={action}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;