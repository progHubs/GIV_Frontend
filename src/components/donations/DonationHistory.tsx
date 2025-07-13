/**
 * Donation History Component
 * Displays user's donation history with pagination and filtering
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUserDonationHistory } from '../../hooks/useDonations';
import { useStripeUtils } from '../../hooks/useStripe';
import DonationCard from './DonationCard';

interface DonationHistoryProps {
  className?: string;
}

const DonationHistory: React.FC<DonationHistoryProps> = ({ className = '' }) => {
  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }>({
    page: 1,
    limit: 10,
    sortBy: 'donated_at',
    sortOrder: 'desc',
  });

  const { data: donationsData, isLoading, error } = useUserDonationHistory(filters);
  const { formatCurrency } = useStripeUtils();

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Handle sort change
  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  // Calculate totals
  const donations = donationsData?.data || [];
  const pagination = (donationsData?.pagination || {
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

  const totalDonated = donations.reduce((sum, donation) => {
    return sum + parseFloat(donation.amount);
  }, 0);

  const completedDonations = donations.filter(d => d.payment_status === 'completed');
  const recurringDonations = donations.filter(d => d.donation_type === 'recurring');

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-theme-primary">Donation History</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-theme-surface rounded-lg p-4 animate-pulse">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-24"></div>
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-20"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Donations</h3>
        <p className="text-red-600">
          Failed to load your donation history. Please try again later.
        </p>
      </div>
    );
  }

  if (!donations.length) {
    return (
      <div className={`text-center py-8 ${className}`}>
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
        <h3 className="text-lg font-semibold text-theme-primary mb-2">No Donations Yet</h3>
        <p className="text-theme-muted mb-4">
          You haven't made any donations yet. Start supporting causes you care about!
        </p>
        <Link
          to="/campaigns"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Explore Campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-theme-primary">Donation History</h3>
          <p className="text-theme-muted text-sm">
            {pagination.totalCount || donations.length} total donations
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-theme-primary">{formatCurrency(totalDonated)}</div>
            <div className="text-theme-muted">Total Donated</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-theme-primary">{completedDonations.length}</div>
            <div className="text-theme-muted">Completed</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-theme-primary">{recurringDonations.length}</div>
            <div className="text-theme-muted">Recurring</div>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-theme-muted">Sort by:</span>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={e => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              handleSortChange(sortBy, sortOrder as 'asc' | 'desc');
            }}
            className="text-sm border border-theme rounded px-2 py-1 bg-theme-background text-theme-primary"
          >
            <option value="donated_at-desc">Newest First</option>
            <option value="donated_at-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Donations List */}
      <div className="space-y-4">
        {donations.map((donation, index) => (
          <motion.div
            key={donation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DonationCard
              donation={donation}
              showCampaign={true}
              showDonor={false}
              showActions={true}
            />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-theme-muted">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of{' '}
            {pagination.totalCount} donations
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 text-sm border border-theme rounded bg-theme-background text-theme-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-theme-hover"
            >
              Previous
            </button>

            <span className="text-sm text-theme-muted">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 text-sm border border-theme rounded bg-theme-background text-theme-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-theme-hover"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Load More Button (alternative to pagination) */}
      {pagination.hasNextPage && (
        <div className="text-center">
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Load More Donations
          </button>
        </div>
      )}
    </div>
  );
};

export default DonationHistory;
