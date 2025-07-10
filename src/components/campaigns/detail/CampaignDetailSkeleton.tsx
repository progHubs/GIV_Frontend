/**
 * Campaign Detail Skeleton Component
 * Loading skeleton for campaign detail page
 */

import React from 'react';
import { motion } from 'framer-motion';

const CampaignDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-theme-background">
      {/* Hero Section Skeleton */}
      <div className="relative h-96 bg-gray-200 dark:bg-gray-700 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        
        {/* Breadcrumb Skeleton */}
        <div className="absolute top-6 left-6">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Hero Content Skeleton */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="space-y-4">
            <div className="w-20 h-6 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            <div className="w-3/4 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="w-1/2 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Content Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign Overview Skeleton */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme"
            >
              <div className="space-y-4">
                <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ))}
                  <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </motion.div>

            {/* Impact Metrics Skeleton */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme"
            >
              <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 border border-theme rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-3"></div>
                    <div className="w-12 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Updates Skeleton */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme"
            >
              <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="p-4 border border-theme rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                        <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Donation Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme sticky top-24"
            >
              {/* Progress Section Skeleton */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mx-auto mb-4"></div>
                  <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-2"></div>
                  <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-1"></div>
                      <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
                    </div>
                  ))}
                </div>

                {/* Donation Amounts Skeleton */}
                <div className="space-y-3">
                  <div className="w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>

                {/* Donate Button Skeleton */}
                <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>

                {/* Creator Info Skeleton */}
                <div className="pt-4 border-t border-theme">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                      <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Related Campaigns Skeleton */}
      <div className="bg-theme-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-theme-background rounded-2xl shadow-lg border border-theme overflow-hidden"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="w-full h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="flex justify-between items-center">
                    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailSkeleton;
