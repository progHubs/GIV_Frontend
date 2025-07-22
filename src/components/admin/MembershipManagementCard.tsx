/**
 * Membership Management Center Card Component
 * Single card that leads to membership management page
 */

import React from 'react';
import { motion } from 'framer-motion';
import { UserGroupIcon, ChartBarIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface MembershipManagementCardProps {
  stats:
    | {
        totalMembers?: number;
        active_memberships?: number;
        totalMembershipRevenue?: number;
      }
    | null
    | undefined;
  onClick: () => void;
  isLoading?: boolean;
}

const MembershipManagementCard: React.FC<MembershipManagementCardProps> = ({
  stats,
  onClick,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl p-8 h-48" />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-3">
              <UserGroupIcon className="h-8 w-8 text-white" />
            </div>
            <div className="text-white">
              <h3 className="text-xl font-bold">Membership Management</h3>
              <p className="text-blue-100 text-sm">Manage membership subscriptions and plans</p>
            </div>
          </div>

          <div className="text-right text-white">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="h-5 w-5" />
                <div>
                  <div className="text-xl font-bold">{stats?.active_memberships || 0}</div>
                  <div className="text-xs text-blue-100">Active Members</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MembershipManagementCard;
