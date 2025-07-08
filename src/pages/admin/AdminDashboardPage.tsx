import React from 'react';
import PrivateLayout from '../../layouts/PrivateLayout';

const AdminDashboardPage: React.FC = () => {
  return (
    <PrivateLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users, content, and monitor system performance.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">2,847</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-semibold text-gray-900">$156,420</p>
                <p className="text-sm text-green-600">+8% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
                <p className="text-sm text-blue-600">3 new this week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-semibold text-gray-900">18</p>
                <p className="text-sm text-green-600">2 completed this week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">Add User</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm font-medium text-gray-900">Create Campaign</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">Schedule Event</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-8 h-8 text-orange-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">Create Post</p>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { action: 'New user registered', user: 'John Doe', time: '2 minutes ago', type: 'user' },
                  { action: 'Campaign completed', user: 'School Supplies Drive', time: '1 hour ago', type: 'campaign' },
                  { action: 'Event created', user: 'Community Cleanup', time: '3 hours ago', type: 'event' },
                  { action: 'Large donation received', user: '$500 from Jane Smith', time: '5 hours ago', type: 'donation' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'campaign' ? 'bg-green-500' :
                      activity.type === 'event' ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Server Status</span>
                  <span className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Database</span>
                  <span className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Payment Gateway</span>
                  <span className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Email Service</span>
                  <span className="flex items-center text-sm text-yellow-600">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    Limited
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Links */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
            <div className="space-y-2">
              <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm">
                View All Users
              </button>
              <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm">
                Manage Roles
              </button>
              <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm">
                User Reports
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Management</h3>
            <div className="space-y-2">
              <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm">
                Manage Campaigns
              </button>
              <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm">
                Manage Events
              </button>
              <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm">
                Manage Posts
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
            <div className="space-y-2">
              <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm">
                General Settings
              </button>
              <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm">
                Payment Settings
              </button>
              <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm">
                Email Templates
              </button>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default AdminDashboardPage;
