/**
 * Posts List Component
 * Displays a list of posts with featured post and regular posts
 */

import React from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard';
import FeaturedPostCard from './FeaturedPostCard';
import type { Post } from '../../types/content';

interface PostsListProps {
  posts: Post[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string;
}

const PostsList: React.FC<PostsListProps> = ({ 
  posts, 
  isLoading, 
  searchQuery, 
  selectedCategory 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Loading skeleton */}
        <div className="animate-pulse">
          <div className="bg-gray-200 h-96 rounded-2xl mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-80 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
        <p className="text-gray-600 mb-6">
          {searchQuery 
            ? `No posts match your search for "${searchQuery}"`
            : selectedCategory !== 'all' 
              ? `No posts found in the ${selectedCategory} category`
              : 'No posts available at the moment'
          }
        </p>
        {(searchQuery || selectedCategory !== 'all') && (
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear filters
          </button>
        )}
      </div>
    );
  }

  // Separate featured and regular posts
  const featuredPosts = posts.filter(post => post.is_featured);
  const regularPosts = posts.filter(post => !post.is_featured);

  return (
    <div className="space-y-12">
      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Stories</h2>
            <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.slice(0, 2).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <FeaturedPostCard post={post} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Regular Posts Section */}
      {regularPosts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Latest Updates</h2>
            <div className="w-16 h-1 bg-green-600 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regularPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Load More Button (for future pagination) */}
      {posts.length >= 10 && (
        <div className="text-center pt-8">
          <button className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
};

export default PostsList;
