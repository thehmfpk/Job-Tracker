import React from 'react';
import { format } from 'date-fns';
import { Building2, MapPin, Calendar, Plus } from 'lucide-react';

function JobCard({ job, onAddApplication }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{job.company}</span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {job.title}
          </h3>
          
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(job.postedDate), 'MMM d, yyyy')}
            </div>
          </div>
          
          {job.salaryRange && (
            <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
              {job.salaryRange}
            </p>
          )}
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {job.description}
          </p>
          
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {job.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                >
                  {tag}
                </span>
              ))}
              {job.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md">
                  +{job.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => onAddApplication(job)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
      >
        <Plus className="h-4 w-4" />
        Apply Now
      </button>
    </div>
  );
}

export default JobCard;