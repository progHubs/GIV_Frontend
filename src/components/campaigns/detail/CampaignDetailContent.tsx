/**
 * Campaign Detail Content Component
 * Main content area with campaign overview, impact metrics, updates, and donation activity
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Campaign } from '../../../types';

interface CampaignDetailContentProps {
  campaign: Campaign;
}

const CampaignDetailContent: React.FC<CampaignDetailContentProps> = ({ campaign }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'updates' | 'donors'>('overview');

  // Mock data for demonstration
  const impactMetrics = [
    {
      amount: 25,
      description: 'Provides clean water for 1 family for a month',
      icon: '💧',
    },
    {
      amount: 50,
      description: 'Supplies medical equipment for 1 clinic visit',
      icon: '🏥',
    },
    {
      amount: 100,
      description: 'Funds educational materials for 5 children',
      icon: '📚',
    },
  ];

  const campaignUpdates = [
    {
      id: 1,
      title: 'Great progress on our water well project!',
      content: 'We have successfully completed 60% of the water well construction. The local community has been incredibly supportive, and we expect to finish ahead of schedule.',
      date: '2024-01-15',
      author: campaign.users?.full_name || 'Campaign Creator',
    },
    {
      id: 2,
      title: 'Thank you for your amazing support!',
      content: 'We have reached 75% of our funding goal! This incredible milestone brings us closer to providing clean water access to over 500 families in the region.',
      date: '2024-01-10',
      author: campaign.users?.full_name || 'Campaign Creator',
    },
  ];

  const recentDonors = [
    { name: 'Anonymous', amount: 100, date: '2024-01-16', message: 'Keep up the great work!' },
    { name: 'Sarah Johnson', amount: 50, date: '2024-01-16', message: 'Happy to support this cause' },
    { name: 'Michael Chen', amount: 25, date: '2024-01-15', message: '' },
    { name: 'Anonymous', amount: 200, date: '2024-01-15', message: 'Every drop counts!' },
    { name: 'Emily Davis', amount: 75, date: '2024-01-14', message: 'For a better future' },
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-theme">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'updates', label: 'Updates' },
            { key: 'donors', label: 'Donors' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-theme-muted hover:text-theme-primary hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Campaign Description */}
            <div className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme">
              <h2 className="text-2xl font-bold text-theme-primary mb-4">About This Campaign</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-theme-muted leading-relaxed whitespace-pre-line">
                  {campaign.description}
                </p>
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme">
              <h2 className="text-2xl font-bold text-theme-primary mb-6">Your Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {impactMetrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-6 border border-theme rounded-xl hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="text-4xl mb-3">{metric.icon}</div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {formatCurrency(metric.amount)}
                    </div>
                    <p className="text-sm text-theme-muted">{metric.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Campaign Details */}
            <div className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme">
              <h2 className="text-2xl font-bold text-theme-primary mb-6">Campaign Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-theme-primary mb-2">Start Date</h3>
                  <p className="text-theme-muted">{formatDate(campaign.start_date)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-theme-primary mb-2">End Date</h3>
                  <p className="text-theme-muted">{formatDate(campaign.end_date)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-theme-primary mb-2">Category</h3>
                  <p className="text-theme-muted capitalize">{campaign.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-theme-primary mb-2">Language</h3>
                  <p className="text-theme-muted uppercase">{campaign.language}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Updates Tab */}
        {activeTab === 'updates' && (
          <motion.div
            key="updates"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme">
              <h2 className="text-2xl font-bold text-theme-primary mb-6">Campaign Updates</h2>
              {campaignUpdates.length > 0 ? (
                <div className="space-y-6">
                  {campaignUpdates.map((update, index) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-l-4 border-blue-500 pl-6 pb-6 last:pb-0"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {update.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-theme-primary">{update.title}</h3>
                          <p className="text-sm text-theme-muted">
                            {update.author} • {formatDate(update.date)}
                          </p>
                        </div>
                      </div>
                      <p className="text-theme-muted leading-relaxed">{update.content}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-theme-muted mb-2">No updates yet</div>
                  <p className="text-sm text-theme-muted">
                    Check back later for campaign updates from the creator.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Donors Tab */}
        {activeTab === 'donors' && (
          <motion.div
            key="donors"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme">
              <h2 className="text-2xl font-bold text-theme-primary mb-6">Recent Donors</h2>
              {recentDonors.length > 0 ? (
                <div className="space-y-4">
                  {recentDonors.map((donor, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 border border-theme rounded-lg hover:bg-theme-background transition-colors duration-200"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {donor.name === 'Anonymous' ? '?' : donor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-theme-primary truncate">
                            {donor.name}
                          </h3>
                          <span className="text-lg font-bold text-blue-600 flex-shrink-0">
                            {formatCurrency(donor.amount)}
                          </span>
                        </div>
                        <p className="text-sm text-theme-muted mb-1">{formatDate(donor.date)}</p>
                        {donor.message && (
                          <p className="text-sm text-theme-muted italic">"{donor.message}"</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-theme-muted mb-2">No donations yet</div>
                  <p className="text-sm text-theme-muted">
                    Be the first to support this campaign!
                  </p>
                </div>
              )}
            </div>

            {/* Donation Stats */}
            <div className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme">
              <h2 className="text-2xl font-bold text-theme-primary mb-6">Donation Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {campaign.donor_count}
                  </div>
                  <p className="text-theme-muted">Total Donors</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(parseFloat(campaign.current_amount) / campaign.donor_count || 0)}
                  </div>
                  <p className="text-theme-muted">Average Donation</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {Math.round(campaign.progress_percentage)}%
                  </div>
                  <p className="text-theme-muted">Goal Reached</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetailContent;
