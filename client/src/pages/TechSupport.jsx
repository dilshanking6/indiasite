import React, { useState } from 'react';
import { ArrowLeft, Headphones, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TechSupport = () => {
  const navigate = useNavigate();
  const [issue, setIssue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      alert('Issue reported! Our technical team will investigate this within 24 hours.');
      setIssue('');
      setSubmitting(false);
      navigate('/help');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:pt-16 pb-24">
      <button onClick={() => navigate('/help')} className="flex items-center space-x-2 text-gray-400 font-black hover:text-black mb-10 transition-colors">
        <ArrowLeft size={24} /> <span className="uppercase tracking-widest text-sm">Back</span>
      </button>
      <div className="flex items-center space-x-4 mb-8">
         <div className="p-4 bg-purple-600 text-white rounded-3xl shadow-lg"><Headphones size={32} /></div>
         <h1 className="text-4xl font-black tracking-tighter">Technical Support</h1>
      </div>
      <p className="text-gray-500 font-bold mb-10">Facing glitches or bugs? Let us know the details and we will fix it for you.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea 
          className="w-full h-64 bg-gray-50 border-none rounded-[2.5rem] p-10 text-lg font-bold focus:ring-2 focus:ring-purple-600/20 outline-none resize-none shadow-inner"
          placeholder="Describe the technical problem..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          required
        />
        <button type="submit" disabled={submitting} className="w-full bg-purple-600 text-white font-black py-6 rounded-[2rem] shadow-xl flex items-center justify-center space-x-4 hover:opacity-90 active:scale-95 transition-all text-xl">
          {submitting ? <Loader2 className="animate-spin" /> : <><Send size={24} /> <span>Submit Ticket</span></>}
        </button>
      </form>
    </div>
  );
};

export default TechSupport;
