import React, { useState, useEffect } from 'react';
import { Search, Loader2, Play } from 'lucide-react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExploreContent();
  }, []);

  const fetchExploreContent = async () => {
    try {
      setLoading(true);
      const [reelsRes, postsRes] = await Promise.all([
        api.get('/api/reels'),
        api.get('/api/reels/posts')
      ]);
      setItems([...reelsRes.data, ...postsRes.data].sort(() => Math.random() - 0.5));
    } catch (err) {
      console.error('Fetch explore failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:pt-10">
      <div className="relative mb-10 group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-india-blue transition-colors" size={20} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Bharat mein kya chal raha hai? Search..." 
          className="w-full bg-white border border-gray-100 shadow-xl shadow-gray-100/50 py-5 pl-16 pr-6 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-india-blue/20 font-bold transition-all"
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-india-blue" size={32} /></div>
      ) : (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item._id} 
              onClick={() => navigate(item.mediaType === 'image' ? '/' : `/reels?id=${item._id}`)}
              className="relative aspect-[9/16] md:aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all"
            >
              <img src={item.videoUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="explore" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 {item.mediaType !== 'image' && <Play className="text-white fill-white" size={24} />}
              </div>
              <div className="absolute bottom-2 left-2 flex items-center space-x-1.5">
                 <img src={item.user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user?.username}`} className="w-5 h-5 rounded-full border border-white/50" alt="u" />
                 <span className="text-[10px] text-white font-black drop-shadow-md">@{item.user?.username}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-20 text-gray-400 font-black uppercase tracking-widest">
           No matching Bharat content found
        </div>
      )}
    </div>
  );
};

export default Explore;
