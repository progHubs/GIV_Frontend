/**
 * Related Campaigns Component
 * Shows related campaigns and recommendations
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Campaign } from '../../../types';
import { useCampaigns } from '../../../hooks/useCampaigns';

interface RelatedCampaignsProps {
  currentCampaign: Campaign;
}

const RelatedCampaigns: React.FC<RelatedCampaignsProps> = ({ currentCampaign }) => {
  // Fetch related campaigns (same category, excluding current campaign)
  const { data: campaignsData, isLoading } = useCampaigns({
    category: currentCampaign.category,
    is_active: true,
    limit: 6,
    page: 1,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const apiData = campaignsData as any;
  const allCampaigns = apiData?.data || [];

  // Filter out current campaign and limit to 3
  const relatedCampaigns = allCampaigns
    .filter((campaign: Campaign) => campaign.id !== currentCampaign.id)
    .slice(0, 3);

  // Format currency
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      healthcare: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      education: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      community_development:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      emergency_relief: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      youth_development: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      mental_health: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      disease_prevention: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      environmental: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    };
    return (
      colors[category as keyof typeof colors] ||
      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    );
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

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
        duration: 0.6,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="bg-theme-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-theme-primary mb-8">Related Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-theme-background rounded-2xl shadow-lg border border-theme overflow-hidden"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="w-full h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="flex justify-between items-center">
                    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (relatedCampaigns.length === 0) {
    return null;
  }

  return (
    <div className="bg-theme-surface py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-theme-primary mb-4">
              More{' '}
              {currentCampaign.category.charAt(0).toUpperCase() + currentCampaign.category.slice(1)}{' '}
              Campaigns
            </h2>
            <p className="text-theme-muted max-w-2xl mx-auto">
              Discover other impactful campaigns in the {currentCampaign.category} category that
              need your support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCampaigns.map((campaign: Campaign) => (
              <motion.div
                key={campaign.id}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-theme-background rounded-2xl shadow-lg border border-theme overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/campaigns/${campaign.slug || campaign.id}`} className="block">
                  {/* Campaign Image */}
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

                    {/* Category badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(campaign.category)}`}
                      >
                        {campaign.category
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>

                  {/* Campaign Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-theme-primary mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
                      {campaign.title}
                    </h3>

                    {/* Description */}
                    <p className="text-theme-muted text-sm mb-4 line-clamp-3">
                      {campaign.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-theme-muted">
                          {formatCurrency(campaign.current_amount)} raised
                        </span>
                        <span className="text-theme-muted">
                          {Math.round(campaign.progress_percentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(campaign.progress_percentage, 100)}%`,
                            backgroundColor: campaign.progress_bar_color || '#3B82F6',
                          }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-theme-muted">
                        <div>{getDaysRemaining(campaign.end_date)} days left</div>
                        <div className="mt-1">{campaign.donor_count} donors</div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={e => {
                          e.preventDefault();
                          // Navigate to campaign detail page using slug
                          window.location.href = `/campaigns/${campaign.slug || campaign.id}`;
                        }}
                        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                      >
                        View Campaign
                      </motion.button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div variants={itemVariants} className="text-center mt-12">
            <Link
              to={`/campaigns?category=${currentCampaign.category}`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              View All{' '}
              {currentCampaign.category.charAt(0).toUpperCase() + currentCampaign.category.slice(1)}{' '}
              Campaigns
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RelatedCampaigns;
