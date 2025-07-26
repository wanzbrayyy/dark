
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import BackButton from '@/components/BackButton';
import LanguageSelector from '@/components/LanguageSelector';

const AdminDashboard = () => {
  const [maintenanceHours, setMaintenanceHours] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user || user.role !== 'admin') {
    navigate('/auth');
    return null;
  }

  const handleMaintenanceMode = () => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + maintenanceHours);
    
    localStorage.setItem('maintenanceMode', 'true');
    localStorage.setItem('maintenanceEndTime', endTime.toISOString());
    
    toast({
      title: "Mode maintenance diaktifkan!",
      description: `Situs akan dalam maintenance selama ${maintenanceHours} jam.`
    });
    
    setTimeout(() => {
      navigate('/maintenance');
    }, 2000);
  };

  const handleSettingsUpdate = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Admin Dashboard - RedDark.id</title>
        <meta name="description" content="Panel administrasi RedDark.id" />
      </Helmet>

      <BackButton />

      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">
              <i className="fas fa-crown mr-2"></i>
              {t('adminPanel')}
            </h1>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <div className="text-right">
                <div className="text-white font-medium">{user.username}</div>
                <div className="text-yellow-400 text-sm">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dark-card rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">1,337</div>
                <div className="text-gray-400">Total Users</div>
              </div>
              <i className="fas fa-users text-3xl text-blue-400"></i>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="dark-card rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">5,420</div>
                <div className="text-gray-400">Total Posts</div>
              </div>
              <i className="fas fa-file-alt text-3xl text-green-400"></i>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="dark-card rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-400">₿2.5</div>
                <div className="text-gray-400">BTC Volume</div>
              </div>
              <i className="fab fa-bitcoin text-3xl text-orange-400"></i>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="dark-card rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <i className="fas fa-server text-3xl text-purple-400"></i>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Maintenance Control */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="dark-card rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              <i className="fas fa-cog mr-2"></i>
              {t('maintenanceMode')}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Durasi Maintenance (Jam)
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={maintenanceHours}
                  onChange={(e) => setMaintenanceHours(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <Button
                onClick={handleMaintenanceMode}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <i className="fas fa-tools mr-2"></i>
                Aktifkan Maintenance Mode
              </Button>
              
              <p className="text-gray-400 text-sm">
                <i className="fas fa-info-circle mr-2"></i>
                Semua user akan diarahkan ke halaman maintenance kecuali admin.
              </p>
            </div>
          </motion.div>

          {/* Site Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="dark-card rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              <i className="fas fa-sliders-h mr-2"></i>
              {t('settings')}
            </h2>
            
            <div className="space-y-4">
              <Button
                onClick={handleSettingsUpdate}
                variant="outline"
                className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/20"
              >
                <i className="fas fa-palette mr-2"></i>
                Atur Tema & Warna
              </Button>
              
              <Button
                onClick={handleSettingsUpdate}
                variant="outline"
                className="w-full border-green-600 text-green-400 hover:bg-green-600/20"
              >
                <i className="fas fa-layout mr-2"></i>
                Atur Layout
              </Button>
              
              <Button
                onClick={handleSettingsUpdate}
                variant="outline"
                className="w-full border-purple-600 text-purple-400 hover:bg-purple-600/20"
              >
                <i className="fas fa-puzzle-piece mr-2"></i>
                Kelola Widget
              </Button>
              
              <Button
                onClick={handleSettingsUpdate}
                variant="outline"
                className="w-full border-yellow-600 text-yellow-400 hover:bg-yellow-600/20"
              >
                <i className="fas fa-bars mr-2"></i>
                Atur Sidebar & Nav
              </Button>
            </div>
          </motion.div>

          {/* User Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="dark-card rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              <i className="fas fa-users-cog mr-2"></i>
              Manajemen User
            </h2>
            
            <div className="space-y-4">
              <Button
                onClick={handleSettingsUpdate}
                variant="outline"
                className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/20"
              >
                <i className="fas fa-list mr-2"></i>
                Lihat Semua User
              </Button>
              
              <Button
                onClick={handleSettingsUpdate}
                variant="outline"
                className="w-full border-red-600 text-red-400 hover:bg-red-600/20"
              >
                <i className="fas fa-ban mr-2"></i>
                Kelola Banned Users
              </Button>
              
              <Button
                onClick={handleSettingsUpdate}
                variant="outline"
                className="w-full border-yellow-600 text-yellow-400 hover:bg-yellow-600/20"
              >
                <i className="fas fa-crown mr-2"></i>
                Atur Ranking System
              </Button>
            </div>
          </motion.div>

          {/* System Monitoring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="dark-card rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              <i className="fas fa-chart-line mr-2"></i>
              System Monitoring
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Server Status:</span>
                <span className="text-green-400">
                  <i className="fas fa-circle mr-1"></i>
                  Online
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">CPU Usage:</span>
                <span className="text-white">23%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Memory Usage:</span>
                <span className="text-white">45%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Sessions:</span>
                <span className="text-white">1,337</span>
              </div>
              
              <Button
                onClick={handleSettingsUpdate}
                variant="outline"
                className="w-full border-purple-600 text-purple-400 hover:bg-purple-600/20"
              >
                <i className="fas fa-chart-bar mr-2"></i>
                Lihat Detail Analytics
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
