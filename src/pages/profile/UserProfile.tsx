/**
 * User Profile Page
 * User profile management and dashboard
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from '../../theme';
import ModernNavigation from '../../components/navigation/ModernNavigation';

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

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

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    joinDate: 'January 2024',
    totalDonations: '$1,250',
    campaignsSupported: 8,
    volunteerHours: 24,
  };

  const myDonations = [
    {
      id: 1,
      campaign: 'Emergency Medical Equipment',
      amount: '$500',
      date: '2024-01-15',
      status: 'Completed',
    },
    {
      id: 2,
      campaign: 'Maternal Health Program',
      amount: '$300',
      date: '2024-01-10',
      status: 'Completed',
    },
    {
      id: 3,
      campaign: 'Community Education Initiative',
      amount: '$200',
      date: '2024-01-05',
      status: 'Completed',
    },
    {
      id: 4,
      campaign: 'Mobile Clinic Vehicle Fund',
      amount: '$250',
      date: '2023-12-28',
      status: 'Completed',
    },
  ];

  const volunteerActivities = [
    {
      id: 1,
      activity: 'Medical Mission - Hawassa',
      hours: 8,
      date: '2024-01-20',
      status: 'Completed',
    },
    {
      id: 2,
      activity: 'Community Health Education',
      hours: 6,
      date: '2024-01-15',
      status: 'Completed',
    },
    {
      id: 3,
      activity: 'Emergency Response Training',
      hours: 10,
      date: '2024-01-08',
      status: 'Completed',
    },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'donations', name: 'My Donations', icon: '💝' },
    { id: 'volunteer', name: 'Volunteer Work', icon: '🤝' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-theme-primary">{user.totalDonations}</h3>
                    <p className="text-theme-muted text-sm">Total Donations</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-theme-primary">{user.campaignsSupported}</h3>
                    <p className="text-theme-muted text-sm">Campaigns Supported</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-theme-primary">{user.volunteerHours}</h3>
                    <p className="text-theme-muted text-sm">Volunteer Hours</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme">
              <h3 className="text-xl font-bold text-theme-primary mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-theme-background">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-theme-primary">Donated $500 to Emergency Medical Equipment campaign</p>
                    <p className="text-sm text-theme-muted">January 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-theme-background">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-theme-primary">Completed 8 hours of volunteer work in Hawassa</p>
                    <p className="text-sm text-theme-muted">January 20, 2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-theme-background">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-theme-primary">Joined Community Health Education program</p>
                    <p className="text-sm text-theme-muted">January 15, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'donations':
        return (
          <div className="bg-theme-surface rounded-2xl shadow-lg border border-theme">
            <div className="p-6">
              <h3 className="text-xl font-bold text-theme-primary mb-6">My Donations</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-theme">
                      <th className="text-left py-3 text-theme-primary font-medium">Campaign</th>
                      <th className="text-left py-3 text-theme-primary font-medium">Amount</th>
                      <th className="text-left py-3 text-theme-primary font-medium">Date</th>
                      <th className="text-left py-3 text-theme-primary font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myDonations.map((donation) => (
                      <tr key={donation.id} className="border-b border-theme hover:bg-theme-background transition-colors">
                        <td className="py-4 text-theme-primary">{donation.campaign}</td>
                        <td className="py-4 text-theme-primary font-semibold">{donation.amount}</td>
                        <td className="py-4 text-theme-muted">{donation.date}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {donation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'volunteer':
        return (
          <div className="bg-theme-surface rounded-2xl shadow-lg border border-theme">
            <div className="p-6">
              <h3 className="text-xl font-bold text-theme-primary mb-6">Volunteer Activities</h3>
              <div className="space-y-4">
                {volunteerActivities.map((activity) => (
                  <div key={activity.id} className="p-4 rounded-lg bg-theme-background border border-theme">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-theme-primary">{activity.activity}</h4>
                        <p className="text-sm text-theme-muted">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-theme-primary">{activity.hours} hours</p>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-theme-surface rounded-2xl shadow-lg border border-theme">
            <div className="p-6">
              <h3 className="text-xl font-bold text-theme-primary mb-6">Account Settings</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-theme-primary mb-2">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      className="w-full px-4 py-3 rounded-lg border border-theme bg-theme-background text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-theme-primary mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-4 py-3 rounded-lg border border-theme bg-theme-background text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-theme-primary mb-2">Phone</label>
                    <input
                      type="tel"
                      value={user.phone}
                      className="w-full px-4 py-3 rounded-lg border border-theme bg-theme-background text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-theme-primary mb-2">Location</label>
                    <input
                      type="text"
                      value={user.location}
                      className="w-full px-4 py-3 rounded-lg border border-theme bg-theme-background text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-primary"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn-theme-primary px-6 py-3 rounded-lg font-semibold"
                  >
                    Save Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn-theme-secondary px-6 py-3 rounded-lg font-semibold"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
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
                  <p className="text-theme-muted mt-2">Welcome back, {user.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-theme-muted">Member since</p>
                  <p className="text-theme-primary font-medium">{user.joinDate}</p>
                </div>
              </motion.div>

              {/* Profile Card */}
              <motion.div variants={itemVariants} className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-theme-primary to-theme-secondary rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{user.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-theme-primary">{user.name}</h2>
                    <p className="text-theme-muted">{user.email}</p>
                    <p className="text-theme-muted">{user.location}</p>
                  </div>
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div variants={itemVariants}>
                <div className="flex space-x-1 bg-theme-surface rounded-xl p-1 border border-theme">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-theme-primary text-white shadow-md'
                          : 'text-theme-muted hover:text-theme-primary hover:bg-theme-background'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Tab Content */}
              <motion.div variants={itemVariants}>
                {renderTabContent()}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default UserProfile;
