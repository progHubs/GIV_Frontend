/**
 * Individual Comment Item Component
 * Enhanced component with visual hierarchy and progressive loading
 */

import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useReplyToComment, useCommentReplies, useDeleteComment, useAdminDeleteComment } from '../../hooks/useContent';
import { useAuth } from '../../hooks/useAuth';
import type { Comment } from '../../types/content';

interface CommentItemProps {
  comment: Comment;
  isMainComment?: boolean; // true for main comments, false for sub-comments
  postId: string;
  onCommentAdd: (comment: Comment) => void;
  parentCommentAuthor?: string; // For @mention in nested replies
}

const CommentItem: React.FC<CommentItemProps> = memo(({
  comment,
  isMainComment = true,
  postId,
  onCommentAdd,
  parentCommentAuthor
}) => {
  // Local state for this specific comment's reply
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesPage, setRepliesPage] = useState(1);
  const [allReplies, setAllReplies] = useState<Comment[]>([]);

  // Hook for reply operations
  const replyToCommentMutation = useReplyToComment();

  // Hook for delete operations
  const deleteCommentMutation = useDeleteComment();
  const adminDeleteCommentMutation = useAdminDeleteComment();

  // Get current user
  const { user } = useAuth();

  // Hook for loading replies (only for main comments)
  const {
    data: repliesData,
    isLoading: repliesLoading,
    refetch: refetchReplies
  } = useCommentReplies(
    postId,
    comment.id,
    { page: repliesPage, limit: 5 },
    isMainComment && showReplies
  );

  const hasReplies = (comment.reply_count || 0) > 0;

  // Update allReplies when new data arrives
  React.useEffect(() => {
    if (repliesData?.data) {
      if (repliesPage === 1) {
        setAllReplies(repliesData.data);
      } else {
        setAllReplies(prev => [...prev, ...repliesData.data]);
      }
    }
  }, [repliesData?.data, repliesPage]);

  // Memoized format date function
  const formatDate = useCallback((dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  }, []);

  // Memoized handlers
  const handleReplyToggle = useCallback(() => {
    setIsReplying(!isReplying);
    if (isReplying) {
      setReplyContent('');
    }
  }, [isReplying]);

  const handleReplyCancel = useCallback(() => {
    setIsReplying(false);
    setReplyContent('');
  }, []);

  const handleReplyContentChange = useCallback((value: string) => {
    setReplyContent(value);
  }, []);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    if (!postId) {
      console.error('CommentItem: postId is undefined or empty for reply');
      toast.error('Unable to post reply: Post ID is missing');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await replyToCommentMutation.mutateAsync({
        postId: postId,
        parentId: comment.id,
        content: replyContent.trim(),
      });

      if (response?.data) {
        setReplyContent('');
        setIsReplying(false);

        // Add the new reply to the local replies list immediately
        if (showReplies) {
          setAllReplies(prev => [...prev, response.data]);
          // Also refetch to ensure consistency
          refetchReplies();
        } else {
          // If replies aren't shown, just show them now with the new reply
          setShowReplies(true);
          setAllReplies([response.data]);
        }

        // Notify parent component (this will update reply counts)
        onCommentAdd(response.data);

        // Show appropriate success message based on user role
        if (user?.role === 'admin') {
          toast.success('Reply added successfully!');
        } else {
          toast.success('Reply submitted! It will be visible after admin approval.', {
            duration: 10000, // 10 seconds
            icon: '⏳',
          });
        }
      }
    } catch (error: any) {
      console.error('Failed to add reply:', error);
      toast.error(error.message || 'Failed to add reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowReplies = () => {
    setShowReplies(true);
    // Don't clear existing replies or reset page - keep what we have loaded
    // Only reset if we have no replies loaded yet
    if (allReplies.length === 0) {
      setRepliesPage(1);
    }
  };

  const handleLoadMoreReplies = () => {
    setRepliesPage(prev => prev + 1);
  };

  const handleDeleteComment = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const isOwner = user?.id === comment.user_id;
      const isAdmin = user?.role === 'admin';

      if (isAdmin && !isOwner) {
        // Admin deleting someone else's comment
        await adminDeleteCommentMutation.mutateAsync(comment.id);
      } else if (isOwner) {
        // User deleting their own comment
        await deleteCommentMutation.mutateAsync(comment.id);
      }

      // Notify parent component that a comment was deleted
      // The parent should handle removing it from the list
      onCommentAdd({} as Comment); // Trigger refresh
    } catch (error: any) {
      console.error('Failed to delete comment:', error);
      toast.error(error.message || 'Failed to delete comment');
    }
  };

  // Format content with @mention for nested replies
  const formatContent = () => {
    // Check if this is a reply to a sub-comment (has parent_comment info)
    const mentionAuthor = parentCommentAuthor || comment.parent_comment?.users?.full_name;

    if (!isMainComment && mentionAuthor) {
      return (
        <span>
          <span className="text-blue-600 font-medium">@{mentionAuthor}</span> {comment.content}
        </span>
      );
    }
    return <span>{comment.content}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isMainComment ? 'mb-6' : 'ml-12 mt-3'}`}
    >
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={comment.users?.profile_image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
            alt={comment.users?.full_name || 'User'}
            className={`${isMainComment ? 'w-10 h-10' : 'w-8 h-8'} rounded-full object-cover border border-gray-200`}
          />

        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Comment Bubble */}
          <div className="bg-gray-50 rounded-2xl px-3 py-2 inline-block max-w-full">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900 text-sm">
                {comment.users?.full_name || 'Anonymous'}
              </h4>
              {comment.users?.role === 'admin' && (
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  Admin
                </span>
              )}
              {comment.users?.role === 'volunteer' && (
                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                  Volunteer
                </span>
              )}
            </div>
            <p className="text-gray-800 text-sm leading-relaxed break-words">
              {formatContent()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mt-1 ml-3">
            <span className="text-xs text-gray-500">
              {formatDate(comment.created_at)}
            </span>
            <button
              onClick={handleReplyToggle}
              className="text-xs text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Reply
            </button>
            {/* Delete button - show if user owns comment or is admin */}
            {user && (user.id === comment.user_id || user.role === 'admin') && (
              <button
                onClick={handleDeleteComment}
                className="text-xs text-gray-600 hover:text-red-600 font-medium transition-colors duration-200"
              >
                Delete
              </button>
            )}
          </div>

          {/* Reply Form */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 ml-3"
              >
                {/* Approval Notice for Non-Admin Users */}
                {user?.role !== 'admin' && (
                  <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs text-amber-800">Reply will be visible after admin approval</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitReply}>
                <div className="flex space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                    alt="You"
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="bg-white border border-gray-300 rounded-2xl px-3 py-2">
                      <textarea
                        value={replyContent}
                        onChange={(e) => handleReplyContentChange(e.target.value)}
                        placeholder={`Reply to ${comment.users?.full_name || 'this comment'}...`}
                        className="w-full text-sm focus:outline-none resize-none bg-transparent"
                        rows={2}
                        required
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-2 mt-2">
                      <button
                        type="button"
                        onClick={handleReplyCancel}
                        className="px-3 py-1 text-xs text-gray-600 hover:text-gray-700 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !replyContent.trim()}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {isSubmitting ? 'Posting...' : 'Reply'}
                      </button>
                    </div>
                  </div>
                </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies Section - Only for Main Comments */}
          {isMainComment && hasReplies && (
            <div className="mt-3">
              {/* Show Replies Button */}
              {!showReplies && (
                <button
                  onClick={handleShowReplies}
                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 font-medium mb-2 ml-3"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span>Show replies</span>
                </button>
              )}

              {/* Loaded Replies */}
              <AnimatePresence>
                {showReplies && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {allReplies.map((reply) => (
                      <CommentItem
                        key={reply.id}
                        comment={reply}
                        isMainComment={false}
                        postId={postId}
                        onCommentAdd={onCommentAdd}
                        parentCommentAuthor={
                          reply.parent_comment?.users?.full_name || comment.users?.full_name
                        }
                      />
                    ))}

                    {/* Load More Replies Button */}
                    {repliesData?.pagination?.hasNext && (
                      <div className="ml-12 mt-3">
                        <button
                          onClick={handleLoadMoreReplies}
                          disabled={repliesLoading}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                        >
                          {repliesLoading ? 'Loading...' : 'Load more replies'}
                        </button>
                      </div>
                    )}

                    {/* Hide Replies Button */}
                    <div className="ml-3 mt-2">
                      <button
                        onClick={() => setShowReplies(false)}
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Hide replies
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.comment.id === nextProps.comment.id &&
    prevProps.comment.content === nextProps.comment.content &&
    prevProps.comment.created_at === nextProps.comment.created_at &&
    prevProps.comment.reply_count === nextProps.comment.reply_count &&
    prevProps.isMainComment === nextProps.isMainComment &&
    prevProps.parentCommentAuthor === nextProps.parentCommentAuthor
  );
});

CommentItem.displayName = 'CommentItem';

export default CommentItem;
