/**
 * Campaign Management Filters Component
 * Comprehensive filtering interface for admin campaign management
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CampaignFilters, CampaignCategory } from '../../types';

interface CampaignManagementFiltersProps {
  filters: CampaignFilters;
  onFiltersChange: (filters: Partial<CampaignFilters>) => void;
  loading?: boolean;
}

const categories: Array<{ value: CampaignCategory; label: string }> = [
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'community_development', label: 'Community Development' },
  { value: 'emergency_relief', label: 'Emergency Relief' },
  { value: 'youth_development', label: 'Youth Development' },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'disease_prevention', label: 'Disease Prevention' },
  { value: 'environmental', label: 'Environmental' },
  { value: 'other', label: 'Other' },
];

const CampaignManagementFilters: React.FC<CampaignManagementFiltersProps> = ({
  filters,
  onFiltersChange,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.search) {
        onFiltersChange({ search: searchQuery || undefined, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, filters.search, onFiltersChange]);

  const handleCategoryChange = (category: CampaignCategory | '') => {
    onFiltersChange({
      category: category || undefined,
      page: 1,
    });
  };

  const handleStatusFilter = (status: 'active' | 'inactive' | 'completed' | 'featured' | 'all') => {
    const updates: Partial<CampaignFilters> = { page: 1 };

    if (status === 'active') {
      updates.is_active = true;
      updates.is_completed = false;
      updates.is_featured = undefined;
    } else if (status === 'inactive') {
      updates.is_active = false;
      updates.is_completed = undefined;
      updates.is_featured = undefined;
    } else if (status === 'completed') {
      updates.is_completed = true;
      updates.is_active = undefined;
      updates.is_featured = undefined;
    } else if (status === 'featured') {
      updates.is_featured = true;
      updates.is_active = undefined;
      updates.is_completed = undefined;
    } else {
      updates.is_active = undefined;
      updates.is_featured = undefined;
      updates.is_completed = undefined;
    }

    onFiltersChange(updates);
  };

  const clearFilters = () => {
    setSearchQuery('');
    onFiltersChange({
      search: undefined,
      category: undefined,
      is_active: undefined,
      is_featured: undefined,
      is_completed: undefined,
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 1,
    });
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.category ||
    filters.is_active !== undefined ||
    filters.is_featured !== undefined ||
    filters.is_completed !== undefined ||
    filters.sortBy !== 'created_at' ||
    filters.sortOrder !== 'desc'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-theme-primary">Campaign Management</h2>
          <p className="text-theme-muted">
            Manage all campaigns with comprehensive filtering and controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-2 text-sm font-medium text-theme-primary border border-theme rounded-lg hover:bg-theme-surface transition-colors duration-200"
          >
            {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
          </motion.button>

          {hasActiveFilters && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            >
              Clear All
            </motion.button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-theme-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search campaigns by title, description, or category..."
          className="w-full pl-10 pr-4 py-3 border border-theme rounded-xl bg-theme-surface text-theme-primary placeholder-theme-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          disabled={loading}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Quick Status Filters */}
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStatusFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            filters.is_active === undefined && filters.is_featured === undefined && filters.is_completed === undefined
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-theme-surface text-theme-primary border border-theme hover:bg-theme-background'
          }`}
        >
          All Campaigns
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStatusFilter('active')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            filters.is_active === true && filters.is_completed === false
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-theme-surface text-theme-primary border border-theme hover:bg-theme-background'
          }`}
        >
          Active
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStatusFilter('completed')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            filters.is_completed === true
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-theme-surface text-theme-primary border border-theme hover:bg-theme-background'
          }`}
        >
          Completed
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStatusFilter('inactive')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            filters.is_active === false
              ? 'bg-gray-500 text-white shadow-lg'
              : 'bg-theme-surface text-theme-primary border border-theme hover:bg-theme-background'
          }`}
        >
          Inactive
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStatusFilter('featured')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            filters.is_featured === true
              ? 'bg-yellow-500 text-white shadow-lg'
              : 'bg-theme-surface text-theme-primary border border-theme hover:bg-theme-background'
          }`}
        >
          Featured
        </motion.button>
      </div>

      {/* Advanced Filters */}
      <motion.div
        initial={false}
        animate={{
          height: showAdvancedFilters ? 'auto' : 0,
          opacity: showAdvancedFilters ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="bg-theme-surface rounded-xl p-6 border border-theme space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">Category</label>
              <select
                value={filters.category || ''}
                onChange={e => handleCategoryChange(e.target.value as CampaignCategory)}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={filters.sortBy || 'created_at'}
                  onChange={e => onFiltersChange({ sortBy: e.target.value, page: 1 })}
                  className="flex-1 px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="created_at">Created Date</option>
                  <option value="title">Title</option>
                  <option value="goal_amount">Goal Amount</option>
                  <option value="current_amount">Current Amount</option>
                  <option value="start_date">Start Date</option>
                  <option value="end_date">End Date</option>
                </select>
                <select
                  value={filters.sortOrder || 'desc'}
                  onChange={e => onFiltersChange({ sortOrder: e.target.value as 'asc' | 'desc', page: 1 })}
                  className="px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CampaignManagementFilters;
