import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { toast } from '@/components/ui/use-toast';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLearnMore = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>RedDark.id - Forum Underground Indonesia</title>
        <meta name="description" content="Forum diskusi dan marketplace underground Indonesia dengan sistem Bitcoin payment yang aman dan terpercaya" />
      </Helmet>

      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Title */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-3 floating">
              RedDark.id
            </h1>
            <div className="flex items-center justify-center gap-2 text-orange-400">
              <i className="fab fa-bitcoin text-xl bitcoin-glow"></i>
              <span className="text-lg font-semibold">Bitcoin Powered</span>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="glass-effect p-6 rounded-lg hover-glow">
              <i className="fas fa-shield-alt text-3xl text-blue-400 mb-4"></i>
              <h3 className="text-lg font-semibold text-white mb-2">Aman & Anonim</h3>
              <p className="text-gray-400">Sistem keamanan tingkat tinggi dengan enkripsi end-to-end</p>
            </div>
            <div className="glass-effect p-6 rounded-lg hover-glow">
              <i className="fab fa-bitcoin text-3xl text-orange-400 mb-4"></i>
              <h3 className="text-lg font-semibold text-white mb-2">Bitcoin Payment</h3>
              <p className="text-gray-400">Transaksi menggunakan Bitcoin untuk privasi maksimal</p>
            </div>
            <div className="glass-effect p-6 rounded-lg hover-glow">
              <i className="fas fa-users text-3xl text-green-400 mb-4"></i>
              <h3 className="text-lg font-semibold text-white mb-2">Komunitas Aktif</h3>
              <p className="text-gray-400">Ribuan member aktif dari seluruh Indonesia</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate('/forum')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg hover-glow"
            >
              <i className="fas fa-eye mr-2"></i>
              {t('viewForum')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg hover-glow"
            >
              <i className="fas fa-user-plus mr-2"></i>
              {t('joinNow')}
            </Button>
            <Button
              size="lg"
              onClick={handleLearnMore}
              variant="ghost"
              className="text-white hover:bg-white/10 px-8 py-3 text-lg hover-glow"
            >
              <i className="fas fa-info-circle mr-2"></i>
              Pelajari Lebih Lanjut
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1,337+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5,420+</div>
              <div className="text-gray-400">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">₿2.5+</div>
              <div className="text-gray-400">BTC Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lottie Animation */}
      <div className="absolute bottom-10 right-10 opacity-30">
        <lottie-player
          src="https://assets5.lottiefiles.com/packages/lf20_fcfjwiyb.json"
          background="transparent"
          speed="1"
          style={{ width: '200px', height: '200px' }}
          loop
          autoplay
        ></lottie-player>
      </div>
    </div>
  );
};

export default LandingPage;