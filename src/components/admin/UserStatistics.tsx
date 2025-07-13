// User Statistics Component
// Dashboard showing user counts, growth charts, and key metrics

import React from 'react';
import {
  FiUsers,
  FiShield,
  FiHeart,
  FiUserCheck,
  FiTrendingUp,
  FiTrendingDown,
  FiGlobe,
  FiCalendar,
} from 'react-icons/fi';
import { MdOutlineMailOutline } from 'react-icons/md';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { useUserStats, useUsers } from '../../hooks/useUserManagement';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { User, UserStatistics as UserStatsType } from '../../types/user';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: React.ElementType;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  loading?: boolean;
}

function StatCard({ title, value, change, icon: Icon, color, loading }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <div className="mt-2">
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
            )}
          </div>
          {change && !loading && (
            <div className="mt-2 flex items-center">
              {change.type === 'increase' ? (
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.value > 0 ? '+' : ''}
                {change.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">{change.period}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}

// Helper function to calculate statistics from user data
function calculateStatsFromUsers(users: User[]): UserStatsType {
  const stats: UserStatsType = {
    totalUsers: users.length,
    totalAdmins: users.filter(user => user.role === 'admin').length,
    totalRegularUsers: users.filter(user => user.role === 'user').length,
    emailVerifiedUsers: users.filter(user => user.email_verified).length,
    emailUnverifiedUsers: users.filter(user => !user.email_verified).length,
    usersWithDonorProfiles: users.filter(user => user.is_donor).length,
    usersWithVolunteerProfiles: users.filter(user => user.is_volunteer).length,
    usersWithBothProfiles: users.filter(user => user.is_donor && user.is_volunteer).length,
    usersByLanguage: {
      en: users.filter(user => user.language_preference === 'en').length,
      am: users.filter(user => user.language_preference === 'am').length,
    },
    recentRegistrations: {
      today: users.filter(user => isToday(new Date(user.created_at))).length,
      thisWeek: users.filter(user => isThisWeek(new Date(user.created_at))).length,
      thisMonth: users.filter(user => isThisMonth(new Date(user.created_at))).length,
    },
    userGrowth: [], // This would need more complex calculation with historical data
  };

  return stats;
}

export function UserStatistics() {
  const { data: userStats, isLoading: userStatsLoading, error: userStatsError } = useUserStats();

  // Fallback: fetch all users to calculate statistics if stats API fails
  const { data: usersData, isLoading: usersLoading } = useUsers({
    limit: 1000, // Get a large number to calculate stats
    page: 1,
  });

  // Use API stats if available, otherwise calculate from users data
  let stats = userStats?.data;
  let isLoading = userStatsLoading;

  // If stats API failed but we have users data, calculate stats from it
  if (userStatsError && usersData?.data && !usersLoading) {
    stats = calculateStatsFromUsers(usersData.data);
    isLoading = false;
  } else if (userStatsError && usersLoading) {
    isLoading = true;
  }

  // Chart colors
  const chartColors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    tertiary: '#F59E0B',
    quaternary: '#EF4444',
    quinary: '#8B5CF6',
  };

  // Prepare user growth chart data
  const userGrowthData =
    stats?.userGrowth?.map(item => ({
      month: format(parseISO(`${item.month}-01`), 'MMM yyyy'),
      users: item.count,
    })) || [];

  // Prepare language distribution data
  const languageData = stats
    ? [
        { name: 'English', value: stats.usersByLanguage?.en || 0, color: chartColors.primary },
        { name: 'Amharic', value: stats.usersByLanguage?.am || 0, color: chartColors.secondary },
      ]
    : [];

  // Prepare user type distribution data
  const userTypeData = stats
    ? [
        { name: 'Regular Users', value: stats.totalRegularUsers, color: chartColors.primary },
        { name: 'Admins', value: stats.totalAdmins, color: chartColors.quaternary },
      ]
    : [];

  // Prepare profile distribution data
  const profileData = stats
    ? [
        {
          name: 'Basic Users',
          value:
            stats.totalUsers -
            stats.usersWithDonorProfiles -
            stats.usersWithVolunteerProfiles +
            (stats.usersWithBothProfiles || 0),
          color: chartColors.primary,
        },
        {
          name: 'Donors Only',
          value: stats.usersWithDonorProfiles - (stats.usersWithBothProfiles || 0),
          color: chartColors.secondary,
        },
        {
          name: 'Volunteers Only',
          value: stats.usersWithVolunteerProfiles - (stats.usersWithBothProfiles || 0),
          color: chartColors.tertiary,
        },
        {
          name: 'Both Profiles',
          value: stats.usersWithBothProfiles || 0,
          color: chartColors.quinary,
        },
      ].filter(item => item.value > 0)
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Only show error if both stats API and users API failed
  if (userStatsError && (!usersData?.data || usersLoading)) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load user statistics</p>
        <p className="text-sm text-gray-500 mb-4">
          Unable to fetch data from both statistics and users APIs.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          change={{
            value: stats?.recentRegistrations?.thisMonth || 0,
            type: 'increase',
            period: 'this month',
          }}
          icon={FiUsers}
          color="blue"
          loading={isLoading}
        />

        <StatCard
          title="Admin Users"
          value={stats?.totalAdmins || 0}
          icon={FiShield}
          color="red"
          loading={isLoading}
        />

        <StatCard
          title="Email Verified"
          value={stats?.emailVerifiedUsers || 0}
          icon={MdOutlineMailOutline}
          color="green"
          loading={isLoading}
        />

        <StatCard
          title="Recent Signups"
          value={stats?.recentRegistrations?.thisWeek || 0}
          change={{
            value: stats?.recentRegistrations?.today || 0,
            type: 'increase',
            period: 'today',
          }}
          icon={FiCalendar}
          color="purple"
          loading={isLoading}
        />
      </div>

      {/* Profile Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Donor Profiles"
          value={stats?.usersWithDonorProfiles || 0}
          icon={FiHeart}
          color="green"
          loading={isLoading}
        />

        <StatCard
          title="Volunteer Profiles"
          value={stats?.usersWithVolunteerProfiles || 0}
          icon={FiUserCheck}
          color="blue"
          loading={isLoading}
        />

        <StatCard
          title="Both Profiles"
          value={stats?.usersWithBothProfiles || 0}
          icon={FiUsers}
          color="purple"
          loading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Growth</h3>
            <Badge variant="secondary">Last 6 months</Badge>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke={chartColors.primary}
                  fill={chartColors.primary}
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Language Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Language Preference
            </h3>
            <FiGlobe className="w-5 h-5 text-gray-500" />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* User Role Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Roles</h3>
            <FiShield className="w-5 h-5 text-gray-500" />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={chartColors.primary} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Profile Type Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Types</h3>
            <FiUsers className="w-5 h-5 text-gray-500" />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={profileData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {profileData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Recent Activity
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats?.recentRegistrations?.today || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">New users today</div>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats?.recentRegistrations?.thisWeek || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">New users this week</div>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats?.recentRegistrations?.thisMonth || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">New users this month</div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
