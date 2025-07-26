
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

const MaintenancePage = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const maintenanceEnd = localStorage.getItem('maintenanceEndTime');
    if (!maintenanceEnd) {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(maintenanceEnd).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        localStorage.removeItem('maintenanceMode');
        localStorage.removeItem('maintenanceEndTime');
        navigate('/');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen maintenance-bg relative overflow-hidden">
      <Helmet>
        <title>Maintenance - RedDark.id</title>
        <meta name="description" content="RedDark.id sedang dalam pemeliharaan. Silakan kembali lagi nanti." />
      </Helmet>

      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Maintenance Icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="mb-8"
          >
            <i className="fas fa-cog text-8xl text-orange-400"></i>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            {t('maintenance')}
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-8">
            {t('maintenanceDesc')}
          </p>

          {/* Countdown Timer */}
          <div className="glass-effect rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              <i className="fas fa-clock mr-2"></i>
              Estimasi Selesai
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-gray-400">Jam</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-gray-400">Menit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-gray-400">Detik</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg hover-glow"
          >
            <i className="fas fa-home mr-2"></i>
            {t('backToHome')}
          </Button>

          {/* Status Updates */}
          <div className="mt-12 glass-effect rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              <i className="fas fa-info-circle mr-2"></i>
              Update Status
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <i className="fas fa-check-circle text-green-400"></i>
                <span className="text-gray-300">Database optimization - Selesai</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-spinner fa-spin text-orange-400"></i>
                <span className="text-gray-300">Security updates - Sedang berlangsung</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-clock text-gray-500"></i>
                <span className="text-gray-400">Server restart - Menunggu</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lottie Animation */}
      <div className="absolute bottom-10 left-10 opacity-30">
        <lottie-player
          src="https://assets2.lottiefiles.com/packages/lf20_usmfx6bp.json"
          background="transparent"
          speed="1"
          style={{ width: '150px', height: '150px' }}
          loop
          autoplay
        ></lottie-player>
      </div>
    </div>
  );
};

export default MaintenancePage;
