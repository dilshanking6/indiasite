import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 min-h-screen bg-white">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center text-india-blue font-bold">
        <ArrowLeft size={20} className="mr-2" /> Back
      </button>
      
      <h1 className="text-4xl font-black mb-8 tracking-tighter">Terms of Service</h1>
      
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing India Site, you agree to follow all local and national laws of Bharat. Our platform is dedicated to promoting a positive and secure Indian social experience.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">2. User Conduct</h2>
          <p>Users must not post content that is hateful, illegal, or violates the sovereignty of India. We maintain a zero-tolerance policy for fake accounts and misinformation.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">3. Age Requirements</h2>
          <p>You must be at least 13 years old to use this service. Our algorithm filters content based on your Date of Birth to ensure a safe environment for all ages.</p>
        </section>

        <section>
          <p className="text-xs text-gray-400 mt-12 italic">Last Updated: May 22, 2026</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
