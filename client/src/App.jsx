import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import NamasteHeader from './components/NamasteHeader';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import ReelsPage from './pages/ReelsPage';
import AIPage from './pages/AI';
import SettingsPage from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import IdeaSubmission from './pages/IdeaSubmission';
import TechSupport from './pages/TechSupport';
import UserGuides from './pages/UserGuides';
import SecurityVerification from './pages/SecurityVerification';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Notifications from './pages/Notifications';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import UploadReel from './components/reels/UploadReel';
import { useAuth } from './context/AuthContext';

function App() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, loading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('sleep_mode') === 'true');

  useEffect(() => {
    localStorage.setItem('sleep_mode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode-eye-protect');
    } else {
      document.documentElement.classList.remove('dark-mode-eye-protect');
    }
  }, [isDarkMode]);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-india-blue"></div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen transition-all duration-500">
        {user && <NamasteHeader onUploadClick={() => setIsUploadOpen(true)} />}
        
        {user && (
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="fixed top-4 right-4 z-[100] p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 hover:scale-110 transition-all active:scale-95"
            title="Sleep Mode (Eye Protect)"
          >
            {isDarkMode ? <Sun className="text-india-saffron" size={20} /> : <Moon className="text-india-blue" size={20} />}
          </button>
        )}
        
        <main className={`container mx-auto pb-24 sm:pb-8 pt-4 sm:pt-2 ${!user ? 'pt-0' : ''}`}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            
            <Route path="/" element={user ? <Home key={refreshKey} /> : <Navigate to="/login" />} />
            <Route path="/explore" element={user ? <Explore /> : <Navigate to="/login" />} />
            <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
            <Route path="/ai" element={user ? <AIPage /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} />
            <Route path="/security/verification" element={user ? <SecurityVerification /> : <Navigate to="/login" />} />
            
            <Route path="/help" element={user ? <HelpCenter /> : <Navigate to="/login" />} />
            <Route path="/help/idea" element={user ? <IdeaSubmission /> : <Navigate to="/login" />} />
            <Route path="/help/report" element={user ? <TechSupport /> : <Navigate to="/login" />} />
            <Route path="/help/guides" element={user ? <UserGuides /> : <Navigate to="/login" />} />
            
            <Route path="/admin/ideas" element={user ? <AdminDashboard /> : <Navigate to="/login" />} />
            
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/profile/:username" element={user ? <Profile /> : <Navigate to="/login" />} />
            
            <Route path="/reels" element={user ? <ReelsPage key={refreshKey + 1} /> : <Navigate to="/login" />} />
            <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>

        <UploadReel 
          isOpen={isUploadOpen} 
          onClose={() => setIsUploadOpen(false)} 
          onUploadSuccess={handleUploadSuccess}
        />
      </div>
    </Router>
  );
}

export default App;
