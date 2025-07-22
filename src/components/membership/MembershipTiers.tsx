/**
 * Membership Tiers Component
 * Displays available membership plans with benefits and pricing
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, StarIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useMembershipPlans, useUserMembership } from '../../hooks/useMembership';
import type { MembershipPlan } from '../../types/membership';

interface MembershipTiersProps {
  onSelectPlan: (plan: MembershipPlan) => void;
  selectedPlanId?: string;
  billingCycle?: 'monthly' | 'annual';
  onBillingCycleChange?: (cycle: 'monthly' | 'annual') => void;
  className?: string;
  compact?: boolean;
}

const MembershipTiers: React.FC<MembershipTiersProps> = ({
  onSelectPlan,
  selectedPlanId,
  billingCycle = 'monthly',
  onBillingCycleChange,
  className = '',
  compact = false,
}) => {
  const { data: plans, isLoading } = useMembershipPlans();
  const { data: userMembership } = useUserMembership();

  const filteredPlans = plans?.filter(plan => plan.billing_cycle === billingCycle) || [];

  // Helper function to safely parse amount (handles Decimal objects from backend)
  const safeParseAmount = (amount: any): number => {
    if (amount === null || amount === undefined) return 0;

    // Handle Decimal objects with structure {s, e, d}
    if (
      typeof amount === 'object' &&
      amount.s !== undefined &&
      amount.e !== undefined &&
      amount.d !== undefined
    ) {
      // Convert Decimal object to number
      // s = sign (1 for positive, -1 for negative)
      // e = exponent (number of digits before decimal point)
      // d = digits array
      const sign = amount.s;
      const exponent = amount.e;
      const digits = amount.d;

      if (!Array.isArray(digits) || digits.length === 0) return 0;

      // For our membership amounts, the digits array already contains the complete number
      // Bronze: digits[0] = 20, Silver: digits[0] = 50, Gold: digits[0] = 100, Platinum: digits[0] = 200
      // No need for complex reconstruction - just use the first element directly
      const result = digits[0] * sign;
      return isNaN(result) ? 0 : result;
    }

    // Handle Decimal objects that have toString method
    if (typeof amount === 'object' && typeof amount.toString === 'function') {
      const parsed = parseFloat(amount.toString());
      return isNaN(parsed) ? 0 : parsed;
    }

    // Handle string or number values
    const parsed = parseFloat(String(amount));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Tier icons mapping
  const tierIcons = {
    bronze: StarIcon,
    silver: SparklesIcon,
    gold: TrophyIcon,
    platinum: TrophyIcon,
  };

  // Tier colors mapping
  const tierColors = {
    bronze: 'from-amber-500 to-amber-600',
    silver: 'from-gray-400 to-gray-500',
    gold: 'from-yellow-400 to-yellow-500',
    platinum: 'from-purple-500 to-purple-600',
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`membership-tiers ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Membership
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Join our community and support our mission with recurring donations
        </p>

        {/* Billing Cycle Toggle */}
        {onBillingCycleChange && (
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => onBillingCycleChange('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => onBillingCycleChange('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Annual
            </button>
          </div>
        )}
      </div>

      {/* Membership Plans Grid */}
      <div
        className={`grid gap-6 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}
      >
        {filteredPlans.map((plan, index) => {
          const TierIcon = tierIcons[plan.tier as keyof typeof tierIcons];
          const isSelected = selectedPlanId === plan.id;
          const isCurrentPlan = userMembership?.membership_plan_id === plan.id;

          return (
            <motion.div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              } ${isCurrentPlan ? 'ring-2 ring-green-200 dark:ring-green-800' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Popular Badge */}
              {plan.tier === 'gold' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Tier Header */}
                <div className="text-center mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${tierColors[plan.tier as keyof typeof tierColors]} mb-4`}
                  >
                    <TierIcon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize mb-2">
                    {plan.tier}
                  </h3>

                  <div className="text-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${safeParseAmount(plan.amount).toFixed(0)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => onSelectPlan(plan)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    isCurrentPlan
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : plan.tier === 'gold'
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600'
                          : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                  }`}
                >
                  {isCurrentPlan
                    ? 'Current Plan'
                    : isSelected
                      ? 'Selected'
                      : `Choose ${plan.tier.charAt(0).toUpperCase() + plan.tier.slice(1)}`}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Information */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          All memberships are recurring donations that directly support our mission.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          You can cancel or change your membership anytime.
        </p>
      </div>
    </div>
  );
};

export default MembershipTiers;
