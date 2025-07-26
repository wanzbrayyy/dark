import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/use-toast';
import BackButton from '@/components/BackButton';
import LanguageSelector from '@/components/LanguageSelector';
import { useSocket } from '@/contexts/SocketContext';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, getRankInfo, updateUser } = useAuth();
  const { t } = useTranslation();
  const [profileUser, setProfileUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const socket = useSocket();

  useEffect(() => {
    // In a real app, you'd fetch the user data based on `username`
    // For now, we'll just use the logged in user's data if it's their profile
    if (user && user.username === username) {
      setProfileUser(user);
      setAvatar(user.avatar);
    } else {
      // Here you would fetch the user data from your API
      // For example:
      // fetch(`/api/users/${username}`)
      //   .then(res => res.json())
      //   .then(data => {
      //     setProfileUser(data);
      //     setAvatar(data.avatar);
      //   });
    }
  }, [username, user]);

  useEffect(() => {
    if (socket) {
      socket.on('users', (change) => {
        if (change.fullDocument._id === profileUser._id) {
          setProfileUser(change.fullDocument);
        }
      });
    }
  }, [socket, profileUser]);

  if (!profileUser) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  const isOwnProfile = user && user.username === username;
  const rankInfo = getRankInfo(profileUser.points);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        updateUser({ avatar: reader.result });
        toast({
          title: "Avatar berhasil diubah!",
          description: "Avatar profil Anda telah diperbarui."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAvatarUpload = () => {
    if (isOwnProfile) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Profil {profileUser.username} - RedDark.id</title>
        <meta name="description" content={`Profil pengguna ${profileUser.username} di RedDark.id`} />
      </Helmet>

      <BackButton />

      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold gradient-text">
              <i className="fas fa-user mr-2"></i>
              {t('profile')}
            </h1>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dark-card rounded-lg p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {isOwnProfile && (
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/png, image/jpeg"
                  className="hidden"
                />
              )}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
                ) : (
                  <i className="fas fa-user-secret text-3xl text-white"></i>
                )}
              </div>
              {isOwnProfile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={triggerAvatarUpload}
                  className="absolute bottom-0 right-0 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                >
                  <i className="fas fa-camera"></i>
                </Button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <h1 className="text-2xl font-bold text-white">{profileUser.username}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${rankInfo.color}`}>
                  <i className="fas fa-crown mr-1"></i>
                  {t(rankInfo.name)}
                </span>
              </div>
              <p className="text-gray-400 mb-4">{profileUser.email}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{profileUser.points}</div>
                  <div className="text-gray-400 text-sm">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-400">₿{profileUser.btcBalance.toFixed(6)}</div>
                  <div className="text-gray-400 text-sm">{t('balance')}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{profileUser.totalPosts}</div>
                  <div className="text-gray-400 text-sm">{t('posts')}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{profileUser.totalTransactions}</div>
                  <div className="text-gray-400 text-sm">{t('transactions')}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="dark-card rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              <i className="fas fa-info-circle mr-2"></i>
              Informasi Akun
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Bergabung:</span>
                <span className="text-white">
                  {new Date(profileUser.joinDate).toLocaleDateString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400">
                  <i className="fas fa-circle mr-1"></i>
                  Online
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Role:</span>
                <span className="text-white capitalize">{profileUser.role}</span>
              </div>
            </div>
          </motion.div>

          {/* Rank Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="dark-card rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              <i className="fas fa-trophy mr-2"></i>
              Progress Ranking
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Rank:</span>
                <span className={`font-bold ${rankInfo.color}`}>
                  {t(rankInfo.name)}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress to next rank</span>
                  <span className="text-white">{profileUser.points}/100</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${Math.min((profileUser.points % 100), 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                Dapatkan poin dengan posting, komentar, dan transaksi!
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="dark-card rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              <i className="fas fa-history mr-2"></i>
              Aktivitas Terbaru
            </h2>
            <Button
              onClick={() => navigate('/history')}
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
            >
              <i className="fas fa-external-link-alt mr-2"></i>
              Lihat Semua
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 glass-effect rounded-lg">
              <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center">
                <i className="fas fa-user-plus text-green-400"></i>
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">Akun dibuat</div>
                <div className="text-gray-400 text-sm">
                  {new Date(profileUser.joinDate).toLocaleDateString('id-ID')}
                </div>
              </div>
              <div className="text-green-400 font-medium">+1 Point</div>
            </div>

            <div className="text-center py-8">
              <i className="fas fa-clock text-4xl text-gray-600 mb-4"></i>
              <p className="text-gray-400">Belum ada aktivitas lainnya</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;