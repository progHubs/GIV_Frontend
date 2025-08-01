/**
 * Volunteer Profile Edit Modal Component
 * Modal for editing volunteer profile information
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import type { VolunteerProfile, VolunteerProfileUpdateRequest } from '../../types/volunteer';

interface VolunteerProfileEditModalProps {
  profile: VolunteerProfile;
  onSubmit: (data: VolunteerProfileUpdateRequest, files?: File[]) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

// Available volunteer roles/areas of interest
const VOLUNTEER_ROLES = [
  'Dermatologist',
  'Radiologist',
  'Gynecologist',
  'Data Collectors',
  'Internists',
  'Optometrists',
  'Public Health',
  'Medical Student',
  'General Practitioners',
  'Pharmacist',
  'Laboratory professionals',
  'Intern',
  'Nurse',
  'Social worker',
];

interface FormData extends VolunteerProfileUpdateRequest {
  volunteer_roles?: string[];
}

const VolunteerProfileEditModal: React.FC<VolunteerProfileEditModalProps> = ({
  profile,
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  // Parse existing volunteer roles
  const existingRoles = profile.volunteer_roles
    ? profile.volunteer_roles.split(',').map(role => role.trim())
    : [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      location: profile.location || '',
      volunteer_roles: existingRoles,
      is_licensed_practitioner: profile.is_licensed_practitioner || false,
      license_number: profile.license_number || '',
      license_expiry_date: (() => {
        if (!profile.license_expiry_date) return '';
        try {
          const date = new Date(profile.license_expiry_date);
          if (isNaN(date.getTime())) return '';
          return date.toISOString().split('T')[0];
        } catch (error) {
          console.warn('Invalid license_expiry_date:', profile.license_expiry_date);
          return '';
        }
      })(),
      medical_education_institution: profile.medical_education_institution || '',
      medical_education_year: profile.medical_education_year || undefined,
      medical_education_degree: profile.medical_education_degree || '',
    },
  });

  const isLicensedPractitioner = watch('is_licensed_practitioner');

  // Form submission
  const onFormSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);

      // Process the data
      const processedData: VolunteerProfileUpdateRequest = {
        ...data,
        volunteer_roles: data.volunteer_roles || [],
      };

      await onSubmit(processedData, files.length > 0 ? files : undefined);
    } catch (err: any) {
      setError(err.message || 'Failed to update volunteer profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden ${className}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Edit Volunteer Profile</h2>
              <p className="text-blue-100 text-sm">Update your volunteer information</p>
            </div>
            <button onClick={onCancel} className="text-white hover:text-gray-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                {...register('location')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your city or region"
              />
            </div>

            {/* Areas of Interest */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Areas of Interest
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {VOLUNTEER_ROLES.map(role => (
                  <label key={role} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={role}
                      {...register('volunteer_roles')}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Licensed Practitioner */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('is_licensed_practitioner')}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  I am a licensed medical practitioner
                </span>
              </label>
            </div>

            {/* Medical Information (conditional) */}
            {isLicensedPractitioner && (
              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Medical Practitioner Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      License Number
                    </label>
                    <input
                      type="text"
                      {...register('license_number')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      License Expiry Date
                    </label>
                    <input
                      type="date"
                      {...register('license_expiry_date')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Medical Education Institution
                  </label>
                  <input
                    type="text"
                    {...register('medical_education_institution')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Graduation Year
                    </label>
                    <input
                      type="number"
                      min="1901"
                      max="2155"
                      {...register('medical_education_year', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Degree
                    </label>
                    <input
                      type="text"
                      {...register('medical_education_degree')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., MD, MBBS, DO"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Documents Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add Documents
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Upload additional certificates, licenses, or other relevant documents
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Profile'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default VolunteerProfileEditModal;
