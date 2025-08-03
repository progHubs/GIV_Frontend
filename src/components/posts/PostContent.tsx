/**
 * Post Content Component
 * Displays the full content of a post with metadata (without hero image)
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import type { Post } from '../../types/content';

interface PostContentProps {
  post: Post;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return 'Recently';
    }
  };

  const formatRelativeDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'news':
        return 'bg-blue-100 text-blue-800';
      case 'blog':
        return 'bg-green-100 text-green-800';
      case 'press_release':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'news':
        return 'News Article';
      case 'blog':
        return 'Blog Post';
      case 'press_release':
        return 'Press Release';
      default:
        return 'Article';
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content?.substring(0, 160) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const readingTime = Math.max(1, Math.ceil((post.content?.length || 0) / 200));

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Content */}
      <div className="p-6 lg:p-8">
        {/* Article Meta and Actions */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
              {post.is_featured && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium flex items-center text-xs">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </span>
              )}
              <span>{post.views} views</span>
              <span>•</span>
              <span>{formatRelativeDate(post.created_at)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors duration-200 text-sm ${
                  isLiked
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <svg className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-medium">{likeCount}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="font-medium">Save</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="font-medium">Share</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="prose prose-base max-w-none mb-6">
          <div className="text-gray-700 leading-relaxed space-y-4">
            {post.content?.split('\n\n').map((paragraph, index) => {
              // Handle quotes
              if (paragraph.startsWith('"') && paragraph.endsWith('"')) {
                return (
                  <blockquote key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg my-6">
                    <p className="text-lg italic text-blue-900 font-medium leading-relaxed">
                      {paragraph}
                    </p>
                  </blockquote>
                );
              }

              // Handle headers (simple detection)
              if (paragraph.length < 100 && !paragraph.includes('.') && paragraph.trim().length > 0) {
                return (
                  <h2 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">
                    {paragraph}
                  </h2>
                );
              }

              // Regular paragraphs
              return (
                <p key={index} className="text-base leading-relaxed text-gray-700">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        {post.tags && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostContent;
