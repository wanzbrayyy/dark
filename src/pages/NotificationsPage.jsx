import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import BackButton from '@/components/BackButton';
import LanguageSelector from '@/components/LanguageSelector';

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    navigate(notification.link);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'reply': return { icon: 'fas fa-reply', color: 'text-blue-400', bg: 'bg-blue-600/20' };
      case 'tag': return { icon: 'fas fa-at', color: 'text-purple-400', bg: 'bg-purple-600/20' };
      case 'deposit': return { icon: 'fab fa-bitcoin', color: 'text-orange-400', bg: 'bg-orange-600/20' };
      default: return { icon: 'fas fa-bell', color: 'text-gray-400', bg: 'bg-gray-600/20' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Notifikasi - RedDark.id</title>
        <meta name="description" content="Lihat semua notifikasi Anda di RedDark.id" />
      </Helmet>

      <BackButton />

      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold gradient-text">
              <i className="fas fa-bell mr-2"></i>
              {t('notifications')}
            </h1>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dark-card rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Notifikasi Terbaru</h2>
            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
            >
              Tandai semua dibaca
            </Button>
          </div>

          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => {
                const iconInfo = getIcon(notification.type);
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                      notification.read ? 'bg-white/5' : 'glass-effect hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 ${iconInfo.bg} rounded-full flex items-center justify-center`}>
                      <i className={`${iconInfo.icon} ${iconInfo.color}`}></i>
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                        {notification.message}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {new Date(notification.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <lottie-player
                  src="https://assets1.lottiefiles.com/packages/lf20_x62chJ.json"
                  background="transparent"
                  speed="1"
                  style={{ width: '200px', height: '200px', margin: '0 auto' }}
                  loop
                  autoplay
                ></lottie-player>
                <h3 className="text-xl font-semibold text-white mt-4">Tidak ada notifikasi</h3>
                <p className="text-gray-400">Semua notifikasi Anda akan muncul di sini.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationsPage;