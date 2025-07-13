// User Management Filters Component
// Advanced filtering component for users with role, verification status, profile types, and date range filters

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiRefreshCw, FiHeart, FiUsers, FiImage } from 'react-icons/fi';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
import { Badge } from '../ui/Badge';
import { Checkbox } from '../ui/Checkbox';

import type { UserFilters } from '../../types/user';

interface UserManagementFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  totalUsers?: number;
}

export function UserManagementFilters({
  filters,
  onFiltersChange,
  totalUsers = 0,
}: UserManagementFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateRange, setDateRange] = useState<{
    created_after?: Date;
    created_before?: Date;
    updated_after?: Date;
    updated_before?: Date;
  }>({
    created_after: filters.created_after ? new Date(filters.created_after) : undefined,
    created_before: filters.created_before ? new Date(filters.created_before) : undefined,
    updated_after: filters.updated_after ? new Date(filters.updated_after) : undefined,
    updated_before: filters.updated_before ? new Date(filters.updated_before) : undefined,
  });

  // Role options
  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
  ];

  // Language options
  const languageOptions = [
    { value: '', label: 'All Languages' },
    { value: 'en', label: 'English' },
    { value: 'am', label: 'Amharic' },
  ];

  // Handle filter changes
  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  // Handle date range changes
  const handleDateChange = (key: keyof typeof dateRange, date: Date | undefined) => {
    const newDateRange = { ...dateRange, [key]: date };
    setDateRange(newDateRange);

    // Convert to ISO string for API
    const isoValue = date ? date.toISOString() : undefined;
    handleFilterChange(key, isoValue);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setDateRange({});
    onFiltersChange({
      page: 1,
      limit: filters.limit,
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.role) count++;
    if (filters.email_verified !== undefined) count++;
    if (filters.language_preference) count++;
    if (filters.is_donor !== undefined) count++;
    if (filters.is_volunteer !== undefined) count++;
    if (filters.has_profile_image !== undefined) count++;
    if (filters.phone) count++;
    if (filters.created_after) count++;
    if (filters.created_before) count++;
    if (filters.updated_after) count++;
    if (filters.updated_before) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FiFilter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Filters</h3>
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-2">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {totalUsers} user{totalUsers !== 1 ? 's' : ''} found
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
            <FiFilter className="w-4 h-4 mr-1" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>

          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <FiRefreshCw className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Users
          </label>
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search || ''}
            onChange={e => handleFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <Select
            value={filters.role || ''}
            onChange={e => handleFilterChange('role', e.target.value || undefined)}
            options={roleOptions}
            placeholder="Select role"
          />
        </div>

        {/* Email Verification */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Status
          </label>
          <Select
            value={filters.email_verified === undefined ? '' : filters.email_verified.toString()}
            onChange={e => {
              const value = e.target.value;
              const boolValue = value === '' ? undefined : value === 'true';
              handleFilterChange('email_verified', boolValue);
            }}
            options={[
              { value: '', label: 'All Users' },
              { value: 'true', label: 'Verified' },
              { value: 'false', label: 'Unverified' },
            ]}
            placeholder="Select status"
          />
        </div>

        {/* Language Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Language
          </label>
          <Select
            value={filters.language_preference || ''}
            onChange={e => handleFilterChange('language_preference', e.target.value || undefined)}
            options={languageOptions}
            placeholder="Select language"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-4"
          >
            {/* Profile Type Filters */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Types
              </label>
              <div className="flex flex-wrap gap-4">
                <Checkbox
                  checked={filters.is_donor === true}
                  onChange={checked => handleFilterChange('is_donor', checked ? true : undefined)}
                  label={
                    <div className="flex items-center gap-1">
                      <FiHeart className="w-4 h-4 text-red-500" />
                      Has Donor Profile
                    </div>
                  }
                />
                <Checkbox
                  checked={filters.is_volunteer === true}
                  onChange={checked =>
                    handleFilterChange('is_volunteer', checked ? true : undefined)
                  }
                  label={
                    <div className="flex items-center gap-1">
                      <FiUsers className="w-4 h-4 text-green-500" />
                      Has Volunteer Profile
                    </div>
                  }
                />
                <Checkbox
                  checked={filters.has_profile_image === true}
                  onChange={checked =>
                    handleFilterChange('has_profile_image', checked ? true : undefined)
                  }
                  label={
                    <div className="flex items-center gap-1">
                      <FiImage className="w-4 h-4 text-blue-500" />
                      Has Profile Image
                    </div>
                  }
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <Input
                  type="text"
                  placeholder="Search by phone number..."
                  value={filters.phone || ''}
                  onChange={e => handleFilterChange('phone', e.target.value)}
                />
              </div>
            </div>

            {/* Date Range Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created After
                </label>
                <DatePicker
                  selected={dateRange.created_after}
                  onChange={date => handleDateChange('created_after', date)}
                  placeholderText="Select date"
                  maxDate={new Date()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created Before
                </label>
                <DatePicker
                  selected={dateRange.created_before}
                  onChange={date => handleDateChange('created_before', date)}
                  placeholderText="Select date"
                  maxDate={new Date()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Updated After
                </label>
                <DatePicker
                  selected={dateRange.updated_after}
                  onChange={date => handleDateChange('updated_after', date)}
                  placeholderText="Select date"
                  maxDate={new Date()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Updated Before
                </label>
                <DatePicker
                  selected={dateRange.updated_before}
                  onChange={date => handleDateChange('updated_before', date)}
                  placeholderText="Select date"
                  maxDate={new Date()}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Filters:
            </span>

            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 hover:text-red-600"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </Badge>
            )}

            {filters.role && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Role: {filters.role}
                <button
                  onClick={() => handleFilterChange('role', undefined)}
                  className="ml-1 hover:text-red-600"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </Badge>
            )}

            {filters.email_verified !== undefined && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Email: {filters.email_verified ? 'Verified' : 'Unverified'}
                <button
                  onClick={() => handleFilterChange('email_verified', undefined)}
                  className="ml-1 hover:text-red-600"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </Badge>
            )}

            {filters.language_preference && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Language: {filters.language_preference === 'en' ? 'English' : 'Amharic'}
                <button
                  onClick={() => handleFilterChange('language_preference', undefined)}
                  className="ml-1 hover:text-red-600"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </Badge>
            )}

            {filters.is_donor && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <FiHeart className="w-3 h-3" />
                Donor Profile
                <button
                  onClick={() => handleFilterChange('is_donor', undefined)}
                  className="ml-1 hover:text-red-600"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </Badge>
            )}

            {filters.is_volunteer && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <FiUsers className="w-3 h-3" />
                Volunteer Profile
                <button
                  onClick={() => handleFilterChange('is_volunteer', undefined)}
                  className="ml-1 hover:text-red-600"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
