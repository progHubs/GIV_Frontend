/**
 * Admin Dashboard Page
 * Administrative overview and management interface
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '../../theme';
import ModernNavigation from '../../components/navigation/ModernNavigation';
import { useDonationStats, useDonorStats } from '../../hooks/useDonations';
import { useStripeUtils } from '../../hooks/useStripe';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: donationStats } = useDonationStats();
  const { data: donorStats } = useDonorStats();
  const { formatCurrency } = useStripeUtils();

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

  const stats = [
    {
      title: 'Total Donors',
      value: donorStats?.totalDonors?.toString() || '0',
      // change: '+12%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Total Donations',
      value: donationStats?.total_donations?.toString() || '0',
      // change: '+3',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      title: 'Total Amount',
      value: donationStats?.total_amount
        ? formatCurrency(parseFloat(donationStats.total_amount))
        : '$0',
      // change: '+8.2%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
    {
      title: 'Recurring Donors',
      value: donorStats?.recurringDonors?.toString() || '0',
      // change: '+5',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'donation',
      message: 'New donation of $500 received for Emergency Medical Equipment campaign',
      time: '2 minutes ago',
      user: 'Anonymous Donor',
    },
    {
      id: 2,
      type: 'campaign',
      message: 'Maternal Health Program campaign reached 80% of funding goal',
      time: '15 minutes ago',
      user: 'System',
    },
    {
      id: 3,
      type: 'volunteer',
      message: 'Dr. Sarah Alemayehu submitted a new volunteer application',
      time: '1 hour ago',
      user: 'Dr. Sarah Alemayehu',
    },
    {
      id: 4,
      type: 'user',
      message: '12 new users registered today',
      time: '2 hours ago',
      user: 'System',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Campaigns',
      description: 'Create, edit, and manage campaigns',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: 'bg-blue-500',
      onClick: () => navigate('/admin/campaigns'),
    },
    {
      title: 'Manage Volunteers',
      description: 'View and manage volunteer profiles and applications',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: 'bg-teal-500',
      onClick: () => navigate('/admin/volunteers'),
    },
    {
      title: 'Manage Donations',
      description: 'View and manage all donations',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      color: 'bg-green-500',
      onClick: () => navigate('/admin/donations'),
    },
    {
      title: 'Manage Donors',
      description: 'View and manage donor profiles',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: 'bg-purple-500',
      onClick: () => navigate('/admin/donors'),
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      color: 'bg-indigo-500',
      onClick: () => navigate('/admin/users'),
    },
    {
      title: 'Content Management',
      description: 'Manage posts, events, and content',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      color: 'bg-orange-500',
      onClick: () => navigate('/admin/content'),
    },
    {
      title: 'Comment Management',
      description: 'Review and moderate comments',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      color: 'bg-indigo-500',
      onClick: () => navigate('/admin/comments'),
    },
  ];

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
                  <h1 className="text-3xl font-bold text-theme-primary">Admin Dashboard</h1>
                  <p className="text-theme-muted mt-2">Welcome back, Administrator</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-theme-muted">Last login</p>
                  <p className="text-theme-primary font-medium">Today at 9:30 AM</p>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {stats.map(stat => (
                  <motion.div
                    key={stat.title}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-theme-primary">{stat.icon}</div>
                      {/* Change indicator temporarily disabled */}
                    </div>
                    <div className="mt-4">
                      <h3 className="text-2xl font-bold text-theme-primary">{stat.value}</h3>
                      <p className="text-theme-muted text-sm">{stat.title}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold text-theme-primary mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickActions.map(action => (
                    <motion.button
                      key={action.title}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={action.onClick}
                      className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme text-left hover:shadow-xl transition-shadow duration-300"
                    >
                      <div
                        className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white mb-4`}
                      >
                        {action.icon}
                      </div>
                      <h3 className="font-semibold text-theme-primary mb-2">{action.title}</h3>
                      <p className="text-sm text-theme-muted">{action.description}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activities */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold text-theme-primary mb-6">Recent Activities</h2>
                <div className="bg-theme-surface rounded-2xl shadow-lg border border-theme">
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4 p-4 rounded-lg hover:bg-theme-background transition-colors duration-200"
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              activity.type === 'donation'
                                ? 'bg-green-500'
                                : activity.type === 'campaign'
                                  ? 'bg-blue-500'
                                  : activity.type === 'volunteer'
                                    ? 'bg-purple-500'
                                    : 'bg-orange-500'
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-theme-primary">{activity.message}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm text-theme-muted">{activity.user}</span>
                              <span className="text-sm text-theme-muted">•</span>
                              <span className="text-sm text-theme-muted">{activity.time}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-theme p-4">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      className="w-full text-center text-theme-brand-primary hover:underline font-medium"
                    >
                      View All Activities
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AdminDashboard;
