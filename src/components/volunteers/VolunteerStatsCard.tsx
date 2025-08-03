/**
 * Volunteer Stats Card Component
 * Display volunteer statistics in a card format
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { VolunteerStats } from '../../types/volunteer';

interface VolunteerStatsCardProps {
  stats?: any; // Using any to handle both VolunteerStats and VolunteerStatistics types
  loading?: boolean;
  className?: string;
}

const VolunteerStatsCard: React.FC<VolunteerStatsCardProps> = ({
  stats,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No statistics available</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Statistics will appear once you start volunteering.
          </p>
        </div>
      </div>
    );
  }

  // Handle both snake_case and camelCase properties from different API responses
  const getValue = (value: any): number => {
    if (typeof value === 'number') return value;
    return 0;
  };

  const statItems = [
    {
      label: 'Total Volunteers',
      value: getValue(stats.total_volunteers || stats.totalVolunteers),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'blue',
    },
    {
      label: 'Active Volunteers',
      value: getValue(stats.active_volunteers || stats.activeVolunteers),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 616 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green',
    },
    {
      label: 'Pending Applications',
      value: getValue(stats.pendingApplications || stats.pending_applications || stats.backgroundCheckStatus?.pending || 0),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'yellow',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Stats Grid - Ultra Compact Version */}
      <div className="p-2">
        <div className="flex justify-between items-center">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2"
            >
              <div className={`inline-flex items-center justify-center w-5 h-5 rounded ${getColorClasses(item.color)}`}>
                <div className="w-3 h-3">
                  {item.icon}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 leading-none">
                  {item.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>




      </div>
    </div>
  );
};

export default VolunteerStatsCard;
