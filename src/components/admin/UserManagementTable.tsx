// User Management Table Component
// Comprehensive table for managing users with filtering, sorting, pagination, and actions

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiEdit3,
  FiTrash2,
  FiEye,
  FiMail,
  FiPhone,
  FiUser,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiMoreVertical,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { useUsers, useDeleteUser } from '../../hooks/useUserManagement';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Pagination } from '../ui/Pagination';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { DropdownMenu } from '../ui/DropdownMenu';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import type { User, UserFilters } from '../../types/user';

interface UserManagementTableProps {
  filters: UserFilters;
  searchQuery?: string;
  onFiltersChange: (filters: UserFilters) => void;
  onUserSelect: (user: User) => void;
  onUserEdit: (user: User) => void;
}

export function UserManagementTable({
  filters,
  searchQuery,
  onFiltersChange,
  onUserSelect,
  onUserEdit,
}: UserManagementTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    userId?: string;
    userName?: string;
  }>({ isOpen: false });

  // Hooks
  const { data: usersData, isLoading, error, refetch } = useUsers(filters);
  const deleteUserMutation = useDeleteUser();

  const users = usersData?.data || [];
  const pagination = usersData?.pagination;

  // Handle sorting
  const handleSort = (field: string) => {
    const newSortOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltersChange({
      ...filters,
      sortBy: field,
      sortOrder: newSortOrder,
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    onFiltersChange({ ...filters, page });
  };

  // Handle delete
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
      setDeleteConfirm({ isOpen: false });
      refetch();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'user':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Get verification status badge
  const getVerificationBadge = (verified: boolean) => {
    return verified ? (
      <Badge variant="success" className="flex items-center gap-1">
        <FiCheckCircle className="w-3 h-3" />
        Verified
      </Badge>
    ) : (
      <Badge variant="warning" className="flex items-center gap-1">
        <FiXCircle className="w-3 h-3" />
        Unverified
      </Badge>
    );
  };

  // User actions dropdown
  const getUserActions = (user: User) => [
    {
      label: 'View Details',
      icon: FiEye,
      onClick: () => onUserSelect(user),
    },
    {
      label: 'Edit User',
      icon: FiEdit3,
      onClick: () => onUserEdit(user),
    },
    {
      label: 'Send Email',
      icon: FiMail,
      onClick: () => window.open(`mailto:${user.email}`),
    },
    ...(user.phone
      ? [
          {
            label: 'Call User',
            icon: FiPhone,
            onClick: () => window.open(`tel:${user.phone}`),
          },
        ]
      : []),
    {
      label: 'Delete User',
      icon: FiTrash2,
      onClick: () =>
        setDeleteConfirm({
          isOpen: true,
          userId: user.id,
          userName: user.full_name,
        }),
      className: 'text-red-600 hover:text-red-700',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load users</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('full_name')}
                >
                  User
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('email')}
                >
                  Contact
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('role')}
                >
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('created_at')}
                >
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.profile_image_url ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profile_image_url}
                            alt={user.full_name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <FiUser className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                    {user.phone && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role === 'admin' && <FiShield className="w-3 h-3 mr-1" />}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">{getVerificationBadge(user.email_verified)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <Tooltip content={format(new Date(user.created_at), 'PPpp')}>
                      {format(new Date(user.created_at), 'MMM dd, yyyy')}
                    </Tooltip>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu
                      trigger={
                        <Button variant="ghost" size="sm">
                          <FiMoreVertical className="w-4 h-4" />
                        </Button>
                      }
                      items={getUserActions(user)}
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery
                ? 'Try adjusting your search or filters.'
                : 'Get started by creating a new user.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={() => deleteConfirm.userId && handleDeleteUser(deleteConfirm.userId)}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteConfirm.userName}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
}
