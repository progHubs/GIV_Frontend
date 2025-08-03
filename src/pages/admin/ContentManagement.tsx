/**
 * Admin Content Management Page
 * Main page for managing posts, articles, and content
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiFileText,
  FiTrendingUp,
  FiEye,
  FiHeart,
  FiMessageCircle
} from 'react-icons/fi';
import { ThemeProvider } from '../../theme';
import ModernNavigation from '../../components/navigation/ModernNavigation';
import ContentListTable from '../../components/admin/ContentListTable';
import ContentForm from '../../components/admin/ContentForm';
import { usePosts } from '../../hooks/useContent';
import type { Post, PostQueryParams } from '../../types/content';
import { renderContentBlocksToHtml } from '../../utils/contentRenderer';

type ViewMode = 'list' | 'create' | 'edit' | 'preview';

const ContentManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPost, setSelectedPost] = useState<Post | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<PostQueryParams>({
    page: 1,
    limit: 10
  });

  // Get stats for dashboard
  const { data: allPosts } = usePosts({ limit: 1000 });
  const { data: blogPosts } = usePosts({ post_type: 'blog', limit: 1000 });
  const { data: newsPosts } = usePosts({ post_type: 'news', limit: 1000 });
  const { data: featuredPosts } = usePosts({ is_featured: true, limit: 1000 });

  const stats = [
    {
      title: 'Total Posts',
      value: allPosts?.pagination?.total || 0,
      icon: <FiFileText className="w-6 h-6" />,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Blog Posts',
      value: blogPosts?.pagination?.total || 0,
      icon: <FiFileText className="w-6 h-6" />,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'News Articles',
      value: newsPosts?.pagination?.total || 0,
      icon: <FiTrendingUp className="w-6 h-6" />,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Featured',
      value: featuredPosts?.pagination?.total || 0,
      icon: <FiHeart className="w-6 h-6" />,
      color: 'bg-orange-500',
      change: '+5%'
    }
  ];

  const handleCreateNew = () => {
    setSelectedPost(undefined);
    setViewMode('create');
  };

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setViewMode('edit');
  };

  const handleView = (post: Post) => {
    setSelectedPost(post);
    setViewMode('preview');
  };

  const handleSave = (post: Post) => {
    setViewMode('list');
    setSelectedPost(undefined);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedPost(undefined);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      title_search: query,
      page: 1
    }));
  };

  const handleFilterChange = (newFilters: Partial<PostQueryParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme-background">
        <ModernNavigation />

        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {viewMode === 'list' && (
                <>
                  {/* Header */}
                  <motion.div variants={itemVariants} className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-theme-primary">Content Management</h1>
                      <p className="text-theme-muted mt-2">Manage your posts, articles, and content</p>
                    </div>
                    <button
                      onClick={handleCreateNew}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Create New</span>
                    </button>
                  </motion.div>

                  {/* Stats Grid */}
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.title}
                        whileHover={{ y: -4, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme"
                      >
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                            {stat.icon}
                          </div>
                          <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-2xl font-bold text-theme-primary">{stat.value}</h3>
                          <p className="text-theme-muted text-sm">{stat.title}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Filters and Search */}
                  <motion.div variants={itemVariants} className="bg-theme-surface rounded-2xl p-6 shadow-lg border border-theme">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Search */}
                      <div className="flex-1">
                        <div className="relative">
                          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Filters */}
                      <div className="flex gap-3">
                        <select
                          value={filters.post_type || ''}
                          onChange={(e) => handleFilterChange({ 
                            post_type: e.target.value as any || undefined 
                          })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">All Types</option>
                          <option value="blog">Blog Posts</option>
                          <option value="news">News Articles</option>
                          <option value="press_release">Press Releases</option>
                        </select>

                        <select
                          value={filters.language || ''}
                          onChange={(e) => handleFilterChange({ 
                            language: e.target.value as any || undefined 
                          })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">All Languages</option>
                          <option value="en">English</option>
                          <option value="am">Amharic</option>
                        </select>

                        <select
                          value={filters.is_featured !== undefined ? filters.is_featured.toString() : ''}
                          onChange={(e) => handleFilterChange({ 
                            is_featured: e.target.value ? e.target.value === 'true' : undefined 
                          })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">All Posts</option>
                          <option value="true">Featured Only</option>
                          <option value="false">Non-Featured</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>

                  {/* Content Table */}
                  <motion.div variants={itemVariants}>
                    <ContentListTable
                      filters={filters}
                      onEdit={handleEdit}
                      onView={handleView}
                      searchQuery={searchQuery}
                    />
                  </motion.div>
                </>
              )}

              {(viewMode === 'create' || viewMode === 'edit') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ContentForm
                    post={selectedPost}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onPreview={handleView}
                  />
                </motion.div>
              )}

              {viewMode === 'preview' && selectedPost && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Preview</h2>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(selectedPost)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back to List
                      </button>
                    </div>
                  </div>
                  
                  {/* Preview Content */}
                  <div className="prose prose-lg max-w-none">
                    {selectedPost.feature_image && (
                      <img
                        src={selectedPost.feature_image}
                        alt={selectedPost.title}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                      />
                    )}
                    <h1>{selectedPost.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                      <span>Type: {selectedPost.post_type}</span>
                      <span>Language: {selectedPost.language}</span>
                      {selectedPost.is_featured && <span className="text-yellow-600">Featured</span>}
                    </div>
                    {(selectedPost.content_blocks || selectedPost.content) && (() => {
                      try {
                        console.log('=== PREVIEW CONTENT RENDERING DEBUG ===');
                        console.log('Raw content_blocks:', selectedPost.content_blocks);
                        console.log('Content_blocks type:', typeof selectedPost.content_blocks);
                        console.log('Legacy content field:', selectedPost.content);

                        let contentBlocks;
                        let renderedHtml;

                        // Check if we have EditorJS content blocks
                        if (selectedPost.content_blocks) {
                          // Parse EditorJS content blocks
                          contentBlocks = typeof selectedPost.content_blocks === 'string'
                            ? JSON.parse(selectedPost.content_blocks)
                            : selectedPost.content_blocks;

                          console.log('Parsed content blocks:', contentBlocks);
                          console.log('Blocks array:', contentBlocks.blocks);

                          // Render blocks to HTML
                          renderedHtml = renderContentBlocksToHtml(contentBlocks);
                        } else if (selectedPost.content) {
                          // Fallback to legacy content (plain text/HTML)
                          console.log('Using legacy content field');
                          renderedHtml = selectedPost.content;
                        } else {
                          console.log('No content found');
                          renderedHtml = '';
                        }

                        console.log('Rendered HTML:', renderedHtml);
                        console.log('HTML length:', renderedHtml.length);
                        console.log('==========================================');

                        if (!renderedHtml || renderedHtml.trim().length === 0) {
                          return (
                            <div className="text-yellow-600 bg-yellow-50 p-4 rounded-lg">
                              <p className="font-medium">No content to display</p>
                              <p className="text-sm mt-1">The content blocks appear to be empty.</p>
                            </div>
                          );
                        }

                        return (
                          <div
                            className="content-blocks-preview"
                            dangerouslySetInnerHTML={{ __html: renderedHtml }}
                          />
                        );
                      } catch (error) {
                        console.error('Error rendering content blocks:', error);
                        console.error('Content_blocks that failed:', selectedPost.content_blocks);
                        return (
                          <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                            <p className="font-medium">Error rendering content</p>
                            <p className="text-sm mt-1">The content format appears to be invalid.</p>
                            <details className="mt-2">
                              <summary className="cursor-pointer text-xs">Show error details</summary>
                              <pre className="text-xs mt-1 bg-red-100 p-2 rounded overflow-auto">
                                {error instanceof Error ? error.message : String(error)}
                              </pre>
                            </details>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ContentManagement;
