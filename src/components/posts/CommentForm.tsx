/**
 * Comment Form Component
 * Standalone comment input form for posting new comments
 */

import React, { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useCreateComment } from '../../hooks/useContent';
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
        toast.success('Comment added successfully!');
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
