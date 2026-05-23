import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, UserPlus, ArrowLeft } from 'lucide-react';
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
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
      
      // Mark as read after fetching
      await axios.put('http://localhost:5000/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Fetch notifications failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="text-red-500 fill-red-500" size={16} />;
      case 'comment': return <MessageCircle className="text-blue-500 fill-blue-500" size={16} />;
      case 'follow': return <UserPlus className="text-green-500" size={16} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-black">Notifications</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-india-blue"></div>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-6">
          {notifications.map((n) => (
            <div key={n._id} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                    <img src={n.sender?.profilePicture} alt={n.sender?.username} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                    {getIcon(n.type)}
                  </div>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-bold">{n.sender?.username}</span>
                    {n.type === 'like' && ' liked your reel.'}
                    {n.type === 'comment' && ' commented on your reel.'}
                    {n.type === 'follow' && ' started following you.'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {n.reelId && (
                <div className="w-10 h-14 bg-gray-100 rounded overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                  <video src={n.reelId.videoUrl} className="w-full h-full object-cover" />
                </div>
              )}
              
              {!n.reelId && n.type === 'follow' && (
                 <button className="bg-india-blue text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-opacity-90 transition-all shadow-md shadow-blue-100">
                    Follow Back
                 </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
            <Heart className="text-gray-300" size={40} />
          </div>
          <h2 className="text-xl font-bold">Activity On Your Posts</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            When someone likes or comments on one of your posts, you'll see it here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
