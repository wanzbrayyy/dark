
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translations } = useLanguage();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateUnreadCount = () => {
      const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
      const count = allMessages.filter(msg => msg.recipientId === user?.id && !msg.read).length;
      setUnreadCount(count);
    };

    updateUnreadCount();
    const interval = setInterval(updateUnreadCount, 2000); 
    return () => clearInterval(interval);
  }, [user]);

  const navItems = [
    { path: '/dashboard', icon: 'fa-home', label: translations.dashboard, id: 'dashboard' },
    { path: '/forum', icon: 'fa-comments', label: translations.forum, id: 'forum' },
    { path: '/new-post', icon: 'fa-plus', label: translations.newPost, id: 'new-post' },
    {
      path: '/messages',
      icon: 'fa-envelope',
      label: translations.messages,
      id: 'messages',
      notificationCount: unreadCount
    },
    { path: '/profile', icon: 'fa-user', label: translations.profile, id: 'profile' },
  ];
  
  if (user?.role === 'admin') {
    navItems.splice(3, 0, { path: '/admin', icon: 'fa-user-shield', label: translations.admin, id: 'admin' });
  }

  const handleTerminalClick = () => {
    toast({
        title: "🚧 Fitur Belum Tersedia 🚧",
        description: "segera hadir",
        variant: "destructive",
    });
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 glass-effect border-t border-red-500/20 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <motion.button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center p-2 rounded-lg transition-all w-16"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className={`fas ${item.icon} text-lg mb-1 ${
                isActive 
                  ? 'text-red-400' 
                  : 'text-gray-400 group-hover:text-red-400'
              }`}></i>
              <span className={`text-xs font-medium ${
                isActive ? 'text-white' : 'text-gray-400'
              }`}>{item.label}</span>
              {isActive && (
                <motion.div 
                  className="absolute bottom-0 h-0.5 w-1/2 bg-red-500 rounded-full"
                  layoutId="underline"
                />
              )}
              {item.notificationCount > 0 && (
                <div className="absolute top-0 right-2 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-black">
                  {item.notificationCount}
                </div>
              )}
            </motion.button>
          );
        })}
        <motion.button
            onClick={handleTerminalClick}
            className="flex flex-col items-center p-2 rounded-lg transition-all w-16 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <i className="fas fa-terminal text-lg mb-1 text-gray-400 group-hover:text-red-400"></i>
            <span className="text-xs font-medium text-gray-400">Lab</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BottomNavigation;
