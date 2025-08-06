/**
 * Featured Posts Hero Component
 * Hero section displaying featured posts in a carousel/slider format
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '../../types/content';
import { renderContentBlocksToText } from '../../utils/contentRenderer';

interface FeaturedPostsHeroProps {
  featuredPosts: Post[];
  isLoading?: boolean;
}

const FeaturedPostsHero: React.FC<FeaturedPostsHeroProps> = ({
  featuredPosts,
  isLoading = false
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || featuredPosts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredPosts.length, isAutoPlaying]);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getPostExcerpt = (post: Post, maxLength: number = 200) => {
    let content = '';

    // Try to get content from content_blocks first
    if (post.content_blocks) {
      try {
        const contentBlocks = typeof post.content_blocks === 'string'
          ? JSON.parse(post.content_blocks)
          : post.content_blocks;
        content = renderContentBlocksToText(contentBlocks);
      } catch (error) {
        console.error('Error extracting text from content blocks:', error);
      }
    }

    // Fallback to legacy content
    if (!content && post.content) {
      content = post.content;
    }

    // Truncate content
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <section className="relative h-96 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">Loading featured posts...</div>
        </div>
      </section>
    );
  }

  if (!featuredPosts || featuredPosts.length === 0) {
    return null;
  }

  const currentPost = featuredPosts[currentSlide];

  return (
    <section
      className="relative h-[450px] md:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentPost.feature_image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop'}
              alt={currentPost.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Content - Positioned at bottom left */}
          <div className="relative h-full flex items-end">
            <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
              <div className="max-w-4xl mb-8">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-4"
                >
                  {/* Title */}
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                    <Link
                      to={`/posts/${currentPost.slug}`}
                      className="hover:text-blue-200 transition-colors duration-200"
                    >
                      {currentPost.title}
                    </Link>
                  </h1>

                  {/* Excerpt */}
                  <p className="text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed max-w-2xl">
                    {getPostExcerpt(currentPost, 120)}
                  </p>

                  {/* Read More Button */}
                  <div className="pt-2">
                    <Link
                      to={`/posts/${currentPost.slug}`}
                      className="inline-flex items-center px-4 py-2 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm"
                    >
                      Read Full Story
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {featuredPosts.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {featuredPosts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedPostsHero;
