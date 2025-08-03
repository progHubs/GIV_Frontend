/**
 * Related Posts Component
 * Shows related posts at the bottom of a post detail page
 */

import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '../../types/content';

interface RelatedPostsProps {
  posts: Post[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
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

  const truncateTitle = (title: string, maxLength: number = 60) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength).trim() + '...';
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Stories</h2>
        <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group cursor-pointer"
          >
            <a href={`/posts/${post.slug}`} className="block">
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-xl mb-4">
                <img
                  src={post.feature_image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Post Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPostTypeColor(post.post_type)}`}>
                    {getPostTypeLabel(post.post_type)}
                  </span>
                </div>

                {/* Reading Time */}
                <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {Math.max(1, Math.ceil((post.content?.length || 0) / 200))} min
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                  {truncateTitle(post.title)}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm line-clamp-2">
                  {post.content?.substring(0, 120) + '...' || 'Read more about this story...'}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  {/* Author */}
                  <div className="flex items-center space-x-2">
                    <img
                      src={post.users?.profile_image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face'}
                      alt={post.users?.full_name || 'Author'}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600 font-medium">
                      {post.users?.full_name || 'GIV Society'}
                    </span>
                  </div>

                  {/* Date */}
                  <span className="text-xs text-gray-500">
                    {formatDate(post.created_at)}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{post.comments_count}</span>
                  </div>
                </div>
              </div>
            </a>
          </motion.article>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center mt-8 pt-6 border-t border-gray-100">
        <a
          href="/posts"
          className="inline-flex items-center px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 font-medium"
        >
          <span>View All Posts</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default RelatedPosts;
