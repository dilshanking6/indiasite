import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 min-h-screen bg-white">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center text-india-blue font-bold">
        <ArrowLeft size={20} className="mr-2" /> Back
      </button>
      
      <h1 className="text-4xl font-black mb-8 tracking-tighter">Privacy Policy</h1>
      
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p>At India Site, your privacy is our priority. We store your data securely in accordance with Indian data protection guidelines.</p>
        
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">1. Data Collection</h2>
          <p>We collect your Phone Number, Email, and Date of Birth strictly for verification and content personalization purposes. We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">2. Security</h2>
          <p>Your authentication is handled via Firebase, a world-class secure identity platform. We use high-level encryption to protect your account.</p>
        </section>

        <section>
          <p className="text-xs text-gray-400 mt-12 italic">Last Updated: May 22, 2026</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
