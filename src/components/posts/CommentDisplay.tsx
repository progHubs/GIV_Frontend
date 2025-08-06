/**
 * Comment Display Component
 * Enhanced component with progressive loading and priority-based sorting
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useCommentsByPost } from '../../hooks/useContent';
import CommentItem from './CommentItem';
import type { Comment } from '../../types/content';

interface CommentDisplayProps {
  postId: string;
  onCommentAdd: (comment: Comment) => void;
}

const CommentDisplay: React.FC<CommentDisplayProps> = ({
  postId,
  onCommentAdd
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allComments, setAllComments] = useState<Comment[]>([]);

  // Fetch main comments with pagination
  const {
    data: commentsData,
    isLoading: commentsLoading,
    refetch: refetchComments
  } = useCommentsByPost(
    postId,
    { page: currentPage, limit: 10, type: 'main' },
    !!postId
  );

  // Update all comments when new data arrives
  React.useEffect(() => {
    if (commentsData?.data) {
      if (currentPage === 1) {
        setAllComments(commentsData.data);
      } else {
        setAllComments(prev => [...prev, ...commentsData.data]);
      }
    }
  }, [commentsData?.data, currentPage]);

  // Memoize the comments list to prevent unnecessary re-renders
  const memoizedComments = useMemo(() => allComments, [allComments]);

  const handleLoadMoreComments = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const handleCommentAdded = useCallback(async (comment: Comment) => {
    // Reset to first page and refetch to get updated sorting
    setCurrentPage(1);
    await refetchComments();
    onCommentAdd(comment);
  }, [refetchComments, onCommentAdd]);

  return (
    <section className="bg-white py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-gray-900">
            Comments
          </h2>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
            {commentsData?.pagination?.total || 0}
          </span>
        </div>
      </div>

      {/* Comments List */}
      {memoizedComments.length > 0 ? (
        <div className="space-y-0">
          <div className="divide-y divide-gray-100">
            {memoizedComments.map((comment) => (
              <div key={comment.id} className="py-4 first:pt-0 last:pb-0">
                <CommentItem
                  comment={comment}
                  isMainComment={true}
                  postId={postId}
                  onCommentAdd={handleCommentAdded}
                />
              </div>
            ))}
          </div>

          {/* Load More Comments Button */}
          {commentsData?.pagination?.hasNext && (
            <div className="text-center mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={handleLoadMoreComments}
                disabled={commentsLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                {commentsLoading ? 'Loading...' : 'Load More Comments'}
              </button>
            </div>
          )}
        </div>
      ) : commentsLoading ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <svg className="w-8 h-8 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Loading comments...</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </section>
  );
};

export default CommentDisplay;
