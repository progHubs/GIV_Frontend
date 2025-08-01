/**
 * Volunteer Profile Component
 * Display and edit volunteer profile information
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import type { VolunteerProfile, VolunteerProfileUpdateRequest } from '../../types/volunteer';
import { FileUpload } from '../ui/FileUpload';
import { validateFile } from '../../lib/uploadApi';

interface VolunteerProfileProps {
  profile?: VolunteerProfile;
  onUpdate?: (data: VolunteerProfileUpdateRequest, files?: File[]) => Promise<void>;
  editable?: boolean;
  className?: string;
}

const VolunteerProfile: React.FC<VolunteerProfileProps> = ({
  profile,
  onUpdate,
  editable = false,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);

  const { register, handleSubmit, reset } = useForm<VolunteerProfileUpdateRequest>({
    defaultValues: profile
      ? {
          phone_number: profile.phone_number || '',
          emergency_contact_name: profile.emergency_contact_name || '',
          emergency_contact_phone: profile.emergency_contact_phone || '',
          medical_conditions: profile.medical_conditions || '',
          skills: profile.skills || [],
          availability: profile.availability || [],
          preferred_roles: profile.preferred_roles || [],
          is_medical_professional: profile.is_medical_professional || false,
          medical_license_number: profile.medical_license_number || '',
          medical_specialization: profile.medical_specialization || '',
          license_expiry_date: profile.license_expiry_date || '',
        }
      : {},
  });

  // Handle document selection
  const handleDocumentSelect = (files: File | File[]) => {
    const fileArray = Array.isArray(files) ? files : [files];
    const validFiles: File[] = [];

    fileArray.forEach(file => {
      const error = validateFile.document(file);
      if (!error) {
        validFiles.push(file);
      }
    });

    setSelectedDocuments(prev => [...prev, ...validFiles]);
  };

  // Form submission
  const onFormSubmit = async (data: VolunteerProfileUpdateRequest) => {
    if (!onUpdate) return;

    try {
      setLoading(true);
      setError(null);

      await onUpdate(data, selectedDocuments.length > 0 ? selectedDocuments : undefined);
      setIsEditing(false);
      setSelectedDocuments([]);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSelectedDocuments([]);
    reset();
  };

  if (!profile && !isEditing) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            No volunteer profile
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create your volunteer profile to start applying for campaigns.
          </p>
          {editable && (
            <div className="mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Profile
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Volunteer Profile
          </h2>
          {editable && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        /* Edit Form */
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                {...register('phone_number')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Emergency Contact Name
              </label>
              <input
                type="text"
                {...register('emergency_contact_name')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                {...register('emergency_contact_phone')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('is_medical_professional')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Medical Professional
                </span>
              </label>
            </div>
          </div>

          {/* Medical Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Medical License Number
              </label>
              <input
                type="text"
                {...register('medical_license_number')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Medical Specialization
              </label>
              <input
                type="text"
                {...register('medical_specialization')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Medical Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Medical Conditions (Optional)
            </label>
            <textarea
              {...register('medical_conditions')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any medical conditions we should be aware of..."
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Update Documents
            </label>
            <FileUpload
              accept=".pdf,.doc,.docx,.txt"
              multiple={true}
              onFileSelect={handleDocumentSelect}
              maxSize={10}
              placeholder="Upload certificates, licenses, or other documents"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Profile'
              )}
            </motion.button>
          </div>
        </form>
      ) : (
        /* Display Profile */
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {profile?.phone_number || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Emergency Contact:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {profile?.emergency_contact_name || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          {profile?.is_medical_professional && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Medical Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">License Number:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {profile?.medical_license_number || 'Not provided'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Specialization:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {profile?.medical_specialization || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VolunteerProfile;
