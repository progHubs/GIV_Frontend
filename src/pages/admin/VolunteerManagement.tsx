/**
 * Admin Volunteer Management Page
 * Comprehensive interface for managing volunteers and their campaign associations
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  CogIcon,
  DocumentIcon,
  AcademicCapIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

import { useAuth } from '../../hooks/useAuth';
import {
  useAllVolunteers,
  useSearchVolunteers,

  useUpdateVolunteerProfile,
  useDeleteVolunteer,
} from '../../hooks/useVolunteer';
import { useCampaigns } from '../../hooks/useCampaigns';

import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Pagination } from '../../components/ui/Pagination';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';

import {
  VolunteerCard,
  VolunteerFilters,
  CampaignVolunteerManagement,
} from '../../components/volunteers';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

import type { VolunteerProfile, VolunteerFilters as VolunteerFiltersType } from '../../types/volunteer';

/**
 * Admin Volunteer Management Page
 * Comprehensive interface for managing volunteers and their campaign associations
 */
const VolunteerManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // State management
  const [activeTab, setActiveTab] = useState<'volunteers' | 'campaigns' | 'documents'>('volunteers');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<VolunteerFiltersType>({
    page: 1,
    limit: 12,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerProfile | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');

  // Check if any filters are applied (excluding pagination and sorting)
  const hasAnyFilters = React.useMemo(() => {
    const filterKeys = Object.keys(filters).filter(
      key => !['page', 'limit', 'sortBy', 'sortOrder'].includes(key)
    );
    return filterKeys.length > 0 || searchQuery.trim().length > 0;
  }, [filters, searchQuery]);

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Hooks for data fetching
  const {
    data: volunteersData,
    isLoading: volunteersLoading,
    error: volunteersError,
    refetch: refetchVolunteers,
  } = useAllVolunteers(filters, { enabled: searchQuery.trim().length === 0 });

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchVolunteers(
    { query: searchQuery, ...filters },
    { enabled: searchQuery.trim().length > 0 }
  );


  const { data: campaignsData } = useCampaigns({ is_active: true });
  const updateVolunteerMutation = useUpdateVolunteerProfile();
  const deleteVolunteerMutation = useDeleteVolunteer();

  // Data processing - use search data when search query exists, otherwise use filtered volunteers data
  const volunteers = searchQuery.trim().length > 0 ? searchData?.data || [] : volunteersData?.data || [];
  const pagination = searchQuery.trim().length > 0 ? searchData?.pagination : volunteersData?.pagination;


  const campaigns = campaignsData?.data || [];
  const isLoading = volunteersLoading || searchLoading;
  const error = volunteersError || searchError;

  // Event handlers
  const handleFilterChange = useCallback((newFilters: Partial<VolunteerFiltersType>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters, page: 1 }));
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
    setSearchQuery('');
  };

  const handleViewVolunteer = (volunteer: VolunteerProfile) => {
    navigate(`/admin/volunteers/${volunteer.user_id}`);
  };

  const handleDeleteVolunteer = (volunteer: VolunteerProfile) => {
    setSelectedVolunteer(volunteer);
    setShowDeleteDialog(true);
  };

  const confirmDeleteVolunteer = async () => {
    if (!selectedVolunteer) return;

    try {
      await deleteVolunteerMutation.mutateAsync(selectedVolunteer.user_id);
      setShowDeleteDialog(false);
      setSelectedVolunteer(null);
      refetchVolunteers();
      toast.success('Volunteer profile deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete volunteer profile');
    }
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'suspended':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <XCircleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error loading volunteers
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {error.message || 'An unexpected error occurred'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Dashboard
              </Button>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Volunteer Management
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage volunteer profiles, applications, and campaign assignments
                  </p>
            </div>
          </div>


            </div>


          </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="volunteers" className="flex items-center gap-2">
              <UserGroupIcon className="w-4 h-4" />
              Volunteers
              {pagination && (
                <Badge variant="secondary" className="ml-2">
                  {pagination.totalCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4" />
              Campaign Integration
            </TabsTrigger>
          </TabsList>

          {/* Volunteers Tab */}
          <TabsContent value="volunteers" className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 min-w-0">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search volunteers by name, email, or location..."
                      value={searchQuery}
                      onChange={e => handleSearchChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                      showFilters
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    Filters
                    {hasAnyFilters && (
                      <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </button>

                  {hasAnyFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Filters Component */}
              {showFilters && (
                <VolunteerFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  totalVolunteers={pagination?.totalCount || 0}
                />
              )}
            </div>

            {/* Volunteers List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Volunteers ({pagination?.totalCount || 0})
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                      options={[
                        { value: 'created_at', label: 'Date Joined' },
                        { value: 'updated_at', label: 'Last Updated' },
                        { value: 'rating', label: 'Rating' },
                        { value: 'completed_campaigns_count', label: 'Completed Campaigns' },
                      ]}
                    />
                    <Select
                      value={filters.sortOrder}
                      onChange={(e) => handleFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
                      options={[
                        { value: 'desc', label: 'Newest First' },
                        { value: 'asc', label: 'Oldest First' },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="p-6">
                  <LoadingSpinner />
                </div>
              ) : volunteers.length === 0 ? (
                <div className="p-12 text-center">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    No volunteers found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {hasAnyFilters
                      ? 'Try adjusting your search filters.'
                      : 'No volunteers have registered yet.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {volunteers.map((volunteer, index) => (
                    <motion.div
                      key={volunteer.user_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {volunteer.users?.full_name?.charAt(0) || 'V'}
                            </span>
                          </div>

                          {/* Volunteer Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                                {volunteer.users?.full_name || 'Unknown Volunteer'}
                              </h4>
                              {volunteer.is_licensed_practitioner && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                  <AcademicCapIcon className="w-3 h-3 mr-1" />
                                  Licensed
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>{volunteer.users?.email}</span>
                              {volunteer.location && (
                                <>
                                  <span>•</span>
                                  <span>{volunteer.location}</span>
                                </>
                              )}
                            </div>

                            {/* Stats */}
                            <div className="mt-2 flex items-center space-x-6 text-sm">
                              <div className="flex items-center space-x-1">
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  {volunteer.completed_campaigns_count || 0} completed
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ClockIcon className="h-4 w-4 text-blue-500" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  {volunteer.active_campaigns_count || 0} active
                                </span>
                              </div>
                              {volunteer.rating && parseFloat(volunteer.rating) > 0 && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-yellow-500">★</span>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {parseFloat(volunteer.rating).toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewVolunteer(volunteer)}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVolunteer(volunteer)}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete Profile"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    showInfo={true}
                    totalItems={pagination.totalCount}
                    itemsPerPage={pagination.limit}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Campaign Integration Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Campaign-Volunteer Management
              </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage volunteer applications and assignments for campaigns
                  </p>
                </div>
                {campaigns.length > 0 && !selectedCampaignId && (
                  <div className="max-w-xs">
                    <Select
                      value={selectedCampaignId}
                      onChange={setSelectedCampaignId}
                      options={[
                        { value: '', label: 'Select a campaign...' },
                        ...campaigns.map((campaign: any) => ({
                          value: campaign.id,
                          label: campaign.title,
                        })),
                      ]}
                    />
                  </div>
                )}
              </div>
              <CampaignVolunteerManagement
                selectedCampaignId={selectedCampaignId}
                onCampaignChange={setSelectedCampaignId}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals and Dialogs */}
      {showDeleteDialog && selectedVolunteer && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDeleteVolunteer}
          title="Delete Volunteer Profile"
          message={`Are you sure you want to delete ${selectedVolunteer.users?.full_name}'s volunteer profile? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
};

export default VolunteerManagement;
