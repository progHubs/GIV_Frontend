import React from 'react';
import PublicLayout from '../layouts/PublicLayout';

const PostsPage: React.FC = () => {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Latest News & Stories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, success stories, and insights from 
            our community impact initiatives across Ethiopia.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
            All Posts
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            Success Stories
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            News & Updates
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            Impact Reports
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            Community Spotlights
          </button>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-64 bg-gray-300"></div>
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                  Featured
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                  Success Story
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                1000 Children Receive Education Support Through Our Latest Campaign
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Thanks to the generous support of our community, we've successfully provided 
                educational materials and scholarships to over 1000 children across rural Ethiopia. 
                This milestone represents months of dedicated work and the power of collective action.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>January 10, 2025</span>
                  <span>•</span>
                  <span>5 min read</span>
                  <span>•</span>
                  <span>245 likes</span>
                </div>
                <button className="text-blue-600 font-medium hover:text-blue-700">
                  Read More →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((post) => (
            <article key={post} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                    Impact Report
                  </span>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  Monthly Impact Report: December 2024 Achievements
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  Discover the incredible impact we made together in December, including 
                  new partnerships, volunteer milestones, and community transformations.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>3 min read</span>
                    <span>•</span>
                    <span>89 likes</span>
                  </div>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Read More
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Load More Posts
          </button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PostsPage;
