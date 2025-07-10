/**
 * Campaign Card Skeleton Component
 * Loading skeleton for campaign cards during data fetching
 */

import React from 'react';
import { motion } from 'framer-motion';

const CampaignCardSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-theme-surface rounded-2xl shadow-lg border border-theme overflow-hidden"
    >
      {/* Image Skeleton */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Category Badge Skeleton */}
        <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Progress Bar Skeleton */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse">
            <div className="h-full w-1/3 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
          </div>
          <div className="flex justify-between">
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    </motion.div>
  );
};

export default CampaignCardSkeleton;
