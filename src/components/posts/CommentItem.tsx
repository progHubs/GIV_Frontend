/**
 * Individual Comment Item Component
 * Enhanced component with visual hierarchy and progressive loading
 */

import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useReplyToComment, useCommentReplies } from '../../hooks/useContent';
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

  // Hook for reply operations
  const replyToCommentMutation = useReplyToComment();

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
  const loadedReplies = repliesData?.data || [];

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
        onCommentAdd(response.data);
        setReplyContent('');
        setIsReplying(false);
        // Refresh replies if they're currently shown
        if (showReplies) {
          refetchReplies();
        }
        toast.success('Reply added successfully!');
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
    setRepliesPage(1);
  };

  const handleLoadMoreReplies = () => {
    setRepliesPage(prev => prev + 1);
  };

  // Format content with @mention for nested replies
  const formatContent = (content: string) => {
    if (!isMainComment && parentCommentAuthor) {
      return (
        <span>
          <span className="text-blue-600 font-medium">@{parentCommentAuthor}</span> {content}
        </span>
      );
    }
    return <span>{content}</span>;
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
              {formatContent(comment.content)}
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
            <button className="text-xs text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
              Like
            </button>
          </div>

          {/* Reply Form */}
          <AnimatePresence>
            {isReplying && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmitReply}
                className="mt-3 ml-3"
              >
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
              </motion.form>
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
                  <span>Show {comment.reply_count} replies</span>
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
                    {loadedReplies.map((reply) => (
                      <CommentItem
                        key={reply.id}
                        comment={reply}
                        isMainComment={false}
                        postId={postId}
                        onCommentAdd={onCommentAdd}
                        parentCommentAuthor={comment.users?.full_name}
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
