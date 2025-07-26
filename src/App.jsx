import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/pages/LandingPage';
import ForumHome from '@/pages/ForumHome';
import PostDetail from '@/pages/PostDetail';
import UserProfile from '@/pages/UserProfile';
import AuthPage from '@/pages/AuthPage';
import MaintenancePage from '@/pages/MaintenancePage';
import AdminDashboard from '@/pages/AdminDashboard';
import DepositPage from '@/pages/DepositPage';
import WithdrawPage from '@/pages/WithdrawPage';
import NewPostPage from '@/pages/NewPostPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import ActivityHistoryPage from '@/pages/ActivityHistoryPage';
import NotificationsPage from '@/pages/NotificationsPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { ForumProvider } from '@/contexts/ForumContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SocketProvider } from '@/contexts/SocketContext';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';

function AppContent() {
  const { user } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/dashboard/wanzadmin" element={<AdminDashboard />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        
        <Route path="*" element={<MainAppRoutes />} />
      </Routes>
      {user && <BottomNav />}
    </>
  );
}

function MainAppRoutes() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    const maintenanceStatus = localStorage.getItem('maintenanceMode');
    const maintenanceEnd = localStorage.getItem('maintenanceEndTime');
    
    if (maintenanceStatus === 'true' && maintenanceEnd) {
      const endTime = new Date(maintenanceEnd);
      const now = new Date();
      
      if (now < endTime) {
        setIsMaintenanceMode(true);
      } else {
        localStorage.removeItem('maintenanceMode');
        localStorage.removeItem('maintenanceEndTime');
      }
    }
  }, []);

  if (isMaintenanceMode) {
    return <Navigate to="/maintenance" replace />;
  }

  return (
    <Routes>
      <Route path="/forum" element={<ForumHome />} />
      <Route path="/post/new" element={<NewPostPage />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/profile/:username" element={<UserProfile />} />
      <Route path="/deposit" element={<DepositPage />} />
      <Route path="/withdraw" element={<WithdrawPage />} />
      <Route path="/history" element={<ActivityHistoryPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="*" element={<Navigate to="/forum" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <SocketProvider>
      <AuthProvider>
        <NotificationProvider>
          <ForumProvider>
            <Router>
              <div className="min-h-screen pb-20 md:pb-0">
                <Helmet>
                  <title>RedDark.id - Forum Underground Indonesia</title>
                  <meta name="description" content="Forum diskusi dan marketplace underground Indonesia dengan sistem Bitcoin payment" />
                </Helmet>
                <AppContent />
                <Toaster />
              </div>
            </Router>
          </ForumProvider>
        </NotificationProvider>
      </AuthProvider>
    </SocketProvider>
  );
}

export default App;