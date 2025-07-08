import React from 'react';

interface Author {
  name: string;
  role: string;
  avatar: string;
}

interface Stats {
  views: string;
  likes: string;
  readTime: string;
}

interface Story {
  id: number;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  image: string;
  author: Author;
  stats: Stats;
  date: string;
  featured?: boolean;
}

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <div className="w-80 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative">
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`${story.categoryColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
            {story.category}
          </span>
        </div>

        {/* Heart/Like Button */}
        <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
          <svg className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Stats Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{story.stats.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{story.stats.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{story.stats.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={story.author.avatar}
            alt={story.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{story.author.name}</h4>
            <p className="text-xs text-gray-600">{story.author.role}</p>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {story.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {story.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{story.date}</span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center">
            Read More
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
