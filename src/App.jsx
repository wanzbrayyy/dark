
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import Forum from '@/pages/Forum';
import ForumDetail from '@/pages/ForumDetail';
import PostDetail from '@/pages/PostDetail';
import NewPost from '@/pages/NewPost';
import Profile from '@/pages/Profile';
import UserProfile from '@/pages/UserProfile';
import Messages from '@/pages/Messages';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';
import MaintenanceMode from '@/components/MaintenanceMode';
import RankUpNotification from '@/components/RankUpNotification';
import { Helmet } from 'react-helmet';
import UserTour from '@/components/UserTour';

function App() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const { language, translations } = useLanguage();
  const location = useLocation();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    document.documentElement.className = theme;
    document.documentElement.lang = language;
  }, [theme, language]);
  
  useEffect(() => {
      const isNewUser = localStorage.getItem('isNewUser');
      if (user && isNewUser === 'true') {
          setShowTour(true);
      }
  }, [user]);

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.removeItem('isNewUser');
  };

  const maintenanceMode = localStorage.getItem('maintenanceMode') === 'true';
  const maintenanceStart = localStorage.getItem('maintenanceStart');
  const maintenanceEnd = localStorage.getItem('maintenanceEnd');
  
  const now = new Date();
  const isMaintenanceActive = maintenanceMode && 
                              (!maintenanceStart || now >= new Date(maintenanceStart)) && 
                              (!maintenanceEnd || now < new Date(maintenanceEnd));


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center hacker-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-red-400">{translations.loading}</p>
        </div>
      </div>
    );
  }

  if (isMaintenanceActive && (!user || user.role !== 'admin')) {
    return <MaintenanceMode />;
  }

  return (
    <>
      <Helmet>
        <title>RedDrak ID - {translations.hackerForum}</title>
        <meta name="description" content={translations.forumDescription} />
        <html lang={language} />
      </Helmet>
      
      <div className="min-h-screen hacker-bg">
        {showTour && <UserTour onComplete={handleTourComplete} />}
        <RankUpNotification />
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
            
            <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="forum" element={<Forum />} />
              <Route path="forum/:forumId" element={<ForumDetail />} />
              <Route path="post/:postId" element={<PostDetail />} />
              <Route path="new-post" element={<NewPost />} />
              <Route path="profile" element={<Profile />} />
              <Route path="user/:username" element={<UserProfile />} />
              <Route path="messages" element={<Messages />} />
              {user?.role === 'admin' && (
                <Route path="admin" element={<AdminDashboard />} />
              )}
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
