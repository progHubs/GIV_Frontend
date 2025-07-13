/**
 * Campaign Filters Component
 * Search and filter controls for campaigns
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CampaignFilters as CampaignFiltersType, CampaignCategory } from '../../types';

interface CampaignFiltersProps {
  filters: CampaignFiltersType;
  onFiltersChange: (filters: Partial<CampaignFiltersType>) => void;
  loading?: boolean;
}

const CampaignFilters: React.FC<CampaignFiltersProps> = ({
  filters,
  onFiltersChange,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sync search query with filters prop
  useEffect(() => {
    setSearchQuery(filters.search || '');
  }, [filters.search]);

  // Debounce search input - only trigger when user actually types
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only update if search query actually changed and is different from current filter
      const currentSearch = filters.search || '';
      const newSearch = searchQuery.trim();

      // Don't trigger if both are empty or the same
      if (newSearch !== currentSearch && !(newSearch === '' && currentSearch === '')) {
        onFiltersChange({ search: newSearch || undefined, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, filters.search, onFiltersChange]);

  const categories: { value: CampaignCategory; label: string }[] = [
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

  const sortOptions = [
    { value: 'created_at', label: 'Newest First' },
    { value: 'goal_amount', label: 'Goal Amount' },
    { value: 'current_amount', label: 'Funds Raised' },
    { value: 'progress_percentage', label: 'Progress' },
    { value: 'title', label: 'Alphabetical' },
  ];

  const handleCategoryChange = (category: CampaignCategory | '') => {
    onFiltersChange({
      category: category || undefined,
      page: 1,
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    onFiltersChange({
      sortBy,
      sortOrder,
      page: 1,
    });
  };

  const handleStatusFilter = (status: 'featured' | 'all') => {
    const updates: Partial<CampaignFiltersType> = { page: 1 };

    if (status === 'featured') {
      updates.is_featured = true;
      // Keep the default active and non-completed filters
      updates.is_active = true;
      updates.is_completed = false;
    } else {
      updates.is_featured = undefined;
      // Keep the default active and non-completed filters
      updates.is_active = true;
      updates.is_completed = false;
    }

    onFiltersChange(updates);
  };

  const clearFilters = () => {
    setSearchQuery('');
    onFiltersChange({
      search: undefined,
      category: undefined,
      is_active: true, // Keep default active filter
      is_featured: undefined,
      is_completed: false, // Keep default non-completed filter
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 1,
    });
  };

  const hasActiveFilters = !!(
    (
      filters.search ||
      filters.category ||
      filters.is_featured ||
      filters.sortBy !== 'created_at' ||
      filters.sortOrder !== 'desc'
    )
    // Don't consider is_active and is_completed as "active filters" since they're defaults
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-theme-primary">All Campaigns</h2>
          <p className="text-theme-muted">
            Discover impactful campaigns making a difference in communities
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

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStatusFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            !filters.is_featured
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-theme-surface text-theme-primary border border-theme hover:bg-theme-background'
          }`}
        >
          All Campaigns
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStatusFilter('featured')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            filters.is_featured
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">Sort By</label>
              <select
                value={filters.sortBy || 'created_at'}
                onChange={e => handleSortChange(e.target.value, filters.sortOrder || 'desc')}
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-2">Order</label>
              <select
                value={filters.sortOrder || 'desc'}
                onChange={e =>
                  handleSortChange(filters.sortBy || 'created_at', e.target.value as 'asc' | 'desc')
                }
                className="w-full px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CampaignFilters;
