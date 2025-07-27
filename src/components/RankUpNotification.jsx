import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const RankUpNotification = () => {
  const [rankUpInfo, setRankUpInfo] = useState(null);
  const { translations } = useLanguage();

  useEffect(() => {
    const checkRankUp = () => {
      const rankUpData = localStorage.getItem('rankUp');
      if (rankUpData) {
        setRankUpInfo(JSON.parse(rankUpData));
        localStorage.removeItem('rankUp');
      }
    };

    const interval = setInterval(checkRankUp, 2000); 
    return () => clearInterval(interval);
  }, []);

  if (!rankUpInfo) return null;

  return (
    <AnimatePresence>
      {rankUpInfo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -200 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200]"
          onClick={() => setRankUpInfo(null)}
        >
          <div className="text-center p-8 rounded-lg glass-effect neon-border space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
            >
              <i className={`fas ${rankUpInfo.icon} text-7xl text-yellow-400 text-shadow`}></i>
            </motion.div>
            <h2 className="text-3xl font-bold gradient-text">PANGKAT NAIK!</h2>
            <p className="text-xl text-white">
              Selamat! Anda telah mencapai pangkat <span className="text-yellow-400 font-semibold">{rankUpInfo.rank}</span>!
            </p>
            <p className="text-gray-400">Teruslah berkontribusi di komunitas!</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RankUpNotification;