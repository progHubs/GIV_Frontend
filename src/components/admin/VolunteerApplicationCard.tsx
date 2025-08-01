/**
 * Volunteer Application Card Component
 * Admin component for reviewing and managing volunteer applications
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import type { CampaignVolunteer } from '../../types/volunteer';
import { useUpdateVolunteerStatus } from '../../hooks/useVolunteer';

interface VolunteerApplicationCardProps {
  application: CampaignVolunteer;
  onStatusUpdate?: () => void;
  className?: string;
}

const VolunteerApplicationCard: React.FC<VolunteerApplicationCardProps> = ({
  application,
  onStatusUpdate,
  className = '',
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const updateStatusMutation = useUpdateVolunteerStatus();

  const handleStatusUpdate = async (status: 'approved' | 'rejected' | 'waiting') => {
    try {
      setIsUpdating(true);
      await updateStatusMutation.mutateAsync({
        campaignId: application.campaign_id,
        userId: application.user_id,
        status,
        notes: `Status updated to ${status} by admin`,
      });
      toast.success(`Application ${status} successfully`);
      onStatusUpdate?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update application status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': case 'waiting': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'medical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'coordinator': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'specialist': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {application.users?.full_name?.charAt(0) || 'V'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {application.users?.full_name || 'Unknown Volunteer'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {application.users?.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Applied: {formatDate(application.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(application.volunteer_role)}`}>
              {application.volunteer_role}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.application_status)}`}>
              {application.application_status}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Campaign Info */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Campaign
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {application.campaigns?.title || 'Unknown Campaign'}
          </p>
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Hours Committed
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {application.hours_committed || 0} hours/week
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Hours Completed
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {application.hours_completed || 0} hours
            </p>
          </div>
        </div>

        {/* Application Notes */}
        {application.application_notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Application Notes
            </h4>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {application.application_notes}
              </p>
            </div>
          </div>
        )}

        {/* Admin Notes */}
        {application.admin_notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Admin Notes
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {application.admin_notes}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {application.application_status !== 'approved' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusUpdate('approved')}
                disabled={isUpdating}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                ) : (
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Approve
              </motion.button>
            )}

            {application.application_status !== 'rejected' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                ) : (
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                Reject
              </motion.button>
            )}

            {application.application_status !== 'waiting' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusUpdate('waiting')}
                disabled={isUpdating}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? (
                  <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-1"></div>
                ) : (
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                Reset to Waiting
              </motion.button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {showNotes ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </div>

        {/* Extended Details */}
        {showNotes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">User ID:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">{application.user_id}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Campaign ID:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">{application.campaign_id}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Application ID:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">{application.id}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {formatDate(application.updated_at)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default VolunteerApplicationCard;
