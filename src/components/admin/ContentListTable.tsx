/**
 * Content List Table Component
 * Display and manage existing content items
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  FiEdit3,
  FiTrash2,
  FiEye,
  FiStar,
  FiImage,
  FiFileText,
  FiCalendar,
  FiUser
} from 'react-icons/fi';
import { usePosts, useDeletePost, useUpdatePost } from '../../hooks/useContent';
import type { Post, PostQueryParams } from '../../types/content';

interface ContentListTableProps {
  filters: PostQueryParams;
  onEdit: (post: Post) => void;
  onView: (post: Post) => void;
  searchQuery?: string;
}

const ContentListTable: React.FC<ContentListTableProps> = ({
  filters,
  onEdit,
  onView,
  searchQuery
}) => {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    postId?: string;
    postTitle?: string;
  }>({ isOpen: false });

  const { data: postsData, isLoading, error } = usePosts(filters);
  const deletePostMutation = useDeletePost();
  const updatePostMutation = useUpdatePost();

  const posts = postsData?.data || [];
  const pagination = postsData?.pagination;

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

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(post => post.id));
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deletePostMutation.mutateAsync(postId);
      setDeleteConfirm({ isOpen: false });
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleToggleFeatured = async (post: Post) => {
    try {
      await updatePostMutation.mutateAsync({
        id: post.id,
        postData: { is_featured: !post.is_featured }
      });
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedPosts.map(postId => deletePostMutation.mutateAsync(postId))
      );
      setSelectedPosts([]);
    } catch (error) {
      console.error('Failed to delete posts:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-red-500 mb-4">
          <FiFileText className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Content</h3>
        <p className="text-gray-600">Failed to load content. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Content ({pagination?.total || 0})
            </h3>
            {selectedPosts.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedPosts.length} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedPosts.length === posts.length && posts.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post, index) => (
              <motion.tr
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => handleSelectPost(post.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {post.feature_image ? (
                        <img
                          src={post.feature_image}
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FiImage className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {post.content?.substring(0, 100)}...
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {post.is_featured && (
                          <FiStar className="w-3 h-3 text-yellow-500" />
                        )}
                        <span className="text-xs text-gray-400">
                          /{post.slug}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPostTypeColor(post.post_type)}`}>
                    {getPostTypeLabel(post.post_type)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <FiUser className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {post.users?.full_name || 'Unknown'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <div>{post.views} views</div>
                    <div>{post.likes} likes</div>
                    <div>{post.comments_count} comments</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <FiCalendar className="w-4 h-4" />
                    <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(post)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(post)}
                      className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                      title="Edit"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(post)}
                      className={`p-1 transition-colors ${
                        post.is_featured 
                          ? 'text-yellow-500 hover:text-yellow-600' 
                          : 'text-gray-400 hover:text-yellow-500'
                      }`}
                      title={post.is_featured ? 'Unfeature' : 'Feature'}
                    >
                      <FiStar className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ 
                        isOpen: true, 
                        postId: post.id, 
                        postTitle: post.title 
                      })}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating your first post.'}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteConfirm.postTitle}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm({ isOpen: false })}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm.postId && handleDelete(deleteConfirm.postId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentListTable;
