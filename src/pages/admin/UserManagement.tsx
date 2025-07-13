// User Management Page
// Main page that combines all user management components with proper layout and navigation

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiPlus, FiBarChart, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';

import { toast } from 'react-hot-toast';
import { UserManagementTable } from '../../components/admin/UserManagementTable';
import { UserManagementFilters } from '../../components/admin/UserManagementFilters';
import { UserStatistics } from '../../components/admin/UserStatistics';
import { UserForm } from '../../components/admin/UserForm';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { useUsers, useUserStats } from '../../hooks/useUserManagement';
import type { User, UserFilters } from '../../types/user';

export function UserManagement() {
  // State
  const [activeTab, setActiveTab] = useState('users');

  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const [userForm, setUserForm] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'profile';
    user?: User;
  }>({
    isOpen: false,
    mode: 'edit',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useUsers(filters);
  const { data: statsData, error: statsError, refetch: refetchStats } = useUserStats();

  const pagination = usersData?.pagination;
  let stats = statsData?.data;

  // If stats API failed, calculate basic stats from users data
  if (statsError && usersData?.data) {
    // Note: We can only calculate total users accurately from pagination
    // Other stats like "This Month" require all user data, not just current page
    stats = {
      ...stats,
      totalUsers: pagination?.totalItems || usersData.data.length,
      recentRegistrations: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0, // Cannot calculate accurately from paginated data
      },
    } as any;
  }

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: UserFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle user selection
  const handleUserSelect = useCallback(
    (user: User) => {
      navigate(`/admin/users/${user.id}`);
    },
    [navigate]
  );

  // Handle user editing
  const handleUserEdit = useCallback((user: User) => {
    setUserForm({
      isOpen: true,
      mode: 'edit',
      user,
    });
  }, []);

  // Handle user creation
  const handleUserCreate = useCallback(() => {
    setUserForm({
      isOpen: true,
      mode: 'create',
    });
  }, []);

  // Handle form close
  const handleFormClose = useCallback(() => {
    setUserForm({
      isOpen: false,
      mode: 'edit',
    });
  }, []);

  // Handle form success
  const handleFormSuccess = useCallback(() => {
    refetchUsers();
    // Don't show toast here - the mutation hooks already show success toasts
  }, [refetchUsers]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      // Refresh both users and stats data
      await Promise.all([refetchUsers(), refetchStats()]);
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchUsers, refetchStats]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <FiArrowLeft className="w-4 h-4" />
                {/* Back to Dashboard */}
              </Button>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    User Management
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage users, roles, and permissions
                  </p>
                </div>
              </div>

              {stats && (
                <div className="hidden md:flex items-center gap-4 ml-8">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FiUsers className="w-3 h-3" />
                    {stats.totalUsers || 0} Total Users
                  </Badge>
                  <Badge variant="success" className="flex items-center gap-1">
                    <FiUsers className="w-3 h-3" />
                    {stats.recentRegistrations?.thisMonth || 0} This Month
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={usersLoading || isRefreshing}
              >
                <FiRefreshCw
                  className={`w-4 h-4 mr-2 ${usersLoading || isRefreshing ? 'animate-spin' : ''}`}
                />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>

              <Button onClick={handleUserCreate} className="flex items-center gap-2">
                <FiPlus className="w-4 h-4" />
                Add User
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <FiUsers className="w-4 h-4" />
              Users
              {pagination && (
                <Badge variant="secondary" className="ml-2">
                  {pagination.totalItems}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <FiBarChart className="w-4 h-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Filters */}
            <UserManagementFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              totalUsers={pagination?.totalItems || 0}
            />

            {/* Users Table */}
            <UserManagementTable
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onUserSelect={handleUserSelect}
              onUserEdit={handleUserEdit}
            />
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <UserStatistics />
          </TabsContent>
        </Tabs>
      </div>

      {/* User Form Modal */}
      <UserForm
        user={userForm.user}
        isOpen={userForm.isOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        mode={userForm.mode}
      />
    </div>
  );
}

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

// Wrap the component with motion for page transitions
export default function UserManagementPage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <UserManagement />
    </motion.div>
  );
}
