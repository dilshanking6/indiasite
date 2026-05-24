import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlaySquare, MessageCircle, User, PlusSquare, Bell, Bot, Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const NamasteHeader = ({ onUploadClick }) => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { icon: <Home size={28} />, label: t('home'), path: '/' },
    { icon: <Search size={28} />, label: t('explore'), path: '/explore' },
    { icon: <PlusSquare size={28} />, label: t('post'), path: '#', onClick: onUploadClick },
    { icon: <PlaySquare size={28} />, label: t('reels'), path: '/reels' },
    { icon: <Bot size={28} />, label: t('ai'), path: '/ai' },
    { icon: <MessageCircle size={28} />, label: t('messages'), path: '/chat' },
    { icon: <User size={28} />, label: t('profile'), path: '/profile' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-16 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-black tracking-tighter text-black">
              INDIA<span className="text-india-blue">SITE</span>
            </span>
          </Link>

          <div className="flex items-center space-x-3">
            <Link to="/notifications" className="p-2.5 bg-gray-50 rounded-2xl hover:bg-india-saffron/10 hover:text-india-saffron transition-all">
              <Bell size={24} />
            </Link>
            <Link to="/settings" className="p-2.5 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all">
              <Settings size={24} />
            </Link>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-100 flex justify-around items-center h-16 sm:hidden px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          item.onClick ? (
            <button key={item.label} onClick={item.onClick} className="p-3 text-gray-500 active:scale-90 transition-all">
              {item.icon}
            </button>
          ) : (
            <Link key={item.path} to={item.path} className={`p-3 rounded-2xl transition-all ${location.pathname === item.path ? 'text-india-blue bg-india-blue/5' : 'text-gray-500'}`}>
              {item.icon}
            </Link>
          )
        ))}
      </nav>

      <nav className="fixed left-0 top-16 bottom-0 w-20 xl:w-64 hidden sm:flex flex-col border-r border-gray-100 p-4 space-y-4 bg-white z-40">
        {navItems.map((item) => (
          item.onClick ? (
            <button key={item.label} onClick={item.onClick} className="flex items-center space-x-4 p-4 rounded-2xl font-black text-gray-500 hover:bg-gray-50 transition-all w-full text-left">
              {item.icon}
              <span className="hidden xl:block text-sm">{item.label}</span>
            </button>
          ) : (
            <Link key={item.path} to={item.path} className={`flex items-center space-x-4 p-4 rounded-2xl font-black transition-all ${location.pathname === item.path ? 'text-india-blue bg-india-blue/5' : 'text-gray-500 hover:bg-gray-50'}`}>
              {item.icon}
              <span className="hidden xl:block text-sm">{item.label}</span>
            </Link>
          )
        ))}
      </nav>

      <div className="h-16 w-full" />
    </>
  );
};

export default NamasteHeader;
