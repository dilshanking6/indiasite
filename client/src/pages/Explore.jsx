import React from 'react';
import { Search } from 'lucide-react';

const Explore = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search India Site" 
          className="w-full bg-gray-100 py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-india-saffron"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-1">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-sm"></div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
