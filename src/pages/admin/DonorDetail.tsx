/**
 * Admin Donor Detail Page
 * Detailed view of a specific donor with tier management
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useDonorProfile, useRecalculateSingleTier } from '../../hooks/useDonations';
import { useStripeUtils } from '../../hooks/useStripe';
import TierBadge from '../../components/common/TierBadge';

const DonorDetail: React.FC = () => {
  const { donorId } = useParams<{ donorId: string }>();
  const navigate = useNavigate();
  const { formatCurrency } = useStripeUtils();

  const { data: donor, isLoading, error } = useDonorProfile(donorId);
  const recalculateTierMutation = useRecalculateSingleTier();

  const handleRecalculateTier = async () => {
    if (!donorId) return;

    try {
      await recalculateTierMutation.mutateAsync(donorId);
    } catch (error) {
      console.error('Failed to recalculate tier:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-theme-primary">Loading Donor Details...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !donor) {
    return (
      <div className="min-h-screen bg-theme-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Donor</h3>
            <p className="text-red-600">Failed to load donor details. Please try again later.</p>
            <button
              onClick={() => navigate('/admin/donors')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Donors
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-background p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/donors')}
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
                Back to Donors
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRecalculateTier}
              disabled={recalculateTierMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              {recalculateTierMutation.isPending ? 'Recalculating...' : 'Recalculate Tier'}
            </motion.button>
          </div>

          {/* Donor Info Card */}
          <div className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-theme-primary mb-2">
                  {donor.users?.full_name || donor.users?.email || 'Anonymous Donor'}
                </h1>
                {donor.users?.email && <p className="text-theme-muted">{donor.users.email}</p>}
              </div>

              <div className="flex items-center space-x-3">
                {donor.donation_tier && (
                  <TierBadge tier={donor.donation_tier} size="lg" animated={true} />
                )}
                {donor.is_anonymous && (
                  <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                    Anonymous
                  </span>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">Total Donated</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(parseFloat(donor.total_donated || '0'))}
                    </p>
                  </div>
                  <div className="text-green-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Donation Frequency</p>
                    <p className="text-xl font-bold text-blue-900">
                      {donor.donation_frequency || 'One-time'}
                    </p>
                  </div>
                  <div className="text-blue-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-medium">Last Donation</p>
                    <p className="text-lg font-bold text-purple-900">
                      {donor.last_donation_date
                        ? new Date(donor.last_donation_date).toLocaleDateString()
                        : 'Never'}
                    </p>
                  </div>
                  <div className="text-purple-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-theme">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-theme-primary mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Email:</span> {donor.users?.email || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Member Since:</span>{' '}
                      {new Date(donor.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-theme-primary mb-2">Donor Preferences</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Anonymous Donations:</span>{' '}
                      {donor.is_anonymous ? 'Yes' : 'No'}
                    </p>
                    <p>
                      <span className="font-medium">Donation Type:</span>{' '}
                      {donor.donation_frequency ? 'Recurring' : 'One-time'}
                    </p>
                    <p>
                      <span className="font-medium">Current Tier:</span>{' '}
                      {donor.donation_tier
                        ? donor.donation_tier.charAt(0).toUpperCase() + donor.donation_tier.slice(1)
                        : 'None'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tier Recalculation Result */}
          {recalculateTierMutation.isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-600"
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
                <p className="text-green-800 font-medium">Tier recalculated successfully!</p>
              </div>
            </motion.div>
          )}

          {recalculateTierMutation.isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <p className="text-red-800 font-medium">
                  Failed to recalculate tier. Please try again.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DonorDetail;
