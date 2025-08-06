/**
 * Featured Post Card Component
 * Larger card for featured posts with enhanced styling
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '../../types/content';
import { renderContentBlocksToText } from '../../utils/contentRenderer';

interface FeaturedPostCardProps {
  post: Post;
}

const FeaturedPostCard: React.FC<FeaturedPostCardProps> = ({ post }) => {
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
        return 'bg-blue-600 text-white';
      case 'blog':
        return 'bg-green-600 text-white';
      case 'press_release':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'news':
        return 'Featured News';
      case 'blog':
        return 'Featured Story';
      case 'press_release':
        return 'Press Release';
      default:
        return 'Featured Article';
    }
  };

  const getPostExcerpt = (post: Post, maxLength: number = 180) => {
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

    // Truncate content
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={post.feature_image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Featured Badge */}
        <div className="absolute top-6 left-6">
          <div className="flex items-center space-x-2">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPostTypeColor(post.post_type)}`}>
              {getPostTypeLabel(post.post_type)}
            </span>
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </span>
          </div>
        </div>

        {/* Reading Time */}
        <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
          {Math.max(1, Math.ceil((post.content?.length || 0) / 200))} min read
        </div>

        {/* Bottom Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-xl font-bold mb-2 line-clamp-2">
            <Link to={`/posts/${post.slug}`} className="hover:text-blue-300 transition-colors duration-200">
              {post.title}
            </Link>
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {getPostExcerpt(post)}
        </p>

        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.split(',').slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg font-medium hover:bg-blue-100 transition-colors duration-200"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Author */}
          <div className="flex items-center space-x-3">
            <img
              src={post.users?.profile_image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
              alt={post.users?.full_name || 'Author'}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {post.users?.full_name || 'GIV Society'}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(post.created_at)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-medium">{post.views}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-red-600 transition-colors duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-medium">{post.likes}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-green-600 transition-colors duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-medium">{post.comments_count}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default FeaturedPostCard;
