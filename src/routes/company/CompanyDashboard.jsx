import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { validateJobForm } from '../../lib/validators';
import Header from '../../components/Header';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Plus, Briefcase, Edit, Trash2, Building, MapPin, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

function CompanyDashboard() {
  const { state, dispatch, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('post');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingJob, setEditingJob] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    company: state.user?.companyName || '',
    location: '',
    postedDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-time',
    salaryRange: '',
    description: '',
    tags: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter company's jobs
  const companyJobs = useMemo(() => {
    const userEmail = state.user?.email;
    return state.jobs.filter(job => 
      job.createdBy === userEmail &&
      (!searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [state.jobs, state.user?.email, searchTerm]);

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

    const validation = validateJobForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const jobData = {
        ...formData,
        postedDate: new Date(formData.postedDate).toISOString(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        createdBy: state.user?.email
      };

      if (editingJob) {
        dispatch({
          type: 'UPDATE_JOB',
          payload: {
            ...jobData,
            id: editingJob.id,
            createdAt: editingJob.createdAt,
            updatedAt: new Date().toISOString()
          }
        });
        showToast('Job updated successfully');
        setEditingJob(null);
      } else {
        dispatch({
          type: 'ADD_JOB',
          payload: {
            ...jobData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });
        showToast('Job posted successfully');
      }

      resetForm();
    } catch (error) {
      showToast('Error saving job', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: state.user?.companyName || '',
      location: '',
      postedDate: new Date().toISOString().split('T')[0],
      employmentType: 'Full-time',
      salaryRange: '',
      description: '',
      tags: ''
    });
    setErrors({});
    setEditingJob(null);
  };

  const handleEdit = (job) => {
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location || '',
      postedDate: job.postedDate.split('T')[0],
      employmentType: job.employmentType,
      salaryRange: job.salaryRange || '',
      description: job.description,
      tags: job.tags?.join(', ') || ''
    });
    setEditingJob(job);
    setActiveTab('post');
  };

  const handleDelete = (job) => {
    setDeleteDialog(job);
  };

  const confirmDelete = () => {
    if (deleteDialog) {
      dispatch({ type: 'DELETE_JOB', payload: deleteDialog.id });
      showToast('Job deleted successfully');
      setDeleteDialog(null);
    }
  };

  const stats = useMemo(() => {
    const total = companyJobs.length;
    const thisMonth = companyJobs.filter(job => {
      const jobDate = new Date(job.postedDate);
      const now = new Date();
      return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
    }).length;
    
    return { total, thisMonth };
  }, [companyJobs]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        showSearch={activeTab === 'jobs'} 
        onSearch={setSearchTerm} 
        searchTerm={searchTerm}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {state.user?.companyName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your job postings and connect with talented candidates
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Job Posts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.thisMonth}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Posted This Month</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">Live</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">∞</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Views</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('post')}
            className={`flex-1 min-w-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'post'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {editingJob ? 'Edit Job' : 'Post a Job'}
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 min-w-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'jobs'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            My Job Posts
          </button>
        </div>

        {/* Post Job Tab */}
        {activeTab === 'post' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {editingJob ? 'Edit Job Posting' : 'Post a New Job'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {editingJob ? 'Update your job posting details' : 'Create a new job posting to attract top talent'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="e.g. Senior Frontend Developer"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
                </div>

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
                    placeholder="Your company name"
                  />
                  {errors.company && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.company}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g. San Francisco, CA or Remote"
                  />
                </div>

                {/* Employment Type */}
                <div>
                  <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Employment Type *
                  </label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.employmentType 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                  {errors.employmentType && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.employmentType}</p>}
                </div>

                {/* Salary Range */}
                <div>
                  <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    id="salaryRange"
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g. $80k - $120k or $50/hr"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g. React, TypeScript, Node.js, Remote"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add relevant skills and keywords separated by commas
                </p>
              </div>

              {/* Job Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.description 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none`}
                  placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity great..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  {isSubmitting ? 'Saving...' : editingJob ? 'Update Job' : 'Post Job'}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {editingJob ? 'Cancel Edit' : 'Reset Form'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            {companyJobs.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
                <EmptyState
                  icon={Briefcase}
                  title="No job postings yet"
                  description="Start hiring by posting your first job opportunity."
                  action={() => setActiveTab('post')}
                  actionText="Post Your First Job"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {companyJobs.map(job => (
                  <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {job.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {job.company}
                          </div>
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(job.postedDate), 'MMM d, yyyy')}
                          </div>
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-md">
                            {job.employmentType}
                          </span>
                        </div>
                        
                        {job.salaryRange && (
                          <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400 mb-3">
                            <DollarSign className="h-4 w-4" />
                            {job.salaryRange}
                          </div>
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

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleEdit(job)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteDialog}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog(null)}
        title="Delete Job Posting"
        message={`Are you sure you want to delete "${deleteDialog?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}

export default CompanyDashboard;