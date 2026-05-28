import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Send, Search, User, MoreVertical, Phone, Video, Smile, Paperclip, MessageCircle, ChevronLeft, Edit2, Check, X, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const targetUserId = queryParams.get('id');

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  useEffect(() => {
    if (targetUserId) {
      initChatWithUser(targetUserId);
    }
  }, [targetUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatList = async () => {
    try {
      // Original API might have been /api/chat/rooms or similar
      // Since I reverted the backend, I should check what's available.
      // If I reverted, there might be NO chat routes!
      const res = await api.get('/api/chat/rooms').catch(() => ({ data: [] }));
      setChatList(res.data);
    } catch (err) {
      console.error('Failed to fetch chat list:', err);
    }
  };

  const initChatWithUser = async (userId) => {
    try {
      const res = await api.post('/api/chat/room', { targetUserId: userId }).catch(() => null);
      if (res) {
        setActiveChat(res.data);
        fetchMessages(res.data._id);
      }
    } catch (err) {
      console.error('Failed to init chat:', err);
    }
  };

  const fetchMessages = async (roomId) => {
    if (!roomId) return;
    try {
      const res = await api.get(`/api/chat/messages/${roomId}`).catch(() => ({ data: [] }));
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;
    
    try {
      const res = await api.post('/api/chat/send', {
        roomId: activeChat._id,
        text: inputText
      }).catch(() => null);
      
      if (res) {
        setMessages([...messages, res.data]);
        setInputText('');
      }
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  if (!user) return <div className="p-20 text-center text-white font-bold">Loading...</div>;

  return (
    <div className="flex h-[85vh] bg-[#121212] border border-white/10 rounded-xl overflow-hidden max-w-6xl mx-auto mt-4 text-white">
      {/* Sidebar */}
      <div className={`w-full md:w-80 border-r border-white/10 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
           <h2 className="text-xl font-bold">{user?.username}</h2>
           <Edit2 size={20} />
        </div>
        <div className="flex-1 overflow-y-auto">
           {chatList.length === 0 ? (
             <div className="p-10 text-center opacity-40">
                <MessageCircle size={40} className="mx-auto mb-2" />
                <p className="text-sm">No messages yet</p>
             </div>
           ) : (
             chatList.map(chat => (
               <div key={chat._id} onClick={() => { setActiveChat(chat); fetchMessages(chat._id); }} className="p-4 hover:bg-white/5 cursor-pointer transition-all">
                  <div className="flex items-center space-x-3">
                     <img src={chat.participants?.find(p => p._id !== user.id)?.profilePicture} className="w-12 h-12 rounded-full" alt="p" />
                     <span className="font-bold">{chat.participants?.find(p => p._id !== user.id)?.username}</span>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>

      {/* Main Chat */}
      <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            <div className="p-4 border-b border-white/10 flex items-center space-x-4">
               <button onClick={() => setActiveChat(null)} className="md:hidden"><ChevronLeft /></button>
               <img src={activeChat.participants?.find(p => p._id !== user.id)?.profilePicture} className="w-8 h-8 rounded-full" alt="p" />
               <span className="font-bold">{activeChat.participants?.find(p => p._id !== user.id)?.username}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.sender === user.id || m.sender?._id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[70%] ${m.sender === user.id || m.sender?._id === user.id ? 'bg-india-blue' : 'bg-white/10'}`}>
                       <p className="text-sm">{m.text}</p>
                    </div>
                 </div>
               ))}
               <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex items-center space-x-2">
               <input 
                 type="text" 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 placeholder="Message..." 
                 className="flex-1 bg-transparent border border-white/20 rounded-full px-4 py-2 text-sm outline-none focus:border-white/40"
               />
               <button type="submit" disabled={!inputText.trim()} className="text-india-blue font-bold px-2">Send</button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-50">
             <div className="p-6 border-2 border-white rounded-full"><MessageCircle size={60} /></div>
             <h3 className="text-2xl font-bold">Your Messages</h3>
             <p className="text-sm">Send private photos and messages to a friend.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
