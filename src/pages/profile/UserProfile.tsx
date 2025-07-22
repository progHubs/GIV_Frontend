/**
 * User Profile Page
 * User profile management and dashboard
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CogIcon, CreditCardIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ThemeProvider } from '../../theme';
import ModernNavigation from '../../components/navigation/ModernNavigation';
import { useAuth } from '../../features/auth/context/AuthContext';
import { DonationHistory, DonationStats } from '../../components/donations';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import MembershipBadge from '../../components/common/MembershipBadge';
import { useDonorProfile } from '../../hooks/useDonations';
import { useUserMembership, useReactivateMembership } from '../../hooks/useMembership';
import { api } from '../../lib/api';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const { data: donorProfile } = useDonorProfile(user?.id?.toString());
  const {
    data: userMembership,
    refetch: refetchMembership,
    isLoading: membershipLoading,
  } = useUserMembership();
  const reactivateMembershipMutation = useReactivateMembership();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  if (authLoading || !user) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-theme-background">
          <ModernNavigation />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-theme-primary">Loading Profile...</h2>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  const handleCancelMembership = async () => {
    if (!userMembership) return;

    setIsCancelling(true);
    try {
      await api.post('/memberships/cancel', {
        cancel_at_period_end: true,
      });

      toast.success('Membership will be cancelled at the end of your current billing period.');
      setShowCancelModal(false);
      refetchMembership();
    } catch (error: any) {
      console.error('Cancel membership error:', error);
      toast.error(error.response?.data?.error || 'Failed to cancel membership. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleChangePlan = () => {
    navigate('/membership');
  };

  const handleReactivateMembership = async () => {
    setIsReactivating(true);
    try {
      await reactivateMembershipMutation.mutateAsync();
      toast.success('Membership reactivated successfully!');
      refetchMembership();
    } catch (error: any) {
      console.error('Reactivate membership error:', error);
      toast.error(
        error.response?.data?.error || 'Failed to reactivate membership. Please try again.'
      );
    } finally {
      setIsReactivating(false);
    }
  };

  const sections = [
    { id: 'overview', name: 'Overview', icon: '🏠' },
    { id: 'donations', name: 'Donations', icon: '💝' },
    { id: 'events', name: 'Events', icon: '🎫' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-theme-surface rounded-lg p-6 border border-theme">
              <h3 className="text-lg font-semibold text-theme-primary mb-4">Account Overview</h3>
              <p className="text-theme-muted mb-4">Welcome to your dashboard overview.</p>

              {user.is_donor && donorProfile && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Donor Status</h4>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-blue-700">Current Tier:</span>
                        {userMembership && userMembership.status === 'active' ? (
                          <MembershipBadge tier={userMembership.membership_plans.tier} size="md" />
                        ) : (
                          <span className="text-sm text-gray-500">No active membership</span>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-blue-600">
                        Total Donated:{' '}
                        <span className="font-semibold">
                          ${parseFloat(donorProfile.total_donated || '0').toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl">🎯</div>
                      <div className="text-xs text-blue-600 mt-1">Thank you!</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Membership Management Section */}
            {!membershipLoading && userMembership && (
              <div className="bg-theme-surface rounded-lg p-6 border border-theme">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-theme-primary">
                    Membership Management
                  </h3>
                  {userMembership.status === 'active' && (
                    <MembershipBadge tier={userMembership.membership_plans.tier} size="sm" />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Plan Details */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-theme-primary">Current Plan</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-theme-muted">Plan:</span>
                        <span className="font-medium">{userMembership.membership_plans.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-theme-muted">Amount:</span>
                        <span className="font-medium">
                          $
                          {userMembership.membership_plans?.amount
                            ? Number(userMembership.membership_plans.amount).toFixed(2)
                            : '0.00'}
                          /{userMembership.membership_plans?.billing_cycle || 'monthly'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-theme-muted">Status:</span>
                        <span
                          className={`font-medium capitalize ${
                            userMembership.status === 'active'
                              ? 'text-green-600'
                              : userMembership.status === 'cancelled'
                                ? 'text-red-600'
                                : 'text-yellow-600'
                          }`}
                        >
                          {userMembership.status}
                        </span>
                      </div>
                      {/* Only show Next Billing for active memberships that are NOT scheduled to cancel */}
                      {userMembership.status === 'active' &&
                        !userMembership.cancel_at_period_end && (
                          <div className="flex justify-between">
                            <span className="text-theme-muted">Next Billing:</span>
                            <span className="font-medium">
                              {userMembership.current_period_end
                                ? new Date(userMembership.current_period_end).toLocaleDateString()
                                : 'N/A'}
                            </span>
                          </div>
                        )}
                      {userMembership.cancel_at_period_end && (
                        <div className="flex justify-between">
                          <span className="text-theme-muted">Cancels:</span>
                          <span className="font-medium text-red-600">
                            {userMembership.current_period_end
                              ? new Date(userMembership.current_period_end).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Management Actions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-theme-primary">Actions</h4>
                    <div className="space-y-3">
                      <button
                        onClick={handleChangePlan}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <CreditCardIcon className="h-4 w-4 mr-2" />
                        Change Plan
                      </button>

                      {userMembership.status === 'active' &&
                        !userMembership.cancel_at_period_end && (
                          <button
                            onClick={() => setShowCancelModal(true)}
                            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XMarkIcon className="h-4 w-4 mr-2" />
                            Cancel Membership
                          </button>
                        )}

                      {userMembership.cancel_at_period_end && (
                        <div className="space-y-3">
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              Your membership will be cancelled on{' '}
                              {new Date(userMembership.current_period_end).toLocaleDateString()}.
                            </p>
                          </div>
                          <button
                            onClick={handleReactivateMembership}
                            disabled={isReactivating}
                            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            <CreditCardIcon className="h-4 w-4 mr-2" />
                            {isReactivating ? 'Reactivating...' : 'Reactivate Membership'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No Membership CTA */}
            {!membershipLoading && !userMembership && user.is_donor && (
              <div className="bg-theme-surface rounded-lg p-6 border border-theme">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-theme-primary mb-2">Become a Member</h3>
                  <p className="text-theme-muted mb-4">
                    Join our membership program for exclusive benefits and regular impact.
                  </p>
                  <button
                    onClick={() => navigate('/membership')}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    View Membership Plans
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'donations':
        return (
          <div className="space-y-6">
            <DonationStats />
            <DonationHistory />
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            <div className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme">
              <h3 className="text-xl font-bold text-theme-primary mb-4">My Events</h3>
              <p className="text-theme-muted">Event functionality coming soon...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme-background">
        <ModernNavigation />

        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Header */}
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-theme-primary">My Profile</h1>
                  <p className="text-theme-muted mt-2">Welcome back, {user.full_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-theme-muted">Member since</p>
                  <p className="text-theme-primary font-medium">
                    {(() => {
                      if (!user.created_at) return 'Unknown';
                      const date = new Date(user.created_at);
                      if (isNaN(date.getTime())) return 'Unknown';
                      return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      });
                    })()}
                  </p>
                </div>
              </motion.div>

              {/* Profile Card */}
              <motion.div
                variants={itemVariants}
                className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme"
              >
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-theme-primary to-theme-secondary rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user.full_name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-theme-primary">{user.full_name}</h2>
                    <p className="text-theme-muted">{user.email}</p>
                    {user.phone && <p className="text-theme-muted">{user.phone}</p>}
                    <div className="flex items-center space-x-4 mt-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                      {user.is_donor && (
                        <>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Donor
                          </span>
                          {userMembership && userMembership.status === 'active' && (
                            <MembershipBadge
                              tier={userMembership.membership_plans.tier}
                              size="sm"
                            />
                          )}
                        </>
                      )}
                      {user.is_volunteer && (
                        <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                          Volunteer
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Pills for mobile (<=md) */}
              <motion.div variants={itemVariants} className="md:hidden">
                <div className="flex overflow-x-auto space-x-1 bg-theme-surface rounded-xl p-1 border border-theme no-scrollbar">
                  {sections.map(sec => (
                    <motion.button
                      key={sec.id}
                      onClick={() => setActiveSection(sec.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-shrink-0 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                        activeSection === sec.id
                          ? 'bg-theme-primary text-white shadow-md'
                          : 'text-theme-muted hover:text-theme-primary hover:bg-theme-background'
                      }`}
                    >
                      <span className="mr-2">{sec.icon}</span>
                      {sec.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Main grid with sidebar on md+ */}
              <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <ProfileSidebar
                  items={sections}
                  active={activeSection}
                  onSelect={setActiveSection}
                />

                {/* Content */}
                <div className="flex-1">{renderSectionContent()}</div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Cancel Membership Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl"
            >
              <div className="flex items-center mb-4">
                <XMarkIcon className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cancel Membership
                </h3>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Are you sure you want to cancel your membership? Your membership will remain
                  active until the end of your current billing period.
                </p>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> You can reactivate your membership anytime before the
                    cancellation date by changing to a new plan.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Keep Membership
                </button>
                <button
                  onClick={handleCancelMembership}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Membership'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default UserProfile;
