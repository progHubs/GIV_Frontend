import React from 'react';
import PublicLayout from '../layouts/PublicLayout';

const CampaignsPage: React.FC = () => {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Active Campaigns
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Support verified campaigns making a real difference in Ethiopian communities. 
            Every contribution helps build a better future.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
            All Campaigns
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            Education
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            Healthcare
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            Emergency Relief
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
            Infrastructure
          </button>
        </div>

        {/* Campaign Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Sample Campaign Card */}
          {[1, 2, 3, 4, 5, 6].map((campaign) => (
            <div key={campaign} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Education
                  </span>
                  <span className="text-sm text-gray-500">5 days left</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  School Supplies for Rural Children
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Help provide essential school supplies to children in remote villages across Ethiopia.
                </p>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Raised</p>
                    <p className="text-lg font-semibold text-gray-900">$7,500</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Goal</p>
                    <p className="text-lg font-semibold text-gray-900">$10,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Donors</p>
                    <p className="text-lg font-semibold text-gray-900">156</p>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Donate Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Load More Campaigns
          </button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CampaignsPage;
