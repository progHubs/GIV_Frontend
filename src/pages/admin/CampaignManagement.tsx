/**
 * Admin Campaign Management Page
 * Comprehensive campaign management interface for administrators
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from '../../theme';
import ModernNavigation from '../../components/navigation/ModernNavigation';
import CampaignManagementTable from '../../components/admin/CampaignManagementTable';
import CampaignForm from '../../components/admin/CampaignForm';
import CampaignStats from '../../components/admin/CampaignStatsAdmin';
import {
  useCampaigns,
  useCampaignStats,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
} from '../../hooks/useCampaigns';
import type { Campaign, CampaignFilters } from '../../types';

const CampaignManagement: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [filters, setFilters] = useState<CampaignFilters>({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  // React Query hooks
  const { data: campaignsData, isLoading, error: campaignsError } = useCampaigns(filters);
  const { data: stats } = useCampaignStats();
  const createCampaignMutation = useCreateCampaign();
  const updateCampaignMutation = useUpdateCampaign();
  const deleteCampaignMutation = useDeleteCampaign();

  // Extract data from React Query responses (avoid over-memoization)
  const apiData = campaignsData as any;
  const campaigns = apiData?.data || [];
  const pagination = apiData?.pagination || {};
  const currentPage = pagination.page || filters.page || 1;

  const campaignData = {
    campaigns,
    currentPage,
    totalPages: pagination.totalPages || 1,
    hasNextPage: pagination.hasNextPage || false,
    hasPrevPage: pagination.hasPrevPage || false,
    totalCount: pagination.totalCount || 0,
    loading: isLoading,
    error: campaignsError ? 'Failed to load campaigns' : null,
  };

  // Handle campaign creation
  const handleCreateCampaign = async (data: any) => {
    try {
      await createCampaignMutation.mutateAsync(data);
      setShowCreateForm(false);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create campaign');
    }
  };

  // Handle campaign update
  const handleUpdateCampaign = async (id: string, data: any) => {
    try {
      await updateCampaignMutation.mutateAsync({ id, data });
      setEditingCampaign(null);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update campaign');
    }
  };

  // Handle campaign deletion
  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      await deleteCampaignMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete campaign');
    }
  };

  // Handle filter changes (memoized to prevent re-renders)
  const handleFiltersChange = useCallback((newFilters: Partial<CampaignFilters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);

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
                  <h1 className="text-3xl font-bold text-theme-primary">Campaign Management</h1>
                  <p className="text-theme-muted mt-2">Manage and monitor all campaigns</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Create Campaign
                </motion.button>
              </motion.div>

              {/* Statistics */}
              {stats && (
                <motion.div variants={itemVariants}>
                  <CampaignStats stats={stats} />
                </motion.div>
              )}

              {/* Campaign Table */}
              <motion.div variants={itemVariants}>
                <CampaignManagementTable
                  campaigns={campaignData.campaigns}
                  loading={campaignData.loading}
                  error={campaignData.error}
                  currentPage={campaignData.currentPage}
                  totalPages={campaignData.totalPages}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onEdit={setEditingCampaign}
                  onDelete={handleDeleteCampaign}
                  onRetry={() => window.location.reload()}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Create Campaign Modal */}
        {showCreateForm && (
          <CampaignForm
            mode="create"
            onSubmit={handleCreateCampaign}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* Edit Campaign Modal */}
        {editingCampaign && (
          <CampaignForm
            mode="edit"
            campaign={editingCampaign}
            onSubmit={data => handleUpdateCampaign(editingCampaign.id, data)}
            onCancel={() => setEditingCampaign(null)}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default CampaignManagement;
