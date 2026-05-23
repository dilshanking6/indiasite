import React from 'react';
import ReelsFeed from '../components/reels/ReelsFeed';
import StoriesBar from '../components/StoriesBar';

const Home = () => {
  return (
    <div className="max-w-md mx-auto">
      <StoriesBar />
      <ReelsFeed type="post" />
    </div>
  );
};

export default Home;
