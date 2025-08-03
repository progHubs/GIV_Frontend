import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon,
  MapPinIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

import { useVolunteerStats } from '../../hooks/useVolunteer';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Select } from '../ui/Select';

interface VolunteerAnalyticsProps {
  className?: string;
}

export function VolunteerAnalytics({ className }: VolunteerAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30');
  const { data: statsData, isLoading, error } = useVolunteerStats();

  const stats = statsData?.data;

  // Chart colors
  const COLORS = {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    indigo: '#6366F1',
  };

  const PIE_COLORS = [COLORS.primary, COLORS.success, COLORS.warning, COLORS.danger, COLORS.purple];

  // Mock data for demonstration (replace with real data from API)
  const registrationTrendsData = [
    { month: 'Jan', volunteers: 12, applications: 8 },
    { month: 'Feb', volunteers: 18, applications: 15 },
    { month: 'Mar', volunteers: 25, applications: 22 },
    { month: 'Apr', volunteers: 32, applications: 28 },
    { month: 'May', volunteers: 41, applications: 35 },
    { month: 'Jun', volunteers: 38, applications: 42 },
  ];

  const specializationData = [
    { name: 'General Practitioners', value: 35, count: 45 },
    { name: 'Nurses', value: 25, count: 32 },
    { name: 'Medical Students', value: 20, count: 26 },
    { name: 'Specialists', value: 15, count: 19 },
    { name: 'Others', value: 5, count: 7 },
  ];

  const applicationStatusData = [
    { name: 'Approved', value: 65, count: 85 },
    { name: 'Pending', value: 20, count: 26 },
    { name: 'Rejected', value: 10, count: 13 },
    { name: 'Completed', value: 5, count: 7 },
  ];

  const campaignPerformanceData = [
    { campaign: 'Health Screening Campaign', volunteers: 28, completed: 25, hours: 140 },
    { campaign: 'Vaccination Drive', volunteers: 22, completed: 20, hours: 110 },
    { campaign: 'Medical Education', volunteers: 18, completed: 16, hours: 96 },
    { campaign: 'Community Outreach', volunteers: 15, completed: 12, hours: 75 },
    { campaign: 'Emergency Response', volunteers: 12, completed: 10, hours: 60 },
  ];

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center text-red-600 dark:text-red-400">
          Error loading analytics: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Volunteer Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive insights into volunteer performance and engagement
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={timeRange}
            onChange={setTimeRange}
            options={[
              { value: '7', label: 'Last 7 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 3 months' },
              { value: '365', label: 'Last year' },
            ]}
          />
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Volunteers
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.totalVolunteers || 129}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                +12% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Applications
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.activeApplications || 26}
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Pending review
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed Campaigns
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.completedCampaigns || 85}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                +8% completion rate
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Hours Logged
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.totalHours || '1,247'}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                This month
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrophyIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trends */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Registration Trends
            </h3>
            <CalendarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={registrationTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="volunteers"
                stackId="1"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.6}
                name="New Volunteers"
              />
              <Area
                type="monotone"
                dataKey="applications"
                stackId="1"
                stroke={COLORS.success}
                fill={COLORS.success}
                fillOpacity={0.6}
                name="Applications"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Specialization Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Medical Specializations
            </h3>
            <AcademicCapIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={specializationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {specializationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Application Status
            </h3>
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationStatusData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip formatter={(value, name) => [`${value}%`, 'Percentage']} />
              <Bar dataKey="value" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Campaign Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Top Performing Campaigns
            </h3>
            <TrophyIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {campaignPerformanceData.map((campaign, index) => (
              <div key={campaign.campaign} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {campaign.campaign}
                  </p>
                  <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{campaign.volunteers} volunteers</span>
                    <span>•</span>
                    <span>{campaign.completed} completed</span>
                    <span>•</span>
                    <span>{campaign.hours} hours</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={index < 2 ? 'success' : index < 4 ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Geographic Distribution
          </h3>
          <MapPinIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Top Regions</h4>
            {[
              { region: 'Addis Ababa', count: 45, percentage: 35 },
              { region: 'Oromia', count: 32, percentage: 25 },
              { region: 'Amhara', count: 26, percentage: 20 },
              { region: 'Tigray', count: 19, percentage: 15 },
              { region: 'SNNP', count: 7, percentage: 5 },
            ].map((item) => (
              <div key={item.region} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.region}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.count}
                  </span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-span-2">
            {/* This would typically contain a map component */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Geographic visualization would be displayed here
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 