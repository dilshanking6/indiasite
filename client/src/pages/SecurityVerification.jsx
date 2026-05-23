import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Smartphone, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SecurityVerification = () => {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-6 md:pt-16 pb-24 text-center">
      <button onClick={() => navigate('/settings')} className="flex items-center space-x-2 text-gray-400 font-black hover:text-black mb-10 transition-colors">
        <ArrowLeft size={24} /> <span className="uppercase tracking-widest text-sm">Back to Settings</span>
      </button>

      <div className="p-10 bg-india-blue/5 rounded-[3rem] border border-india-blue/10 mb-12">
         <ShieldCheck size={80} className="mx-auto text-india-blue mb-6" />
         <h1 className="text-4xl font-black tracking-tight mb-4 text-gray-900">2-Step Verification</h1>
         <p className="text-gray-500 font-bold max-w-sm mx-auto leading-relaxed">Add an extra layer of security to your Bharat Site account by requiring a code when you log in.</p>
      </div>

      <div className="space-y-6">
         <button 
           onClick={() => setIsEnabled(!isEnabled)}
           className={`w-full flex items-center justify-between p-8 rounded-[2rem] transition-all border-2 ${isEnabled ? 'bg-india-green/5 border-india-green' : 'bg-gray-50 border-transparent'}`}
         >
            <div className="flex items-center space-x-6 text-left">
               <div className={`p-4 rounded-2xl ${isEnabled ? 'bg-india-green text-white' : 'bg-white text-gray-400'}`}><Smartphone /></div>
               <div>
                  <p className="font-black text-lg">Text Message (SMS)</p>
                  <p className="text-xs text-gray-400 font-bold">Use a code sent to your phone</p>
               </div>
            </div>
            {isEnabled && <CheckCircle2 className="text-india-green" />}
         </button>

         <div className="p-8 rounded-[2rem] bg-gray-50 border-2 border-transparent flex items-center justify-between opacity-50 cursor-not-allowed">
            <div className="flex items-center space-x-6 text-left">
               <div className="p-4 rounded-2xl bg-white text-gray-400"><Mail /></div>
               <div>
                  <p className="font-black text-lg">Email Verification</p>
                  <p className="text-xs text-gray-400 font-bold">Recommended for better security</p>
               </div>
            </div>
            <Lock size={20} className="text-gray-300" />
         </div>
      </div>
    </div>
  );
};

export default SecurityVerification;
