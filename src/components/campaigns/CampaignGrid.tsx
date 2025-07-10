/**
 * Campaign Grid Component
 * Grid layout for displaying campaigns with loading states and pagination
 */

import React from 'react';
import { motion } from 'framer-motion';
import CampaignCard from './CampaignCard';
import CampaignCardSkeleton from './CampaignCardSkeleton';
import type { Campaign } from '../../types';

interface CampaignGridProps {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

const CampaignGrid: React.FC<CampaignGridProps> = React.memo(
  ({ campaigns, loading, error, currentPage, totalPages, hasNextPage, onPageChange, onRetry }) => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
        },
      },
    };

    // Loading skeleton
    const LoadingSkeleton = () => (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {Array.from({ length: campaigns.length > 0 ? campaigns.length : 6 }).map((_, index) => (
          <motion.div key={`skeleton-${index}`} variants={itemVariants}>
            <CampaignCardSkeleton />
          </motion.div>
        ))}
      </motion.div>
    );

    // Error state
    const ErrorState = () => (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <p className="text-theme-muted mb-6">{error}</p>
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150 hover:scale-102 active:scale-98"
          >
            Try Again
          </button>
        </div>
      </div>
    );

    // Empty state
    const EmptyState = () => (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-theme-primary mb-2">No Campaigns Found</h3>
          <p className="text-theme-muted">
            Try adjusting your search criteria or filters to find campaigns.
          </p>
        </div>
      </div>
    );

    // Pagination component
    const Pagination = () => {
      if (totalPages <= 1) return null;

      const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
          for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) {
              pages.push(i);
            }
            pages.push('...');
            pages.push(totalPages);
          } else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push('...');
            for (let i = totalPages - 3; i <= totalPages; i++) {
              pages.push(i);
            }
          } else {
            pages.push(1);
            pages.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
              pages.push(i);
            }
            pages.push('...');
            pages.push(totalPages);
          }
        }

        return pages;
      };

      return (
        <div className="flex items-center justify-center space-x-2 mt-12">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-theme-primary border border-theme rounded-lg hover:bg-theme-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 hover:scale-105 active:scale-95"
          >
            Previous
          </button>

          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-theme-muted">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 hover:scale-105 active:scale-95 ${
                    currentPage === page
                      ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300'
                      : 'text-theme-primary border border-theme hover:bg-theme-surface hover:border-blue-300'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="px-4 py-2 text-sm font-medium text-theme-primary border border-theme rounded-lg hover:bg-theme-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 hover:scale-105 active:scale-95"
          >
            Next
          </button>
        </div>
      );
    };

    if (loading) {
      return (
        <div className="space-y-8">
          <LoadingSkeleton />
          {/* Show pagination even during loading if we have pagination info */}
          {totalPages > 1 && <Pagination />}
        </div>
      );
    }

    if (error) {
      return <ErrorState />;
    }

    if (campaigns.length === 0) {
      return <EmptyState />;
    }

    return (
      <div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {campaigns.map(campaign => (
            <motion.div key={campaign.id} variants={itemVariants}>
              <CampaignCard campaign={campaign} />
            </motion.div>
          ))}
        </motion.div>

        <Pagination />
      </div>
    );
  }
);

export default CampaignGrid;
