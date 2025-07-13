/**
 * Campaigns Page
 * Main campaigns listing page with hero section, filters, and campaign grid
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from '../theme';
import ModernNavigation from '../components/navigation/ModernNavigation';
import Footer from '../components/layout/Footer';
import CampaignHero from '../components/campaigns/CampaignHero';
import CampaignFilters from '../components/campaigns/CampaignFilters';
import CampaignGrid from '../components/campaigns/CampaignGrid';
// import CampaignStats from '../components/campaigns/CampaignStats';
import CampaignImpactMap from '../components/campaigns/CampaignImpactMap';
import CampaignPartners from '../components/campaigns/CampaignPartners';
import NewsletterSignup from '../components/home/NewsletterSignup';
import { useCampaigns, useCampaignStats } from '../hooks/useCampaigns';
import type { CampaignFilters as CampaignFiltersType } from '../types';

const CampaignsPage: React.FC = () => {
  // Local state for filters (consistent with admin page)
  // Default to show only active and non-completed campaigns
  const [filters, setFilters] = useState<CampaignFiltersType>({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc',
    language: 'en',
    is_active: true,
    is_completed: false,
  });

  // Use React Query hooks
  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    error: campaignsError,
  } = useCampaigns(filters);
  const { data: stats, isLoading: statsLoading } = useCampaignStats();

  // Handle filter changes (consistent with admin page)
  const updateFilters = useCallback((newFilters: Partial<CampaignFiltersType>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);

  // Extract data from React Query responses (consistent with admin page)
  const apiData = campaignsData as any;
  const campaigns = apiData?.data || [];
  const pagination = apiData?.pagination || {};
  const currentPage = pagination.page || filters.page || 1;

  const campaignData = {
    campaigns,
    currentPage,
    totalPages: pagination.totalPages || 1,
    hasNextPage: pagination.hasNextPage || false,
    hasPrevPage: pagination.hasPrevPage || false,
    totalCount: pagination.totalCount || 0,
    loading: campaignsLoading,
    error: campaignsError ? 'Failed to load campaigns' : null,
  };

  // Memoized page change handler (consistent with admin page)
  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

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
    },
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme-background">
        <ModernNavigation />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="pt-20"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants}>
            <CampaignHero stats={stats} loading={statsLoading} />
          </motion.div>

          {/* Campaign Statistics */}
          {/* {stats && (
            <motion.div variants={itemVariants}>
              <CampaignStats stats={stats} />
            </motion.div>
          )} */}

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="space-y-8">
              {/* Filters */}
              <CampaignFilters
                filters={filters}
                onFiltersChange={updateFilters}
                loading={campaignData.loading}
              />

              {/* Campaign Grid */}
              <CampaignGrid
                campaigns={campaignData.campaigns}
                loading={campaignData.loading}
                error={campaignData.error}
                currentPage={campaignData.currentPage}
                totalPages={campaignData.totalPages}
                hasNextPage={campaignData.hasNextPage}
                onPageChange={handlePageChange}
                onRetry={() => window.location.reload()}
              />
            </div>
          </div>

          {/* Impact Map Section */}
          <motion.div variants={itemVariants}>
            <CampaignImpactMap />
          </motion.div>

          {/* Partners Section */}
          <motion.div variants={itemVariants}>
            <CampaignPartners />
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div variants={itemVariants}>
            <NewsletterSignup />
          </motion.div>
        </motion.div>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default CampaignsPage;
