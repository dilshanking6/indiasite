import React, { useState, useEffect } from 'react';
import api from '../api';
import { Grid, Bookmark, User as UserIcon, LogOut, X, Camera, Edit2, Link as LinkIcon, MapPin, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user: currentUser, logout } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);

  const [editData, setEditData] = useState({
    username: '',
    bio: '',
    fullName: '',
    website: ''
  });

  const targetUsername = username || currentUser?.username;

  useEffect(() => {
    if (targetUsername) {
      fetchProfile();
    }
  }, [targetUsername, currentUser]);

  useEffect(() => {
    if (activeTab === 'saved' && isOwnProfile) {
      fetchSavedPosts();
    }
  }, [activeTab]);

  const fetchSavedPosts = async () => {
    try {
      const res = await api.get('/api/users/saved-content');
      setSavedPosts(res.data);
    } catch (err) {
      console.error('Fetch saved failed:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/users/profile/${targetUsername}`);
      setProfile(res.data);
      
      if (currentUser) {
        setIsFollowing(res.data.followers?.some(f => f._id === currentUser.id || f === currentUser.id));
      }

      setEditData({
        username: res.data.username,
        bio: res.data.bio || '',
        fullName: res.data.fullName || '',
        website: res.data.website || ''
      });
      
      const reelsRes = await api.get('/api/reels/posts');
      const userPosts = reelsRes.data.filter(p => p.user?._id === res.data._id || p.user === res.data._id);
      setPosts(userPosts);
    } catch (err) {
      console.error('Fetch profile failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await api.post(`/api/users/follow/${profile._id}`);
      setIsFollowing(res.data.following);
      fetchProfile();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profilePicture', file);
    try {
      setIsAvatarUploading(true);
      await api.put('/api/users/update-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchProfile();
    } catch (err) {
      alert('Avatar upload failed');
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/users/edit', editData);
      setIsEditModalOpen(false);
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-india-blue border-b-2"></div>
    </div>
  );

  const isOwnProfile = currentUser?.username === profile?.username;

  return (
    <div className="max-w-4xl mx-auto p-4 md:pt-10">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-16 mb-12">
        <div className="relative group">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full p-1.5 bg-india-gradient shadow-xl">
            <div className="w-full h-full rounded-full bg-white border-4 border-white overflow-hidden relative">
              <img 
                src={profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`} 
                alt="Profile" 
                className={`w-full h-full object-cover ${isAvatarUploading ? 'opacity-30' : 'opacity-100'}`}
              />
            </div>
          </div>
          {isOwnProfile && (
            <label className="absolute bottom-2 right-2 bg-india-blue text-white p-2.5 rounded-full shadow-lg cursor-pointer">
              <Camera size={20} />
              <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
            </label>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left pt-2">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
            <h2 className="text-3xl font-black tracking-tight">{profile?.username}</h2>
            <div className="flex space-x-3">
              {isOwnProfile ? (
                <>
                  <button onClick={() => setIsEditModalOpen(true)} className="bg-gray-100 px-8 py-2 rounded-xl text-sm font-black hover:bg-gray-200">Edit Profile</button>
                  <button onClick={logout} className="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-100"><LogOut size={20} /></button>
                </>
              ) : (
                <>
                  <button onClick={handleFollow} className={`px-8 py-2 rounded-xl text-sm font-black transition-all ${isFollowing ? 'bg-gray-100 text-black' : 'bg-india-blue text-white shadow-lg shadow-blue-100'}`}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button onClick={() => navigate(`/chat?u=${profile?.username}`)} className="bg-gray-100 p-2 rounded-xl hover:bg-gray-200">
                    <MessageCircle size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-center md:justify-start space-x-12 mb-8">
            <div className="flex flex-col"><span className="font-black text-xl">{posts.length}</span><span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Posts</span></div>
            <div className="flex flex-col cursor-pointer" onClick={() => setShowFollowersList(true)}><span className="font-black text-xl">{profile?.followers?.length || 0}</span><span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Followers</span></div>
            <div className="flex flex-col cursor-pointer" onClick={() => setShowFollowingList(true)}><span className="font-black text-xl">{profile?.following?.length || 0}</span><span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Following</span></div>
          </div>

          <div className="space-y-2 bg-gray-50/50 p-6 rounded-[2rem] inline-block min-w-full md:min-w-[400px]">
            <h1 className="font-black text-lg text-india-blue">{profile?.fullName || profile?.username}</h1>
            <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">{profile?.bio || 'Namaste! I am using India Site.'}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 flex justify-center space-x-20 mb-6">
        <button onClick={() => setActiveTab('posts')} className={`flex items-center space-x-2 py-4 border-t-2 ${activeTab === 'posts' ? 'border-india-blue text-india-blue' : 'border-transparent text-gray-400'}`}>
          <Grid size={18} /> <span className="text-xs font-black uppercase tracking-widest">Feed</span>
        </button>
        {isOwnProfile && (
          <button onClick={() => setActiveTab('saved')} className={`flex items-center space-x-2 py-4 border-t-2 ${activeTab === 'saved' ? 'border-india-blue text-india-blue' : 'border-transparent text-gray-400'}`}>
            <Bookmark size={18} /> <span className="text-xs font-black uppercase tracking-widest">Saved</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1 md:gap-6">
        {(activeTab === 'posts' ? posts : savedPosts).map((post) => (
          <div key={post._id} onClick={() => navigate(post.mediaType === 'image' ? '/' : `/reels?id=${post._id}`)} className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
            <img src={post.videoUrl} className="w-full h-full object-cover" alt="Content" />
          </div>
        ))}
      </div>

      {!loading && (activeTab === 'posts' ? posts : savedPosts).length === 0 && (
         <div className="text-center py-20 text-gray-400 font-black uppercase tracking-widest text-xs">
            No {activeTab} yet
         </div>
      )}

      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="absolute inset-0 bg-black/40" onClick={() => setIsEditModalOpen(false)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl">
               <div className="flex justify-between items-center mb-8">
                  <span className="font-black text-xl">Edit Profile</span>
                  <button onClick={() => setIsEditModalOpen(false)}><X /></button>
               </div>
               <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <input type="text" placeholder="Full Name" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={editData.fullName} onChange={(e) => setEditData({...editData, fullName: e.target.value})} />
                  <textarea placeholder="Bio" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold h-32" value={editData.bio} onChange={(e) => setEditData({...editData, bio: e.target.value})} />
                  <button type="submit" className="w-full bg-india-blue text-white font-black py-4 rounded-2xl">Save Changes</button>
               </form>
            </motion.div>
          </div>
        )}

        {(showFollowersList || showFollowingList) && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="absolute inset-0 bg-black/40" onClick={() => { setShowFollowersList(false); setShowFollowingList(false); }} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl max-h-[70vh] flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <span className="font-black text-xl">{showFollowersList ? 'Followers' : 'Following'}</span>
                  <button onClick={() => { setShowFollowersList(false); setShowFollowingList(false); }}><X /></button>
               </div>
               <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {(showFollowersList ? profile?.followers : profile?.following)?.map((u) => (
                    <div key={u._id} onClick={() => { navigate(`/profile/${u.username}`); setShowFollowersList(false); setShowFollowingList(false); }} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all">
                       <img src={u.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="w-12 h-12 rounded-full border border-gray-100" alt="u" />
                       <span className="font-black text-sm">{u.username}</span>
                    </div>
                  ))}
                  {((showFollowersList ? profile?.followers : profile?.following)?.length === 0) && (
                    <p className="text-center text-gray-400 font-bold py-10">No users found</p>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
