/**
 * Posts Page Component
 * Main page for displaying news and blog posts
 */

import React, { useState } from 'react';
import { ThemeProvider } from '../theme';
import ModernNavigation from '../components/navigation/ModernNavigation';
import Footer from '../components/layout/Footer';
import PostsHero from '../components/posts/PostsHero';
import PostsList from '../components/posts/PostsList';
import PostsSidebar from '../components/posts/PostsSidebar';
import { MOCK_POSTS } from '../constants/content';
import type { Post } from '../types/content';

const PostsPage: React.FC = () => {
  const [posts] = useState<Post[]>(MOCK_POSTS);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(MOCK_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter posts based on category and search
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterPosts(category, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPosts(selectedCategory, query);
  };

  const filterPosts = (category: string, query: string) => {
    let filtered = posts;

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(post => post.post_type === category);
    }

    // Filter by search query
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.content?.toLowerCase().includes(lowercaseQuery) ||
        post.tags?.toLowerCase().includes(lowercaseQuery)
      );
    }

    setFilteredPosts(filtered);
  };

  return (
    <ThemeProvider defaultMode="light">
      <div className="min-h-screen bg-theme-background">
        {/* Navigation */}
        <ModernNavigation />

        {/* Hero Section */}
        <PostsHero onSearch={handleSearch} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <PostsList 
                posts={filteredPosts}
                isLoading={false}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <PostsSidebar
                posts={posts}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryFilter}
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
