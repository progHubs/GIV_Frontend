/**
 * Comment Form Component
 * Standalone comment input form for posting new comments
 */

import React, { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useCreateComment } from '../../hooks/useContent';
import { useAuth } from '../../hooks/useAuth';
import type { Comment } from '../../types/content';

interface CommentFormProps {
  postId: string;
  onCommentAdd: (comment: Comment) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdd }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook for comment operations
  const createCommentMutation = useCreateComment();

  // Get current user to check if admin
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Memoized handler to prevent unnecessary re-renders
  const handleNewCommentChange = useCallback((value: string) => {
    setNewComment(value);
  }, []);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    // Debug: Check if postId is valid
    if (!postId) {
      console.error('CommentForm: postId is undefined or empty');
      toast.error('Unable to post comment: Post ID is missing');
      return;
    }

    console.log('CommentForm: Submitting comment with postId:', postId);

    setIsSubmitting(true);

    try {
      const response = await createCommentMutation.mutateAsync({
        postId: postId,
        content: newComment.trim(),
      });

      if (response?.data) {
        onCommentAdd(response.data);
        setNewComment('');

        if (isAdmin) {
          toast.success('Comment added successfully!');
        } else {
          // Show approval notice for regular users
          toast.success('Comment submitted! It will be visible after admin approval.', {
            duration: 10000, // 10 seconds
            icon: '⏳',
          });
        }
      }
    } catch (error: any) {
      console.error('Failed to add comment:', error);
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Comment</h3>

      {/* Approval Notice for Non-Admin Users */}
      {!isAdmin && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-amber-800 font-medium">Comments require approval</p>
              <p className="text-xs text-amber-700 mt-1">Your comment will be visible after it's reviewed and approved by an administrator.</p>
            </div>
          </div>
        </div>
      )}

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
  );
};

export default CommentForm;
