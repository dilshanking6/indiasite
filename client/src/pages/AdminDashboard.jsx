import React, { useState, useEffect } from 'react';
import api from '../api';
import { LayoutGrid, PlayCircle, Loader2, Sparkles, ChevronRight, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await api.get('/api/ideas/all');
      setIdeas(res.data);
    } catch (err) {
      console.error('Fetch ideas failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-india-blue" size={40} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:pt-10 pb-24">
      <div className="flex items-center justify-between mb-12">
        <div>
           <h1 className="text-4xl font-black tracking-tight flex items-center space-x-3">
              <Sparkles className="text-india-saffron" size={36} />
              <span>Community Ideas</span>
           </h1>
           <p className="text-gray-400 font-bold mt-2">Manage and review suggestions from India Site users</p>
        </div>
        <div className="bg-india-blue text-white px-6 py-2 rounded-full font-black text-sm">{ideas.length} Ideas</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ideas.length > 0 ? (
          ideas.map((idea) => (
            <motion.div 
              key={idea._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden group"
            >
              <div className="flex items-center space-x-4 mb-6">
                <img src={idea.user?.profilePicture} className="w-12 h-12 rounded-full border-2 border-white shadow-md" alt="u" />
                <div>
                   <p className="font-black text-lg">@{idea.user?.username}</p>
                   <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest space-x-2">
                      <Clock size={12} />
                      <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                   </div>
                </div>
              </div>
              <p className="text-gray-700 font-bold leading-relaxed mb-8 italic">"{idea.text}"</p>
              <div className="flex space-x-3">
                 <button className="flex-1 bg-india-blue/5 text-india-blue font-black py-3 rounded-2xl text-xs hover:bg-india-blue hover:text-white transition-all">Mark as Reviewed</button>
                 <button className="flex-1 bg-india-green/5 text-india-green font-black py-3 rounded-2xl text-xs hover:bg-india-green hover:text-white transition-all">Implement Now</button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 py-32 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
             <Lightbulb className="mx-auto text-gray-200 mb-4" size={64} />
             <p className="text-gray-400 font-black tracking-widest uppercase text-sm">No ideas submitted yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
