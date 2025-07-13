/**
 * Admin Donation Management Page
 * Comprehensive donation management interface for administrators
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DonationCard } from '../../components/donations';
import {
  useDonations,
  useDonationStats,
  useUpdateDonationStatus,
  useSearchDonations,
} from '../../hooks/useDonations';
import { useStripeUtils } from '../../hooks/useStripe';
import type { DonationFilters, Donation } from '../../types/donation';

const DonationManagement: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DonationFilters>({
    page: 1,
    limit: 20,
    sortBy: 'donated_at',
    sortOrder: 'desc',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Hooks
  const { data: donationsData, isLoading, error } = useDonations(filters);
  const { data: searchResults, isLoading: searchLoading } = useSearchDonations(
    searchQuery,
    filters
  );
  const { data: stats } = useDonationStats();
  const updateStatusMutation = useUpdateDonationStatus();

  const { formatCurrency } = useStripeUtils();

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.payment_status) count++;
    if (filters.donation_type) count++;
    if (filters.payment_method) count++;
    if (filters.currency) count++;
    if (filters.is_anonymous !== undefined) count++;
    if (searchQuery) count++;
    return count;
  }, [filters, searchQuery]);

  // Use search results if searching, otherwise use regular donations
  const displayData = searchQuery ? searchResults : donationsData;
  const donations = displayData?.data || [];
  const pagination = (displayData?.pagination || {
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
  const updateFilters = useCallback((newFilters: Partial<DonationFilters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters, page: 1 }));
  }, []);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Handle donation update
  const handleUpdateDonation = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowStatusModal(true);
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedDonation) return;

    try {
      await updateStatusMutation.mutateAsync({
        donationId: selectedDonation.id,
        updateData: { payment_status: newStatus as any },
      });
      setShowStatusModal(false);
      setSelectedDonation(null);
    } catch (error) {
      console.error('Failed to update donation status:', error);
    }
  };

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
            <h1 className="text-3xl font-bold text-theme-primary mb-2">Donation Management</h1>
            <p className="text-theme-muted">Manage and monitor all donations across the platform</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="mb-8">
              {/* Primary Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-theme-muted text-sm">Total Donations</p>
                      <p className="text-2xl font-bold text-theme-primary">
                        {stats.total_donations}
                      </p>
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
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
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
                      <p className="text-theme-muted text-sm">Total Amount</p>
                      <p className="text-2xl font-bold text-theme-primary">
                        {formatCurrency(parseFloat(stats.total_amount))}
                      </p>
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
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-theme-muted text-sm">Completed</p>
                      <p className="text-2xl font-bold text-theme-primary">
                        {stats?.completed_donations || 0}
                      </p>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-theme-muted text-sm">Pending</p>
                      <p className="text-2xl font-bold text-theme-primary">
                        {stats?.pending_donations || 0}
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Additional Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-theme-muted text-sm">Anonymous</p>
                      <p className="text-2xl font-bold text-theme-primary">
                        {stats?.anonymous_donations || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-600"
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-theme-muted text-sm">Recurring</p>
                      <p className="text-2xl font-bold text-theme-primary">
                        {stats?.recurring_donations || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-indigo-600"
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-theme-muted text-sm">Stripe</p>
                      <p className="text-2xl font-bold text-theme-primary">
                        {stats?.stripe_donations || 0}
                      </p>
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
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-theme-muted text-sm">Telebirr</p>
                      <p className="text-2xl font-bold text-theme-primary">
                        {stats?.telebirr_donations || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-theme-surface rounded-lg shadow-sm border border-theme mb-6">
            {/* Filter Header */}
            <div className="flex items-center justify-between p-4 border-b border-theme">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-theme-primary">Filters & Search</h3>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 py-1 text-sm text-theme-muted hover:text-theme-primary transition-colors"
              >
                <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Filter Content */}
            {showFilters && (
              <div className="p-6">
                {/* Quick Filter Buttons */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-theme-primary mb-3">Quick Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateFilters({ payment_status: 'completed' })}
                      className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                    >
                      Completed Only
                    </button>
                    <button
                      onClick={() => updateFilters({ payment_status: 'pending' })}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors"
                    >
                      Pending Only
                    </button>
                    <button
                      onClick={() => updateFilters({ donation_type: 'recurring' })}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      Recurring Only
                    </button>
                    <button
                      onClick={() => updateFilters({ is_anonymous: true })}
                      className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      Anonymous Only
                    </button>
                    <button
                      onClick={() => updateFilters({ payment_method: 'stripe' })}
                      className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full hover:bg-indigo-200 transition-colors"
                    >
                      Stripe Only
                    </button>
                  </div>
                </div>

                {/* First Row - Search and Primary Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-theme-primary mb-2">
                      Multi-field Search
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search donors, campaigns, transactions, notes..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 pl-10 border border-theme rounded-lg bg-theme-background text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-theme-muted"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    {searchQuery && (
                      <p className="text-xs text-theme-muted mt-1">
                        Searching in: donor names, campaign titles, transaction IDs, and notes
                      </p>
                    )}
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-theme-primary mb-2">
                      Status
                    </label>
                    <select
                      value={filters.payment_status || ''}
                      onChange={e =>
                        updateFilters({ payment_status: (e.target.value as any) || undefined })
                      }
                      className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-theme-primary mb-2">
                      Type
                    </label>
                    <select
                      value={filters.donation_type || ''}
                      onChange={e =>
                        updateFilters({ donation_type: (e.target.value as any) || undefined })
                      }
                      className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="one_time">One-time</option>
                      <option value="recurring">Recurring</option>
                      <option value="in_kind">In-kind</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-theme-primary mb-2">
                      Sort By
                    </label>
                    <select
                      value={`${filters.sortBy}-${filters.sortOrder}`}
                      onChange={e => {
                        const [sortBy, sortOrder] = e.target.value.split('-');
                        updateFilters({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
                      }}
                      className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="donated_at-desc">Newest First</option>
                      <option value="donated_at-asc">Oldest First</option>
                      <option value="amount-desc">Highest Amount</option>
                      <option value="amount-asc">Lowest Amount</option>
                    </select>
                  </div>
                </div>

                {/* Second Row - Additional Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Payment Method Filter */}
                  <div>
                    <label className="block text-sm font-medium text-theme-primary mb-2">
                      Payment Method
                    </label>
                    <select
                      value={filters.payment_method || ''}
                      onChange={e =>
                        updateFilters({ payment_method: (e.target.value as any) || undefined })
                      }
                      className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Methods</option>
                      <option value="stripe">Stripe</option>
                      <option value="telebirr">Telebirr</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>

                  {/* Currency Filter */}
                  <div>
                    <label className="block text-sm font-medium text-theme-primary mb-2">
                      Currency
                    </label>
                    <select
                      value={filters.currency || ''}
                      onChange={e => updateFilters({ currency: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Currencies</option>
                      <option value="USD">USD</option>
                      <option value="ETB">ETB</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>

                  {/* Anonymity Filter */}
                  <div>
                    <label className="block text-sm font-medium text-theme-primary mb-2">
                      Anonymity
                    </label>
                    <select
                      value={
                        filters.is_anonymous === undefined ? '' : filters.is_anonymous.toString()
                      }
                      onChange={e => {
                        const value = e.target.value;
                        updateFilters({
                          is_anonymous: value === '' ? undefined : value === 'true',
                        });
                      }}
                      className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Donations</option>
                      <option value="false">Non-Anonymous</option>
                      <option value="true">Anonymous Only</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilters({
                          page: 1,
                          limit: 20,
                          sortBy: 'donated_at',
                          sortOrder: 'desc',
                        });
                        setSearchQuery('');
                      }}
                      className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary and Active Filters */}
          <div className="bg-theme-surface rounded-lg p-4 shadow-sm border border-theme mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Results Count */}
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-theme-primary">
                  {searchQuery ? 'Search Results' : 'All Donations'}
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {pagination.totalCount} {pagination.totalCount === 1 ? 'donation' : 'donations'}
                </span>
                {searchQuery && (
                  <span className="text-sm text-theme-muted">for "{searchQuery}"</span>
                )}
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2">
                {filters.payment_status && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    Status: {filters.payment_status}
                  </span>
                )}
                {filters.donation_type && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    Type: {filters.donation_type.replace('_', ' ')}
                  </span>
                )}
                {filters.payment_method && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                    Method: {filters.payment_method}
                  </span>
                )}
                {filters.currency && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                    Currency: {filters.currency}
                  </span>
                )}
                {filters.is_anonymous !== undefined && (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                    {filters.is_anonymous ? 'Anonymous Only' : 'Non-Anonymous Only'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Donations List */}
          <div className="space-y-4">
            {isLoading || searchLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-theme-surface rounded-lg p-4 animate-pulse">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-300 rounded w-24"></div>
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Donations</h3>
                <p className="text-red-600">Failed to load donations. Please try again later.</p>
              </div>
            ) : donations.length === 0 ? (
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-theme-primary mb-2">
                  No Donations Found
                </h3>
                <p className="text-theme-muted">
                  {searchQuery
                    ? 'No donations match your search criteria.'
                    : 'No donations have been made yet.'}
                </p>
              </div>
            ) : (
              donations.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DonationCard
                    donation={donation}
                    showCampaign={true}
                    showDonor={true}
                    showActions={true}
                    onUpdate={handleUpdateDonation}
                    searchTerm={searchQuery}
                  />
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
                {pagination.totalCount} donations
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

      {/* Status Update Modal */}
      {showStatusModal && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-theme-surface rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">
              Update Donation Status
            </h3>
            <p className="text-theme-muted mb-4">
              Update the status for donation #{selectedDonation.id.slice(-8)}
            </p>
            <div className="space-y-2 mb-6">
              {['completed', 'pending', 'failed'].map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={updateStatusMutation.isPending}
                  className={`w-full px-4 py-2 text-left rounded-lg border transition-colors ${
                    selectedDonation.payment_status === status
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : 'bg-theme-background border-theme text-theme-primary hover:bg-theme-hover'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
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

export default DonationManagement;
