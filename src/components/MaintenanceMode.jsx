
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const MaintenanceMode = () => {
  const { translations } = useLanguage();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const maintenanceEnd = localStorage.getItem('maintenanceEnd');
    if (maintenanceEnd) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(maintenanceEnd).getTime();
        const distance = end - now;

        if (distance > 0) {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
          setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
          localStorage.removeItem('maintenanceMode');
          localStorage.removeItem('maintenanceEnd');
          window.location.reload();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center hacker-bg maintenance-overlay">
      <motion.div 
        className="text-center space-y-8 p-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <i className="fas fa-tools text-6xl text-red-500 animate-pulse"></i>
          <h1 className="text-4xl font-bold gradient-text">{translations.maintenanceMode}</h1>
          <p className="text-xl text-gray-300">{translations.maintenanceModeActive}</p>
        </div>
        
        {timeLeft && (
          <div className="space-y-2">
            <p className="text-gray-400">Estimated completion time:</p>
            <div className="text-3xl font-mono text-red-400 neon-border p-4 rounded-lg">
              {timeLeft}
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenanceMode;
