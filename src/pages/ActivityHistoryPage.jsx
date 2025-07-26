import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import BackButton from '@/components/BackButton';
import LanguageSelector from '@/components/LanguageSelector';
import { useAuth } from '@/contexts/AuthContext';

const dummyActivities = [
  { id: 1, type: 'register', description: 'Akun dibuat', points: '+1 Point', date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 2, type: 'post', description: 'Membuat post: "Premium Netflix Account Generator"', points: '+5 Points', date: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, type: 'comment', description: 'Mengomentari post: "Jasa Pembuatan Bot Telegram"', points: '+2 Points', date: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 4, type: 'deposit', description: 'Deposit ₿0.005', points: '+10 Points', date: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 5, type: 'login', description: 'Login ke akun', points: '', date: new Date().toISOString() },
];

const ActivityHistoryPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const getIcon = (type) => {
    switch (type) {
      case 'register': return { icon: 'fas fa-user-plus', color: 'text-green-400', bg: 'bg-green-600/20' };
      case 'post': return { icon: 'fas fa-file-alt', color: 'text-blue-400', bg: 'bg-blue-600/20' };
      case 'comment': return { icon: 'fas fa-comments', color: 'text-purple-400', bg: 'bg-purple-600/20' };
      case 'deposit': return { icon: 'fab fa-bitcoin', color: 'text-orange-400', bg: 'bg-orange-600/20' };
      case 'login': return { icon: 'fas fa-sign-in-alt', color: 'text-gray-400', bg: 'bg-gray-600/20' };
      default: return { icon: 'fas fa-history', color: 'text-gray-400', bg: 'bg-gray-600/20' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Riwayat Aktivitas - RedDark.id</title>
        <meta name="description" content={`Riwayat aktivitas untuk pengguna ${user?.username}`} />
      </Helmet>

      <BackButton />

      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold gradient-text">
              <i className="fas fa-history mr-2"></i>
              Riwayat Aktivitas
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
          <div className="space-y-4">
            {dummyActivities.map((activity, index) => {
              const iconInfo = getIcon(activity.type);
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 glass-effect rounded-lg"
                >
                  <div className={`w-10 h-10 ${iconInfo.bg} rounded-full flex items-center justify-center`}>
                    <i className={`${iconInfo.icon} ${iconInfo.color}`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{activity.description}</div>
                    <div className="text-gray-400 text-sm">
                      {new Date(activity.date).toLocaleString('id-ID')}
                    </div>
                  </div>
                  {activity.points && (
                    <div className="text-green-400 font-medium">{activity.points}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ActivityHistoryPage;