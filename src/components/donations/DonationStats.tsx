/**
 * Donation Stats Component
 * Displays user's donation statistics and donor profile information
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useCurrentUserDonorProfile, useUserDonationHistory } from '../../hooks/useDonations';
import { useStripeUtils } from '../../hooks/useStripe';
import { DONATION_TIERS } from '../../types/donation';
import type { DonationTier } from '../../types/donation';

interface DonationStatsProps {
  className?: string;
}

const DonationStats: React.FC<DonationStatsProps> = ({ className = '' }) => {
  const { data: donorProfile, isLoading: profileLoading } = useCurrentUserDonorProfile();
  const { data: donationsData, isLoading: historyLoading } = useUserDonationHistory({ limit: 100 });
  const { formatCurrency } = useStripeUtils();

  const isLoading = profileLoading || historyLoading;
  const donations = donationsData?.data || [];

  // Helper function to safely parse amount
  const safeParseAmount = (amount: any): number => {
    if (amount === null || amount === undefined) return 0;
    const parsed = parseFloat(String(amount));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Helper function to safely parse date
  const safeParseDate = (dateStr: any): Date => {
    if (!dateStr) return new Date(0); // Return epoch if no date
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date(0) : date;
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    const completedDonations = donations.filter(d => d.payment_status === 'completed');
    const recurringDonations = donations.filter(d => d.donation_type === 'recurring');
    const oneTimeDonations = donations.filter(d => d.donation_type === 'one_time');

    const totalAmount = completedDonations.reduce((sum, d) => sum + safeParseAmount(d.amount), 0);
    const averageAmount =
      completedDonations.length > 0 ? totalAmount / completedDonations.length : 0;

    const thisYear = new Date().getFullYear();
    const thisYearDonations = completedDonations.filter(d => {
      const donationDate = safeParseDate(d.donated_at);
      return donationDate.getFullYear() === thisYear;
    });
    const thisYearAmount = thisYearDonations.reduce((sum, d) => sum + safeParseAmount(d.amount), 0);

    return {
      totalDonations: completedDonations.length,
      totalAmount,
      averageAmount,
      recurringCount: recurringDonations.length,
      oneTimeCount: oneTimeDonations.length,
      thisYearAmount,
      thisYearCount: thisYearDonations.length,
    };
  }, [donations]);

  // Get tier information
  const getTierInfo = (tier: DonationTier | undefined) => {
    if (!tier) return null;
    return DONATION_TIERS[tier];
  };

  const tierInfo = getTierInfo(donorProfile?.donation_tier);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-theme-surface rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!donorProfile && donations.length === 0) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-6 text-center ${className}`}>
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
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
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Start Your Giving Journey</h3>
        <p className="text-blue-700">
          Make your first donation to unlock your donor profile and track your impact!
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Donor Tier Card */}
      {donorProfile && tierInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-theme-primary">Donor Status</h3>
              <p className="text-theme-muted text-sm">Your current giving tier</p>
            </div>
            <div
              className="px-4 py-2 rounded-full text-white font-medium"
              style={{ backgroundColor: tierInfo.color }}
            >
              {tierInfo.name}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-theme-primary">
                {formatCurrency(parseFloat(donorProfile.total_donated))}
              </div>
              <div className="text-sm text-theme-muted">Total Contributed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-theme-primary">
                {donorProfile.is_recurring_donor ? 'Yes' : 'No'}
              </div>
              <div className="text-sm text-theme-muted">Recurring Donor</div>
            </div>
          </div>

          {/* Tier Benefits */}
          <div className="mt-4 pt-4 border-t border-blue-200">
            <h4 className="font-medium text-theme-primary mb-2">Your Benefits:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {tierInfo.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-sm text-theme-muted">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-theme-surface rounded-lg p-4 shadow-sm border border-theme"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-theme-primary">{stats.totalDonations}</div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-600"
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
          <div className="text-sm text-theme-muted">Total Donations</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-theme-surface rounded-lg p-4 shadow-sm border border-theme"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-theme-primary">
              {formatCurrency(stats.totalAmount)}
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-green-600"
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
          <div className="text-sm text-theme-muted">Total Amount</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-theme-surface rounded-lg p-4 shadow-sm border border-theme"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-theme-primary">
              {formatCurrency(stats.averageAmount)}
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <div className="text-sm text-theme-muted">Average Donation</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-theme-surface rounded-lg p-4 shadow-sm border border-theme"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-theme-primary">
              {formatCurrency(stats.thisYearAmount)}
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="text-sm text-theme-muted">This Year</div>
        </motion.div>
      </div>

      {/* Donation Type Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-theme-surface rounded-lg p-6 shadow-sm border border-theme"
      >
        <h3 className="text-lg font-semibold text-theme-primary mb-4">Donation Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-theme-muted">One-time Donations</span>
              <span className="font-medium text-theme-primary">{stats.oneTimeCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${stats.totalDonations > 0 ? (stats.oneTimeCount / stats.totalDonations) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-theme-muted">Recurring Donations</span>
              <span className="font-medium text-theme-primary">{stats.recurringCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${stats.totalDonations > 0 ? (stats.recurringCount / stats.totalDonations) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Last Donation Info */}
      {donorProfile?.last_donation_date && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-theme-surface rounded-lg p-4 shadow-sm border border-theme"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-theme-muted">Last Donation</div>
              <div className="font-medium text-theme-primary">
                {(() => {
                  const date = safeParseDate(donorProfile.last_donation_date);
                  if (date.getTime() === 0) return 'Unknown';
                  return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                })()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-theme-muted">Frequency</div>
              <div className="font-medium text-theme-primary capitalize">
                {donorProfile.donation_frequency || 'Varies'}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DonationStats;
