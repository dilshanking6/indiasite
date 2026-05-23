import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Loader2, Sparkles, Settings2, X, BrainCircuit } from 'lucide-react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const AIPage = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Namaste! I am India Site AI. How can I assist you today?' }
  ]);
  const [input, setMessagesInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  
  const [aiContext, setAiContext] = useState(
    "You are 'India Site AI', the official AI for the India Site social network. Personality: Grounded in Bharat vibes, helpful, and respectful. Language: Mix of English and Hindi (Hinglish). If users ask about other platforms, focus on India Site features."
  );

  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setMessagesInput('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/ai-chat', { 
        message: input,
        context: aiContext 
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[82vh] max-w-4xl mx-auto bg-white md:rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 relative">
      {/* AI Header */}
      <div className="p-8 bg-gradient-to-r from-india-blue to-indigo-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-5">
           <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20">
              <Bot size={32} />
           </div>
           <div>
              <h2 className="font-black text-2xl tracking-tighter">Bharat AI</h2>
              <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Powered by IndiaSite</span>
              </div>
           </div>
        </div>
        <button onClick={() => setIsTraining(true)} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/10">
           <Settings2 size={24} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/20">
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-sm ${msg.role === 'user' ? 'bg-india-blue text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
              <p className="text-sm font-bold leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white p-5 rounded-[2.5rem] rounded-tl-none border border-gray-100 flex items-center space-x-3">
                <Loader2 size={16} className="animate-spin text-india-blue" />
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">AI is thinking...</span>
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} className="p-8 bg-white border-t border-gray-50 flex items-center space-x-5">
        <input 
          type="text" value={input} onChange={(e) => setMessagesInput(e.target.value)}
          placeholder="Ask Bharat AI..."
          className="flex-1 bg-gray-50 border-none rounded-[2rem] px-8 py-5 text-sm font-bold focus:ring-2 focus:ring-india-blue/10 outline-none"
        />
        <button type="submit" disabled={!input.trim() || loading} className={`p-5 rounded-[1.5rem] transition-all shadow-xl ${input.trim() ? 'bg-india-blue text-white shadow-blue-100' : 'bg-gray-100 text-gray-400'}`}>
          <Send size={26} />
        </button>
      </form>

      <AnimatePresence>
        {isTraining && (
          <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                   <span className="font-black text-2xl tracking-tighter">AI Training Lab</span>
                   <button onClick={() => setIsTraining(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={28} /></button>
                </div>
                <div className="p-10 space-y-8">
                   <textarea 
                     className="w-full bg-gray-50 border-none rounded-[2rem] p-8 text-sm font-bold h-64 focus:ring-2 focus:ring-india-saffron outline-none resize-none"
                     placeholder="Define AI behavior..."
                     value={aiContext}
                     onChange={(e) => setAiContext(e.target.value)}
                   />
                   <button onClick={() => { alert('AI Updated!'); setIsTraining(false); }} className="w-full bg-india-saffron text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-saffron-100 transition-all text-lg">Save Changes</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIPage;
