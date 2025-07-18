/**
 * Advanced Donation Filters Component
 * Provides comprehensive filtering interface for donations with period-based filtering,
 * multi-currency support, and advanced search capabilities
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  FunnelIcon,
  ChevronDownIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { useDonationFilterOptions } from '../../hooks/useDonations';
import type { AdvancedDonationFilters } from '../../types/donation';

interface AdvancedFiltersProps {
  initialFilters?: AdvancedDonationFilters;
  onFilterChange: (filters: AdvancedDonationFilters) => void;
  onClearFilters: () => void;
  className?: string;
  compact?: boolean;
  showResultCount?: boolean;
  resultCount?: number;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  initialFilters = {},
  onFilterChange,
  onClearFilters,
  className = '',
  compact = false,
  showResultCount = true,
  resultCount = 0
}) => {
  const [filters, setFilters] = useState<AdvancedDonationFilters>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  const { data: filterOptions, isLoading } = useDonationFilterOptions();
  
  // Update active filters count
  useEffect(() => {
    const count = Object.values(filters).filter(value => 
      value !== undefined && value !== null && value !== '' && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
    setActiveFiltersCount(count);
  }, [filters]);
  
  // Handle filter changes
  const handleFilterChange = (key: keyof AdvancedDonationFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Clear all filters
  const handleClearAll = () => {
    setFilters({});
    onClearFilters();
  };
  
  // Period options
  const periodOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last_7_days', label: 'Last 7 days' },
    { value: 'last_30_days', label: 'Last 30 days' },
    { value: 'this_month', label: 'This month' },
    { value: 'last_month', label: 'Last month' },
    { value: 'this_year', label: 'This year' },
    { value: 'last_year', label: 'Last year' },
  ];
  
  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 rounded-lg"></div>
    );
  }
  
  return (
    <motion.div 
      className={`donation-advanced-filters bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filter Donations
          </h3>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {showResultCount && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {resultCount} results
            </span>
          )}
          
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear all
            </button>
          )}
          
          {!compact && (
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Advanced
              <ChevronDownIcon 
                className={`ml-1 h-4 w-4 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
              />
            </button>
          )}
        </div>
      </div>
      
      {/* Basic Filters */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Period Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <CalendarIcon className="inline h-4 w-4 mr-1" />
              Time Period
            </label>
            <select
              value={filters.period || ''}
              onChange={(e) => handleFilterChange('period', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Time</option>
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Amount Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
              Amount Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.min_amount || ''}
                onChange={(e) => handleFilterChange('min_amount', e.target.value ? Number(e.target.value) : undefined)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.max_amount || ''}
                onChange={(e) => handleFilterChange('max_amount', e.target.value ? Number(e.target.value) : undefined)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Donor name, campaign, transaction ID..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
      
      {/* Advanced Filters */}
      <AnimatePresence>
        {(showAdvanced || compact) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Currency Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    multiple
                    value={filters.currencies || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      handleFilterChange('currencies', values.length > 0 ? values : undefined);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    size={3}
                  >
                    {filterOptions?.data.currencies.map(currency => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Payment Method Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    multiple
                    value={filters.payment_methods || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      handleFilterChange('payment_methods', values.length > 0 ? values : undefined);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    size={3}
                  >
                    {filterOptions?.data.payment_methods.map(method => (
                      <option key={method} value={method}>
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Donation Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Donation Type
                  </label>
                  <select
                    multiple
                    value={filters.donation_types || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      handleFilterChange('donation_types', values.length > 0 ? values : undefined);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    size={3}
                  >
                    {filterOptions?.data.donation_types.map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Payment Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Status
                  </label>
                  <select
                    multiple
                    value={filters.payment_statuses || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      handleFilterChange('payment_statuses', values.length > 0 ? values : undefined);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    size={3}
                  >
                    {filterOptions?.data.payment_statuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Custom Date Range */}
              {!filters.period && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={filters.date_from || ''}
                      onChange={(e) => handleFilterChange('date_from', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={filters.date_to || ''}
                      onChange={(e) => handleFilterChange('date_to', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdvancedFilters;
