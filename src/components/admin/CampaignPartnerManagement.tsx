/**
 * Campaign Partner Management Component
 * Main interface for managing campaign partners
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CampaignPartnerForm from './CampaignPartnerForm';
import CampaignPartnerTable from './CampaignPartnerTable';
import {
  useCampaignPartners,
  useCreateCampaignPartner,
  useUpdateCampaignPartner,
  useDeleteCampaignPartner,
} from '../../hooks/useCampaignPartners';
import type { CampaignPartner, CampaignPartnerFormData } from '../../types/campaignPartner';

interface CampaignPartnerManagementProps {
  campaignId: string;
  campaignTitle: string;
  onClose: () => void;
}

const CampaignPartnerManagement: React.FC<CampaignPartnerManagementProps> = ({
  campaignId,
  campaignTitle,
  onClose,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<CampaignPartner | null>(null);

  // React Query hooks
  const { data: partners = [], isLoading, error, refetch } = useCampaignPartners(campaignId);
  const createPartnerMutation = useCreateCampaignPartner();
  const updatePartnerMutation = useUpdateCampaignPartner();
  const deletePartnerMutation = useDeleteCampaignPartner();

  // Handle create partner
  const handleCreatePartner = async (data: CampaignPartnerFormData) => {
    try {
      await createPartnerMutation.mutateAsync({ campaignId, data });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create campaign partner:', error);
      throw error;
    }
  };

  // Handle update partner
  const handleUpdatePartner = async (data: CampaignPartnerFormData) => {
    if (!editingPartner) return;

    try {
      await updatePartnerMutation.mutateAsync({
        campaignId,
        partnerId: editingPartner.id,
        data,
      });
      setEditingPartner(null);
    } catch (error) {
      console.error('Failed to update campaign partner:', error);
      throw error;
    }
  };

  // Handle delete partner
  const handleDeletePartner = async (partnerId: string) => {
    try {
      await deletePartnerMutation.mutateAsync({ campaignId, partnerId });
    } catch (error) {
      console.error('Failed to delete campaign partner:', error);
      throw error;
    }
  };

  // Handle edit partner
  const handleEditPartner = (partner: CampaignPartner) => {
    setEditingPartner(partner);
  };

  // Handle retry on error
  const handleRetry = () => {
    refetch();
  };

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
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-theme-background rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-theme bg-theme-surface">
          <div>
            <h2 className="text-2xl font-bold text-theme-primary">Campaign Partners</h2>
            <p className="text-theme-muted mt-1">
              Manage partners for: <span className="font-medium">{campaignTitle}</span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Add Partner
            </motion.button>
            <button
              onClick={onClose}
              className="text-theme-muted hover:text-theme-primary transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Statistics */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-theme-surface rounded-xl p-4 border border-theme">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-theme-muted">Total Partners</p>
                    <p className="text-2xl font-bold text-theme-primary">{partners.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-theme-surface rounded-xl p-4 border border-theme">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-theme-muted">Active</p>
                    <p className="text-2xl font-bold text-theme-primary">
                      {partners.filter(p => p.is_active).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-theme-surface rounded-xl p-4 border border-theme">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-theme-muted">With Logos</p>
                    <p className="text-2xl font-bold text-theme-primary">
                      {partners.filter(p => p.logo_url).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-theme-surface rounded-xl p-4 border border-theme">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-theme-muted">With Websites</p>
                    <p className="text-2xl font-bold text-theme-primary">
                      {partners.filter(p => p.website).length}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Partners Table */}
            <motion.div variants={itemVariants}>
              <CampaignPartnerTable
                campaignId={campaignId}
                partners={partners}
                loading={isLoading}
                error={error ? (error as any).message || String(error) : null}
                onEdit={handleEditPartner}
                onDelete={handleDeletePartner}
                onRetry={handleRetry}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Create Partner Form */}
      <AnimatePresence>
        {showCreateForm && (
          <CampaignPartnerForm
            mode="create"
            campaignId={campaignId}
            onSubmit={handleCreatePartner}
            onCancel={() => setShowCreateForm(false)}
            loading={createPartnerMutation.isPending}
          />
        )}
      </AnimatePresence>

      {/* Edit Partner Form */}
      <AnimatePresence>
        {editingPartner && (
          <CampaignPartnerForm
            mode="edit"
            campaignId={campaignId}
            partner={editingPartner}
            onSubmit={handleUpdatePartner}
            onCancel={() => setEditingPartner(null)}
            loading={updatePartnerMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampaignPartnerManagement;
