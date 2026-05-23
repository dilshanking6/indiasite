import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import { Heart, MessageCircle, Share2, Play, Bookmark, MoreHorizontal, Music, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ReelCard = ({ reel, isActive }) => {
  const videoRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(reel.likes || 0);
  const [isLiked, setIsLiked] = useState(reel.likedBy?.includes(user?.id) || false);
  const [isSaved, setIsSaved] = useState(reel.savedBy?.includes(user?.id) || false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(reel.comments || []);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const isVideo = reel.mediaType === 'video' || (!reel.mediaType && reel.videoUrl.match(/\.(mp4|webm|ogg)$/i));

  useEffect(() => {
    if (isVideo && videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(err => console.log("Autoplay blocked:", err));
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, isVideo]);

  const goToProfile = (e) => {
    e.stopPropagation();
    if (reel.user?.username) {
      navigate(`/profile/${reel.user.username}`);
    }
  };

  const handleDoubleTap = (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (!isLiked) handleLike(e);
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
    } else if (isVideo && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
    setLastTap(now);
  };

  const handleLike = async (e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.post(`/api/reels/${reel._id}/like`);
      setLikes(res.data.likes);
      setIsLiked(res.data.liked);
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleSave = async (e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.post(`/api/reels/${reel._id}/save`);
      setIsSaved(res.data.saved);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/api/reels/${reel._id}/comment`, { text: commentText });
      setComments(res.data);
      setCommentText('');
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  const handleShare = (e) => {
    if (e) e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: 'India Site Reel', text: reel.caption, url: window.location.origin + '/reels?id=' + reel._id });
    } else {
      navigator.clipboard.writeText(window.location.origin + '/reels?id=' + reel._id);
      alert('Link copied!');
    }
  };

  return (
    <div className="relative bg-black rounded-[2rem] overflow-hidden aspect-[9/16] shadow-2xl group max-w-[380px] mx-auto mb-8 border border-white/5">
      {isVideo ? (
        <video ref={videoRef} src={reel.videoUrl} className="w-full h-full object-cover" loop onClick={handleDoubleTap} playsInline />
      ) : (
        <img src={reel.videoUrl} className="w-full h-full object-cover" alt={reel.caption} onClick={handleDoubleTap} />
      )}
      
      <AnimatePresence>
        {showHeartAnim && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.5, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <Heart className="text-white fill-white drop-shadow-2xl" size={100} />
          </motion.div>
        )}
      </AnimatePresence>

      {isVideo && !isPlaying && !showHeartAnim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
          <Play className="text-white opacity-80" size={64} fill="white" />
        </div>
      )}

      <div className="absolute right-4 bottom-28 flex flex-col space-y-6 z-10">
        <div className="flex flex-col items-center">
          <motion.button whileTap={{ scale: 1.5 }} onClick={handleLike} className={`p-3 rounded-full backdrop-blur-md transition-all ${isLiked ? 'bg-red-500/20' : 'bg-black/20 hover:bg-black/40'}`}>
            <Heart className={isLiked ? "text-red-500 fill-red-500" : "text-white"} size={28} />
          </motion.button>
          <span className="text-white text-xs mt-1 font-bold drop-shadow-lg">{likes}</span>
        </div>

        <div className="flex flex-col items-center">
          <button onClick={() => setShowComments(true)} className="p-3 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition-all">
            <MessageCircle className="text-white" size={28} />
          </button>
          <span className="text-white text-xs mt-1 font-bold drop-shadow-lg">{comments.length}</span>
        </div>

        <button onClick={handleSave} className="p-3 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition-all">
          <Bookmark className={isSaved ? "text-yellow-400 fill-yellow-400" : "text-white"} size={28} />
        </button>

        <button onClick={handleShare} className="p-3 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition-all">
          <Share2 className="text-white" size={28} />
        </button>

        <button onClick={() => setShowMenu(true)} className="p-3 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition-all">
          <MoreHorizontal className="text-white" size={28} />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-11 h-11 rounded-full p-[2px] bg-india-gradient cursor-pointer" onClick={goToProfile}>
            <div className="w-full h-full rounded-full bg-black border-2 border-black overflow-hidden">
              <img src={reel.user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reel.user?.username}`} alt="User" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-white font-black text-base cursor-pointer hover:underline" onClick={goToProfile}>{reel.user?.username || 'user'}</span>
              <button className="text-xs font-bold text-white bg-white/20 px-3 py-1 rounded-full backdrop-blur-md hover:bg-white/30">Follow</button>
            </div>
            <div className="flex items-center space-x-2 text-white/90 text-xs mt-1">
              <Music size={12} className="animate-spin-slow" />
              <div className="overflow-hidden w-40"><p className="whitespace-nowrap animate-marquee">{reel.musicName || 'Original Audio - India Site'}</p></div>
            </div>
          </div>
        </div>
        <p className="text-white text-sm line-clamp-2 font-medium leading-relaxed mb-2">{reel.caption}</p>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="absolute inset-0 bg-black/90 backdrop-blur-2xl z-50 flex flex-col rounded-[2rem]">
            <div className="p-5 border-b border-white/10 flex justify-between items-center">
              <span className="text-white font-black text-lg">Comments</span>
              <button onClick={() => setShowComments(false)} className="text-white p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {comments.map((c, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 cursor-pointer" onClick={() => navigate(`/profile/${c.user?.username}`)}>
                    <img src={c.user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.username}`} alt="User" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-black cursor-pointer hover:underline" onClick={() => navigate(`/profile/${c.user?.username}`)}>{c.user?.username || 'user'}</p>
                    <p className="text-white/80 text-sm mt-1 leading-relaxed">{c.text}</p>
                    <div className="flex items-center space-x-6 mt-3">
                      <span className="text-white/40 text-[10px] font-bold">12h</span>
                      <button className="text-white/60 text-[10px] font-black hover:text-white">Reply</button>
                      <button className="text-white/60 text-[10px] font-black hover:text-white">Like</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleComment} className="p-5 bg-white/5 border-t border-white/10 flex items-center space-x-3">
              <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-white/10 text-white text-sm rounded-2xl px-5 py-3.5 focus:outline-none border border-white/5" />
              <button type="submit" disabled={!commentText.trim()} className={`p-3 rounded-2xl transition-all ${commentText.trim() ? 'bg-india-saffron text-white shadow-lg' : 'bg-white/5 text-gray-500'}`}><Send size={20} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReelCard;
