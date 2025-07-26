import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import BackButton from '@/components/BackButton';
import LanguageSelector from '@/components/LanguageSelector';

const dummyUsers = [
  { id: 'admin', username: 'wanzofc', rank: 'exclusive', points: 9999, avatar: null },
  { id: '1', username: 'darktools', rank: 'master', points: 500, avatar: null },
  { id: '2', username: 'botmaster', rank: 'gold', points: 250, avatar: null },
  { id: '3', username: 'secghost', rank: 'silver', points: 75, avatar: null },
  { id: '4', username: 'cryptoking', rank: 'silver', points: 50, avatar: null },
  { id: '5', username: 'newbie01', rank: 'newbie', points: 10, avatar: null },
  { id: '6', username: 'hackerwannabe', rank: 'newbie', points: 5, avatar: null },
  { id: '7', username: 'dataminer', rank: 'newbie', points: 2, avatar: null },
];

const LeaderboardPage = () => {
  const { t } = useLanguage();

  const getRankInfo = (points) => {
    if (points >= 1000) return { name: 'exclusive', color: 'rank-exclusive' };
    if (points >= 500) return { name: 'master', color: 'rank-master' };
    if (points >= 100) return { name: 'gold', color: 'rank-gold' };
    if (points >= 25) return { name: 'silver', color: 'rank-silver' };
    return { name: 'newbie', color: 'rank-newbie' };
  };

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Leaderboard - RedDark.id</title>
        <meta name="description" content="Lihat peringkat pengguna teratas di RedDark.id" />
      </Helmet>

      <BackButton />

      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold gradient-text">
              <i className="fas fa-trophy mr-2"></i>
              Leaderboard
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
            {dummyUsers.map((user, index) => {
              const rankInfo = getRankInfo(user.points);
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    index < 3 ? 'glass-effect border border-yellow-500/30' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="text-2xl font-bold w-10 text-center">
                    {getMedal(index)}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                    <i className="fas fa-user-secret text-xl text-white"></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-white">{user.username}</div>
                    <div className={`text-sm font-medium ${rankInfo.color}`}>
                      {t(rankInfo.name)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-400">{user.points}</div>
                    <div className="text-sm text-gray-400">Points</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;