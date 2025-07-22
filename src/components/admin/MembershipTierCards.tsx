/**
 * Membership Tier Cards Component
 * Displays membership tier statistics as clickable cards for admin management
 */

import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/outline';

interface MembershipTierStats {
  tier: string;
  count: number;
  total_amount: number;
  percentage: number;
}

interface MembershipTierCardsProps {
  stats:
    | {
        membershipsByTier?: MembershipTierStats[];
        totalMembers?: number;
        totalMembershipRevenue?: number;
      }
    | null
    | undefined;
  onTierClick: (tier: string) => void;
  selectedTier?: string;
  isLoading?: boolean;
}

const MembershipTierCards: React.FC<MembershipTierCardsProps> = ({
  stats,
  onTierClick,
  selectedTier,
  isLoading = false,
}) => {
  // Early return for loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {['bronze', 'silver', 'gold', 'platinum'].map(tier => (
          <div
            key={tier}
            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl p-6 h-32"
          />
        ))}
      </div>
    );
  }

  // Early return if no stats available
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {['bronze', 'silver', 'gold', 'platinum'].map(tier => (
          <div
            key={tier}
            className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-6 opacity-50"
          >
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm">No data available</p>
              <p className="text-xs mt-1 capitalize">{tier} Members</p>
            </div>
          </div>
        ))}
      </div>
    );
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  // Get tier count from stats with defensive programming
  const getTierCount = (tier: string): number => {
    if (!stats || !stats.membershipsByTier || !Array.isArray(stats.membershipsByTier)) {
      return 0;
    }
    const tierData = stats.membershipsByTier.find(t => t.tier === tier);
    return tierData?.count || 0;
  };

  // Get tier revenue from stats with defensive programming
  const getTierRevenue = (tier: string): number => {
    if (!stats || !stats.membershipsByTier || !Array.isArray(stats.membershipsByTier)) {
      return 0;
    }
    const tierData = stats.membershipsByTier.find(t => t.tier === tier);
    return tierData?.total_amount || 0;
  };

  // Get tier icon based on tier type
  const getTierIcon = (tier: string) => {
    const icons = {
      bronze: <StarIcon className="w-8 h-8" />,
      silver: <SparklesIcon className="w-8 h-8" />,
      gold: <TrophyIcon className="w-8 h-8" />,
      platinum: <TrophyIcon className="w-8 h-8" />,
    };
    return icons[tier as keyof typeof icons] || <StarIcon className="w-8 h-8" />;
  };

  // Get tier colors
  const getTierColors = (tier: string) => {
    const colors = {
      bronze: {
        bg: 'from-amber-500 to-amber-600',
        text: 'text-amber-600',
        border: 'border-amber-200',
        bgLight: 'bg-amber-50',
      },
      silver: {
        bg: 'from-gray-400 to-gray-500',
        text: 'text-gray-600',
        border: 'border-gray-200',
        bgLight: 'bg-gray-50',
      },
      gold: {
        bg: 'from-yellow-400 to-yellow-500',
        text: 'text-yellow-600',
        border: 'border-yellow-200',
        bgLight: 'bg-yellow-50',
      },
      platinum: {
        bg: 'from-purple-500 to-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-200',
        bgLight: 'bg-purple-50',
      },
    };
    return colors[tier as keyof typeof colors] || colors.bronze;
  };

  const tiers = ['bronze', 'silver', 'gold', 'platinum'];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {tiers.map(tier => {
        const count = getTierCount(tier);
        const revenue = getTierRevenue(tier);
        const colors = getTierColors(tier);
        const isSelected = selectedTier === tier;

        return (
          <motion.div
            key={tier}
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTierClick(tier)}
            className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all duration-200 ${
              isSelected
                ? `${colors.border} ${colors.bgLight} shadow-lg`
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md'
            }`}
          >
            {/* Tier Icon */}
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${colors.bg} mb-4`}
            >
              <div className="text-white">{getTierIcon(tier)}</div>
            </div>

            {/* Tier Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                {tier} Members
              </h3>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Count:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {count.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Revenue:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Selection Indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.bg}`}></div>
              </div>
            )}

            {/* Hover Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent to-transparent hover:from-blue-50/10 hover:to-purple-50/10 transition-all duration-200 pointer-events-none"></div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default MembershipTierCards;
