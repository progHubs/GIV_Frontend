/**
 * Tier Badge Component
 * Displays donation tier as a styled badge
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { DonationTier } from '../../types/donation';

interface TierBadgeProps {
  tier: DonationTier;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  size = 'md',
  showIcon = true,
  showLabel = true,
  animated = true,
  className = '',
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3',
      text: 'text-xs font-medium',
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      text: 'text-sm font-semibold',
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
      text: 'text-base font-bold',
    },
  };

  // Tier configurations
  const tierConfig = {
    bronze: {
      name: 'Bronze',
      bgColor: 'bg-gradient-to-r from-orange-100 to-orange-200',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-300',
      icon: (
        <svg className={sizeConfig[size].icon} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22L12 19L5.82 22L7 14L2 9L10.91 8.26L12 2Z" />
        </svg>
      ),
    },
    silver: {
      name: 'Silver',
      bgColor: 'bg-gradient-to-r from-gray-100 to-gray-200',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-300',
      icon: (
        <svg className={sizeConfig[size].icon} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22L12 19L5.82 22L7 14L2 9L10.91 8.26L12 2Z" />
        </svg>
      ),
    },
    gold: {
      name: 'Gold',
      bgColor: 'bg-gradient-to-r from-yellow-100 to-yellow-200',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300',
      icon: (
        <svg className={sizeConfig[size].icon} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22L12 19L5.82 22L7 14L2 9L10.91 8.26L12 2Z" />
        </svg>
      ),
    },
    platinum: {
      name: 'Platinum',
      bgColor: 'bg-gradient-to-r from-purple-100 to-purple-200',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-300',
      icon: (
        <svg className={sizeConfig[size].icon} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22L12 19L5.82 22L7 14L2 9L10.91 8.26L12 2Z" />
        </svg>
      ),
    },
  };

  if (!tier || !tierConfig[tier]) {
    return null;
  }

  const config = tierConfig[tier];
  const sizeClasses = sizeConfig[size];

  const badgeContent = (
    <div
      className={`
        inline-flex items-center space-x-1.5 rounded-full border
        ${sizeClasses.container}
        ${config.bgColor}
        ${config.textColor}
        ${config.borderColor}
        ${className}
      `}
    >
      {showIcon && (
        <div className="flex-shrink-0">
          {config.icon}
        </div>
      )}
      {showLabel && (
        <span className={sizeClasses.text}>
          {config.name}
        </span>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.05 }}
        className="inline-block"
      >
        {badgeContent}
      </motion.div>
    );
  }

  return badgeContent;
};

export default TierBadge;
