/**
 * Donation Sidebar Component
 * Sticky sidebar with donation form, progress visualization, and campaign stats
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import DonationForm from '../../donations/DonationForm';
import { donationQueryKeys } from '../../../hooks/useDonations';
import type { Campaign } from '../../../types';

interface DonationSidebarProps {
  campaign: Campaign;
}

const DonationSidebar: React.FC<DonationSidebarProps> = ({ campaign }) => {
  const queryClient = useQueryClient();
  // Calculate progress
  const currentAmount = parseFloat(campaign.current_amount);
  const goalAmount = parseFloat(campaign.goal_amount);
  const progressPercentage = Math.min((currentAmount / goalAmount) * 100, 100);

  // Calculate days remaining
  const getDaysRemaining = () => {
    const endDate = new Date(campaign.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle donation success
  const handleDonationSuccess = () => {
    // Invalidate queries to refresh campaign and donation data
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    queryClient.invalidateQueries({ queryKey: donationQueryKeys.campaignDonations(campaign.id) });
    queryClient.invalidateQueries({ queryKey: donationQueryKeys.all });

  };

  // Handle donation error
  const handleDonationError = (error: string) => {
    // Show error alert to user
    alert(`Donation failed: ${error}`);
    console.error('Donation error:', error);
  };

  return (
    <div className="space-y-6">
      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-theme-surface rounded-2xl shadow-lg border border-theme p-6"
      >
        <div className="text-center">
          {/* Circular Progress */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke={campaign.progress_bar_color || '#3B82F6'}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - progressPercentage / 100)}`}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-theme-primary">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          {/* Amount Progress */}
          <div className="space-y-1">
            <div className="text-2xl font-bold text-theme-primary">
              {formatCurrency(currentAmount)}
            </div>
            <div className="text-sm text-theme-muted">
              raised of {formatCurrency(goalAmount)} goal
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-center mt-6">
          <div>
            <div className="text-lg font-semibold text-theme-primary">{campaign.donor_count}</div>
            <div className="text-xs text-theme-muted">Donors</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-theme-primary">{daysRemaining}</div>
            <div className="text-xs text-theme-muted">Days left</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-theme-primary">
              {Math.round(progressPercentage)}%
            </div>
            <div className="text-xs text-theme-muted">Funded</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-theme-primary">
              {formatCurrency(goalAmount - currentAmount)}
            </div>
            <div className="text-xs text-theme-muted">To go</div>
          </div>
        </div>
      </motion.div>

      {/* Donation Form */}
      <DonationForm
        campaign={campaign}
        onSuccess={handleDonationSuccess}
        onError={handleDonationError}
      />

      {/* Campaign Creator */}
      {campaign.users && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-theme-surface rounded-2xl shadow-lg border border-theme p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {campaign.users.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-theme-primary">
                {campaign.users.full_name}
              </div>
              <div className="text-xs text-theme-muted">Campaign Creator</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DonationSidebar;
