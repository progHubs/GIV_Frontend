import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiRefreshCw, FiUserCheck, FiMapPin, FiAward } from 'react-icons/fi';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
import { Badge } from '../ui/Badge';
import { Checkbox } from '../ui/Checkbox';

import type { VolunteerFilters as VolunteerFiltersType } from '../../types/volunteer';

interface VolunteerFiltersProps {
  filters: VolunteerFiltersType;
  onFilterChange: (filters: Partial<VolunteerFiltersType>) => void;
  onClearFilters: () => void;
  totalVolunteers?: number;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function VolunteerFilters({
  filters,
  onFilterChange,
  onClearFilters,
  totalVolunteers = 0,
  showFilters,
  onToggleFilters,
}: VolunteerFiltersProps) {
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

  // Medical specialization options
  const medicalSpecializationOptions = [
    { value: '', label: 'All Specializations' },
    { value: 'Dermatologist', label: 'Dermatologist' },
    { value: 'Radiologist', label: 'Radiologist' },
    { value: 'Gynecologist', label: 'Gynecologist' },
    { value: 'Internist', label: 'Internist' },
    { value: 'Optometrist', label: 'Optometrist' },
    { value: 'General Practitioner', label: 'General Practitioner' },
    { value: 'Pharmacist', label: 'Pharmacist' },
    { value: 'Nurse', label: 'Nurse' },
    { value: 'Medical Student', label: 'Medical Student' },
    { value: 'Public Health', label: 'Public Health' },
    { value: 'Laboratory Professional', label: 'Laboratory Professional' },
    { value: 'Social Worker', label: 'Social Worker' },
  ];

  // Background check status options
  const backgroundCheckOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  // Application status options
  const applicationStatusOptions = [
    { value: '', label: 'All Applications' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  // Handle filter changes
  const handleFilterChange = (key: keyof VolunteerFiltersType, value: any) => {
    onFilterChange({
      [key]: value,
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

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.volunteer_roles) count++;
    if (filters.is_licensed_practitioner !== undefined) count++;
    if (filters.medical_education_institution) count++;
    if (filters.has_completed_campaigns !== undefined) count++;
    if (filters.min_rating !== undefined) count++;
    if (filters.max_rating !== undefined) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-6"
    >
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {activeFilterCount > 0 && (
            <Badge variant="primary" className="flex items-center gap-1">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
          >
            <FiFilter className="w-4 h-4 mr-1" />
            {showFilters ? 'Hide Filters' : 'Filters'}
          </Button>
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <FiX className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* All Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FiMapPin className="inline w-4 h-4 mr-1" />
            Location
          </label>
          <Input
            type="text"
            placeholder="Filter by location..."
            value={filters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
        </div>

        {/* Medical Specialization Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FiAward className="inline w-4 h-4 mr-1" />
            Specialization
          </label>
          <Select
            value={filters.volunteer_roles || ''}
            onChange={(value) => handleFilterChange('volunteer_roles', value)}
            options={medicalSpecializationOptions}
          />
        </div>

        {/* Licensed Practitioner Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FiUserCheck className="inline w-4 h-4 mr-1" />
            License Status
          </label>
          <Select
            value={filters.is_licensed_practitioner?.toString() || ''}
            onChange={(value) => 
              handleFilterChange('is_licensed_practitioner', 
                value === '' ? undefined : value === 'true'
              )
            }
            options={[
              { value: '', label: 'All Volunteers' },
              { value: 'true', label: 'Licensed Only' },
              { value: 'false', label: 'Non-Licensed Only' },
            ]}
          />
        </div>
      </div>

      {/* Advanced Filters */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                Advanced Filters
              </h4>
              
              {/* Additional Filters Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Medical Education Institution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Medical Institution
                  </label>
                  <Input
                    type="text"
                    placeholder="Filter by institution..."
                    value={filters.medical_education_institution || ''}
                    onChange={(e) => handleFilterChange('medical_education_institution', e.target.value)}
                  />
                </div>
              </div>

              {/* Numeric Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Rating Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Rating
                  </label>
                  <Input
                    type="number"
                    placeholder="0.0"
                    min="0"
                    max="5"
                    step="0.1"
                    value={filters.min_rating || ''}
                    onChange={(e) => handleFilterChange('min_rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Rating
                  </label>
                  <Input
                    type="number"
                    placeholder="5.0"
                    min="0"
                    max="5"
                    step="0.1"
                    value={filters.max_rating || ''}
                    onChange={(e) => handleFilterChange('max_rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>

                {/* Boolean Filters */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Criteria
                  </label>
                  <div className="space-y-2">
                    <Checkbox
                      id="has_completed_campaigns"
                      checked={filters.has_completed_campaigns || false}
                      onChange={(checked) => 
                        handleFilterChange('has_completed_campaigns', checked)
                      }
                      label="Has completed campaigns"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      {totalVolunteers > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {activeFilterCount > 0 ? (
              <>
                Showing filtered results from {totalVolunteers} total volunteers
                {activeFilterCount > 0 && (
                  <span className="ml-2">
                    ({activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied)
                  </span>
                )}
              </>
            ) : (
              `Showing all ${totalVolunteers} volunteers`
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}