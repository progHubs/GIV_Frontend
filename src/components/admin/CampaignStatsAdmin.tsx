/**
 * Admin Campaign Statistics Component
 * Detailed campaign statistics for admin dashboard
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { CampaignStats } from '../../types';

interface CampaignStatsAdminProps {
  stats: CampaignStats;
}

const CampaignStatsAdmin: React.FC<CampaignStatsAdminProps> = ({ stats }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const mainStats = [
    {
      title: 'Total Campaigns',
      value: stats.total_campaigns.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      title: 'Active Campaigns',
      value: stats.active_campaigns.toLocaleString(),
      change: '+5',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      title: 'Total Raised',
      value: formatCurrency(stats.total_current_amount),
      change: '+18.2%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      title: 'Featured Campaigns',
      value: stats.featured_campaigns.toLocaleString(),
      change: '+24%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      color: 'bg-orange-500',
    },
  ];

  const categoryStats = stats.category_breakdown.map(categoryData => ({
    category: categoryData.category.charAt(0).toUpperCase() + categoryData.category.slice(1),
    count: categoryData.count,
    percentage: ((categoryData.count / stats.total_campaigns) * 100).toFixed(1),
    color:
      {
        health: 'bg-red-500',
        education: 'bg-blue-500',
        environment: 'bg-green-500',
        community: 'bg-purple-500',
      }[categoryData.category] || 'bg-gray-500',
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Main Statistics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {mainStats.map(stat => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}
              >
                {stat.icon}
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-theme-primary">{stat.value}</h3>
              <p className="text-theme-muted text-sm">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Category Breakdown and Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          variants={itemVariants}
          className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme"
        >
          <h3 className="text-lg font-semibold text-theme-primary mb-4">Campaigns by Category</h3>
          <div className="space-y-4">
            {categoryStats.map(category => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${category.color} rounded-full mr-3`} />
                  <span className="text-theme-primary font-medium">{category.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-theme-muted text-sm">{category.count}</span>
                  <span className="text-theme-muted text-sm">({category.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Additional Metrics */}
        <motion.div
          variants={itemVariants}
          className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme"
        >
          <h3 className="text-lg font-semibold text-theme-primary mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-theme-muted">Goal Amount</span>
              <span className="text-theme-primary font-semibold">
                {formatCurrency(stats.total_goal_amount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-theme-muted">Current Amount</span>
              <span className="text-theme-primary font-semibold">
                {formatCurrency(stats.total_current_amount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-theme-muted">Featured Campaigns</span>
              <span className="text-theme-primary font-semibold">{stats.featured_campaigns}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-theme-muted">Overall Progress</span>
              <span className="text-theme-primary font-semibold">
                {stats.overall_progress_percentage}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Monthly Progress Chart Placeholder */}
      <motion.div
        variants={itemVariants}
        className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme"
      >
        <h3 className="text-lg font-semibold text-theme-primary mb-4">Monthly Progress</h3>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-theme-muted">Monthly progress chart would be displayed here</p>
            <p className="text-sm text-theme-muted mt-1">
              Integration with charting library (Chart.js, Recharts, etc.)
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CampaignStatsAdmin;
