/**
 * Post Comments Component
 * Comments section with nested replies
 */

import React, { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useCreateComment, useReplyToComment } from '../../hooks/useContent';
import type { Comment } from '../../types/content';

interface PostCommentsProps {
  postId: string;
  comments: Comment[];
  onCommentAdd: (comment: Comment) => void;
}

const PostComments: React.FC<PostCommentsProps> = ({
  postId,
  comments,
  onCommentAdd
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks for comment operations
  const createCommentMutation = useCreateComment();
  const replyToCommentMutation = useReplyToComment();

  // Debug: Log postId when component mounts or postId changes
  React.useEffect(() => {
    console.log('PostComments: postId received:', postId);
  }, [postId]);

  // Don't render if postId is not available
  if (!postId) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Loading comments...</h3>
          <p className="text-gray-600 text-sm">Please wait while we load the comments.</p>
        </div>
      </section>
    );
  }

  // Memoized format date function to prevent re-renders
  const formatDate = useCallback((dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  }, []);

  // Memoized handlers to prevent unnecessary re-renders
  const handleReplyToggle = useCallback((commentId: string) => {
    setReplyTo(replyTo === commentId ? null : commentId);
  }, [replyTo]);

  const handleReplyCancel = useCallback(() => {
    setReplyTo(null);
    setReplyContent('');
  }, []);

  const handleReplyContentChange = useCallback((value: string) => {
    setReplyContent(value);
  }, []);

  const handleNewCommentChange = useCallback((value: string) => {
    setNewComment(value);
  }, []);

  // Memoize the comments list to prevent unnecessary re-renders
  const memoizedComments = useMemo(() => comments, [comments]);

  // State for managing collapsed replies
  const [collapsedReplies, setCollapsedReplies] = useState<Set<string>>(new Set());

  // Toggle collapsed state for replies
  const toggleRepliesCollapsed = useCallback((commentId: string) => {
    setCollapsedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    // Debug: Check if postId is valid
    if (!postId) {
      console.error('PostComments: postId is undefined or empty');
      toast.error('Unable to post comment: Post ID is missing');
      return;
    }

    console.log('PostComments: Submitting comment with postId:', postId);

    setIsSubmitting(true);

    try {
      const response = await createCommentMutation.mutateAsync({
        postId: postId,
        content: newComment.trim(),
      });

      if (response?.data) {
        onCommentAdd(response.data);
        setNewComment('');
        toast.success('Comment added successfully!');
      }
    } catch (error: any) {
      console.error('Failed to add comment:', error);
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    // Debug: Check if postId is valid
    if (!postId) {
      console.error('PostComments: postId is undefined or empty for reply');
      toast.error('Unable to post reply: Post ID is missing');
      return;
    }

    console.log('PostComments: Submitting reply with postId:', postId, 'parentId:', parentId);

    setIsSubmitting(true);

    try {
      const response = await replyToCommentMutation.mutateAsync({
        postId: postId,
        parentId: parentId,
        content: replyContent.trim(),
      });

      if (response?.data) {
        onCommentAdd(response.data);
        setReplyContent('');
        setReplyTo(null);
        toast.success('Reply added successfully!');
      }
    } catch (error: any) {
      console.error('Failed to add reply:', error);
      toast.error(error.message || 'Failed to add reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoized CommentItem component with Facebook-style design
  const CommentItem = memo<{ comment: Comment; depth?: number }>(({
    comment,
    depth = 0
  }) => {
    const hasReplies = comment.children && comment.children.length > 0;
    const isCollapsed = collapsedReplies.has(comment.id);
    const maxDepth = 3; // Maximum nesting depth before flattening
    const shouldFlatten = depth >= maxDepth;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`${depth > 0 ? 'ml-8 mt-3' : 'mb-6'}`}
      >
        <div className="flex space-x-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={comment.users?.profile_image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
              alt={comment.users?.full_name || 'User'}
              className={`${depth === 0 ? 'w-10 h-10' : 'w-8 h-8'} rounded-full object-cover border border-gray-200`}
            />
            {/* Role indicator */}
            {comment.users?.role === 'admin' && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {comment.users?.role === 'volunteer' && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
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
                {comment.content}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 mt-1 ml-3">
              <span className="text-xs text-gray-500">
                {formatDate(comment.created_at)}
              </span>
              <button
                onClick={() => handleReplyToggle(comment.id)}
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
              {replyTo === comment.id && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={(e) => handleSubmitReply(e, comment.id)}
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

            {/* Nested Replies with Collapse/Expand */}
            {hasReplies && (
              <div className="mt-3">
                {/* Show/Hide Replies Button */}
                {comment.children!.length > 1 && (
                  <button
                    onClick={() => toggleRepliesCollapsed(comment.id)}
                    className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 font-medium mb-2 ml-3"
                  >
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>
                      {isCollapsed
                        ? `View ${comment.children!.length} replies`
                        : `Hide ${comment.children!.length} replies`
                      }
                    </span>
                  </button>
                )}

                {/* Replies */}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {comment.children!.map((reply) => (
                        <CommentItem
                          key={reply.id}
                          comment={reply}
                          depth={shouldFlatten ? depth : depth + 1}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }, [replyTo, replyContent, isSubmitting, formatDate, handleReplyToggle, handleReplyContentChange, handleReplyCancel, collapsedReplies, toggleRepliesCollapsed]);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-gray-900">
            Comments
          </h2>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
            {comments.length}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Join the conversation</span>
        </div>
      </div>

      {/* Comment Form - Facebook Style */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <form onSubmit={handleSubmitComment}>
          <div className="flex space-x-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="You"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-200"
            />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors duration-200">
                <textarea
                  value={newComment}
                  onChange={(e) => handleNewCommentChange(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full text-sm focus:outline-none resize-none bg-transparent placeholder-gray-500"
                  rows={3}
                  required
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-500">
                  Be respectful and constructive in your comments.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Posting...</span>
                    </div>
                  ) : (
                    'Post Comment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-1">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h3>
            <p className="text-gray-600">Be the first to share your thoughts on this article!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {memoizedComments.map((comment) => (
              <div key={comment.id} className="py-4 first:pt-0 last:pb-0">
                <CommentItem comment={comment} depth={0} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PostComments;
