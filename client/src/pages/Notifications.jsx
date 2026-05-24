import React, { useState, useEffect } from 'react';
import api from '../api';
import { Heart, MessageCircle, UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/notifications');
      setNotifications(res.data);
      
      // Mark as read after fetching
      await api.put('/api/notifications/read-all');
    } catch (err) {
      console.error('Fetch notifications failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="text-red-500 fill-red-500" size={16} />;
      case 'comment': return <MessageCircle className="text-india-blue fill-india-blue" size={16} />;
      case 'follow': return <UserPlus className="text-india-green" size={16} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:pt-10 min-h-screen">
      <div className="flex items-center space-x-6 mb-12">
        <button onClick={() => navigate(-1)} className="p-3 bg-white shadow-xl shadow-gray-100 rounded-2xl hover:scale-110 transition-all active:scale-95">
          <ArrowLeft size={24} className="text-india-blue" />
        </button>
        <h1 className="text-3xl font-black tracking-tighter">Bharat Activity</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-india-blue" size={32} />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-8">
          {notifications.map((n) => (
            <div key={n._id} className="flex items-center justify-between group cursor-pointer bg-white/50 p-4 rounded-[2rem] hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-gray-100">
              <div className="flex items-center space-x-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img src={n.sender?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.sender?.username}`} alt={n.sender?.username} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md">
                    {getIcon(n.type)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    <span className="font-black text-india-blue mr-1">@{n.sender?.username}</span>
                    {n.type === 'like' && 'ne aapki post pasand ki.'}
                    {n.type === 'comment' && 'ne aapki post par comment kiya.'}
                    {n.type === 'follow' && 'ne aapko follow karna shuru kiya.'}
                  </p>
                  <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
              
              {n.reelId && (
                <div className="w-12 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-sm" onClick={() => navigate(`/reels?id=${n.reelId._id}`)}>
                  <img src={n.reelId.videoUrl} className="w-full h-full object-cover" alt="reel" />
                </div>
              )}
              
              {!n.reelId && n.type === 'follow' && (
                 <button className="bg-india-blue text-white text-xs font-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all shadow-lg shadow-blue-100">
                    Follow Back
                 </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-6">
          <div className="w-24 h-24 bg-white shadow-2xl shadow-gray-100 rounded-[2.5rem] flex items-center justify-center mx-auto border border-gray-50">
            <Heart className="text-gray-100" size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight">Abhi koi activity nahi hai</h2>
            <p className="text-gray-400 text-sm font-bold max-w-xs mx-auto leading-relaxed">
              Jab koi aapki posts ko like ya comment karega, toh aapko yahan pata chal jayega.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
