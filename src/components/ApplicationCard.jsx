import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, Edit, Trash2, Building2, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';

function ApplicationCard({ application, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{application.company}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {application.title}
          </h3>
          <div className="flex items-center gap-4 mb-3">
            <StatusBadge status={application.status} />
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              {format(new Date(application.appliedDate), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
      </div>

      {application.notes && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {application.notes}
        </p>
      )}

      <div className="flex items-center gap-2">
        <Link
          to={`/user/app/${application.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          <Eye className="h-4 w-4" />
          View
        </Link>
        <Link
          to={`/user/add?edit=${application.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Link>
        <button
          onClick={() => onDelete(application)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}

export default ApplicationCard;