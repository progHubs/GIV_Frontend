/**
 * Content Stats Component
 * Display content statistics for admin dashboard
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiTrendingUp, 
  FiEye, 
  FiHeart,
  FiMessageCircle,
  FiStar
} from 'react-icons/fi';
import { usePosts } from '../../hooks/useContent';

const ContentStats: React.FC = () => {
  const { data: allPosts } = usePosts({ limit: 1000 });
  const { data: blogPosts } = usePosts({ post_type: 'blog', limit: 1000 });
  const { data: newsPosts } = usePosts({ post_type: 'news', limit: 1000 });
  const { data: featuredPosts } = usePosts({ is_featured: true, limit: 1000 });

  const stats = [
    {
      title: 'Total Posts',
      value: allPosts?.pagination?.total || 0,
      icon: <FiFileText className="w-5 h-5" />,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Blog Posts',
      value: blogPosts?.pagination?.total || 0,
      icon: <FiFileText className="w-5 h-5" />,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'News Articles',
      value: newsPosts?.pagination?.total || 0,
      icon: <FiTrendingUp className="w-5 h-5" />,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Featured',
      value: featuredPosts?.pagination?.total || 0,
      icon: <FiStar className="w-5 h-5" />,
      color: 'bg-orange-500',
      change: '+5%'
    }
  ];

  // Calculate total views, likes, and comments from all posts
  const totalViews = allPosts?.data?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
  const totalLikes = allPosts?.data?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0;
  const totalComments = allPosts?.data?.reduce((sum, post) => sum + (post.comments_count || 0), 0) || 0;

  const engagementStats = [
    {
      title: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: <FiEye className="w-5 h-5" />,
      color: 'bg-indigo-500'
    },
    {
      title: 'Total Likes',
      value: totalLikes.toLocaleString(),
      icon: <FiHeart className="w-5 h-5" />,
      color: 'bg-red-500'
    },
    {
      title: 'Total Comments',
      value: totalComments.toLocaleString(),
      icon: <FiMessageCircle className="w-5 h-5" />,
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Content Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <div className="mt-3">
                <h4 className="text-2xl font-bold text-gray-900">{stat.value}</h4>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Engagement Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {engagementStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{stat.value}</h4>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentStats;
