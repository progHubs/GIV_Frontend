/**
 * Volunteer Application Form Component
 * Form for applying to volunteer for campaigns
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import type { Campaign, VolunteerApplicationRequest } from '../../types';
import { FileUpload } from '../ui/FileUpload';
import { validateFile } from '../../lib/uploadApi';

interface VolunteerApplicationFormProps {
  campaign: Campaign;
  onSubmit: (data: VolunteerApplicationRequest, files?: File[]) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

const VolunteerApplicationForm: React.FC<VolunteerApplicationFormProps> = ({
  campaign,
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VolunteerApplicationRequest>({
    defaultValues: {
      campaign_id: campaign.id,
      volunteer_role: 'general',
      hours_committed: 10,
    },
  });

  // Handle document selection
  const handleDocumentSelect = (files: File | File[]) => {
    const fileArray = Array.isArray(files) ? files : [files];
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach((file, index) => {
      const error = validateFile.document(file);
      if (error) {
        errors.push(`File ${index + 1}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    setFileErrors(errors);
    setSelectedDocuments(prev => [...prev, ...validFiles]);
  };

  // Remove document
  const removeDocument = (index: number) => {
    setSelectedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const onFormSubmit = async (data: VolunteerApplicationRequest) => {
    try {
      setLoading(true);
      setError(null);

      await onSubmit(data, selectedDocuments.length > 0 ? selectedDocuments : undefined);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const hoursCommitted = watch('hours_committed');

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
              <h2 className="text-xl font-bold text-white">Apply to Volunteer</h2>
              <p className="text-blue-100 text-sm">{campaign.title}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Volunteer Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Volunteer Role
            </label>
            <select
              {...register('volunteer_role', { required: 'Please select a volunteer role' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="general">General Volunteer</option>
              <option value="medical">Medical Professional</option>
              <option value="coordinator">Coordinator</option>
              <option value="specialist">Specialist</option>
            </select>
            {errors.volunteer_role && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.volunteer_role.message}</p>
            )}
          </div>

          {/* Hours Committed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hours Committed (per week)
            </label>
            <input
              type="number"
              min="1"
              max="40"
              {...register('hours_committed', {
                required: 'Please specify hours committed',
                min: { value: 1, message: 'Minimum 1 hour required' },
                max: { value: 40, message: 'Maximum 40 hours allowed' },
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.hours_committed && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hours_committed.message}</p>
            )}
            {hoursCommitted && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Total commitment: {hoursCommitted} hours/week
              </p>
            )}
          </div>

          {/* Application Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Application Notes
            </label>
            <textarea
              {...register('application_notes')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us why you want to volunteer for this campaign and any relevant experience..."
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Supporting Documents (Optional)
            </label>
            <FileUpload
              accept=".pdf,.doc,.docx,.txt"
              multiple={true}
              onFileSelect={handleDocumentSelect}
              maxSize={10}
              placeholder="Upload certificates, resume, or other documents"
            />
            
            {/* File Errors */}
            {fileErrors.length > 0 && (
              <div className="mt-2 space-y-1">
                {fileErrors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600 dark:text-red-400">{error}</p>
                ))}
              </div>
            )}

            {/* Selected Documents */}
            {selectedDocuments.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Documents:</p>
                {selectedDocuments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Application'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VolunteerApplicationForm;
