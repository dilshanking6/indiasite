import React, { useState, useEffect } from 'react';
import api from '../api';
import { Grid, Bookmark, User as UserIcon, LogOut, X, Camera, MessageCircle, Settings } from 'lucide-react';
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
  const [isBlocked, setIsBlocked] = useState(false);
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
        setIsFollowing(res.data.followers?.some(f => (f._id || f) === currentUser.id));
        const me = await api.get('/api/auth/me').catch(() => null);
        const myBlockedUsers = me?.data?.blockedUsers || currentUser.blockedUsers || [];
        setIsBlocked(myBlockedUsers.some(u => (u._id || u) === res.data._id));
      }

      setEditData({
        username: res.data.username,
        bio: res.data.bio || '',
        fullName: res.data.fullName || '',
        website: res.data.website || ''
      });
      
      const reelsRes = await api.get('/api/reels/posts');
      const userPosts = reelsRes.data.filter(p => (p.user?._id || p.user) === res.data._id);
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

  const handleBlock = async () => {
    try {
      const res = await api.post(`/api/users/block/${profile._id}`);
      await fetchProfile();
      setIsBlocked(res.data.blocked);
    } catch (err) {
      alert(err.response?.data?.message || 'Block action failed');
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
    <div className="relative max-w-5xl mx-auto p-4 md:pt-10 min-h-[82vh] overflow-hidden rounded-[2rem]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(255,153,51,0.32),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(19,136,8,0.28),transparent_26%),radial-gradient(circle_at_50%_92%,rgba(255,255,255,0.85),transparent_35%),linear-gradient(135deg,#063b25_0%,#fff7ea_48%,#7a2e00_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-50 bg-[conic-gradient(from_70deg_at_18%_82%,transparent_0deg,#ff9933_42deg,transparent_92deg,#138808_146deg,transparent_210deg,#ffffff_260deg,transparent_360deg)] blur-sm animate-pulse" />
      <div className="absolute -left-24 top-24 -z-10 h-72 w-72 rounded-[45%_55%_62%_38%] border-[32px] border-white/35 rotate-12" />
      <div className="absolute -right-20 bottom-14 -z-10 h-80 w-80 rounded-[60%_40%_35%_65%] border-[28px] border-orange-300/35 -rotate-12" />

      <div className="rounded-[2rem] bg-white/88 backdrop-blur-md border border-white/70 shadow-2xl p-5 md:p-8 text-slate-900">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-20 mb-12">
        <div className="relative w-24 h-24 md:w-36 md:h-36 rounded-full p-1 bg-india-gradient shadow-xl">
           <img 
             src={profile?.profilePicture} 
             alt="p" 
             className="w-full h-full rounded-full object-cover border-4 border-white" 
           />
           {isOwnProfile && (
             <label className="absolute bottom-1 right-1 bg-india-blue text-white p-3 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform" title="Change DP">
               <Camera size={18} />
               <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
             </label>
           )}
           {isAvatarUploading && <div className="absolute inset-0 rounded-full bg-black/50 text-white flex items-center justify-center text-xs font-black">Uploading</div>}
        </div>
        
        <div className="flex-1 pt-2">
          <div className="flex items-center space-x-6 mb-6">
            <h2 className="text-xl font-bold uppercase">{profile?.username}</h2>
            <div className="flex space-x-2">
              {isOwnProfile ? (
                <>
                  <button onClick={() => setIsEditModalOpen(true)} className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg text-sm font-bold transition-all">Edit Profile</button>
                  <button onClick={logout} className="text-slate-700 hover:text-red-500"><LogOut size={20} /></button>
                </>
              ) : (
                <>
                  <button onClick={handleFollow} disabled={isBlocked} className={`px-6 py-1.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 ${isFollowing ? 'bg-india-saffron text-white' : 'bg-india-blue text-white'}`}>
                    {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
                  </button>
                  <button onClick={() => navigate(`/chat?id=${profile?._id}`)} className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-all">
                    <MessageCircle size={20} />
                  </button>
                  <button onClick={handleBlock} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${isBlocked ? 'bg-india-saffron text-white' : 'bg-slate-900 text-white'}`}>
                    {isBlocked ? 'UNBLOCK' : 'BLOCK'}
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex space-x-8 mb-6">
            <div><span className="font-bold">{posts.length}</span> posts</div>
            <div className="cursor-pointer" onClick={() => setShowFollowersList(true)}><span className="font-bold">{profile?.followers?.length || 0}</span> followers</div>
            <div className="cursor-pointer" onClick={() => setShowFollowingList(true)}><span className="font-bold">{profile?.following?.length || 0}</span> following</div>
          </div>

          <div className="text-sm font-bold">{profile?.fullName || profile?.username}</div>
          <div className="text-sm mt-1 whitespace-pre-wrap">{profile?.bio}</div>
        </div>
      </div>

      <div className="border-t border-slate-200 flex justify-center space-x-12">
        <button onClick={() => setActiveTab('posts')} className={`flex items-center space-x-2 py-4 border-t ${activeTab === 'posts' ? 'border-india-blue text-india-blue' : 'border-transparent text-slate-500'}`}>
          <Grid size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Posts</span>
        </button>
        {isOwnProfile && (
          <button onClick={() => setActiveTab('saved')} className={`flex items-center space-x-2 py-4 border-t ${activeTab === 'saved' ? 'border-india-blue text-india-blue' : 'border-transparent text-slate-500'}`}>
            <Bookmark size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Saved</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {(activeTab === 'posts' ? posts : savedPosts).map((post) => (
          <div key={post._id} onClick={() => navigate(post.mediaType === 'image' ? '/' : `/reels?id=${post._id}`)} className="relative aspect-square bg-white/5 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
            <img src={post.videoUrl} className="w-full h-full object-cover" alt="p" />
          </div>
        ))}
      </div>

      {/* Lists Modals */}
      <AnimatePresence>
        {(showFollowersList || showFollowingList) && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80" onClick={() => { setShowFollowersList(false); setShowFollowingList(false); }} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-sm bg-[#121212] rounded-xl border border-white/10 flex flex-col max-h-[70vh] overflow-hidden">
               <div className="p-4 border-b border-white/10 flex justify-between items-center text-white">
                  <span className="font-bold">{showFollowersList ? 'Followers' : 'Following'}</span>
                  <button onClick={() => { setShowFollowersList(false); setShowFollowingList(false); }}><X size={20} /></button>
               </div>
               <div className="flex-1 overflow-y-auto p-2">
                  {(showFollowersList ? profile?.followers : profile?.following)?.map((u) => (
                    <div key={u._id || u} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg group">
                       <div onClick={() => { navigate(`/profile/${u.username}`); setShowFollowersList(false); setShowFollowingList(false); }} className="flex items-center space-x-4 cursor-pointer flex-1">
                          <img src={u.profilePicture} className="w-10 h-10 rounded-full" alt="u" />
                          <span className="font-bold text-sm text-white">{u.username}</span>
                       </div>
                       {(u._id || u) !== currentUser?.id && (
                         <button 
                           onClick={async (e) => {
                             e.stopPropagation();
                             await api.post(`/api/users/follow/${u._id || u}`);
                             fetchProfile();
                           }}
                           className="bg-india-blue text-white px-3 py-1 rounded-md text-[10px] font-bold"
                         >
                           Action
                         </button>
                       )}
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
