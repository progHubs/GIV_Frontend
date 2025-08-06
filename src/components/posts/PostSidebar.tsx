/**
 * Post Sidebar Component
 * Related articles and newsletter subscription sidebar
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useRecentPosts } from '../../hooks/useContent';
import type { Post } from '../../types/content';

interface PostSidebarProps {
  relatedPosts: Post[];
  currentPostId: string;
}

const PostSidebar: React.FC<PostSidebarProps> = ({ relatedPosts, currentPostId }) => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch recent posts separately from related posts
  const { data: recentPostsResponse, isLoading: recentPostsLoading } = useRecentPosts({
    limit: 6,
    exclude_id: currentPostId // Exclude current post from recent posts
  });

  const recentPosts = recentPostsResponse?.data || [];

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubscribing) return;

    setIsSubscribing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubscribing(false);
      setEmail('');
    }, 1500);
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

  return (
    <div className="space-y-6">
      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-base font-bold text-gray-900 mb-4">Related Articles</h3>
          <div className="space-y-4">
            {relatedPosts.slice(0, 3).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/posts/${post.slug}`} className="block">
                  <div className="flex space-x-3">
                    {/* Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded">
                      <img
                        src={post.feature_image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=80&h=80&fit=crop'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-0.5 left-0.5">
                        <span className={`px-1 py-0.5 rounded text-xs font-medium ${getPostTypeColor(post.post_type)}`}>
                          {getPostTypeLabel(post.post_type)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <span>{formatDate(post.created_at)}</span>
                        <span>•</span>
                        <span>{Math.max(1, Math.ceil((post.content?.length || 0) / 200))} min read</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* View All Link */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <a
              href="/posts"
              className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <span>View all articles</span>
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 border border-blue-200">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-3 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h3 className="text-sm font-bold text-gray-900 mb-2">Stay Updated</h3>
          <p className="text-xs text-gray-600 mb-4">
            Get the latest health insights and updates delivered to your inbox.
          </p>

          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xs font-medium text-green-700">Successfully subscribed!</p>
              <p className="text-xs text-green-600 mt-1">Check your email for confirmation.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs"
                required
              />
              <button
                type="submit"
                disabled={isSubscribing || !email.trim()}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-xs font-medium"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Recent Articles</h3>
          {recentPostsLoading && (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {recentPostsLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : recentPosts.length > 0 ? (
          <div className="space-y-4">
            {recentPosts.slice(0, 4).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/posts/${post.slug}`} className="block">
                  <div className="flex space-x-3">
                    {/* Thumbnail */}
                    <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded">
                      <img
                        src={post.feature_image || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=96&h=96&fit=crop&crop=center'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1 leading-tight">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <span className={`px-1 py-0.5 rounded text-xs font-medium ${getPostTypeColor(post.post_type)}`}>
                          {getPostTypeLabel(post.post_type)}
                        </span>
                        <span>•</span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No recent articles available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostSidebar;
