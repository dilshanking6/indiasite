import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Plus, X, Heart, Send, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const StoriesBar = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const progressInterval = useRef(null);

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (selectedStoryIndex !== null) {
      startStory();
    } else {
      stopStory();
    }
    return () => stopStory();
  }, [selectedStoryIndex]);

  const fetchStories = async () => {
    try {
      const res = await api.get('/api/stories');
      setStories(res.data);
    } catch (err) {
      console.error('Fetch stories failed:', err);
    }
  };

  const startStory = () => {
    setProgress(0);
    clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextStory();
          return 100;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds per story
  };

  const stopStory = () => {
    clearInterval(progressInterval.current);
    setProgress(0);
  };

  const handleNextStory = () => {
    if (selectedStoryIndex < stories.length - 1) {
      setSelectedStoryIndex(selectedStoryIndex + 1);
    } else {
      setSelectedStoryIndex(null);
    }
  };

  const handlePrevStory = () => {
    if (selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('media', file);
    try {
      setIsUploading(true);
      await api.post('/api/stories/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchStories();
    } catch (err) {
      alert('Story upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex space-x-5 overflow-x-auto pb-6 pt-4 px-4 no-scrollbar border-b border-gray-100 mb-8">
      {/* Add Story */}
      <div className="flex flex-col items-center space-y-2 shrink-0 cursor-pointer group" onClick={() => fileInputRef.current.click()}>
        <div className="p-[3px] rounded-full bg-gray-100 group-hover:bg-india-gradient transition-all shadow-sm">
          <div className="bg-white p-[3px] rounded-full">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-50 flex items-center justify-center relative overflow-hidden">
              <img src={user?.profilePicture} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" alt="me" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/5"><Plus className="text-india-blue" size={28} /></div>
            </div>
          </div>
        </div>
        <span className="text-[11px] text-gray-500 font-black">Apki Story</span>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
      </div>

      {/* Stories */}
      {stories.map((story, i) => (
        <div key={story._id} onClick={() => setSelectedStoryIndex(i)} className="flex flex-col items-center space-y-2 shrink-0 cursor-pointer">
          <div className="p-[3px] rounded-full bg-india-gradient shadow-md">
            <div className="bg-white p-[3px] rounded-full">
              <img src={story.user?.profilePicture} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover" alt="story" />
            </div>
          </div>
          <span className="text-[11px] text-gray-700 font-black truncate w-20 text-center">{story.user?.username}</span>
        </div>
      ))}

      {/* Story Viewer */}
      <AnimatePresence>
        {selectedStoryIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center">
            <div className="absolute top-0 left-0 right-0 p-4 flex space-x-1 z-[220]">
               {stories.map((_, i) => (
                 <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-100" style={{ width: i < selectedStoryIndex ? '100%' : i === selectedStoryIndex ? `${progress}%` : '0%' }} />
                 </div>
               ))}
            </div>

            <div className="absolute top-8 left-0 right-0 p-6 flex items-center justify-between z-[220]">
               <div className="flex items-center space-x-3">
                  <img src={stories[selectedStoryIndex].user?.profilePicture} className="w-9 h-9 rounded-full border border-white/20" alt="p" />
                  <span className="text-white font-black text-sm">{stories[selectedStoryIndex].user?.username}</span>
               </div>
               <button onClick={() => setSelectedStoryIndex(null)} className="text-white"><X size={28} /></button>
            </div>

            <div className="relative w-full h-full max-w-lg flex items-center">
               <div className="absolute inset-y-0 left-0 w-1/3 z-[210]" onClick={handlePrevStory} />
               <div className="absolute inset-y-0 right-0 w-1/3 z-[210]" onClick={handleNextStory} />
               <img src={stories[selectedStoryIndex].imageUrl} className="w-full h-full object-contain" alt="s" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center space-x-4 z-[220] bg-gradient-to-t from-black/80 to-transparent">
                <input type="text" placeholder="Message bhejein..." className="flex-1 bg-white/10 border-none rounded-full px-6 py-3.5 text-white placeholder-white/50 text-sm focus:ring-1 focus:ring-india-saffron" />
                <button className="text-white hover:text-red-500 transition-all"><Heart size={28} /></button>
                <button className="text-white hover:text-india-blue transition-all"><Send size={28} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isUploading && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center">
           <div className="bg-white p-8 rounded-[2.5rem] flex flex-col items-center space-y-4">
              <Loader2 className="animate-spin text-india-blue w-12 h-12" />
              <p className="font-black text-india-blue">Story lag rahi hai...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default StoriesBar;
