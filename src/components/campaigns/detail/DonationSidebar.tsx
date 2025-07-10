/**
 * Donation Sidebar Component
 * Sticky sidebar with donation form, progress visualization, and campaign stats
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Campaign } from '../../../types';

interface DonationSidebarProps {
  campaign: Campaign;
}

const DonationSidebar: React.FC<DonationSidebarProps> = ({ campaign }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationType, setDonationType] = useState<'one_time' | 'recurring'>('one_time');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Predefined donation amounts
  const donationAmounts = [25, 50, 100, 250];

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

  // Handle amount selection
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  // Handle custom amount change
  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  // Get final donation amount
  const getFinalAmount = () => {
    if (customAmount) {
      const amount = parseFloat(customAmount);
      return isNaN(amount) ? 0 : amount;
    }
    return selectedAmount || 0;
  };

  // Handle donation submission
  const handleDonate = async () => {
    const amount = getFinalAmount();
    if (amount < 1) {
      alert('Please enter a valid donation amount');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement donation logic
      console.log('Donation data:', {
        campaignId: campaign.id,
        amount,
        type: donationType,
        isAnonymous,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Thank you for your donation!');
    } catch (error) {
      console.error('Donation error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-theme-surface rounded-2xl shadow-lg border border-theme p-6 space-y-6"
    >
      {/* Progress Section */}
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
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-lg font-semibold text-theme-primary">
            {campaign.donor_count}
          </div>
          <div className="text-xs text-theme-muted">Donors</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-theme-primary">
            {daysRemaining}
          </div>
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

      {/* Donation Form */}
      <div className="space-y-4">
        {/* Donation Type */}
        <div>
          <label className="block text-sm font-medium text-theme-primary mb-2">
            Donation Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDonationType('one_time')}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                donationType === 'one_time'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-theme-background text-theme-primary border-theme hover:border-blue-300'
              }`}
            >
              One-time
            </button>
            <button
              onClick={() => setDonationType('recurring')}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                donationType === 'recurring'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-theme-background text-theme-primary border-theme hover:border-blue-300'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Donation Amounts */}
        <div>
          <label className="block text-sm font-medium text-theme-primary mb-2">
            Select Amount
          </label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {donationAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`px-3 py-3 text-sm font-medium rounded-lg border transition-colors duration-200 ${
                  selectedAmount === amount
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-theme-background text-theme-primary border-theme hover:border-blue-300'
                }`}
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-muted">
              $
            </span>
            <input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="w-full pl-8 pr-3 py-3 border border-theme rounded-lg bg-theme-background text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              step="0.01"
            />
          </div>
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-theme-background border-theme rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="anonymous" className="ml-2 text-sm text-theme-muted">
            Donate anonymously
          </label>
        </div>

        {/* Donate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDonate}
          disabled={isLoading || getFinalAmount() < 1 || !campaign.is_active}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            isLoading || getFinalAmount() < 1 || !campaign.is_active
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : !campaign.is_active ? (
            'Campaign Ended'
          ) : (
            `Donate ${getFinalAmount() > 0 ? formatCurrency(getFinalAmount()) : ''}`
          )}
        </motion.button>

        {/* Security Note */}
        <div className="text-xs text-theme-muted text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure payment</span>
          </div>
          <div>Your donation is protected by SSL encryption</div>
        </div>
      </div>

      {/* Campaign Creator */}
      {campaign.users && (
        <div className="pt-4 border-t border-theme">
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
        </div>
      )}
    </motion.div>
  );
};

export default DonationSidebar;
