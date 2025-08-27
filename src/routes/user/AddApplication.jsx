import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { validateApplicationForm } from '../../lib/validators';
import Header from '../../components/Header';
import { ArrowLeft, Save, X } from 'lucide-react';

function AddApplication() {
  const { state, dispatch, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get('edit');
  const fromJobId = searchParams.get('from-job');

  const [formData, setFormData] = useState({
    company: '',
    title: '',
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load application data for editing
  useEffect(() => {
    if (editId) {
      const application = state.applications.find(app => app.id === editId);
      if (application) {
        setFormData({
          company: application.company,
          title: application.title,
          status: application.status,
          appliedDate: application.appliedDate.split('T')[0],
          notes: application.notes || ''
        });
      }
    } else if (fromJobId) {
      // Pre-fill from job posting
      const job = state.jobs.find(job => job.id === fromJobId);
      if (job) {
        setFormData(prev => ({
          ...prev,
          company: job.company,
          title: job.title
        }));
      }
    }
  }, [editId, fromJobId, state.applications, state.jobs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateApplicationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const now = new Date().toISOString();
      const applicationData = {
        ...formData,
        appliedDate: new Date(formData.appliedDate).toISOString(),
        updatedAt: now
      };

      if (editId) {
        // Update existing application
        const existingApp = state.applications.find(app => app.id === editId);
        dispatch({
          type: 'UPDATE_APPLICATION',
          payload: {
            ...applicationData,
            id: editId,
            createdAt: existingApp.createdAt
          }
        });
        showToast('Application updated successfully');
      } else {
        // Create new application
        dispatch({
          type: 'ADD_APPLICATION',
          payload: {
            ...applicationData,
            id: crypto.randomUUID(),
            createdAt: now
          }
        });
        showToast('Application added successfully');
      }

      navigate('/user');
    } catch (error) {
      showToast('Error saving application', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (editId) {
      navigate('/user');
    } else {
      setFormData({
        company: '',
        title: '',
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/user')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {editId ? 'Edit Application' : 'Add New Application'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {editId ? 'Update your application details' : 'Track a new job application'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.company 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter company name"
                />
                {errors.company && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.company}</p>}
              </div>

              {/* Job Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.title 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter job title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Application Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.status 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
                {errors.status && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>}
              </div>

              {/* Application Date */}
              <div>
                <label htmlFor="appliedDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Application Date *
                </label>
                <input
                  type="date"
                  id="appliedDate"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.appliedDate 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                />
                {errors.appliedDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.appliedDate}</p>}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Add any notes about this application (optional)"
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Saving...' : editId ? 'Update Application' : 'Save Application'}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <X className="h-4 w-4" />
                {editId ? 'Cancel' : 'Reset'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddApplication;