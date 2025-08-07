/**
 * Campaign Partner Table Component
 * Table for managing campaign partners with sorting and actions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { CampaignPartner } from '../../types/campaignPartner';

interface CampaignPartnerTableProps {
  campaignId: string;
  partners: CampaignPartner[];
  loading: boolean;
  error: string | null;
  onEdit: (partner: CampaignPartner) => void;
  onDelete: (partnerId: string) => Promise<void>;
  onRetry: () => void;
}

const CampaignPartnerTable: React.FC<CampaignPartnerTableProps> = ({
  campaignId,
  partners,
  loading,
  error,
  onEdit,
  onDelete,
  onRetry,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (partnerId: string) => {
    try {
      setDeletingId(partnerId);
      await onDelete(partnerId);
    } catch (error) {
      console.error('Error deleting campaign partner:', error);
    } finally {
      setDeletingId(null);
    }
  };

  // Loading spinner component for delete button
  const DeleteLoadingSpinner = () => (
    <div className="inline-flex items-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Deleting...
    </div>
  );

  // Error state
  if (error && !loading) {
    return (
      <div className="bg-theme-surface rounded-2xl shadow-lg border border-theme p-8">
        <div className="text-center">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-theme-primary mb-2">Failed to load partners</h3>
            <p className="text-theme-muted mb-4">
              {typeof error === 'string' ? error : 'An error occurred while loading partners'}
            </p>
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-theme-surface rounded-2xl shadow-lg border border-theme overflow-hidden">
        <div className="px-6 py-4 border-b border-theme">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="divide-y divide-theme">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="px-6 py-4 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && partners.length === 0) {
    return (
      <div className="bg-theme-surface rounded-2xl shadow-lg border border-theme p-8">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-medium text-theme-primary mb-2">No Partners Yet</h3>
          <p className="text-theme-muted">Add partners to showcase organizations supporting this campaign.</p>
        </div>
      </div>
    );
  }

  // Use partners as-is without sorting

  return (
    <div className="bg-theme-surface rounded-2xl shadow-lg border border-theme overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-theme bg-theme-background">
        <h3 className="text-lg font-medium text-theme-primary">
          Campaign Partners ({partners.length})
        </h3>
      </div>

      {/* Table Content */}
      <div className="divide-y divide-theme">
        {partners.map((partner) => (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-4 hover:bg-theme-background transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                {/* Partner Logo */}
                <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-800 rounded border border-theme overflow-hidden">
                  {partner.logo_url ? (
                    <img
                      src={partner.logo_url}
                      alt={`${partner.name} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center ${partner.logo_url ? 'hidden' : ''}`}>
                    <span className="text-white font-bold text-xs">
                      {partner.name
                        .split(' ')
                        .map(word => word[0])
                        .join('')
                        .slice(0, 2)}
                    </span>
                  </div>
                </div>

                {/* Partner Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-theme-primary truncate">
                      {partner.name}
                    </h4>
                    {!partner.is_active && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        Inactive
                      </span>
                    )}
                  </div>
                  {partner.description && (
                    <p className="text-sm text-theme-muted mt-1 truncate">
                      {partner.description}
                    </p>
                  )}
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                    >
                      {partner.website}
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(partner)}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: deletingId === partner.id ? 1 : 1.05 }}
                  whileTap={{ scale: deletingId === partner.id ? 1 : 0.95 }}
                  onClick={() => handleDelete(partner.id)}
                  disabled={deletingId === partner.id}
                  className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                    deletingId === partner.id
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-red-600 hover:text-red-900 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  {deletingId === partner.id ? <DeleteLoadingSpinner /> : 'Delete'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CampaignPartnerTable;
