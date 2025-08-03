/**
 * Volunteer Card Component
 * Displays volunteer information in a card format
 * Following the design patterns from DonationCard
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { HighlightText, getMatchedField } from '../../utils/textHighlight';
import type { VolunteerProfile } from '../../types/volunteer';

interface VolunteerCardProps {
  volunteer: VolunteerProfile;
  showActions?: boolean;
  onView?: (volunteer: VolunteerProfile) => void;
  onEdit?: (volunteer: VolunteerProfile) => void;
  onDelete?: (volunteer: VolunteerProfile) => void;
  className?: string;
  searchTerm?: string;
}

const VolunteerCard: React.FC<VolunteerCardProps> = ({
  volunteer,
  showActions = false,
  onView,
  onEdit,
  onDelete,
  className = '',
  searchTerm = '',
}) => {
  // Get which field matched the search
  const matchedField = getMatchedField(volunteer, searchTerm);

  // Format date safely
  const formatDate = (dateString: any) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status color based on volunteer activity
  const getStatusColor = () => {
    if (volunteer.active_campaigns_count > 0) {
      return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
    } else if (volunteer.completed_campaigns_count > 0) {
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
    } else {
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = () => {
    if (volunteer.active_campaigns_count > 0) {
      return 'Active';
    } else if (volunteer.completed_campaigns_count > 0) {
      return 'Experienced';
    } else {
      return 'New';
    }
  };

  // Parse volunteer roles
  const volunteerRoles = volunteer.volunteer_roles 
    ? (typeof volunteer.volunteer_roles === 'string' 
        ? volunteer.volunteer_roles.split(',').map(role => role.trim())
        : volunteer.volunteer_roles)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {volunteer.users?.full_name?.charAt(0) || 'V'}
              </span>
            </div>
            
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                <HighlightText
                  text={volunteer.users?.full_name || 'Unknown Volunteer'}
                  searchTerm={searchTerm}
                  isMatch={matchedField === 'full_name'}
                />
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <HighlightText
                  text={volunteer.users?.email || ''}
                  searchTerm={searchTerm}
                  isMatch={matchedField === 'email'}
                />
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Location and License */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          {volunteer.location && (
            <div className="flex items-center space-x-1">
              <MapPinIcon className="h-4 w-4" />
              <span>
                <HighlightText
                  text={volunteer.location}
                  searchTerm={searchTerm}
                  isMatch={matchedField === 'location'}
                />
              </span>
            </div>
          )}
          
          {volunteer.is_licensed_practitioner && (
            <div className="flex items-center space-x-1">
              <AcademicCapIcon className="h-4 w-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400">Licensed Professional</span>
            </div>
          )}
        </div>

        {/* Volunteer Roles */}
        {volunteerRoles.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {volunteerRoles.slice(0, 3).map((role, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  {role}
                </span>
              ))}
              {volunteerRoles.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400">
                  +{volunteerRoles.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {volunteer.completed_campaigns_count || 0}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <ClockIcon className="h-4 w-4 text-blue-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {volunteer.active_campaigns_count || 0}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <StarIcon className="h-4 w-4 text-yellow-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {volunteer.rating ? volunteer.rating.toFixed(1) : '0.0'}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center justify-between">
            <span>Joined {formatDate(volunteer.created_at)}</span>
            {volunteer.updated_at && volunteer.updated_at !== volunteer.created_at && (
              <span>Updated {formatDate(volunteer.updated_at)}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            {onView && (
              <button
                onClick={() => onView(volunteer)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
              >
                View Details
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(volunteer)}
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(volunteer)}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export { VolunteerCard };
