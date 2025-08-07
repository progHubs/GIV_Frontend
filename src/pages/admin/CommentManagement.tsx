/**
 * Admin Comment Management Page
 * Comprehensive comment moderation interface for administrators
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiMessageCircle,
  FiClock,
  FiUser,
  FiFileText,
  FiCheck,
  FiX,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiCornerUpLeft
} from 'react-icons/fi';
import { ThemeProvider } from '../../theme';
import ModernNavigation from '../../components/navigation/ModernNavigation';
import {
  useAllCommentsForAdmin,
  useApproveComment,
  useAdminDeleteComment,
  useReplyToComment
} from '../../hooks/useContent';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import type { Comment } from '../../types/content';

const CommentManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('not_reviewed'); // Default to 'Not reviewed'
  const [isLoading, setIsLoading] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Fetch all comments with filtering
  const {
    data: commentsData,
    isLoading: commentsLoading,
    refetch: refetchComments
  } = useAllCommentsForAdmin({
    page: currentPage,
    limit: 15,
    search: searchQuery,
    sort: sortBy,
    filter: filterBy
  });

  // Mutation hooks
  const approveCommentMutation = useApproveComment();
  const deleteCommentMutation = useAdminDeleteComment();
  const replyToCommentMutation = useReplyToComment();

  const comments = commentsData?.data || [];
  const pagination = commentsData?.pagination;

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort);
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filter: string) => {
    setFilterBy(filter);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Handle approve comment
  const handleApproveComment = async (commentId: string) => {
    try {
      setIsLoading(true);
      await approveCommentMutation.mutateAsync(commentId);
      await refetchComments();
      toast.success('Comment approved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve comment');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteCommentMutation.mutateAsync(commentId);
      await refetchComments();
      toast.success('Comment deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete comment');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reply
  const handleReplyClick = (comment: Comment) => {
    setSelectedComment(comment);
    setReplyModalOpen(true);
    setReplyContent('');
  };

  const handleReplySubmit = async () => {
    if (!selectedComment || !replyContent.trim()) return;

    try {
      setIsLoading(true);
      await replyToCommentMutation.mutateAsync({
        postId: selectedComment.post_id,
        parentId: selectedComment.id,
        content: replyContent.trim(),
      });

      setReplyModalOpen(false);
      setSelectedComment(null);
      setReplyContent('');
      await refetchComments();
      toast.success('Reply posted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to post reply');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyCancel = () => {
    setReplyModalOpen(false);
    setSelectedComment(null);
    setReplyContent('');
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50">
        {/* <ModernNavigation /> */}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Comment Management</h1>
                <p className="text-gray-600 mt-2">
                  Review and moderate all comments
                </p>
              </div>
              
              {/* Stats */}
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center space-x-2">
                  <FiMessageCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    {filterBy === 'not_reviewed' ? 'Pending Comments' :
                     filterBy === 'approved' ? 'Approved Comments' : 'Total Comments'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {pagination?.total || 0}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => handleFilterChange('not_reviewed')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  filterBy === 'not_reviewed'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Not reviewed
              </button>
              <button
                onClick={() => handleFilterChange('approved')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  filterBy === 'approved'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Approved
              </button>
            </div>
          </motion.div>

          {/* Search and Sort */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-6 mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by commenter name or post title..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="sm:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Comments List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {commentsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                <FiMessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending comments</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'No comments match your search criteria.' : 'All comments have been reviewed.'}
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onApprove={() => handleApproveComment(comment.id)}
                  onDelete={() => handleDeleteComment(comment.id)}
                  onReply={() => handleReplyClick(comment)}
                  isLoading={isLoading}
                  formatDate={formatDate}
                />
              ))
            )}
          </motion.div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex items-center justify-between bg-white rounded-lg shadow-sm border p-4"
            >
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * 15) + 1} to {Math.min(currentPage * 15, pagination.total)} of {pagination.total} comments
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="px-3 py-1 text-sm font-medium">
                  Page {currentPage} of {pagination.pages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Reply Modal */}
        {replyModalOpen && selectedComment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Reply to Comment</h3>
                  <button
                    onClick={handleReplyCancel}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Original Comment */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <img
                      src={selectedComment.users?.profile_image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                      alt={selectedComment.users?.full_name || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-900">
                      {selectedComment.users?.full_name || 'Anonymous'}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{selectedComment.content}</p>
                </div>

                {/* Reply Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Reply
                    </label>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your reply..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={handleReplyCancel}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReplySubmit}
                      disabled={isLoading || !replyContent.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isLoading ? 'Posting...' : 'Post Reply'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

// Comment Card Component
interface CommentCardProps {
  comment: Comment & {
    post?: {
      id: string;
      title: string;
      slug: string;
    };
    parent_comment?: {
      id: string;
      users?: {
        full_name: string;
      };
    };
  };
  onApprove: () => void;
  onDelete: () => void;
  onReply: () => void;
  isLoading: boolean;
  formatDate: (date: string) => string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onApprove,
  onDelete,
  onReply,
  isLoading,
  formatDate
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={comment.users?.profile_image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
            alt={comment.users?.full_name || 'User'}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h3 className="font-medium text-gray-900">
              {comment.users?.full_name || 'Anonymous'}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FiClock className="w-4 h-4" />
              <span>{formatDate(comment.created_at)}</span>
              {/* Status Badge */}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                comment.is_approved
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {comment.is_approved ? 'Approved' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Reply Button - Only show for approved comments */}
          {comment.is_approved && (
            <button
              onClick={onReply}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <FiCornerUpLeft className="w-4 h-4" />
              <span>Reply</span>
            </button>
          )}

          {/* Approve Button - Only show for unapproved comments */}
          {!comment.is_approved && (
            <button
              onClick={onApprove}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <FiCheck className="w-4 h-4" />
              <span>Approve</span>
            </button>
          )}

          {/* Delete Button - Always show */}
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Comment Content */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed">{comment.content}</p>
      </div>

      {/* Metadata */}
      <div className="border-t border-gray-100 pt-4 space-y-2">
        {/* Post Information */}
        {comment.post && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FiFileText className="w-4 h-4" />
            <span>Post:</span>
            <span className="font-medium text-gray-900">{comment.post.title}</span>
          </div>
        )}

        {/* Reply Information */}
        {comment.parent_comment && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FiUser className="w-4 h-4" />
            <span>Reply to:</span>
            <span className="font-medium text-gray-900">
              {comment.parent_comment.users?.full_name || 'Unknown User'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CommentManagement;
