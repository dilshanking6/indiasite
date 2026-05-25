import React, { useState, createContext, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'English');

  const translations = {
    English: {
      welcome: "Welcome to India Site",
      home: "Home",
      explore: "Explore",
      reels: "Reels",
      messages: "Messages",
      ai: "AI Chat",
      profile: "Profile",
      settings: "Settings",
      logout: "Log Out",
      post: "Post",
      reel: "Reel",
      loading: "Loading Content...",
      no_content: "No content found yet",
      create_new: "Create New Post"
    },
    Hindi: {
      welcome: "इंडिया साइट में आपका स्वागत है",
      home: "होम",
      explore: "एक्सप्लोर",
      reels: "रील्स",
      messages: "मैसेज",
      ai: "AI चैट",
      profile: "प्रोफाइल",
      settings: "सेटिंग्स",
      logout: "लॉग आउट",
      post: "पोस्ट",
      reel: "रील",
      loading: "कंटेंट लोड हो रहा है...",
      no_content: "अभी कोई कंटेंट नहीं मिला",
      create_new: "नयी पोस्ट बनाएं"
    },
    Marathi: {
      welcome: "इंडिया साइटवर आपले स्वागत आहे",
      home: "होम",
      explore: "एक्सप्लोर",
      reels: "रील्स",
      messages: "संदेश",
      ai: "AI चॅट",
      profile: "प्रोफाइल",
      settings: "सेटिंग्ज",
      logout: "लॉग आउट",
      post: "पोस्ट",
      reel: "रील",
      loading: "कंटेंट लोड होत आहे...",
      no_content: "अद्याप कोणताही कंटेंट सापडला नाही",
      create_new: "नवीन पोस्ट तयार करा"
    }
  };

  const t = (key) => translations[lang][key] || key;

  const changeLanguage = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
