/**
 * Campaign Partners Section Component
 * Displays campaign-specific partners in the campaign detail page
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useActiveCampaignPartners } from '../../../hooks/useCampaignPartners';
import type { CampaignPartner } from '../../../types/campaignPartner';

interface CampaignPartnersSectionProps {
  campaignId: string;
  className?: string;
}

const CampaignPartnersSection: React.FC<CampaignPartnersSectionProps> = ({
  campaignId,
  className = '',
}) => {
  const { data: partners = [], isLoading, error } = useActiveCampaignPartners(campaignId);

  // Don't render if no partners and not loading
  if (!isLoading && partners.length === 0) {
    return null;
  }

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-theme-surface rounded-2xl shadow-lg border border-theme p-6 ${className}`}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <h3 className="text-xl font-bold text-theme-primary mb-2">Campaign Partners</h3>
        <p className="text-sm text-theme-muted">
          Organizations supporting this campaign
        </p>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <motion.div variants={itemVariants} className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <motion.div variants={itemVariants} className="text-center py-8">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm">Failed to load campaign partners</p>
          </div>
        </motion.div>
      )}

      {/* Partners List */}
      {!isLoading && !error && partners.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// Partner Card Component
interface PartnerCardProps {
  partner: CampaignPartner;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="flex items-center space-x-4 p-4 bg-theme-background rounded-xl border border-theme hover:shadow-md transition-all duration-200"
    >
      {/* Partner Logo */}
      <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg border border-theme overflow-hidden">
        {partner.logo_url && !imageError ? (
          <img
            src={partner.logo_url}
            alt={`${partner.name} logo`}
            className="max-w-full max-h-full object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {partner.name
                .split(' ')
                .map(word => word[0])
                .join('')
                .slice(0, 2)}
            </span>
          </div>
        )}
      </div>

      {/* Partner Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-theme-primary truncate">
              {partner.name}
            </h4>
            {partner.description && (
              <p className="text-sm text-theme-muted mt-1 line-clamp-2">
                {partner.description}
              </p>
            )}
          </div>
          
          {/* Website Link */}
          {partner.website && (
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 ml-3 p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
              title="Visit website"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignPartnersSection;
