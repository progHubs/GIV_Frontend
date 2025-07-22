/**
 * Membership Badge Component
 * Displays membership tier badges with appropriate styling
 */

import React from 'react';
import { StarIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/solid';

interface MembershipBadgeProps {
  tier: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const MembershipBadge: React.FC<MembershipBadgeProps> = ({
  tier,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  // Get tier colors and styles
  const getTierStyles = (tier: string) => {
    const styles = {
      bronze: {
        bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
        text: 'text-white',
        icon: StarIcon,
      },
      silver: {
        bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
        text: 'text-white',
        icon: SparklesIcon,
      },
      gold: {
        bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
        text: 'text-white',
        icon: TrophyIcon,
      },
      platinum: {
        bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
        text: 'text-white',
        icon: TrophyIcon,
      },
    };
    return styles[tier as keyof typeof styles] || styles.bronze;
  };

  // Get size classes
  const getSizeClasses = (size: string) => {
    const sizes = {
      sm: {
        container: 'px-2 py-1 text-xs',
        icon: 'h-3 w-3',
      },
      md: {
        container: 'px-3 py-1.5 text-sm',
        icon: 'h-4 w-4',
      },
      lg: {
        container: 'px-4 py-2 text-base',
        icon: 'h-5 w-5',
      },
    };
    return sizes[size as keyof typeof sizes] || sizes.md;
  };

  const tierStyles = getTierStyles(tier);
  const sizeClasses = getSizeClasses(size);
  const IconComponent = tierStyles.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${tierStyles.bg} ${tierStyles.text} ${sizeClasses.container} ${className}`}
    >
      {showIcon && <IconComponent className={sizeClasses.icon} />}
      <span className="capitalize">{tier}</span>
    </span>
  );
};

export default MembershipBadge;
