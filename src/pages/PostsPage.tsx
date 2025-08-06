/**
 * Posts Page Component
 * Main page for displaying news and blog posts
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '../theme';
import ModernNavigation from '../components/navigation/ModernNavigation';
import Footer from '../components/layout/Footer';
import FeaturedPostsHero from '../components/posts/PostsHero';
import PostsSearch from '../components/posts/PostsSearch';
import PostCard from '../components/posts/PostCard';
import PostsList from '../components/posts/PostsList';
import PostsSidebar from '../components/posts/PostsSidebar';
import { usePosts, useFeaturedPosts, usePostsByTag } from '../hooks/useContent';
import type { Post, PostQueryParams } from '../types/content';

const PostsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Build query parameters for API calls
  const queryParams = useMemo<PostQueryParams>(() => {
    const params: PostQueryParams = {
      page: 1,
      limit: 20,
      sort_by: 'created_at',
      sort_order: 'desc',
    };

    // Add category filter
    if (selectedCategory !== 'all') {
      params.post_type = selectedCategory as any;
    }

    // Add search query
    if (searchQuery.trim()) {
      params.title_search = searchQuery;
      params.content_search = searchQuery;
    }

    return params;
  }, [selectedCategory, searchQuery]);

  // Always call both hooks to maintain hook order consistency
  // Use enabled parameter to control when they should execute
  const {
    data: postsResponse,
    isLoading: postsLoading,
    error: postsError
  } = usePosts(queryParams);

  const {
    data: tagPostsResponse,
    isLoading: tagPostsLoading,
    error: tagPostsError
  } = usePostsByTag(selectedTag, queryParams, !!selectedTag);

  // Fetch featured posts separately
  const {
    data: featuredResponse,
    isLoading: featuredLoading
  } = useFeaturedPosts({ limit: 4 });

  // Get the current posts data (either regular posts or tag-filtered posts)
  const currentPostsResponse = selectedTag ? tagPostsResponse : postsResponse;
  const currentPostsLoading = selectedTag ? tagPostsLoading : postsLoading;
  const currentPostsError = selectedTag ? tagPostsError : postsError;

  // Combine all posts for sidebar
  const allPosts = useMemo(() => {
    const regular = currentPostsResponse?.data || [];
    const featured = featuredResponse?.data || [];

    // Combine and deduplicate by ID
    const combined = [...featured, ...regular];
    const unique = combined.filter((post, index, self) =>
      index === self.findIndex(p => p.id === post.id)
    );

    return unique;
  }, [currentPostsResponse?.data, featuredResponse?.data]);

  // Filter posts for display (client-side filtering for better UX)
  const filteredPosts = useMemo(() => {
    if (!currentPostsResponse?.data) return [];

    let filtered = currentPostsResponse.data;

    // Additional client-side filtering if needed
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        (post.tags && post.tags.toLowerCase().includes(searchTerm))
      );
    }

    return filtered;
  }, [currentPostsResponse?.data, searchQuery]);

  const isLoading = currentPostsLoading || featuredLoading;

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setSelectedTag(''); // Clear tag filter when changing category
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle tag filter
  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    setSelectedCategory('all'); // Reset category when filtering by tag
    setSearchQuery(''); // Clear search when filtering by tag
  };

  // Handle clearing all filters
  const handleClearFilters = () => {
    setSelectedTag('');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  // Handle errors
  if (currentPostsError) {
    console.error('Error loading posts:', currentPostsError);
  }

  // Error state
  if (currentPostsError && !currentPostsLoading) {
    return (
      <ThemeProvider defaultMode="light">
        <div className="min-h-screen bg-theme-background">
          <ModernNavigation />
          <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Posts</h1>
              <p className="text-gray-600 mb-6">We're having trouble loading the posts. Please try again later.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultMode="light">
      <div className="min-h-screen bg-theme-background">
        {/* Navigation */}
        <ModernNavigation />

        {/* Featured Posts Hero Section */}
        <div className="pt-16">
          <FeaturedPostsHero
            featuredPosts={featuredResponse?.data || []}
            isLoading={featuredLoading}
          />
        </div>

        {/* Search Section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
            <PostsSearch onSearch={handleSearch} />

            {/* Active Filters */}
            {(selectedTag || selectedCategory !== 'all' || searchQuery) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedTag && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Tag: {selectedTag}
                    <button
                      onClick={() => setSelectedTag('')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content Area - Single Column Layout */}
            <div className="lg:col-span-3">
              {/* Regular Posts - Single Column */}
              <div className="space-y-8">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <div key={post.id}>
                      <PostCard post={post} onTagClick={handleTagFilter} />
                    </div>
                  ))
                ) : isLoading ? (
                  <div className="space-y-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="bg-gray-200 h-48 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                ) : (
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
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <PostsSidebar
                posts={allPosts}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryFilter}
                onTagClick={handleTagFilter}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default PostsPage;
