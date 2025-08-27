import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { ArrowLeft, Edit, Trash2, Building2, Calendar, FileText } from 'lucide-react';

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch, showToast } = useApp();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const application = state.applications.find(app => app.id === id);

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Application Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The application you're looking for doesn't exist or has been deleted.
            </p>
            <button
              onClick={() => navigate('/user')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    dispatch({ type: 'DELETE_APPLICATION', payload: application.id });
    showToast('Application deleted successfully');
    navigate('/user');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/user')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                    {application.company}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {application.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4">
                  <StatusBadge status={application.status} />
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Applied on {format(new Date(application.appliedDate), 'MMMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Link
                  to={`/user/add?edit=${application.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Application Info */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Application Details
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </h3>
                    <p className="text-gray-900 dark:text-white">{application.company}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Position
                    </h3>
                    <p className="text-gray-900 dark:text-white">{application.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </h3>
                    <StatusBadge status={application.status} />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Application Date
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {format(new Date(application.appliedDate), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                  
                  {application.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notes
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                          {application.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Timeline
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Application Submitted
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(application.appliedDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    {application.createdAt !== application.updatedAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Last Updated
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(application.updatedAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  
                  <div className="space-y-3">
                    <Link
                      to={`/user/add?edit=${application.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Application
                    </Link>
                    
                    <button
                      onClick={() => setShowDeleteDialog(true)}
                      className="w-full flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Application
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        title="Delete Application"
        message={`Are you sure you want to delete your application to ${application.company} for ${application.title}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}

export default ApplicationDetails;