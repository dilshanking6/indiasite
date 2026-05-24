import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Loader2, Sparkles, Settings2, X } from 'lucide-react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const AIPage = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Namaste! I am India Site AI. How can I help you today?' }
  ]);
  const [input, setMessagesInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [aiContext, setAiContext] = useState(localStorage.getItem('ai_context') || `You are 'Bharat AI', the official AI soul of India Site. 
Personality: Helpful, wise, friendly, like a 'Bade Bhaiyya' or 'Badi Didi'. Use a mix of English and Hindi (Hinglish).
Identity: Created by India Site team to help the Bharat community.

Interaction Rules:
1. GREETINGS: If user says 'Hi', 'Hello', 'Namaste', reply with a warm Bharat-style greeting (e.g., 'Namaste Bhai! Kaise hain aap? Mera naam Bharat AI hai.').
2. WHO ARE YOU: If asked 'Who are you?' or 'Tum kaun ho?', reply: 'Main Bharat AI hoon, India Site ka digital sathi. Main yahan Bharat ke logon ki madad karne ke liye hoon.'
3. KNOWLEDGE: You are an expert in:
   - Indian History (Ashoka, Mughals, Marathas, Independence struggle, etc.)
   - Social Issues in India (Education, Technology, Rural development)
   - Culture & Festivals (Diwali, Eid, Holi, Pongal, etc.)
   - Modern India (ISRO, Digital India, Startups)
4. TONE: Always be respectful, patriotic, and positive about Bharat. 

If someone asks you to 'train' or 'learn', guide them to use the Training Lab icon.`);

  const scrollRef = useRef();
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.toLowerCase();
    setMessagesInput('');
    setLoading(true);

    // Simulated Local AI Logic (No API call needed for common Bharat questions)
    setTimeout(() => {
      let reply = "Mera Bharat servers thoda slow hain, par main koshish kar raha hoon samajhne ki. Aap aur detail mein bataiye?";

      if (currentInput.includes('hi') || currentInput.includes('hello') || currentInput.includes('namaste')) {
        reply = "Namaste Bhai! Kaise hain aap? Mera naam Bharat AI hai, India Site ka digital sathi. Main aapki kya madad kar sakta hoon?";
      } else if (currentInput.includes('tum kaun ho') || currentInput.includes('who are you')) {
        reply = "Main Bharat AI hoon, jise India Site team ne banaya hai. Mera kaam Bharat ke logon ko ek dusre se jodna aur jaankari dena hai.";
      } else if (currentInput.includes('history') || currentInput.includes('itihaas')) {
        reply = "Bharat ka itihaas bahut mahan hai! Ashoka ki shanti se lekar Maharana Pratap ki veerta tak, aur Gandhi ji ke satyagrah tak—humein apne itihaas par garv hona chahiye.";
      } else if (currentInput.includes('social') || currentInput.includes('community')) {
        reply = "India Site ek aisa platform hai jahan har Bharatvasi apni awaaz utha sakta hai aur apne doston ke sath jude reh sakta hai.";
      } else if (aiContext.length > 500) {
        reply = "Ji, mene aapki nayi 'Training' samajh li hai. Ab main isi context mein baat karunga.";
      }

      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[82vh] max-w-4xl mx-auto bg-white md:rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
      <div className="p-8 bg-india-blue text-white flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <Bot size={32} />
           <div>
              <h2 className="font-black text-2xl">Bharat AI</h2>
              <span className="text-[10px] uppercase font-black opacity-60">Powered by IndiaSite</span>
           </div>
        </div>
        <button onClick={() => setIsTraining(true)} className="p-3 bg-white/10 rounded-xl"><Settings2 size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-5 rounded-[2rem] shadow-sm font-bold text-sm ${msg.role === 'user' ? 'bg-india-blue text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <Loader2 className="animate-spin text-india-blue mx-auto" />}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} className="p-8 bg-white border-t border-gray-50 flex items-center space-x-4">
        <input type="text" value={input} onChange={(e) => setMessagesInput(e.target.value)} placeholder="Ask Bharat AI..." className="flex-1 bg-gray-50 border-none rounded-[2rem] px-8 py-5 font-bold" />
        <button type="submit" className="p-5 bg-india-blue text-white rounded-[1.5rem] shadow-xl"><Send size={26} /></button>
      </form>

      <AnimatePresence>
        {isTraining && (
          <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
             <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl relative">
                <button onClick={() => setIsTraining(false)} className="absolute top-6 right-6 text-black"><X /></button>
                <h3 className="font-black text-2xl mb-6">AI Training Lab</h3>
                <textarea className="w-full h-64 bg-gray-50 border-none rounded-[2rem] p-8 font-bold mb-6" value={aiContext} onChange={(e) => setAiContext(e.target.value)} />
                <button onClick={() => { localStorage.setItem('ai_context', aiContext); setIsTraining(false); }} className="w-full bg-india-saffron text-white font-black py-5 rounded-[2rem]">Save Knowledge</button>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIPage;
