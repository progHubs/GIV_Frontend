/**
 * Posts Sidebar Component
 * Sidebar with categories, popular tags, and trending stories
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Post } from '../../types/content';

interface PostsSidebarProps {
  posts: Post[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const PostsSidebar: React.FC<PostsSidebarProps> = ({ 
  posts, 
  selectedCategory, 
  onCategoryChange 
}) => {
  // Calculate category counts
  const categoryCounts = posts.reduce((acc, post) => {
    acc[post.post_type] = (acc[post.post_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = [
    { id: 'all', name: 'All Stories', count: posts.length, icon: '📚' },
    { id: 'news', name: 'News', count: categoryCounts.news || 0, icon: '📰' },
    { id: 'blog', name: 'Blog Posts', count: categoryCounts.blog || 0, icon: '✍️' },
    { id: 'press_release', name: 'Press Releases', count: categoryCounts.press_release || 0, icon: '📢' },
  ];

  // Get popular tags
  const allTags = posts
    .flatMap(post => post.tags?.split(',').map(tag => tag.trim()) || [])
    .filter(Boolean);
  
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));

  // Get trending stories (most viewed)
  const trendingStories = [...posts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📂</span>
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Popular Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🏷️</span>
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(({ tag, count }) => (
            <button
              key={tag}
              className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 rounded-full text-sm transition-colors duration-200"
            >
              #{tag}
              <span className="ml-1 text-xs opacity-75">({count})</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Trending Stories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🔥</span>
          Trending Stories
        </h3>
        <div className="space-y-4">
          {trendingStories.map((post, index) => (
            <div key={post.id} className="flex items-start space-x-3 group">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  <a href={`/posts/${post.slug}`}>
                    {post.title}
                  </a>
                </h4>
                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.views}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {post.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Newsletter Signup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-6 text-white"
      >
        <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
        <p className="text-blue-100 text-sm mb-4">
          Get the latest stories and updates delivered to your inbox.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
          >
            Subscribe
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default PostsSidebar;
