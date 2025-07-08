import React from 'react';
import PublicLayout from '../layouts/PublicLayout';

const EventsPage: React.FC = () => {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our community events, volunteer opportunities, and workshops. 
            Together we can create positive change in Ethiopia.
          </p>
        </div>

        {/* Event Categories */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
            All Events
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            Volunteer Work
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            Workshops
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            Community Meetings
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            Fundraising
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((event) => (
            <div key={event} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Date */}
                <div className="flex-shrink-0 text-center">
                  <div className="bg-blue-600 text-white rounded-lg p-4 w-20">
                    <div className="text-sm font-medium">JAN</div>
                    <div className="text-2xl font-bold">15</div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      Volunteer Work
                    </span>
                    <span className="text-sm text-gray-500">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Addis Ababa
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Community Clean-up Drive
                  </h3>
                  
                  <p className="text-gray-600 mb-3">
                    Join us for a community-wide clean-up initiative to beautify our neighborhoods 
                    and promote environmental awareness. All volunteers welcome!
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      9:00 AM - 2:00 PM
                    </span>
                    <span>
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      45 volunteers registered
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Load More Events
          </button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default EventsPage;
