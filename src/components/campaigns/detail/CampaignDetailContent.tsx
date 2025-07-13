/**
 * Campaign Detail Content Component
 * Main content area with campaign overview, impact metrics, updates, and donation activity
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCampaignDonations } from '../../../hooks/useDonations';
import { useStripeUtils } from '../../../hooks/useStripe';
import type { Campaign, SuccessStory } from '../../../types';

interface CampaignDetailContentProps {
  campaign: Campaign;
}

const CampaignDetailContent: React.FC<CampaignDetailContentProps> = ({ campaign }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stories' | 'donors'>('overview');

  // Fetch real donation data for this campaign
  const { data: donationsData, isLoading: donationsLoading } = useCampaignDonations(campaign.id, {
    limit: 10,
    sortBy: 'donated_at',
    sortOrder: 'desc',
  });
  const { formatCurrency } = useStripeUtils();

  // Helper function to safely parse success stories
  const parseSuccessStories = (stories: any): SuccessStory[] => {
    if (!stories) return [];
    if (Array.isArray(stories)) return stories;
    if (typeof stories === 'string') {
      try {
        const parsed = JSON.parse(stories);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Get safely parsed success stories
  const successStories = parseSuccessStories(campaign.success_stories);

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

  // Transform real donation data for display
  const recentDonors = React.useMemo(() => {
    if (!donationsData?.data) return [];

    return donationsData.data.map(donation => ({
      name: donation.is_anonymous
        ? 'Anonymous'
        : donation.donor_profiles?.users?.full_name || 'Anonymous',
      amount: parseFloat(donation.amount),
      date: donation.donated_at,
      message: donation.notes || '',
    }));
  }, [donationsData]);

  // Format date
  const formatDate = (dateInput: any) => {
    // Handle null, undefined, empty string, or empty object
    if (
      !dateInput ||
      dateInput === 'null' ||
      dateInput === 'undefined' ||
      dateInput === '' ||
      (typeof dateInput === 'object' && Object.keys(dateInput).length === 0)
    ) {
      return 'N/A';
    }

    try {
      // Handle different date formats
      let date: Date;

      // If it's already a Date object
      if (dateInput instanceof Date) {
        date = dateInput;
      } else if (typeof dateInput === 'string') {
        // Convert string to date
        date = new Date(dateInput);
      } else {
        // For any other type, try to convert to string first
        console.warn('Unexpected date type received:', typeof dateInput, dateInput);
        return 'N/A';
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date received:', dateInput);
        return 'N/A';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error, 'Input:', dateInput);
      return 'N/A';
    }
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
            { key: 'stories', label: 'Success Stories' },
            { key: 'donors', label: 'Donors' },
          ].map(tab => (
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

        {/* Success Stories Tab */}
        {activeTab === 'stories' && (
          <motion.div
            key="stories"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme">
              <h2 className="text-2xl font-bold text-theme-primary mb-6">Success Stories</h2>
              {successStories.length > 0 ? (
                <div className="space-y-6">
                  {successStories.map((story, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-theme rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Story Image */}
                        {story.image_url && (
                          <div className="md:w-1/3">
                            <img
                              src={story.image_url}
                              alt={story.title}
                              className="w-full h-48 md:h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}

                        {/* Story Content */}
                        <div className={story.image_url ? 'md:w-2/3' : 'w-full'}>
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-theme-primary">
                              {story.title}
                            </h3>
                            <span className="text-sm text-theme-muted flex-shrink-0 ml-4">
                              {formatDate(story.date)}
                            </span>
                          </div>
                          <p className="text-theme-muted leading-relaxed">{story.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🌟</div>
                  <div className="text-theme-muted mb-2">No success stories yet</div>
                  <p className="text-sm text-theme-muted">
                    Success stories will appear here as the campaign achieves its goals.
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
              {donationsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-4 p-4 border border-theme rounded-lg animate-pulse"
                    >
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : recentDonors.length > 0 ? (
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
                  <p className="text-sm text-theme-muted">Be the first to support this campaign!</p>
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
                    {formatCurrency(
                      parseFloat(campaign.current_amount) / campaign.donor_count || 0
                    )}
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
