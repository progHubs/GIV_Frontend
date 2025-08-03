/**
 * Post Detail Page Component
 * Individual post page with full content and comments
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '../theme';
import ModernNavigation from '../components/navigation/ModernNavigation';
import Footer from '../components/layout/Footer';
import PostContent from '../components/posts/PostContent';
import PostComments from '../components/posts/PostComments';
import RelatedPosts from '../components/posts/RelatedPosts';
import PostSidebar from '../components/posts/PostSidebar';
import { MOCK_POSTS, MOCK_COMMENTS } from '../constants/content';
import type { Post, Comment } from '../types/content';

const PostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      navigate('/posts');
      return;
    }

    // Find the post by slug
    const foundPost = MOCK_POSTS.find(p => p.slug === slug);
    
    if (!foundPost) {
      navigate('/posts');
      return;
    }

    setPost(foundPost);

    // Get comments for this post
    const postComments = MOCK_COMMENTS.filter(comment => comment.post_id === foundPost.id);
    setComments(postComments);

    // Get related posts (same type, excluding current post)
    const related = MOCK_POSTS
      .filter(p => p.id !== foundPost.id && p.post_type === foundPost.post_type)
      .slice(0, 3);
    setRelatedPosts(related);

    setIsLoading(false);
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <ThemeProvider defaultMode="light">
        <div className="min-h-screen bg-theme-background">
          <ModernNavigation />
          <div className="pt-20 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="h-64 bg-gray-200 rounded mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  if (!post) {
    return (
      <ThemeProvider defaultMode="light">
        <div className="min-h-screen bg-theme-background">
          <ModernNavigation />
          <div className="pt-20 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
              <p className="text-gray-600 mb-8">The post you're looking for doesn't exist.</p>
              <button
                onClick={() => navigate('/posts')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Posts
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

        {/* Hero Section - Full Width */}
        {post.feature_image && (
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
            <img
              src={post.feature_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            {/* Hero Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8 text-white">
              <div className="max-w-7xl mx-auto w-full">
                {/* Post Type Badge */}
                <div className="mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                    {post.post_type === 'news' ? 'News Article' : 
                     post.post_type === 'blog' ? 'Blog Post' : 
                     post.post_type === 'press_release' ? 'Press Release' : 'Article'}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 leading-tight">
                  {post.title}
                </h1>

                {/* Author and Meta Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.users?.profile_image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'}
                      alt={post.users?.full_name || 'Author'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                    />
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {post.users?.full_name || 'GIV Society'}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-white/80">
                        <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                        <span>•</span>
                        <span>{Math.max(1, Math.ceil((post.content?.length || 0) / 200))} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="pt-8 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-xs text-gray-500">
                <li>
                  <button
                    onClick={() => navigate('/')}
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/posts')}
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    Posts
                  </button>
                </li>
                <li>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li className="text-gray-900 font-medium truncate text-xs">
                  {post.title}
                </li>
              </ol>
            </nav>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content - Left Column */}
              <div className="lg:col-span-3 space-y-6">
                {/* Post Content (without hero image) */}
                <PostContent post={post} />

                {/* Comments Section */}
                <PostComments
                  postId={post.id}
                  comments={comments}
                  onCommentAdd={(comment) => setComments([...comments, comment])}
                />
              </div>

              {/* Sidebar - Right Column */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <PostSidebar
                    relatedPosts={relatedPosts}
                    currentPostId={post.id}
                  />
                </div>
              </div>
            </div>

            {/* Related Posts Section (Full Width) */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <RelatedPosts posts={relatedPosts} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default PostDetailPage;
