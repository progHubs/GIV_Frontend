/**
 * Volunteer Section Component
 * Displays volunteer information and application form in campaign details
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { SimpleVolunteerApplicationForm, VolunteerProfileCreationForm } from '../../volunteers';
import LoginNotice from '../../auth/LoginNotice';
import {
  useApplyCampaignVolunteer,
  useVolunteerApplications,
  useVolunteerProfile,
  useCreateVolunteerProfile,
} from '../../../hooks/useVolunteer';
import type { Campaign } from '../../../types/campaign';
import type { VolunteerProfileUpdateRequest } from '../../../types/volunteer';

interface VolunteerSectionProps {
  campaign: Campaign;
  className?: string;
}

const VolunteerSection: React.FC<VolunteerSectionProps> = ({ campaign, className = '' }) => {
  const { user, isAuthenticated } = useAuth();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showProfileCreationForm, setShowProfileCreationForm] = useState(false);
  const [showLoginNotice, setShowLoginNotice] = useState(false);

  // Fetch user's applications and profile (only if authenticated)
  const { data: applicationsData } = useVolunteerApplications(isAuthenticated);
  const { data: profileData } = useVolunteerProfile(undefined, isAuthenticated);
  const applyMutation = useApplyCampaignVolunteer();
  const createProfileMutation = useCreateVolunteerProfile();

  const userApplications = applicationsData?.data || [];
  const safeUserApplications = Array.isArray(userApplications) ? userApplications : [];
  const hasApplied = safeUserApplications.some(app => app.campaign_id === campaign.id);
  const userApplication = safeUserApplications.find(app => app.campaign_id === campaign.id);

  // Check if user has volunteer profile
  const hasVolunteerProfile = user?.is_volunteer && profileData?.data;

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      setShowLoginNotice(true);
      return;
    }

    // Check if user has volunteer profile
    if (!hasVolunteerProfile) {
      setShowProfileCreationForm(true);
      return;
    }

    setShowApplicationForm(true);
  };

  const handleProfileCreation = async (data: VolunteerProfileUpdateRequest, files?: File[]) => {
    try {
      // Combine data and files for the mutation
      const profileData = {
        ...data,
        files: files || [],
      };
      
      await createProfileMutation.mutateAsync(profileData);
      toast.success('Volunteer profile created successfully!');
      setShowProfileCreationForm(false);
      // After profile creation, show application form
      setShowApplicationForm(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create volunteer profile');
      throw error;
    }
  };

  const handleApplicationSubmit = async (applicationNotes: string) => {
    try {
      const applicationData = {
        campaign_id: campaign.id,
        application_notes: applicationNotes,
      };

      await applyMutation.mutateAsync({ data: applicationData });
      toast.success('Application submitted successfully!');
      setShowApplicationForm(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Volunteer Requirements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Volunteer Opportunities
        </h3>

        {/* Campaign Stats */}
        <div className="flex justify-center mb-6">
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg min-w-[200px]">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {campaign.volunteer_count || 0}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Current Volunteers</div>
          </div>
        </div>

        {/* Application Status or Apply Button */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          {hasApplied ? (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Your Application
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    You have applied to volunteer for this campaign
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(userApplication?.application_status || 'pending')}`}
                >
                  {userApplication?.application_status || 'Pending'}
                </span>
              </div>
              {userApplication && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Role:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100 capitalize">
                      {userApplication.volunteer_role}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Hours Committed:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {userApplication.hours_committed}/week
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Applied:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {new Date(userApplication.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {userApplication.hours_completed && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Hours Completed:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {userApplication.hours_completed}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Ready to Make a Difference?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Join our volunteer team and help make this campaign a success.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApplyClick}
                disabled={!campaign.is_active || applyMutation.isPending}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {applyMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Apply to Volunteer
                  </>
                )}
              </motion.button>
              {!campaign.is_active && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  This campaign is not currently accepting volunteers.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Volunteer Requirements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Volunteer Requirements
        </h4>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Background Check Required
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                All volunteers must pass a background check before approval
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Minimum Age: 18 years
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Volunteers must be at least 18 years old
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Commitment Required
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Minimum commitment of 5 hours per week
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Notice Modal */}
      <AnimatePresence>
        {showLoginNotice && (
          <LoginNotice
            onClose={() => setShowLoginNotice(false)}
            message="Please log in or register to apply as a volunteer for this campaign"
          />
        )}
      </AnimatePresence>

      {/* Profile Creation Form Modal */}
      <AnimatePresence>
        {showProfileCreationForm && (
          <VolunteerProfileCreationForm
            onSubmit={handleProfileCreation}
            onCancel={() => setShowProfileCreationForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Application Form Modal */}
      <AnimatePresence>
        {showApplicationForm && (
          <SimpleVolunteerApplicationForm
            campaign={campaign}
            onSubmit={handleApplicationSubmit}
            onCancel={() => setShowApplicationForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VolunteerSection;
