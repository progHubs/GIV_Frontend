/**
 * Campaign Card Component
 * Individual campaign card with image, progress, and donation button
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Campaign } from '../../types';

interface CampaignCardProps {
  campaign: Campaign;
  showDonateButton?: boolean;
  showProgress?: boolean;
  className?: string;
  onClick?: (campaign: Campaign) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  showDonateButton = true,
  showProgress = true,
  className = '',
  onClick,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick(campaign);
    } else {
      // Default behavior: navigate to campaign detail page using slug
      navigate(`/campaigns/${campaign.slug || campaign.id}`);
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      education: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      environment: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      community: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    };
    return (
      colors[category as keyof typeof colors] ||
      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    );
  };

  const getStatusBadge = () => {
    if (campaign.is_featured) {
      return (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            ⭐ Featured
          </span>
        </div>
      );
    }

    if (!campaign.is_active) {
      return (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
            Inactive
          </span>
        </div>
      );
    }

    return null;
  };

  const daysLeft = () => {
    const endDate = new Date(campaign.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Ended';
    if (diffDays === 0) return 'Last day';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  return (
    <motion.div
      // whileHover={{ y: -4, scale: 1.02 }}
      // transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className={`bg-theme-surface rounded-2xl overflow-hidden shadow-lg border border-theme hover:shadow-xl transition-all duration-300 cursor-pointer ${className}`}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {campaign.image_url ? (
          <img
            src={campaign.image_url}
            alt={campaign.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
            <div className="text-white text-4xl font-bold opacity-50">
              {campaign.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Status badge */}
        {getStatusBadge()}

        {/* Category badge */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(campaign.category)}`}
          >
            {campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-theme-primary mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
          {campaign.title}
        </h3>

        {/* Description */}
        <p className="text-theme-muted text-sm mb-4 line-clamp-3">{campaign.description}</p>

        {/* Progress Section */}
        {showProgress && (
          <div className="mb-4">
            {campaign.goal_amount && campaign.progress_percentage !== null ? (
              // Campaign with goal - show progress bar
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-theme-primary">
                    {formatCurrency(campaign.current_amount)} raised
                  </span>
                  <span className="text-sm text-theme-muted">{campaign.progress_percentage}%</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(campaign.progress_percentage, 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: campaign.progress_bar_color || '#3B82F6' }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-theme-muted">
                  <span>Goal: {formatCurrency(campaign.goal_amount)}</span>
                  <span>{campaign.donor_count} donors</span>
                </div>
              </>
            ) : (
              // Campaign without goal - show raised amount and donors only
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-theme-primary">
                    {formatCurrency(campaign.current_amount)} raised
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
                    Open Goal
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-theme-muted">
                  <span>Any amount welcome</span>
                  <span>{campaign.donor_count} donors</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-theme-muted">
            <div>{daysLeft()}</div>
            {campaign.users && <div className="mt-1">By {campaign.users.full_name}</div>}
          </div>

          {showDonateButton && campaign.is_active && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={e => {
                e.stopPropagation();
                // Navigate to campaign detail page with donation focus using slug
                navigate(`/campaigns/${campaign.slug || campaign.id}#donate`);
              }}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Donate
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignCard;
