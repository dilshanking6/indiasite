import React, { useState } from 'react';
import { User, Bell, Shield, HelpCircle, LogOut, ChevronRight, Globe, Lock, UserX, Key, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage = () => {
  const { logout, user } = useAuth();
  const [activeModal, setActiveSection] = useState(null); // 'password', 'privacy', 'language', 'blocked'

  const sections = [
    { title: 'Change Password', icon: <Key />, modal: 'password', color: 'text-blue-500' },
    { title: 'Account Privacy', icon: <Lock />, modal: 'privacy', color: 'text-india-saffron' },
    { title: 'Blocked Accounts', icon: <UserX />, modal: 'blocked', color: 'text-red-500' },
    { title: 'Help Center', icon: <HelpCircle />, link: '/help', color: 'text-purple-500' },
    { title: 'Language', icon: <Globe />, modal: 'language', desc: 'English (US)', color: 'text-gray-500' },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 md:pt-10 min-h-screen pb-24">
      <div className="flex items-center space-x-6 mb-10">
         <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-all"><ChevronRight className="rotate-180" size={28} /></Link>
         <h1 className="text-3xl font-black tracking-tight">Settings</h1>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden mb-8">
        <div className="p-8 border-b border-gray-50 flex items-center space-x-4 bg-gray-50/30">
           <img src={user?.profilePicture} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" alt="p" />
           <div>
              <p className="font-black text-lg">{user?.username}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Personal Account</p>
           </div>
        </div>

        <div className="divide-y divide-gray-50">
           {sections.map((s, i) => (
             s.link ? (
               <Link key={i} to={s.link} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                     <div className={`p-3 bg-gray-50 rounded-2xl ${s.color}`}>{s.icon}</div>
                     <p className="font-black text-sm">{s.title}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
               </Link>
             ) : (
               <button key={i} onClick={() => setActiveSection(s.modal)} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-4">
                     <div className={`p-3 bg-gray-50 rounded-2xl ${s.color}`}>{s.icon}</div>
                     <div>
                        <p className="font-black text-sm">{s.title}</p>
                        {s.desc && <p className="text-[10px] text-gray-400 font-bold">{s.desc}</p>}
                     </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
               </button>
             )
           ))}
        </div>
      </div>

      <button onClick={logout} className="w-full bg-red-50 text-red-500 font-black py-5 rounded-[1.5rem] flex items-center justify-center space-x-3 hover:bg-red-100 transition-all active:scale-95 mb-8">
        <LogOut size={20} />
        <span>Log Out</span>
      </button>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
             <div className="absolute inset-0 bg-black/40" onClick={() => setActiveSection(null)} />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                   <span className="font-black text-2xl tracking-tighter capitalize">{activeModal.replace('-', ' ')}</span>
                   <button onClick={() => setActiveSection(null)} className="p-2 hover:bg-gray-100 rounded-full"><Eye className="rotate-45" size={24} /></button>
                </div>

                {activeModal === 'password' && (
                  <form className="space-y-6">
                     <input type="password" placeholder="Current Password" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" />
                     <input type="password" placeholder="New Password" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" />
                     <button className="w-full bg-india-blue text-white font-black py-4 rounded-2xl shadow-lg">Change Password</button>
                  </form>
                )}

                {activeModal === 'privacy' && (
                  <div className="space-y-8">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="font-black text-sm text-gray-800">Private Account</p>
                           <p className="text-xs text-gray-400 font-bold">Only people you approve can see your photos and videos.</p>
                        </div>
                        <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1" /></div>
                     </div>
                  </div>
                )}

                {activeModal === 'language' && (
                  <div className="space-y-4">
                     {['English', 'Hindi', 'Marathi', 'Bengali', 'Tamil'].map(l => (
                       <button key={l} className="w-full text-left p-4 rounded-2xl hover:bg-gray-50 font-bold flex justify-between items-center group">
                          <span>{l}</span>
                          {l === 'English' && <div className="w-2 h-2 bg-india-blue rounded-full" />}
                       </button>
                     ))}
                  </div>
                )}

                {activeModal === 'blocked' && (
                  <div className="text-center py-10">
                     <UserX className="mx-auto text-gray-100 mb-4" size={64} />
                     <p className="text-gray-400 font-black tracking-widest uppercase text-sm">No blocked users</p>
                  </div>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-10 text-center">
         <h1 className="text-xl font-black tracking-tighter text-gray-300">INDIA<span className="text-india-blue/30">SITE</span></h1>
      </div>
    </div>
  );
};

export default SettingsPage;
