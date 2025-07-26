import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/forum', icon: 'fas fa-home', label: t('forum') },
    { path: '/leaderboard', icon: 'fas fa-trophy', label: t('leaderboard') },
    { path: '/post/new', icon: 'fas fa-plus-circle', label: t('newPost') },
    { path: '/notifications', icon: 'fas fa-bell', label: t('notifications') },
    { path: '/profile', icon: 'fas fa-user', label: t('profile') },
  ];

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  // Hide on specific pages
  const hiddenPaths = ['/dashboard/wanzadmin', '/maintenance', '/auth', '/'];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const finalNavItems = navItems.map(item =>
    item.path === '/profile' ? { ...item, path: `/profile/${user.username}` } : item
  );

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="fixed bottom-0 left-0 right-0 h-16 glass-effect border-t border-white/10 z-40 md:hidden"
    >
      <div className="flex justify-around items-center h-full">
        {finalNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-colors duration-300 relative ${
                isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <i className={`${item.icon} text-xl`}></i>
            <span className="text-xs mt-1">{item.label}</span>
            {item.path === '/notifications' && unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1/4 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
              >
                {unreadCount}
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNav;