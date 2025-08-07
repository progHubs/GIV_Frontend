/**
 * Campaign Management Table Component
 * Table for managing campaigns with filters, sorting, and actions
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Campaign } from '../../types';

interface CampaignManagementTableProps {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: string) => Promise<void>;
  onManagePartners?: (campaign: Campaign) => void;
  onRetry: () => void;
  onPageChange: (page: number) => void;
}

const CampaignManagementTable: React.FC<CampaignManagementTableProps> = ({
  campaigns,
  loading,
  error,
  currentPage,
  totalPages,
  onEdit,
  onDelete,
  onManagePartners,
  onRetry,
  onPageChange,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Track initial load state
  useEffect(() => {
    if (!loading && campaigns.length >= 0) {
      setIsInitialLoad(false);
    }
  }, [loading, campaigns.length]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await onDelete(id);
    } catch (error) {
      console.error('Error deleting campaign:', error);
    } finally {
      setDeletingId(null);
    }
  };

  // Loading spinner component for delete button
  const DeleteLoadingSpinner = () => (
    <div className="inline-flex items-center">
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Deleting...
    </div>
  );

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const formatDate = (dateInput: any) => {
    // Handle null, undefined, empty string, or empty object
    if (
      !dateInput ||
      dateInput === 'null' ||
      dateInput === 'undefined' ||
      dateInput === '' ||
      (typeof dateInput === 'object' && Object.keys(dateInput).length === 0)
    ) {
      return 'N/A';
    }

    try {
      // Handle different date formats
      let date: Date;

      // If it's already a Date object
      if (dateInput instanceof Date) {
        date = dateInput;
      } else if (typeof dateInput === 'string') {
        // Convert string to date
        date = new Date(dateInput);
      } else {
        // For any other type, try to convert to string first
        console.warn('Unexpected date type received:', typeof dateInput, dateInput);
        return 'N/A';
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date received:', dateInput);
        return 'N/A';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error, 'Input:', dateInput);
      return 'N/A';
    }
  };

  const getStatusBadge = (campaign: Campaign) => {
    if (campaign.is_completed) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
          Completed
        </span>
      );
    }

    if (!campaign.is_active) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
          Inactive
        </span>
      );
    }

    if (campaign.is_featured) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          Featured
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        Active
      </span>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'text-red-600',
      education: 'text-blue-600',
      environment: 'text-green-600',
      community: 'text-purple-600',
    };
    return colors[category as keyof typeof colors] || 'text-gray-600';
  };

  // Only show skeleton loading on initial load, not on search/filter updates
  if (loading && isInitialLoad) {
    return (
      <div className="bg-theme-surface rounded-2xl shadow-lg border border-theme p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-theme-surface rounded-2xl shadow-lg border border-theme p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-theme-primary mb-2">
            Failed to Load Campaigns
          </h3>
          <p className="text-theme-muted mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-theme-surface rounded-2xl shadow-lg border border-theme overflow-hidden">
      {/* Table */}
      <div
        className={`overflow-x-auto transition-opacity duration-200 ${loading && !isInitialLoad ? 'opacity-70' : 'opacity-100'}`}
      >
        <table className="w-full">
          <thead className="bg-theme-background">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-theme-muted uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-theme-muted uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-theme-muted uppercase tracking-wider">
                Goal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-theme-muted uppercase tracking-wider">
                Raised
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-theme-muted uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-theme-muted uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-theme-muted uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-theme-muted uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-theme-muted uppercase tracking-wider">
                Partners
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-theme-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            {campaigns.map(campaign => (
              <motion.tr
                key={campaign.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-theme-background transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {campaign.image_url ? (
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={campaign.image_url}
                          alt={campaign.title}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {campaign.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-theme-primary">{campaign.title}</div>
                      <div className="text-sm text-theme-muted">{campaign.donor_count} donors</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getCategoryColor(campaign.category)}`}>
                    {campaign.category.charAt(0).toUpperCase() + campaign.category.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-primary">
                  {campaign.goal_amount ? (
                    formatCurrency(campaign.goal_amount)
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                      Open Goal
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-primary">
                  {formatCurrency(campaign.current_amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {campaign.progress_percentage !== null ? (
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.min(campaign.progress_percentage, 100)}%`,
                            backgroundColor: campaign.progress_bar_color || '#3B82F6',
                          }}
                        />
                      </div>
                      <span className="text-sm text-theme-muted">
                        {campaign.progress_percentage}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-theme-muted">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(campaign)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-muted">
                  {formatDate(campaign.end_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-muted">
                  {formatDate(campaign.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-muted">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-theme-muted mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {campaign.campaign_partners?.length || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {onManagePartners && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onManagePartners(campaign)}
                        className="text-purple-600 hover:text-purple-900 dark:hover:text-purple-400"
                        title="Manage Partners"
                      >
                        Partners
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEdit(campaign)}
                      className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: deletingId === campaign.id ? 1 : 1.05 }}
                      whileTap={{ scale: deletingId === campaign.id ? 1 : 0.95 }}
                      onClick={() => handleDelete(campaign.id)}
                      disabled={deletingId === campaign.id}
                      className={`${
                        deletingId === campaign.id
                          ? 'text-red-400 cursor-not-allowed'
                          : 'text-red-600 hover:text-red-900 dark:hover:text-red-400'
                      } transition-colors duration-200`}
                    >
                      {deletingId === campaign.id ? <DeleteLoadingSpinner /> : 'Delete'}
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-theme">
          <div className="flex items-center justify-between">
            <div className="text-sm text-theme-muted">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-theme rounded hover:bg-theme-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 hover:scale-105 active:scale-95"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-theme rounded hover:bg-theme-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 hover:scale-105 active:scale-95"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignManagementTable;
