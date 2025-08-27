import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import ApplicationCard from '../../components/ApplicationCard';
import JobCard from '../../components/JobCard';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Briefcase, Plus, Download, Upload, FileText, Search as SearchIcon } from 'lucide-react';
import { format } from 'date-fns';

function UserDashboard() {
  const { state, dispatch, showToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [importDialog, setImportDialog] = useState(null);

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = state.applications.filter(app => {
      const matchesSearch = !searchTerm || 
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort applications
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.appliedDate) - new Date(a.appliedDate);
        case 'date-asc':
          return new Date(a.appliedDate) - new Date(b.appliedDate);
        case 'company':
          return a.company.localeCompare(b.company);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [state.applications, searchTerm, statusFilter, sortBy]);

  // Filter jobs for search
  const filteredJobs = useMemo(() => {
    return state.jobs.filter(job => {
      if (!searchTerm) return true;
      return job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }, [state.jobs, searchTerm]);

  const handleDeleteApplication = (application) => {
    setDeleteDialog(application);
  };

  const confirmDelete = () => {
    if (deleteDialog) {
      dispatch({ type: 'DELETE_APPLICATION', payload: deleteDialog.id });
      showToast('Application deleted successfully');
      setDeleteDialog(null);
    }
  };

  const handleAddApplicationFromJob = (job) => {
    navigate(`/user/add?from-job=${job.id}`);
  };

  // Export applications
  const handleExport = () => {
    const dataStr = JSON.stringify(state.applications, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `applications-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Applications exported successfully');
  };

  // Import applications
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          setImportDialog({
            data: importedData,
            count: importedData.length
          });
        } else {
          showToast('Invalid file format', 'error');
        }
      } catch (error) {
        showToast('Error reading file', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const confirmImport = (mode) => {
    if (!importDialog) return;

    if (mode === 'replace') {
      dispatch({ type: 'SET_APPLICATIONS', payload: importDialog.data });
      showToast(`Replaced all applications with ${importDialog.count} imported applications`);
    } else {
      // Merge by avoiding duplicates based on id
      const existingIds = new Set(state.applications.map(app => app.id));
      const newApplications = importDialog.data.filter(app => !existingIds.has(app.id));
      
      dispatch({ 
        type: 'SET_APPLICATIONS', 
        payload: [...state.applications, ...newApplications] 
      });
      showToast(`Imported ${newApplications.length} new applications (${importDialog.count - newApplications.length} duplicates skipped)`);
    }
    setImportDialog(null);
  };

  const stats = useMemo(() => {
    const total = state.applications.length;
    const applied = state.applications.filter(app => app.status === 'Applied').length;
    const interviewing = state.applications.filter(app => app.status === 'Interviewing').length;
    const offers = state.applications.filter(app => app.status === 'Offer').length;
    const rejected = state.applications.filter(app => app.status === 'Rejected').length;
    
    return { total, applied, interviewing, offers, rejected };
  }, [state.applications]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        showSearch={true} 
        onSearch={setSearchTerm} 
        searchTerm={searchTerm}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Applications</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">{stats.applied}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Applied</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.interviewing}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Interviewing</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.offers}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Offers</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Rejected</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex-1 min-w-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'applications'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            My Applications
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 min-w-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'jobs'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Available Jobs
          </button>
        </div>

        {/* My Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
              <div className="flex flex-wrap gap-3">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date-desc">Latest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="company">Company A-Z</option>
                  <option value="status">Status</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Import/Export */}
                <button
                  onClick={handleExport}
                  disabled={state.applications.length === 0}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
                
                <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>

                <Link
                  to="/user/add"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Application
                </Link>
              </div>
            </div>

            {/* Applications Grid */}
            {filteredApplications.length === 0 ? (
              searchTerm || statusFilter !== 'all' ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
                  <EmptyState
                    icon={SearchIcon}
                    title="No applications found"
                    description={`No applications match your search criteria. ${searchTerm ? `Try a different search term` : 'Try changing your filters'}.`}
                  />
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
                  <EmptyState
                    icon={Briefcase}
                    title="No applications yet"
                    description="Start tracking your job applications by adding your first application."
                    action={() => navigate('/user/add')}
                    actionText="Add Your First Application"
                  />
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.map(application => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onDelete={handleDeleteApplication}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Available Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Available Positions
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discover new opportunities and apply with one click
              </p>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
                <EmptyState
                  icon={SearchIcon}
                  title="No jobs found"
                  description="No jobs match your search criteria. Try a different search term."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onAddApplication={handleAddApplicationFromJob}
                  />
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
        title="Delete Application"
        message={`Are you sure you want to delete your application to ${deleteDialog?.company} for ${deleteDialog?.title}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Import Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!importDialog}
        onConfirm={() => confirmImport('merge')}
        onCancel={() => setImportDialog(null)}
        title="Import Applications"
        message={`Found ${importDialog?.count} applications to import. Choose how to handle the import:`}
        confirmText="Merge (Keep Both)"
        cancelText="Cancel"
        type="info"
      >
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => confirmImport('merge')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Merge (Keep Both)
          </button>
          <button
            onClick={() => confirmImport('replace')}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Replace All
          </button>
        </div>
      </ConfirmDialog>
    </div>
  );
}

export default UserDashboard;