import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Send, Search, User, MoreVertical, Phone, Video, Smile, Paperclip, MessageCircle, ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const targetUser = queryParams.get('u');

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (targetUser) {
      setActiveChat({ 
        username: targetUser, 
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser}` 
      });
    }
  }, [targetUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const newMsg = { 
      text: inputText, 
      sender: user?.id, 
      timestamp: new Date(),
      id: Date.now() 
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  if (!user) return <div className="p-20 text-center font-black">Loading Bharat Messages...</div>;

  return (
    <div className="flex h-[88vh] bg-white md:rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100 max-w-6xl mx-auto md:mt-4">
      {/* Chat List Sidebar */}
      <div className={`w-full md:w-96 border-r border-gray-50 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
           <h2 className="text-3xl font-black tracking-tighter">{user?.username}</h2>
           <div className="p-2 bg-gray-50 rounded-xl"><MoreVertical size={20} className="text-gray-400" /></div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-gray-50/20">
           {chatList.length === 0 && !activeChat ? (
             <div className="p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mx-auto border border-gray-100">
                   <MessageCircle size={32} className="text-gray-200" />
                </div>
                <div className="space-y-2">
                   <p className="text-sm font-black uppercase tracking-widest text-gray-300">No active chats</p>
                   <p className="text-xs text-gray-400 font-bold">Start a conversation from a user's profile.</p>
                </div>
             </div>
           ) : (
             <div className="divide-y divide-gray-50">
                {activeChat && (
                  <div className="p-6 bg-india-blue/5 flex items-center space-x-4 border-l-4 border-india-blue">
                     <img src={activeChat.profilePicture} className="w-14 h-14 rounded-[1.5rem] border-2 border-white shadow-md" alt="p" />
                     <div className="flex-1">
                        <p className="font-black text-lg text-gray-800">{activeChat.username}</p>
                        <p className="text-[10px] text-india-blue font-black uppercase tracking-widest animate-pulse">Active Now</p>
                     </div>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>

      {/* Message Area */}
      <div className={`flex-1 flex flex-col bg-gray-50/10 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center px-10">
               <div className="flex items-center space-x-4">
                  <button onClick={() => navigate('/chat')} className="md:hidden p-2 -ml-4 mr-2 hover:bg-gray-50 rounded-full"><ChevronLeft size={24} /></button>
                  <img src={activeChat.profilePicture} className="w-11 h-11 rounded-2xl shadow-sm" alt="p" />
                  <div>
                     <p className="font-black text-xl tracking-tight">{activeChat.username}</p>
                     <p className="text-[10px] font-black text-india-green uppercase tracking-widest">Online</p>
                  </div>
               </div>
               <div className="flex items-center space-x-6 text-gray-300">
                  <Phone size={24} className="hover:text-india-blue transition-colors cursor-pointer" />
                  <Video size={24} className="hover:text-india-blue transition-colors cursor-pointer" />
                  <MoreVertical size={24} className="cursor-pointer" />
               </div>
            </div>

            <div className="flex-1 p-10 overflow-y-auto space-y-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
               {messages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                    <Sparkles size={48} className="text-gray-200" />
                    <p className="font-black uppercase tracking-widest text-xs">Start your Bharat conversation</p>
                 </div>
               ) : (
                 messages.map((m) => (
                   <motion.div key={m.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex ${m.sender === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-5 rounded-[2.5rem] text-sm font-bold max-w-[75%] shadow-xl ${m.sender === user?.id ? 'bg-india-blue text-white rounded-tr-none shadow-blue-100' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-gray-100'}`}>
                         {m.text}
                         <p className={`text-[9px] mt-2 font-black uppercase tracking-widest ${m.sender === user?.id ? 'text-white/40' : 'text-gray-300'}`}>
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                      </div>
                   </motion.div>
                 ))
               )}
            </div>

            <form onSubmit={handleSendMessage} className="p-8 bg-white border-t border-gray-100 flex items-center space-x-5 mx-10 mb-10 rounded-[3rem] shadow-2xl shadow-gray-200/50">
               <Smile className="text-gray-300 hover:text-india-saffron cursor-pointer transition-colors" />
               <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type a message to your friend..." className="flex-1 bg-transparent border-none outline-none font-bold text-sm" />
               <Paperclip className="text-gray-300 cursor-pointer" />
               <button type="submit" disabled={!inputText.trim()} className={`p-4 rounded-2xl transition-all shadow-lg ${inputText.trim() ? 'bg-india-blue text-white shadow-blue-200 scale-105' : 'bg-gray-100 text-gray-300'}`}>
                  <Send size={22} />
               </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 bg-white">
             <div className="relative">
                <div className="absolute inset-0 bg-india-blue/5 rounded-full animate-ping scale-150 opacity-20" />
                <div className="p-12 bg-white rounded-full shadow-2xl shadow-gray-200 border border-gray-50 relative z-10">
                   <MessageCircle size={80} className="text-india-blue/10" />
                </div>
             </div>
             <div className="text-center space-y-3">
                <h3 className="text-4xl font-black tracking-tighter">Your Messages</h3>
                <p className="text-sm text-gray-400 font-bold max-w-xs mx-auto leading-relaxed">Connect with people in your Bharat community through private chats.</p>
             </div>
             <button className="bg-india-blue text-white px-12 py-4 rounded-[1.5rem] font-black shadow-2xl shadow-blue-100 hover:scale-105 transition-all active:scale-95">Send New Message</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Add some nice sparkles icon from lucide
import { Sparkles } from 'lucide-react';

export default Chat;
