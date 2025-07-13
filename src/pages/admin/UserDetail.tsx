// User Detail Page
// Comprehensive page showing all user information, statistics, and related data

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  FiArrowLeft,
  FiEdit,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiUser,
  FiHeart,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiGlobe,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useUserById, useDonorById, useVolunteerById } from '../../hooks/useUserManagement';
import { UserForm } from '../../components/admin/UserForm';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/utils';

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Hooks
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useUserById(userId!);
  const { data: donorData, isLoading: donorLoading } = useDonorById(userId!);
  const { data: volunteerData, isLoading: volunteerLoading } = useVolunteerById(userId!);

  const user = userData?.data;
  const donor = donorData?.data;
  const volunteer = volunteerData?.data;

  const handleEditSuccess = () => {
    refetchUser();
    setIsEditModalOpen(false);
    toast.success('User updated successfully');
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The user you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/admin/users')} variant="outline">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/users')}>
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  {user.profile_image_url ? (
                    <img
                      src={user.profile_image_url}
                      alt={user.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {user.full_name}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">User Details</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2">
                <FiEdit className="w-4 h-4" />
                Edit User
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiUser className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Full Name
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">{user.full_name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </label>
                    <div className="flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900 dark:text-white">{user.email}</p>
                      {user.email_verified ? (
                        <FiCheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <FiXCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  {user.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Phone
                      </label>
                      <div className="flex items-center gap-2">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-white">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Role
                    </label>
                    <div className="flex items-center gap-2">
                      <FiShield className="w-4 h-4 text-gray-400" />
                      <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Language
                    </label>
                    <div className="flex items-center gap-2">
                      <FiGlobe className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900 dark:text-white">
                        {user.language_preference === 'en' ? 'English' : 'Amharic'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Member Since
                    </label>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900 dark:text-white">
                        {format(new Date(user.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donor Profile */}
            {donor && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiHeart className="w-5 h-5 text-red-500" />
                    Donor Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(donor.total_donated || 0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Donated</div>
                    </div>

                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {donor.donation_count || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Donations
                      </div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {donor.last_donation_date
                          ? format(new Date(donor.last_donation_date), 'MMM dd, yyyy')
                          : 'Never'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Last Donation</div>
                    </div>
                  </div>

                  {donor.preferred_payment_method && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Preferred Payment Method
                      </label>
                      <p className="text-gray-900 dark:text-white capitalize">
                        {donor.preferred_payment_method}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Volunteer Profile */}
            {volunteer && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiUsers className="w-5 h-5 text-blue-500" />
                    Volunteer Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {volunteer.total_hours || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Hours</div>
                    </div>

                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {volunteer.registered_events_count || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Events Participated
                      </div>
                    </div>

                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {volunteer.background_check_status === 'approved' ? 'Verified' : 'Pending'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Background Check
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {volunteer.emergency_contact_name && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Emergency Contact
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {volunteer.emergency_contact_name}
                        </p>
                        {volunteer.emergency_contact_phone && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {volunteer.emergency_contact_phone}
                          </p>
                        )}
                      </div>
                    )}

                    {volunteer.availability && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Availability
                        </label>
                        <p className="text-gray-900 dark:text-white">{volunteer.availability}</p>
                      </div>
                    )}
                  </div>

                  {volunteer.motivation && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Motivation
                      </label>
                      <p className="text-gray-900 dark:text-white">{volunteer.motivation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email Verified</span>
                  {user.email_verified ? (
                    <Badge variant="success">Verified</Badge>
                  ) : (
                    <Badge variant="destructive">Not Verified</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Has Donor Profile
                  </span>
                  <Badge variant={donor ? 'success' : 'secondary'}>{donor ? 'Yes' : 'No'}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Has Volunteer Profile
                  </span>
                  <Badge variant={volunteer ? 'success' : 'secondary'}>
                    {volunteer ? 'Yes' : 'No'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Account Status</span>
                  <Badge variant="success">Active</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Loading States for Profiles */}
            {(donorLoading || volunteerLoading) && (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <LoadingSpinner size="md" />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Loading profile data...
                  </span>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <UserForm
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        mode="edit"
      />
    </div>
  );
}
