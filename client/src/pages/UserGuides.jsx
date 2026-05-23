import React from 'react';
import { ArrowLeft, BookOpen, PlayCircle, ShieldCheck, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserGuides = () => {
  const navigate = useNavigate();
  const guides = [
    { title: 'Uploading Reels', steps: ['Tap the + icon', 'Select "Reel"', 'Pick a video (max 2 mins)', 'Add a caption and Share!'] },
    { title: 'Direct Messaging', steps: ['Go to a user profile', 'Tap the Message icon', 'Type your message and Send'] },
    { title: 'Training Your AI', steps: ['Go to the AI tab', 'Tap the Settings icon', 'Describe how the AI should talk', 'Save Changes'] }
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 md:pt-16 pb-24">
      <button onClick={() => navigate('/help')} className="flex items-center space-x-2 text-gray-400 font-black hover:text-black mb-10 transition-colors">
        <ArrowLeft size={24} /> <span className="uppercase tracking-widest text-sm">Back</span>
      </button>
      <h1 className="text-4xl font-black mb-8 tracking-tighter">Bharat Site Guides</h1>
      <div className="space-y-8">
        {guides.map((g, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl">
            <h3 className="text-xl font-black text-india-blue mb-4 flex items-center space-x-2">
              <BookOpen size={20} /> <span>{g.title}</span>
            </h3>
            <ul className="space-y-3">
              {g.steps.map((s, si) => (
                <li key={si} className="flex items-center space-x-3 text-gray-600 font-bold">
                  <span className="w-6 h-6 bg-india-saffron/10 text-india-saffron rounded-full flex items-center justify-center text-xs">{si + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserGuides;
