import React from 'react';

const statusConfig = {
  'Applied': {
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-800 dark:text-gray-300',
    dot: 'bg-gray-500'
  },
  'Interviewing': {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-300',
    dot: 'bg-blue-500'
  },
  'Offer': {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-300',
    dot: 'bg-green-500'
  },
  'Rejected': {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-300',
    dot: 'bg-red-500'
  }
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig['Applied'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status}
    </span>
  );
}

export default StatusBadge;