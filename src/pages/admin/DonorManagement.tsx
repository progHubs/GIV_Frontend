/**
 * Admin Donor Management Page
 * Comprehensive donor management interface for administrators
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDonors, useDonorStats, useUpdateDonorProfile } from '../../hooks/useDonations';
import { useStripeUtils } from '../../hooks/useStripe';

import type { DonorProfile, DonationTier } from '../../types/donation';
import DonorTierCards from '../../components/admin/DonorTierCards';
import TierBadge from '../../components/common/TierBadge';

const DonorManagement: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc',
    donation_tier: undefined as string | undefined,
    is_recurring_donor: undefined as boolean | undefined,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonor, setSelectedDonor] = useState<DonorProfile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<DonationTier | undefined>(undefined);

  // Hooks
  const { data: donorsData, isLoading, error } = useDonors(filters);
  const { data: stats } = useDonorStats();
  const updateDonorMutation = useUpdateDonorProfile();
  const { formatCurrency } = useStripeUtils();

  const donors = donorsData?.data || [];
  const pagination = (donorsData?.pagination || {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  }) as {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };

  // Handle filter changes
  const updateFilters = useCallback((newFilters: any) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters, page: 1 }));
  }, []);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Handle tier filter
  const handleTierClick = useCallback((tier: DonationTier | undefined) => {
    setSelectedTier(tier);
    setFilters(prev => ({
      ...prev,
      donation_tier: tier || undefined,
      page: 1,
    }));
  }, []);

  // Handle donor edit
  const handleEditDonor = (donor: DonorProfile) => {
    setSelectedDonor(donor);
    setShowEditModal(true);
  };

  // Handle donor update
  const handleUpdateDonor = async (updates: Partial<DonorProfile>) => {
    if (!selectedDonor) return;

    try {
      await updateDonorMutation.mutateAsync({
        userId: selectedDonor.user_id,
        profileData: updates,
      });
      setShowEditModal(false);
      setSelectedDonor(null);
    } catch (error) {
      console.error('Failed to update donor:', error);
    }
  };

  // Filter donors based on search
  const filteredDonors = searchQuery
    ? donors.filter(
        donor =>
          donor.users?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          donor.users?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : donors;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center gap-2 text-theme-muted hover:text-theme-primary transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {/* Back to Dashboard */}
              </motion.button>
            </div>
            <h1 className="text-3xl font-bold text-theme-primary mb-2">Donor Management</h1>
            <p className="text-theme-muted">Manage donor profiles and track giving patterns</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-theme-muted text-sm">Total Donors</p>
                    <p className="text-2xl font-bold text-theme-primary">{stats.totalDonors}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
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
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-theme-muted text-sm">Recurring Donors</p>
                    <p className="text-2xl font-bold text-theme-primary">{stats.recurringDonors}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-theme-muted text-sm">Anonymous Donors</p>
                    <p className="text-2xl font-bold text-theme-primary">
                      {stats.anonymousDonors}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
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
                  </div>
                </div>
              </motion.div> */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-theme-muted text-sm">Top Tier Donors</p>
                    <p className="text-2xl font-bold text-theme-primary">
                      {stats.donorsByTier?.find((t: any) => t.tier === 'gold')?.count || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Tier Cards */}
          {stats && (
            <DonorTierCards
              stats={stats}
              onTierClick={handleTierClick}
              selectedTier={selectedTier}
            />
          )}

          {/* Filters and Search */}
          <div className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">
                  Search Donors
                </label>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tier Filter */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">Tier</label>
                <select
                  value={filters.donation_tier || ''}
                  onChange={e => updateFilters({ donation_tier: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Tiers</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>

              {/* Recurring Filter */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">Type</label>
                <select
                  value={filters.is_recurring_donor?.toString() || ''}
                  onChange={e =>
                    updateFilters({
                      is_recurring_donor: e.target.value ? e.target.value === 'true' : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Donors</option>
                  <option value="true">Recurring</option>
                  <option value="false">One-time</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">Sort By</label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={e => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    updateFilters({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
                  }}
                  className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                  <option value="total_donated-desc">Highest Donated</option>
                  <option value="total_donated-asc">Lowest Donated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Donors List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-theme-surface rounded-lg p-6 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Donors</h3>
                <p className="text-red-600">Failed to load donors. Please try again later.</p>
              </div>
            ) : filteredDonors.length === 0 ? (
              <div className="bg-theme-surface rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
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
                </div>
                <h3 className="text-lg font-semibold text-theme-primary mb-2">No Donors Found</h3>
                <p className="text-theme-muted">
                  {searchQuery
                    ? 'No donors match your search criteria.'
                    : 'No donors have been registered yet.'}
                </p>
              </div>
            ) : (
              filteredDonors.map((donor, index) => (
                <motion.div
                  key={donor.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {donor.users?.full_name
                            ?.split(' ')
                            .map(n => n[0])
                            .join('') || 'U'}
                        </span>
                      </div>

                      {/* Donor Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-theme-primary">
                            {donor.users?.full_name || donor.users?.email || 'Anonymous Donor'}
                          </h3>
                          {donor.donation_tier && (
                            <TierBadge tier={donor.donation_tier} size="sm" animated={false} />
                          )}
                          {donor.is_recurring_donor && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Recurring
                            </span>
                          )}
                          {donor.is_anonymous && (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                              Anonymous
                            </span>
                          )}
                        </div>
                        <p className="text-theme-muted text-sm">{donor.users?.email}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-theme-muted">
                          <span>Total: {formatCurrency(parseFloat(donor.total_donated))}</span>
                          {donor.last_donation_date && (
                            <span>
                              Last: {new Date(donor.last_donation_date).toLocaleDateString()}
                            </span>
                          )}
                          <span>Joined: {new Date(donor.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/donors/${donor.user_id}`)}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleEditDonor(donor)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-theme-muted">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of{' '}
                {pagination.totalCount} donors
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 text-sm border border-theme rounded-lg bg-theme-background text-theme-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-theme-hover"
                >
                  Previous
                </button>

                <span className="text-sm text-theme-muted">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 text-sm border border-theme rounded-lg bg-theme-background text-theme-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-theme-hover"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Donor Modal */}
      {showEditModal && selectedDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-theme-surface rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Edit Donor Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">
                  Donation Tier
                </label>
                <select
                  defaultValue={selectedDonor.donation_tier || ''}
                  onChange={e =>
                    handleUpdateDonor({
                      donation_tier: (e.target.value as DonationTier) || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary"
                >
                  <option value="">No Tier</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="recurring"
                  defaultChecked={selectedDonor.is_recurring_donor}
                  onChange={e => handleUpdateDonor({ is_recurring_donor: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-theme-background border-theme rounded focus:ring-blue-500"
                />
                <label htmlFor="recurring" className="ml-2 text-sm text-theme-primary">
                  Recurring Donor
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  defaultChecked={selectedDonor.is_anonymous}
                  onChange={e => handleUpdateDonor({ is_anonymous: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-theme-background border-theme rounded focus:ring-blue-500"
                />
                <label htmlFor="anonymous" className="ml-2 text-sm text-theme-primary">
                  Anonymous Donor
                </label>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-theme rounded-lg text-theme-primary hover:bg-theme-hover"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorManagement;
