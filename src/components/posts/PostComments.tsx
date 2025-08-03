/**
 * Post Comments Component
 * Comments section with nested replies
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
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

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        post_id: postId,
        user_id: 'current-user',
        content: newComment,
        parent_id: undefined,
        is_approved: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        users: {
          id: 'current-user',
          full_name: 'You',
          profile_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
          role: 'user'
        }
      };

      onCommentAdd(comment);
      setNewComment('');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const reply: Comment = {
        id: Date.now().toString(),
        post_id: postId,
        user_id: 'current-user',
        content: replyContent,
        parent_id: parentId,
        is_approved: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        users: {
          id: 'current-user',
          full_name: 'You',
          profile_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
          role: 'user'
        }
      };

      onCommentAdd(reply);
      setReplyContent('');
      setReplyTo(null);
      setIsSubmitting(false);
    }, 1000);
  };

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({
    comment,
    isReply = false
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''} mb-4`}
    >
      <div className="flex space-x-3">
        <div className="relative">
          <img
            src={comment.users?.profile_image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face'}
            alt={comment.users?.full_name || 'User'}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-200"
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
        <div className="flex-1">
          <div className="border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900 text-sm">
                  {comment.users?.full_name || 'Anonymous'}
                </h4>
                <span className="text-xs text-gray-500">
                  {formatDate(comment.created_at)}
                </span>
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
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {comment.content}
            </p>
          </div>

          {!isReply && (
            <div className="mt-1 flex items-center space-x-3">
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Reply
              </button>
            </div>
          )}

          {/* Reply Form */}
          <AnimatePresence>
            {replyTo === comment.id && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={(e) => handleSubmitReply(e, comment.id)}
                className="mt-3"
              >
                <div className="flex space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                    alt="You"
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={2}
                      required
                    />
                    <div className="flex items-center justify-end space-x-2 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyTo(null);
                          setReplyContent('');
                        }}
                        className="px-2 py-1 text-xs text-gray-600 hover:text-gray-700 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !replyContent.trim()}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {isSubmitting ? 'Posting...' : 'Reply'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Nested Replies */}
          {comment.children && comment.children.length > 0 && (
            <div className="mt-2">
              {comment.children.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Comments ({comments.length})
        </h2>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Join the conversation</span>
        </div>
      </div>

      {/* Comment Form */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <form onSubmit={handleSubmitComment}>
          <div className="flex space-x-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face"
              alt="You"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-200"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this article..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                rows={3}
                required
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-500">
                  Be respectful and constructive in your comments.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No comments yet</h3>
            <p className="text-gray-600 text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </section>
  );
};

export default PostComments;
