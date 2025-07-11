/**
 * Campaign Detail Page
 * Comprehensive campaign detail view with donation functionality
 */

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from '../theme';
import ModernNavigation from '../components/navigation/ModernNavigation';
import Footer from '../components/layout/Footer';
import { useCampaign } from '../hooks/useCampaigns';

// Campaign Detail Components
import {
  CampaignDetailHero,
  CampaignDetailContent,
  DonationSidebar,
  RelatedCampaigns,
  CampaignDetailSkeleton,
} from '../components/campaigns';

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Use the id parameter (can be either numeric ID or slug)
  const campaignId = id;

  if (!campaignId) {
    return <Navigate to="/campaigns" replace />;
  }

  // Fetch campaign data
  const { data: campaign, isLoading, error } = useCampaign(campaignId);

  // Animation variants
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

  // Loading state
  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-theme-background">
          <ModernNavigation />
          <div className="pt-20">
            <CampaignDetailSkeleton />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Error state
  if (error || !campaign) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-theme-background">
          <ModernNavigation />
          <div className="pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-16">
                <div className="text-red-500 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-theme-primary mb-4">Campaign Not Found</h1>
                <p className="text-theme-muted mb-8">
                  The campaign you're looking for doesn't exist or has been removed.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.history.back()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Go Back
                </motion.button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

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
          {/* Campaign Hero Section */}
          <motion.div variants={itemVariants}>
            <CampaignDetailHero campaign={campaign} loading={isLoading} />
          </motion.div>

          {/* Main Content Area */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Campaign Content */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <CampaignDetailContent campaign={campaign} />
              </motion.div>

              {/* Right Column - Donation Sidebar */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <div className="lg:sticky lg:top-24">
                  <DonationSidebar campaign={campaign} />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Related Campaigns Section */}
          <motion.div variants={itemVariants}>
            <RelatedCampaigns currentCampaign={campaign} />
          </motion.div>
        </motion.div>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default CampaignDetailPage;
