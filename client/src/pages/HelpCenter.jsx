import React from 'react';
import api from '../api';
import { HelpCircle, ChevronRight, Lightbulb, Shield, AlertCircle, BookOpen, Compass, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HelpCenter = () => {
  const navigate = useNavigate();

  const helpCards = [
    { title: 'Describe Your Idea', desc: 'Tell us how to improve Bharat Site', icon: <Lightbulb />, path: '/help/idea', color: 'bg-india-blue' },
    { title: 'Privacy & Safety', desc: 'Manage blocks and visibility', icon: <Shield />, path: '/settings', color: 'bg-india-saffron' },
    { title: 'User Guides', desc: 'Learn how to use features', icon: <BookOpen />, path: '/help/guides', color: 'bg-india-green' },
    { title: 'Technical Support', desc: 'Report bugs and glitches', icon: <Headphones />, path: '/help/report', color: 'bg-purple-600' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 md:pt-16 pb-32">
      <div className="text-center space-y-4 mb-20">
         <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-black uppercase">Help Center</h1>
         <p className="text-gray-400 font-bold text-xl tracking-tight">How can we empower you today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
         {helpCards.map((card, i) => (
           <motion.button 
             key={i} 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
             onClick={() => navigate(card.path)}
             className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-left group"
           >
              <div className="flex items-center space-x-6">
                 <div className={`p-5 ${card.color} text-white rounded-3xl shadow-lg group-hover:rotate-12 transition-transform duration-500`}>{card.icon}</div>
                 <div>
                    <p className="font-black text-xl text-gray-800">{card.title}</p>
                    <p className="text-sm text-gray-400 font-bold">{card.desc}</p>
                 </div>
              </div>
              <ChevronRight size={24} className="text-gray-300 group-hover:text-black group-hover:translate-x-2 transition-all" />
           </motion.button>
         ))}
      </div>

      <div className="bg-gray-50 rounded-[3rem] p-12 text-center border border-gray-100">
         <AlertCircle size={40} className="mx-auto text-india-blue mb-4" />
         <h3 className="text-2xl font-black mb-2 tracking-tight text-gray-800">Need more help?</h3>
         <p className="text-gray-500 font-bold max-w-sm mx-auto leading-relaxed">Our Bharat Support Team is active 24/7 to ensure your digital safety and experience.</p>
      </div>
    </div>
  );
};

export default HelpCenter;
