import React from 'react';
import ReelsFeed from '../components/reels/ReelsFeed';

const ReelsPage = () => {
  return (
    <div className="bg-black min-h-screen pt-4 pb-20 overflow-y-auto snap-y snap-mandatory relative">
       {/* Ensure the container is visible and not hidden behind other elements */}
       <div className="max-w-md mx-auto">
          <ReelsFeed type="reel" />
       </div>
    </div>
  );
};

export default ReelsPage;
