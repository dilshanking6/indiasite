import React, { useState } from 'react';
import api from '../api';
import { Lightbulb, ArrowLeft, Loader2, Sparkles, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const IdeaSubmission = () => {
  const [idea, setIdea] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmitIdea = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return navigate('/login');
      }
      
      await api.post('/api/ideas/submit', { text: idea });
      alert('Victory! Your idea has been sent to Bharat Site headquarters.');
      setIdea('');
      navigate('/help');
    } catch (err) {
      console.error('Submission error:', err.response?.data || err.message);
      alert('Submission failed: ' + (err.response?.data?.message || 'Check your connection'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:pt-16 pb-24">
      <button onClick={() => navigate('/help')} className="flex items-center space-x-2 text-gray-400 font-black hover:text-black mb-10 transition-colors">
        <ArrowLeft size={24} /> <span className="uppercase tracking-widest text-sm">Back to Support</span>
      </button>

      <div className="space-y-6 mb-12">
        <div className="flex items-center space-x-4">
           <div className="p-4 bg-india-blue rounded-3xl shadow-xl shadow-blue-100 text-white"><Sparkles size={32} /></div>
           <h1 className="text-4xl font-black tracking-tight text-gray-900">Share Your Vision</h1>
        </div>
        <p className="text-gray-500 font-bold text-lg leading-relaxed max-w-2xl">
          Do you have a feature in mind? Describe it below. We build Bharat Site based on YOUR suggestions.
        </p>
      </div>

      <form onSubmit={handleSubmitIdea} className="space-y-8">
        <div className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-india-saffron via-white to-india-green rounded-[3rem] blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
           <textarea 
             className="relative w-full h-80 bg-white border-none rounded-[2.5rem] p-10 text-xl font-bold focus:ring-0 outline-none shadow-2xl resize-none"
             placeholder="I think India Site should have..."
             value={idea}
             onChange={(e) => setIdea(e.target.value)}
             required
           />
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-india-blue text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-200 flex items-center justify-center space-x-4 hover:scale-[1.02] active:scale-95 transition-all text-2xl"
        >
          {submitting ? <Loader2 className="animate-spin" size={28} /> : <><Rocket size={28} /> <span>Submit to Bharat Team</span></>}
        </button>
      </form>
    </div>
  );
};

export default IdeaSubmission;
