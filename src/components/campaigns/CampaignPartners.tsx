/**
 * Campaign Partners Component
 * Displays partner organizations supporting campaigns
 * Can show either general partners or campaign-specific partners
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { CampaignPartner } from '../../types/campaignPartner';

interface CampaignPartnersProps {
  partners?: CampaignPartner[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  description?: string;
  showDescription?: boolean;
  maxPartners?: number;
  className?: string;
}

const CampaignPartners: React.FC<CampaignPartnersProps> = ({
  partners = [],
  loading = false,
  error = null,
  title = "Our Campaign Partners",
  description = "Working together with leading organizations to maximize our impact and reach more communities in need.",
  showDescription = true,
  maxPartners,
  className = "",
}) => {
  // Use provided partners or fallback to default partners for general display
  const defaultPartners = [
    {
      id: '1',
      campaign_id: '',
      name: 'World Health Organization',
      logo_url: '/api/placeholder/120/60',
      description: 'Global health leadership',
      sort_order: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      campaign_id: '',
      name: 'UNICEF Ethiopia',
      logo_url: '/api/placeholder/120/60',
      description: "Children's rights and wellbeing",
      sort_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      campaign_id: '',
      name: 'Ethiopian Red Cross',
      logo_url: '/api/placeholder/120/60',
      description: 'Humanitarian assistance',
      sort_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      campaign_id: '',
      name: 'Gates Foundation',
      logo_url: '/api/placeholder/120/60',
      description: 'Global health initiatives',
      sort_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      campaign_id: '',
      name: 'Doctors Without Borders',
      logo_url: '/api/placeholder/120/60',
      description: 'Medical humanitarian aid',
      sort_order: 4,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ] as CampaignPartner[];

  const displayPartners = partners.length > 0 ? partners : defaultPartners;
  const limitedPartners = maxPartners ? displayPartners.slice(0, maxPartners) : displayPartners;

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

  // Don't render if no partners and not loading
  if (!loading && limitedPartners.length === 0) {
    return null;
  }

  return (
    <div className={`bg-theme-background py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
              {title}
            </h2>
            {showDescription && (
              <p className="text-lg text-theme-muted max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="bg-theme-surface rounded-xl p-6 shadow-lg border border-theme animate-pulse">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div variants={itemVariants} className="text-center py-8">
              <div className="text-red-500 dark:text-red-400 mb-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm">Failed to load partners</p>
              </div>
            </motion.div>
          )}

          {/* Partners Grid */}
          {!loading && !error && limitedPartners.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center"
            >
              {limitedPartners.map(partner => (
              <motion.div
                key={partner.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <div className="bg-theme-surface rounded-xl p-6 shadow-lg border border-theme hover:shadow-xl transition-all duration-300">
                  {/* Partner Logo */}
                  <div className="h-16 flex items-center justify-center mb-4">
                    {partner.logo_url ? (
                      <img
                        src={partner.logo_url}
                        alt={`${partner.name} logo`}
                        className="max-h-12 max-w-full object-contain"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-lg flex items-center justify-center ${partner.logo_url ? 'hidden' : ''}`}>
                      <span className="text-white font-bold text-sm">
                        {partner.name
                          .split(' ')
                          .map(word => word[0])
                          .join('')
                          .slice(0, 3)}
                      </span>
                    </div>
                  </div>

                  {/* Partner Name */}
                  <h3 className="font-semibold text-theme-primary text-sm mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {partner.name}
                  </h3>

                  {/* Partner Description */}
                  {showDescription && partner.description && (
                    <p className="text-xs text-theme-muted mb-2">{partner.description}</p>
                  )}

                  {/* Partner Website Link */}
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
          )}

          {/* Partnership Benefits */}
          <motion.div
            variants={itemVariants}
            className="mt-16 bg-theme-surface rounded-2xl p-8 shadow-lg border border-theme"
          >
            <h3 className="text-xl font-bold text-theme-primary mb-6">Partnership Benefits</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-theme-primary mb-2">Amplified Impact</h4>
                <p className="text-sm text-theme-muted">
                  Combined resources and expertise multiply our campaign effectiveness
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-theme-primary mb-2">Verified Programs</h4>
                <p className="text-sm text-theme-muted">
                  Partner validation ensures campaign authenticity and effectiveness
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-theme-primary mb-2">Global Reach</h4>
                <p className="text-sm text-theme-muted">
                  International partnerships extend our campaign reach worldwide
                </p>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Become a Partner
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CampaignPartners;
