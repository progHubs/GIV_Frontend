/**
 * Membership Plan Cards Component
 * Displays membership plans as clickable cards for detailed management
 */

import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { Gem } from 'lucide-react';

interface MembershipPlanStats {
  tier: string;
  count: number;
  total_amount: number;
  percentage: number;
  active_count?: number;
  cancelled_count?: number;
  monthly_count?: number;
  annual_count?: number;
}

interface MembershipPlanCardsProps {
  stats:
    | {
        membershipsByTier?: MembershipPlanStats[];
        totalMembers?: number;
        totalMembershipRevenue?: number;
      }
    | null
    | undefined;
  onPlanClick: (tier: string) => void;
  isLoading?: boolean;
}

const MembershipPlanCards: React.FC<MembershipPlanCardsProps> = ({
  stats,
  onPlanClick,
  isLoading = false,
}) => {
  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return <StarIcon className="h-8 w-8" />;
      case 'silver':
        return <SparklesIcon className="h-8 w-8" />;
      case 'gold':
        return <TrophyIcon className="h-8 w-8" />;
      case 'platinum':
        return <Gem className="h-8 w-8" />;
      default:
        return <StarIcon className="h-8 w-8" />;
    }
  };

  const getTierColors = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return {
          bg: 'from-amber-500 to-orange-600',
          text: 'text-amber-600',
          bgLight: 'bg-amber-50',
          bgDark: 'bg-amber-900/20',
        };
      case 'silver':
        return {
          bg: 'from-gray-400 to-gray-600',
          text: 'text-gray-600',
          bgLight: 'bg-gray-50',
          bgDark: 'bg-gray-900/20',
        };
      case 'gold':
        return {
          bg: 'from-yellow-400 to-yellow-600',
          text: 'text-yellow-600',
          bgLight: 'bg-yellow-50',
          bgDark: 'bg-yellow-900/20',
        };
      case 'platinum':
        return {
          bg: 'from-purple-500 to-indigo-600',
          text: 'text-purple-600',
          bgLight: 'bg-purple-50',
          bgDark: 'bg-purple-900/20',
        };
      default:
        return {
          bg: 'from-blue-500 to-blue-600',
          text: 'text-blue-600',
          bgLight: 'bg-blue-50',
          bgDark: 'bg-blue-900/20',
        };
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {['bronze', 'silver', 'gold', 'platinum'].map(tier => (
          <div
            key={tier}
            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl p-6 h-48"
          />
        ))}
      </div>
    );
  }

  const membershipsByTier = stats?.membershipsByTier || [];

  // Ensure all tiers are represented
  const allTiers = ['bronze', 'silver', 'gold', 'platinum'];
  const tierData = allTiers.map(tier => {
    const existing = membershipsByTier.find(m => m.tier.toLowerCase() === tier);
    return (
      existing || {
        tier,
        count: 0,
        total_amount: 0,
        percentage: 0,
        active_count: 0,
        cancelled_count: 0,
        monthly_count: 0,
        annual_count: 0,
      }
    );
  });

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Membership Plans
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Click on any plan to view detailed analytics and member management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tierData.map((tier, index) => {
          const colors = getTierColors(tier.tier);

          return (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={tier.count > 0 ? { scale: 1.05 } : {}}
              whileTap={tier.count > 0 ? { scale: 0.95 } : {}}
              onClick={tier.count > 0 ? () => onPlanClick(tier.tier) : undefined}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                tier.count > 0 ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg ${colors.bgLight} dark:${colors.bgDark}`}>
                  <div className={colors.text}>{getTierIcon(tier.tier)}</div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {tier.tier} Plan
                </h4>
              </div>

              {/* Active and Cancelled Members */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {tier.active_count || 0} Active
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {tier.cancelled_count || 0} Cancelled
                  </span>
                </div>
              </div>

              {/* View Details (only if has members) */}
              {tier.count > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      View Details →
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MembershipPlanCards;
