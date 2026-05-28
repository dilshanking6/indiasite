import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import { Loader2, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import ReelCard from './ReelCard';
import { useNavigate } from 'react-router-dom';

const ReelsFeed = ({ type = 'all' }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReelId, setActiveReelId] = useState(null);
  const [commentPost, setCommentPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const observer = useRef(null);
  const navigate = useNavigate();

  const handleLikePost = async (postId) => {
    try {
      await api.post(`/api/reels/${postId}/like`);
      fetchContent();
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleSavePost = async (postId) => {
    try {
      await api.post(`/api/reels/${postId}/save`);
      alert('Saved to Bharat Gallery!');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleCommentPost = async (e) => {
    e.preventDefault();
    if (!commentPost || !commentText.trim()) return;
    try {
      await api.post(`/api/reels/${commentPost._id}/comment`, { text: commentText });
      setCommentText('');
      setCommentPost(null);
      fetchContent();
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [type]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      // If type is 'post', use /api/reels/posts, else use /api/reels (which returns videos)
      const endpoint = type === 'post' ? '/api/reels/posts' : '/api/reels';
      const res = await api.get(endpoint);
      setContent(res.data);
      if (res.data.length > 0) setActiveReelId(res.data[0]._id);
    } catch (err) {
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveReelId(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );
    return () => observer.current?.disconnect();
  }, [content]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <Loader2 className="animate-spin text-india-blue w-12 h-12" />
      <p className="text-india-blue font-black animate-pulse uppercase tracking-widest text-xs">Loading Content...</p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto pb-24">
      <div className="space-y-10 px-2">
        {content.length > 0 ? (
          content.map((item, index) => (
            <motion.div 
              key={item._id} id={item._id} 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              ref={(el) => el && observer.current?.observe(el)}
              className={item.mediaType === 'image' ? 'bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 p-2' : ''}
            >
              {item.mediaType === 'image' ? (
                <div className="space-y-4">
                   <div className="flex items-center p-4 space-x-3">
                      <div onClick={() => navigate(`/profile/${item.user?.username}`)} className="w-10 h-10 rounded-full bg-india-gradient p-[2px] cursor-pointer">
                         <img src={item.user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user?.username}`} className="w-full h-full rounded-full object-cover border-2 border-white" alt="user" />
                      </div>
                      <span onClick={() => navigate(`/profile/${item.user?.username}`)} className="font-black text-sm cursor-pointer hover:text-india-blue">@{item.user?.username}</span>
                   </div>
                   <img src={item.videoUrl} className="w-full aspect-square object-cover rounded-[2rem]" alt="post" />
                   
                   <div className="flex items-center justify-between px-6 py-2">
                      <div className="flex items-center space-x-6">
                         <button onClick={() => handleLikePost(item._id)} className={`transition-all ${item.likes > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            <Heart size={24} fill={item.likes > 0 ? 'currentColor' : 'none'} />
                         </button>
                         <button className="text-gray-400" onClick={() => setCommentPost(item)}>
                            <MessageCircle size={24} />
                         </button>
                         <button className="text-gray-400" onClick={() => alert(`Share link: ${window.location.origin}/reels?id=${item._id}`)}>
                            <Share2 size={24} />
                         </button>
                      </div>
                      <button onClick={() => handleSavePost(item._id)} className="text-gray-400 hover:text-india-blue transition-colors">
                         <Bookmark size={24} />
                      </button>
                   </div>

                   <div className="px-6 pb-6 space-y-2">
                      <p className="text-xs font-black text-gray-800">{item.likes || 0} likes</p>
                      <p className="text-sm font-bold"><span onClick={() => navigate(`/profile/${item.user?.username}`)} className="text-india-blue mr-2 font-black cursor-pointer">@{item.user?.username}</span>{item.caption}</p>
                      {item.comments?.length > 0 && <p className="text-xs text-gray-500 font-bold">{item.comments.length} comments</p>}
                   </div>
                </div>
              ) : (
                <ReelCard reel={item} isActive={activeReelId === item._id} />
              )}
              
              {/* Google AdSense / Sponsored Content Placeholder */}
              {(index + 1) % 3 === 0 && (
                <div className="mt-8 bg-gray-50 border border-dashed border-gray-200 rounded-[2rem] p-6 text-center">
                   <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Sponsored</p>
                   <div className="h-40 bg-white rounded-2xl flex items-center justify-center text-gray-200 font-black italic">
                      Google AdSense Space
                   </div>
                   <button className="mt-4 text-india-blue font-black text-xs">Learn More</button>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No {type === 'post' ? 'posts' : 'reels'} found yet</p>
          </div>
        )}
      </div>

      {commentPost && (
        <div className="fixed inset-0 z-[220] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900">Comments</h3>
              <button onClick={() => setCommentPost(null)} className="text-slate-500 font-bold">Close</button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
              {(commentPost.comments || []).map((c, i) => (
                <div key={i} className="text-sm">
                  <span className="font-black text-india-blue">@{c.user?.username || 'user'}</span>
                  <span className="ml-2 text-slate-700">{c.text}</span>
                </div>
              ))}
              {(!commentPost.comments || commentPost.comments.length === 0) && <p className="text-sm text-slate-400 font-bold">No comments yet</p>}
            </div>
            <form onSubmit={handleCommentPost} className="flex gap-2">
              <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
              <button className="bg-india-blue text-white px-5 rounded-xl font-black">Post</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelsFeed;
