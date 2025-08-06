/**
 * Post Card Component
 * Individual post card for displaying in the posts list
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '../../types/content';
import { renderContentBlocksToText } from '../../utils/contentRenderer';

interface PostCardProps {
  post: Post;
  onTagClick?: (tag: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onTagClick }) => {
  const formatDate = (dateString: string) => {
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
        return 'News';
      case 'blog':
        return 'Blog';
      case 'press_release':
        return 'Press Release';
      default:
        return 'Article';
    }
  };

  const getPostExcerpt = (post: Post, maxLength: number = 120) => {
    let content = '';

    // Try to get content from content_blocks first
    if (post.content_blocks) {
      try {
        const contentBlocks = typeof post.content_blocks === 'string'
          ? JSON.parse(post.content_blocks)
          : post.content_blocks;
        content = renderContentBlocksToText(contentBlocks);
      } catch (error) {
        console.error('Error extracting text from content blocks:', error);
      }
    }

    // Fallback to legacy content
    if (!content && post.content) {
      content = post.content;
    }

    // Clean HTML tags for excerpt display
    content = content.replace(/<[^>]*>/g, '');

    // Truncate content
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Mobile Layout (Vertical) - Below md */}
      <div className="md:hidden">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.feature_image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop'}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Post Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.post_type)}`}>
              {getPostTypeLabel(post.post_type)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Author Info */}
          <div className="flex items-center space-x-2 mb-3">
            <img
              src={post.users?.profile_image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
              alt={post.users?.full_name || 'Author'}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {post.users?.full_name || 'GIV Society'}
              </p>
              <p className="text-xs text-gray-500">
                Founder & Medical Director
              </p>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
            <Link to={`/posts/${post.slug}`} className="block">
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-base mb-4 line-clamp-2">
            {getPostExcerpt(post, 100)}
          </p>

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.split(',').slice(0, 3).map((tag, index) => (
                <button
                  key={index}
                  onClick={() => onTagClick?.(tag.trim())}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium hover:bg-blue-100 transition-colors duration-200"
                >
                  {tag.trim()}
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{post.likes}</span>
              </div>
            </div>
            <Link
              to={`/posts/${post.slug}`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>Read</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Layout (Horizontal) - md and above */}
      <div className="hidden md:flex">
        {/* Image */}
        <div className="relative w-80 h-56 flex-shrink-0 overflow-hidden">
          <img
            src={post.feature_image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop'}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Post Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.post_type)}`}>
              {getPostTypeLabel(post.post_type)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          {/* Author Info */}
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={post.users?.profile_image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
              alt={post.users?.full_name || 'Author'}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {post.users?.full_name || 'Dr. Misker Kassahun'}
              </p>
              <p className="text-xs text-gray-500">
                Founder & Medical Director
              </p>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
            <Link to={`/posts/${post.slug}`} className="block">
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-base mb-5 line-clamp-2 leading-relaxed">
            {getPostExcerpt(post, 150)}
          </p>

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.split(',').slice(0, 3).map((tag, index) => (
                <button
                  key={index}
                  onClick={() => onTagClick?.(tag.trim())}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium hover:bg-blue-100 transition-colors duration-200"
                >
                  {tag.trim()}
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{post.likes}</span>
              </div>
            </div>
            <Link
              to={`/posts/${post.slug}`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>Read</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;
