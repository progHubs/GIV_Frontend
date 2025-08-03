// Volunteer Detail Page
// Comprehensive page showing all volunteer information, statistics, and related data

import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ArrowLeftIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ShieldCheckIcon,
  UserIcon,
  HeartIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  GlobeAltIcon,
  DocumentIcon,
  AcademicCapIcon,
  ClockIcon,
  MapPinIcon,
  LanguageIcon,
  StarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

import { formatDate as formatDateUtil } from '../../utils/dateUtils';
import { api } from '../../lib/api';
import { useVolunteerProfile, useVolunteerCampaignApplications } from '../../hooks/useVolunteer';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import campaignApi from '../../lib/campaignApi';

import type { VolunteerProfile } from '../../types/volunteer';

export default function VolunteerDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State hooks - must be called before any early returns
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCampaignForCertificate, setSelectedCampaignForCertificate] = useState<any>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [isUploadingCertificate, setIsUploadingCertificate] = useState(false);

  // Determine back navigation based on 'from' parameter
  const getBackPath = () => {
    const from = searchParams.get('from');

    if (from === 'campaigns') {
      return '/admin/campaigns';
    } else {
      return '/admin/volunteers';
    }
  };

  // Hooks
  const {
    data: volunteerData,
    isLoading: volunteerLoading,
    error: volunteerError,
    refetch: refetchVolunteer,
  } = useVolunteerProfile(userId!);

  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    refetch: refetchCampaigns,
  } = useVolunteerCampaignApplications(userId!);

  const volunteer = volunteerData?.data;
  const campaigns = campaignsData?.data || [];
  const isLoading = volunteerLoading || campaignsLoading;

  // Combined refetch function for both queries
  const refetch = () => {
    refetchVolunteer();
    refetchCampaigns();
  };

  if (!userId) {
    navigate('/admin/volunteers');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (volunteerError || !volunteer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Volunteer Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The volunteer you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/admin/volunteers')}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Volunteers
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (campaign: any) => {
    try {
      // This would typically open a modal, but for now we'll implement a simple status cycle
      const statusCycle = {
        'waiting': 'approved',
        'approved': 'completed',
        'completed': 'completed',
        'rejected': 'approved'
      };

      const newStatus = statusCycle[campaign.status as keyof typeof statusCycle] || 'approved';

      const response = await campaignApi.updateVolunteerCampaignStatus(
        userId!,
        campaign.campaign_id,
        newStatus,
        `Status updated to ${newStatus} by admin`
      );

      if (response.success) {
        toast.success(`Status updated to ${newStatus}`);
        // Refetch the data without page reload
        refetch();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCertificateIssuance = (campaign: any) => {
    setSelectedCampaignForCertificate(campaign);
    setShowCertificateModal(true);
  };

  const handleCertificateUpload = async () => {
    if (!certificateFile || !selectedCampaignForCertificate) {
      toast.error('Please select a certificate file');
      return;
    }

    setIsUploadingCertificate(true);

    try {
      const formData = new FormData();
      formData.append('file', certificateFile); // Backend expects 'file' field name
      formData.append('certificateData', JSON.stringify({
        volunteerName: volunteer.users?.full_name,
        campaignTitle: selectedCampaignForCertificate.campaigns?.title,
        completionDate: new Date().toISOString()
      }));

      const result = await api.upload(`/volunteers/${userId}/campaigns/${selectedCampaignForCertificate.campaign_id}/certificate`, formData);

      if (result.success) {
        toast.success('Certificate uploaded successfully');
        setShowCertificateModal(false);
        setCertificateFile(null);
        setSelectedCampaignForCertificate(null);
        // Refetch the data without page reload
        refetch();
      } else {
        toast.error(result.error || 'Failed to upload certificate');
      }
    } catch (error) {
      toast.error('Failed to upload certificate');
    } finally {
      setIsUploadingCertificate(false);
    }
  };

  // Use the centralized date utility
  const formatDate = formatDateUtil;

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircleIcon className="w-3 h-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircleIcon className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case 'waiting':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            Pending
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <TrophyIcon className="w-3 h-3" />
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(getBackPath())}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Volunteer Details
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Comprehensive volunteer profile and activity information
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Link */}
            <Card>
              <CardContent className="p-6">
                <button
                  onClick={() => navigate(`/admin/users/${volunteer.user_id}?from=volunteers`)}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
                    {volunteer.users?.profile_image_url ? (
                      <img
                        src={volunteer.users.profile_image_url}
                        alt={volunteer.users.full_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      volunteer.users?.full_name?.charAt(0) || 'V'
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {volunteer.users?.full_name || 'Volunteer'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click to view user details
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Volunteer Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5" />
                  Volunteer Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {volunteer.registered_campaigns_count || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Registered
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {volunteer.active_campaigns_count || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Active
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {volunteer.completed_campaigns_count || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-1">
                      {volunteer.rating ? parseFloat(volunteer.rating).toFixed(1) : '0.0'}
                      <StarIcon className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Rating
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Licensed Practitioner
                    </label>
                    <div className="mt-1">
                      {volunteer.is_licensed_practitioner ? (
                        <Badge variant="success" className="flex items-center gap-1 w-fit">
                          <CheckCircleIcon className="w-3 h-3" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                          <XCircleIcon className="w-3 h-3" />
                          No
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      License Number
                    </label>
                    <div className="mt-1">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                        {volunteer.license_number || 'Not provided'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      License Expiry
                    </label>
                    <div className="mt-1">
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                        {formatDate(volunteer.license_expiry_date)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Medical Institution
                    </label>
                    <div className="mt-1">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                        {volunteer.medical_education_institution || 'Not provided'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Graduation Year
                    </label>
                    <div className="mt-1">
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                        {volunteer.medical_education_year || 'Not provided'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Medical Degree
                    </label>
                    <div className="mt-1">
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">
                        {volunteer.medical_education_degree || 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Volunteer Roles
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {volunteer.volunteer_roles ? (
                      volunteer.volunteer_roles.split(',').map((role, index) => (
                        <Badge key={index} variant="outline">
                          {role.trim()}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        No roles specified
                      </span>
                    )}
                  </div>
                </div>


              </CardContent>
            </Card>

            {/* Campaign Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5" />
                  Campaign Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {campaigns.length > 0 ? (
                  <div className="space-y-3">
                    {campaigns.map((campaign: any, index: number) => (
                      <motion.div
                        key={campaign.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {campaign.campaigns?.title || 'Campaign'}
                          </h4>
                          <div className="mt-1 space-y-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Applied: {formatDate(campaign.application_date)}
                            </p>
                            {campaign.approval_date && campaign.status !== 'waiting' && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Approved: {formatDate(campaign.approval_date)}
                              </p>
                            )}
                            {campaign.hours_committed && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Hours committed: {campaign.hours_committed}
                              </p>
                            )}
                            {campaign.hours_completed > 0 && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Hours completed: {campaign.hours_completed}
                              </p>
                            )}
                            {campaign.certificate_url && (
                              <p className="text-sm text-green-600 dark:text-green-400">
                                ✓ Certificate issued
                              </p>
                            )}
                          </div>
                          {campaign.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                              <strong>Notes:</strong> {campaign.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(campaign.status)}
                          <div className="flex items-center gap-2">
                            {campaign.status === 'waiting' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(campaign)}
                                className="text-green-600 hover:text-green-700"
                              >
                                Approve
                              </Button>
                            )}
                            {campaign.status === 'approved' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(campaign)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Mark Complete
                              </Button>
                            )}
                            {campaign.status === 'rejected' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(campaign)}
                                className="text-green-600 hover:text-green-700"
                              >
                                Re-approve
                              </Button>
                            )}
                            {campaign.status === 'completed' && !campaign.certificate_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCertificateIssuance(campaign)}
                                className="text-purple-600 hover:text-purple-700"
                              >
                                Issue Certificate
                              </Button>
                            )}
                            {campaign.certificate_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(campaign.certificate_url, '_blank')}
                                className="text-green-600 hover:text-green-700"
                              >
                                View Certificate
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      No campaign applications
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      This volunteer hasn't applied to any campaigns yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            {volunteer.volunteer_documents && volunteer.volunteer_documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DocumentIcon className="w-5 h-5" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {volunteer.volunteer_documents.map((doc: any, index: number) => (
                      <div
                        key={doc.id || index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <DocumentIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {doc.document_name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {doc.document_type} • Uploaded {formatDate(doc.upload_date)}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.file_path, '_blank')}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Upload Modal */}
      {showCertificateModal && selectedCampaignForCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Upload Certificate
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Campaign: <strong>{selectedCampaignForCertificate.campaigns?.title}</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Volunteer: <strong>{volunteer.users?.full_name}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate File (PDF, JPG, PNG)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
                {certificateFile && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Selected: {certificateFile.name}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCertificateModal(false);
                    setCertificateFile(null);
                    setSelectedCampaignForCertificate(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCertificateUpload}
                  disabled={!certificateFile || isUploadingCertificate}
                  className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
                  {isUploadingCertificate ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    'Upload Certificate'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}