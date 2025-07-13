/**
 * User Profile Page
 * User profile management and dashboard
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from '../../theme';
import ModernNavigation from '../../components/navigation/ModernNavigation';
import { useAuth } from '../../features/auth/context/AuthContext';
import { DonationHistory, DonationStats } from '../../components/donations';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import TierBadge from '../../components/common/TierBadge';
import { useDonorProfile } from '../../hooks/useDonations';

const UserProfile: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { user, isLoading: authLoading } = useAuth();
  const { data: donorProfile } = useDonorProfile(user?.id?.toString());

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
                        {donorProfile.donation_tier && (
                          <TierBadge tier={donorProfile.donation_tier} size="md" animated={true} />
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
                          {donorProfile?.donation_tier && (
                            <TierBadge
                              tier={donorProfile.donation_tier}
                              size="sm"
                              animated={true}
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
      </div>
    </ThemeProvider>
  );
};

export default UserProfile;
