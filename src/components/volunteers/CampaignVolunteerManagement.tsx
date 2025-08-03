import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  DocumentIcon,
  TrophyIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

import { useCampaignVolunteers, useUpdateVolunteerStatus } from '../../hooks/useVolunteer';
import { useCampaigns } from '../../hooks/useCampaigns';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Pagination } from '../ui/Pagination';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input';

import type { CampaignVolunteer, CampaignVolunteerFilters } from '../../types/volunteer';
import type { Campaign } from '../../types/campaign';
import { formatDate } from '../../utils/dateUtils';
import { api } from '../../lib/api';

interface CampaignVolunteerManagementProps {
  selectedCampaignId?: string;
  onCampaignChange?: (campaignId: string) => void;
}

export function CampaignVolunteerManagement({
  selectedCampaignId,
  onCampaignChange,
}: CampaignVolunteerManagementProps) {
  const [filters, setFilters] = useState<CampaignVolunteerFilters>({
    page: 1,
    limit: 10,
    sortBy: 'application_date',
    sortOrder: 'desc',
  });
  const [selectedVolunteer, setSelectedVolunteer] = useState<CampaignVolunteer | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<{
    status: 'waiting' | 'approved' | 'rejected' | 'completed';
    notes: string;
  }>({
    status: 'approved',
    notes: '',
  });

  // Certificate functionality
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedVolunteerForCertificate, setSelectedVolunteerForCertificate] = useState<CampaignVolunteer | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [isUploadingCertificate, setIsUploadingCertificate] = useState(false);
  
  // Campaign search functionality
  const [campaignSearch, setCampaignSearch] = useState('');
  const [showCampaignDropdown, setShowCampaignDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowCampaignDropdown(false);
      }
    };

    if (showCampaignDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCampaignDropdown]);

  // Campaign pagination state
  const [campaignPage, setCampaignPage] = useState(1);
  const [campaignLimit] = useState(20); // Show 20 campaigns per page

  // Hooks
  const { data: campaignsData } = useCampaigns({
    is_active: true,
    page: campaignPage,
    limit: campaignLimit
  });
  const {
    data: volunteersData,
    isLoading,
    error,
    refetch,
  } = useCampaignVolunteers(
    selectedCampaignId || '',
    filters,
    { enabled: !!selectedCampaignId }
  );
  const updateStatusMutation = useUpdateVolunteerStatus();

  const campaigns = campaignsData?.data || [];
  const campaignPagination = campaignsData?.pagination;
  const volunteers = Array.isArray(volunteersData?.data) ? volunteersData.data : [];
  const pagination = volunteersData?.pagination;

  // Filter campaigns based on search
  const filteredCampaigns = campaigns.filter((campaign: Campaign) =>
    campaign.title.toLowerCase().includes(campaignSearch.toLowerCase())
  );

  // Event handlers
  const handleFilterChange = useCallback((newFilters: Partial<CampaignVolunteerFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleStatusUpdate = (volunteer: CampaignVolunteer) => {
    setSelectedVolunteer(volunteer);
    // Set the current status as the default, let user change it in the modal
    setStatusUpdate({
      status: volunteer.status as 'waiting' | 'approved' | 'rejected' | 'completed',
      notes: volunteer.notes || '',
    });
    setShowStatusModal(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (!selectedVolunteer || !selectedCampaignId) return;

    try {
      await updateStatusMutation.mutateAsync({
        campaignId: selectedCampaignId,
        userId: selectedVolunteer.user_id,
        status: statusUpdate.status,
        notes: statusUpdate.notes,
      });

      setShowStatusModal(false);
      setSelectedVolunteer(null);
      refetch();
      toast.success(`Volunteer status updated to ${statusUpdate.status}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update volunteer status');
    }
  };

  const handleCertificateIssuance = (volunteer: CampaignVolunteer) => {
    setSelectedVolunteerForCertificate(volunteer);
    setShowCertificateModal(true);
  };

  const handleCertificateUpload = async () => {
    if (!certificateFile || !selectedVolunteerForCertificate || !selectedCampaignId) {
      toast.error('Please select a certificate file');
      return;
    }

    setIsUploadingCertificate(true);

    try {
      const formData = new FormData();
      formData.append('file', certificateFile); // Backend expects 'file' field name
      formData.append('certificateData', JSON.stringify({
        volunteerName: selectedVolunteerForCertificate.users?.full_name,
        campaignTitle: selectedVolunteerForCertificate.campaigns?.title,
        completionDate: new Date().toISOString()
      }));

      const result = await api.upload(`/volunteers/${selectedVolunteerForCertificate.user_id}/campaigns/${selectedCampaignId}/certificate`, formData);

      if (result.success) {
        toast.success('Certificate uploaded successfully');
        setShowCertificateModal(false);
        setCertificateFile(null);
        setSelectedVolunteerForCertificate(null);
        refetch();
      } else {
        toast.error(result.error || 'Failed to upload certificate');
      }
    } catch (error) {
      toast.error('Failed to upload certificate');
    } finally {
      setIsUploadingCertificate(false);
    }
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircleIcon className="w-3 h-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircleIcon className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <TrophyIcon className="w-3 h-3" />
            Completed
          </Badge>
        );
      case 'waiting':
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            Pending
          </Badge>
        );
    }
  };

  // Using the centralized date utility imported above

  if (!selectedCampaignId) {
    return (
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="relative" ref={searchRef}>
            <Input
              type="text"
              placeholder="Search campaigns..."
              value={campaignSearch}
              onChange={(e) => setCampaignSearch(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Active Campaigns ({filteredCampaigns.length})
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a campaign to manage its volunteers
            </p>
          </div>

          {filteredCampaigns.length === 0 ? (
            <div className="p-12 text-center">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                No campaigns found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {campaignSearch ? `No campaigns match "${campaignSearch}"` : 'No active campaigns available'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCampaigns.map((campaign: Campaign, index: number) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => onCampaignChange?.(campaign.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {campaign.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {campaign.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>Start: {new Date(campaign.start_date).toLocaleDateString()}</span>
                        {campaign.end_date && (
                          <span>End: {new Date(campaign.end_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {campaign.volunteer_count || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Volunteers
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Campaign Pagination */}
          {campaignPagination && campaignPagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                currentPage={campaignPage}
                totalPages={campaignPagination.totalPages}
                onPageChange={setCampaignPage}
                showPageNumbers={true}
                className="justify-center"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  const selectedCampaign = campaigns.find((c: Campaign) => c.id === selectedCampaignId);

  return (
    <div className="space-y-6">
      {/* Campaign Header with Back Button */}
      {selectedCampaign && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onCampaignChange?.(null)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Campaigns
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {selectedCampaign.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Managing volunteers for this campaign
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {volunteers.length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total Volunteers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {volunteers.filter(v => v.status === 'approved').length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Approved
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {volunteers.filter(v => v.status === 'waiting').length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Pending
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Select
              value={filters.status || ''}
              onChange={(value) => handleFilterChange({ status: value as any })}
              options={[
                { value: '', label: 'All Status' },
                { value: 'waiting', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'completed', label: 'Completed' },
              ]}
            />
            <Select
              value={filters.sortBy}
              onChange={(value) => handleFilterChange({ sortBy: value as any })}
              options={[
                { value: 'application_date', label: 'Application Date' },
                { value: 'approval_date', label: 'Approval Date' },
                { value: 'hours_completed', label: 'Hours Completed' },
                { value: 'hours_committed', label: 'Hours Committed' },
              ]}
            />
            <Select
              value={filters.sortOrder}
              onChange={(value) => handleFilterChange({ sortOrder: value as 'asc' | 'desc' })}
              options={[
                { value: 'desc', label: 'Newest First' },
                { value: 'asc', label: 'Oldest First' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Volunteers List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Campaign Volunteers ({pagination?.totalCount || 0})
          </h3>
        </div>

        {isLoading ? (
          <div className="p-6">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="text-center text-red-600 dark:text-red-400">
              Error loading volunteers: {error.message}
            </div>
          </div>
        ) : volunteers.length === 0 ? (
          <div className="p-12 text-center">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              No volunteers found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No volunteers have applied for this campaign yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {volunteers.map((volunteer, index) => (
              <motion.div
                key={volunteer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {volunteer.users?.full_name?.charAt(0) || 'V'}
                      </span>
                    </div>

                    {/* Volunteer Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {volunteer.users?.full_name || 'Unknown Volunteer'}
                        </h4>
                        {getStatusBadge(volunteer.status)}
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Applied {formatDate(volunteer.application_date)}</span>
                        {volunteer.hours_committed && (
                          <>
                            <span>•</span>
                            <span>{volunteer.hours_committed} hours committed</span>
                          </>
                        )}
                        {volunteer.hours_completed > 0 && (
                          <>
                            <span>•</span>
                            <span>{volunteer.hours_completed} hours completed</span>
                          </>
                        )}
                      </div>
                      {volunteer.notes && (
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                          <DocumentIcon className="inline w-3 h-3 mr-1" />
                          {volunteer.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(volunteer)}
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Update Status
                    </Button>
                    {volunteer.status === 'completed' && !volunteer.certificate_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCertificateIssuance(volunteer)}
                        className="text-purple-600 border-purple-300 hover:bg-purple-50"
                      >
                        <TrophyIcon className="w-4 h-4 mr-1" />
                        Issue Certificate
                      </Button>
                    )}
                    {volunteer.certificate_url && (
                      <Badge variant="success" className="flex items-center gap-1">
                        <TrophyIcon className="w-3 h-3" />
                        Certificate Issued
                      </Badge>
                    )}
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

      {/* Status Update Modal */}
      {showStatusModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Update Volunteer Status
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedVolunteer.users?.full_name}
                </h4>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span>Current status:</span>
                  {getStatusBadge(selectedVolunteer.status)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Status
                </label>
                <Select
                  value={statusUpdate.status}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('Status change:', value); // Debug log
                    setStatusUpdate(prev => ({
                      ...prev,
                      status: value as 'waiting' | 'approved' | 'rejected' | 'completed'
                    }));
                  }}
                  options={[
                    { value: 'waiting', label: 'Waiting for Approval' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'rejected', label: 'Rejected' },
                    { value: 'completed', label: 'Completed' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <Textarea
                  value={statusUpdate.notes}
                  onChange={(e) => setStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this status update..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmStatusUpdate}
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Upload Modal */}
      {showCertificateModal && selectedVolunteerForCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Upload Certificate
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Campaign: <strong>{selectedVolunteerForCertificate.campaigns?.title}</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Volunteer: <strong>{selectedVolunteerForCertificate.users?.full_name}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate File
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG (max 5MB)
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCertificateModal(false);
                    setCertificateFile(null);
                    setSelectedVolunteerForCertificate(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCertificateUpload}
                  disabled={!certificateFile || isUploadingCertificate}
                  className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
                  {isUploadingCertificate ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    'Upload Certificate'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}