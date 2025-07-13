import React from 'react';

/**
 * CampaignStatsSkeleton
 * Simple animated placeholders for the statistics grid while data is loading
 */
const CampaignStatsSkeleton: React.FC = () => {
  // Render four boxes mimicking the stats layout
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-pulse">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="text-center">
          <div className="h-8 md:h-10 w-20 md:w-24 bg-white bg-opacity-30 rounded mb-2 mx-auto" />
          <div className="h-4 w-24 bg-white bg-opacity-20 rounded mx-auto" />
        </div>
      ))}
    </div>
  );
};

export default CampaignStatsSkeleton; 