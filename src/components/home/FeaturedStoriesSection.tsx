import React, { useState, useRef } from 'react';
import StoryCard from './StoryCard';

// Mock data for featured stories
const mockStories = [
  {
    id: 1,
    title: "Breaking Barriers: How GIV Society Ethiopia Reached 40,000 Lives...",
    description: "A landmark achievement in our mission to provide free healthcare services across Ethiopia, marking a significant milestone in community...",
    category: "Impact Stories",
    categoryColor: "bg-red-500",
    image: "/api/placeholder/400/250",
    author: {
      name: "Dr. Misker Kassahun",
      role: "Founder & Medical Director",
      avatar: "/api/placeholder/40/40"
    },
    stats: {
      views: "2,450",
      likes: "189",
      readTime: "8 min"
    },
    date: "1/15/2025",
    featured: true
  },
  {
    id: 2,
    title: "Mental Health Revolution: Supporting Healthcare Workers Over...",
    description: "Our Mental Health for Healthcare Professionals (MHHP) program has provided critical support to over 500 healthcare workers, addressing...",
    category: "Mental Health",
    categoryColor: "bg-green-500",
    image: "/api/placeholder/400/250",
    author: {
      name: "Dr. Elizabeth Ekubay",
      role: "Mental Health Coordinator",
      avatar: "/api/placeholder/40/40"
    },
    stats: {
      views: "1,890",
      likes: "156",
      readTime: "6 min"
    },
    date: "1/12/2025"
  },
  {
    id: 3,
    title: "Partnership Spotlight: Federal Ministry of Health Collaboration...",
    description: "Our strategic partnership with the Federal Ministry of Health has opened new pathways to serve remote communities across Ethiopia.",
    category: "Partnerships",
    categoryColor: "bg-blue-500",
    image: "/api/placeholder/400/250",
    author: {
      name: "Communications Team",
      role: "Content & Outreach",
      avatar: "/api/placeholder/40/40"
    },
    stats: {
      views: "1,234",
      likes: "98",
      readTime: "5 min"
    },
    date: "1/10/2025"
  },
  {
    id: 4,
    title: "Empowering Women: Maternal and Child Health Initiatives",
    description: "Our new program focuses on providing comprehensive maternal and child health services, empowering women and ensuring...",
    category: "Healthcare",
    categoryColor: "bg-purple-500",
    image: "/api/placeholder/400/250",
    author: {
      name: "Dr. Elizabeth Ekubay",
      role: "Mental Health Coordinator",
      avatar: "/api/placeholder/40/40"
    },
    stats: {
      views: "1,600",
      likes: "140",
      readTime: "7 min"
    },
    date: "2/1/2025"
  },
  {
    id: 5,
    title: "Mobile Clinics: Bringing Healthcare to Remote Villages",
    description: "Our mobile clinic initiative has reached over 50 remote villages, providing essential healthcare services to underserved communities...",
    category: "Community Outreach",
    categoryColor: "bg-orange-500",
    image: "/api/placeholder/400/250",
    author: {
      name: "Dr. Samuel Tadesse",
      role: "Field Operations Director",
      avatar: "/api/placeholder/40/40"
    },
    stats: {
      views: "2,100",
      likes: "175",
      readTime: "9 min"
    },
    date: "1/8/2025"
  },
  {
    id: 6,
    title: "Volunteer Spotlight: Heroes Making a Difference",
    description: "Meet the dedicated volunteers who are making a real impact in their communities through our various healthcare programs...",
    category: "Volunteers",
    categoryColor: "bg-pink-500",
    image: "/api/placeholder/400/250",
    author: {
      name: "Sarah Johnson",
      role: "Volunteer Coordinator",
      avatar: "/api/placeholder/40/40"
    },
    stats: {
      views: "1,750",
      likes: "220",
      readTime: "6 min"
    },
    date: "1/5/2025"
  }
];

const FeaturedStoriesSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 320; // Card width + gap
      const scrollPosition = index * cardWidth;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : mockStories.length - 1;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < mockStories.length - 1 ? currentIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const cardWidth = 320;
      const scrollLeft = carouselRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Featured <span className="text-blue-600">Stories</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Discover the latest updates, success stories, and insights from our healthcare initiatives
            across Ethiopia.
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Previous story"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Next story"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Pagination Dots */}
          {/* <div className="flex space-x-2">
            {mockStories.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div> */}
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {mockStories.map((story) => (
              <div key={story.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Posts Button */}
        <div className="text-center mt-12">
          <button 
          onClick={() => window.location.href = '/posts'}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center">
            View All Posts
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedStoriesSection;
