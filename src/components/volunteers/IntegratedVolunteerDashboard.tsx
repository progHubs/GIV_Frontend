/**
 * Integrated Volunteer Dashboard Component
 * Simplified volunteer dashboard for integration into user profile page
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { VolunteerProfileEditModal, VolunteerProfileCreationForm } from './index';
import {
  useVolunteerProfile,
  useCreateVolunteerProfile,
  useUpdateVolunteerProfile,
  useVolunteerApplications,
} from '../../hooks/useVolunteer';
import type {
  VolunteerProfile,
  VolunteerProfileUpdateRequest,
  CampaignVolunteer,
} from '../../types/volunteer';
import ErrorBoundary from '../common/ErrorBoundary';

interface IntegratedVolunteerDashboardProps {
  className?: string;
}

const IntegratedVolunteerDashboard: React.FC<IntegratedVolunteerDashboardProps> = ({
  className = '',
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'applications'>('profile');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch volunteer data
  const { data: profileData, isLoading: profileLoading } = useVolunteerProfile();
  const { data: applicationsData, isLoading: applicationsLoading } = useVolunteerApplications();
  const createProfileMutation = useCreateVolunteerProfile();
  const updateProfileMutation = useUpdateVolunteerProfile();

  // Extract data from backend response (backend returns { success: true, data: volunteer })
  const profile: VolunteerProfile | undefined = profileData?.data;
  // Applications data structure: { success: true, data: { campaigns: [...], pagination: {...} } }
  const applications = Array.isArray(applicationsData?.data?.campaigns)
    ? applicationsData.data.campaigns
    : [];

  // Debug logging
  React.useEffect(() => {
    console.log('Profile Data:', profileData);
    console.log('Applications Data:', applicationsData);
    console.log('User:', user);
  }, [profileData, applicationsData, user]);

  // Check if user has volunteer flag
  const isVolunteer = user?.is_volunteer || false;

  const handleUpdateProfile = async (data: VolunteerProfileUpdateRequest, files?: File[]) => {
    try {
      // Update existing profile
      await updateProfileMutation.mutateAsync({ data, files });
      toast.success('Profile updated successfully!');
      setShowEditModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const handleCreateProfile = async (data: VolunteerProfileUpdateRequest, files?: File[]) => {
    try {
      // Create new profile
      await createProfileMutation.mutateAsync({ data, files });
      toast.success('Volunteer profile created successfully!');
      setShowCreateModal(false);
      // The backend trigger will set is_volunteer = true, so we need to refresh the page or refetch user data
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile');
      throw error;
    }
  };

  const handleCreateVolunteerProfile = () => {
    setShowCreateModal(true);
  };

  const handleApplyToCampaigns = () => {
    navigate('/campaigns');
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCancelApplication = async (campaignId: string) => {
    if (!window.confirm('Are you sure you want to cancel this application?')) {
      return;
    }

    try {
      // Call withdraw API endpoint
      await fetch(`/api/volunteers/campaigns/${campaignId}/withdraw`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success('Application cancelled successfully');
      // Refetch applications data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to cancel application');
    }
  };

  // Filter applications
  const filteredApplications = applications.filter((app: any) => {
    const matchesSearch =
      !searchTerm || app.campaigns?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  // Stats calculation
  const stats = {
    total: applications.length,
    waiting: applications.filter((app: any) => app.status === 'waiting').length,
    approved: applications.filter((app: any) => app.status === 'approved').length,
    rejected: applications.filter((app: any) => app.status === 'rejected').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // If user is not a volunteer, show create profile prompt
  if (!isVolunteer) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <svg
            className="mx-auto h-16 w-16 text-blue-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Become a Volunteer
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your volunteer profile to start applying for campaigns and making a difference in
            your community.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateVolunteerProfile}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create Volunteer Profile
          </motion.button>
        </div>

        {/* Create Profile Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <VolunteerProfileCreationForm
              onSubmit={handleCreateProfile}
              onCancel={() => setShowCreateModal(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Volunteer Profile
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              My Applications ({applications.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' ? (
            <div className="space-y-6">
              {/* Profile Header with Actions */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Volunteer Profile
                </h3>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApplyToCampaigns}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    Apply
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEditProfile}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Edit
                  </motion.button>
                </div>
              </div>

              {/* Profile Information */}
              {profileLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Loading profile...</p>
                </div>
              ) : profile ? (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Location
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {profile.location || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Areas of Interest
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {profile.volunteer_roles ? (
                        profile.volunteer_roles.split(',').map((role, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          >
                            {role.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">No areas specified</span>
                      )}
                    </div>
                  </div>

                  {profile.is_licensed_practitioner && (
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Medical Practitioner Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="block text-gray-500 dark:text-gray-400">
                            License Number
                          </label>
                          <p className="text-gray-900 dark:text-gray-100">
                            {profile.license_number || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-gray-500 dark:text-gray-400">
                            License Expiry
                          </label>
                          <p className="text-gray-900 dark:text-gray-100">
                            {profile.license_expiry_date
                              ? new Date(profile.license_expiry_date).toLocaleDateString()
                              : 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-gray-500 dark:text-gray-400">
                            Institution
                          </label>
                          <p className="text-gray-900 dark:text-gray-100">
                            {profile.medical_education_institution || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-gray-500 dark:text-gray-400">Degree</label>
                          <p className="text-gray-900 dark:text-gray-100">
                            {profile.medical_education_degree || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Statistics */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                      Statistics
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {profile.registered_campaigns_count || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Total Applications
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {profile.active_campaigns_count || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {profile.completed_campaigns_count || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <div className="text-gray-500 dark:text-gray-400 mb-4">
                    No volunteer profile found
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                    Create your volunteer profile to start applying for campaigns
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateVolunteerProfile}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Create Profile
                  </motion.button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.total}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.waiting}
                  </div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">Waiting</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.approved}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Approved</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.rejected}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">Rejected</div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="waiting">Waiting</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Applications Table */}
              {applicationsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Loading applications...</p>
                </div>
              ) : paginatedApplications.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-13h10a2 2 0 012 2v11a2 2 0 01-2 2H9m0-13v13"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    No applications found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm || statusFilter
                      ? 'Try adjusting your filters.'
                      : 'Start by applying to volunteer for campaigns.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Campaign
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Applied
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {paginatedApplications.map((application: any, index: number) => (
                        <motion.tr
                          key={application.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {application.campaigns?.title || 'Unknown Campaign'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                              General Volunteer
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
                            >
                              {application.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(application.application_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {application.status === 'waiting' ? (
                              <button
                                onClick={() => handleCancelApplication(application.campaign_id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">-</span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {startIndex + 1} to{' '}
                    {Math.min(startIndex + itemsPerPage, filteredApplications.length)} of{' '}
                    {filteredApplications.length} applications
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Profile Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <VolunteerProfileCreationForm
            onSubmit={handleCreateProfile}
            onCancel={() => setShowCreateModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && profile && (
          <VolunteerProfileEditModal
            profile={profile}
            onSubmit={handleUpdateProfile}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntegratedVolunteerDashboard;
