/**
 * Donor Tier Cards Component
 * Displays tier statistics as clickable cards for donor management
 */

import React from 'react';
import { motion } from 'framer-motion';
import { DONATION_TIERS } from '../../types/donation';
import type { DonorStats, DonationTier } from '../../types/donation';

interface DonorTierCardsProps {
  stats: DonorStats;
  onTierClick: (tier: DonationTier) => void;
  selectedTier?: DonationTier;
}

const DonorTierCards: React.FC<DonorTierCardsProps> = ({
  stats,
  onTierClick,
  selectedTier,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  // Get tier count from stats
  const getTierCount = (tier: DonationTier): number => {
    const tierData = stats.donorsByTier?.find(t => t.tier === tier);
    return tierData?.count || 0;
  };

  // Get tier icon based on tier type
  const getTierIcon = (tier: DonationTier) => {
    const icons = {
      bronze: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22L12 19L5.82 22L7 14L2 9L10.91 8.26L12 2Z" />
        </svg>
      ),
      silver: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22L12 19L5.82 22L7 14L2 9L10.91 8.26L12 2Z" />
        </svg>
      ),
      gold: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22L12 19L5.82 22L7 14L2 9L10.91 8.26L12 2Z" />
        </svg>
      ),
      platinum: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22L12 19L5.82 22L7 14L2 9L10.91 8.26L12 2Z" />
        </svg>
      ),
    };
    return icons[tier];
  };

  // Get tier color classes
  const getTierColorClasses = (tier: DonationTier, isSelected: boolean) => {
    const baseClasses = "transition-all duration-200 cursor-pointer transform hover:scale-105";
    const selectedClasses = "ring-2 ring-offset-2 shadow-lg";
    
    const tierClasses = {
      bronze: isSelected 
        ? `bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300 ring-orange-400 text-orange-800`
        : `bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300 text-orange-700`,
      silver: isSelected
        ? `bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 ring-gray-400 text-gray-800`
        : `bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:border-gray-300 text-gray-700`,
      gold: isSelected
        ? `bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 ring-yellow-400 text-yellow-800`
        : `bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:border-yellow-300 text-yellow-700`,
      platinum: isSelected
        ? `bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300 ring-purple-400 text-purple-800`
        : `bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300 text-purple-700`,
    };

    return `${baseClasses} ${tierClasses[tier]} ${isSelected ? selectedClasses : ''}`;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-theme-primary">Donor Tiers</h2>
          <p className="text-theme-muted">Click on a tier to filter donors by tier level</p>
        </div>
        {selectedTier && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTierClick(undefined as any)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Clear Filter
          </motion.button>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {(Object.keys(DONATION_TIERS) as DonationTier[]).map((tier, index) => {
          const tierConfig = DONATION_TIERS[tier];
          const count = getTierCount(tier);
          const isSelected = selectedTier === tier;

          return (
            <motion.div
              key={tier}
              variants={cardVariants}
              transition={{ delay: index * 0.1 }}
              onClick={() => onTierClick(tier)}
              className={`rounded-xl p-6 border-2 ${getTierColorClasses(tier, isSelected)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getTierIcon(tier)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{tierConfig.name}</h3>
                    <p className="text-sm opacity-75">{tier.charAt(0).toUpperCase() + tier.slice(1)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Donors</span>
                  <span className="text-2xl font-bold">{count.toLocaleString()}</span>
                </div>
                
                <div className="text-xs opacity-75">
                  {tier === 'bronze' && 'Up to $499'}
                  {tier === 'silver' && '$500 - $1,999'}
                  {tier === 'gold' && '$2,000 - $9,999'}
                  {tier === 'platinum' && '$10,000+'}
                </div>

                {count > 0 && (
                  <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                    <div className="flex items-center justify-between text-xs">
                      <span>View Details</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default DonorTierCards;
