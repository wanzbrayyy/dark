import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getRankDetails } from '@/lib/rankSystem';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { translations } = useLanguage();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalForums: 0,
    onlineUsers: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [productRecommendations, setProductRecommendations] = useState([]);

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const forums = JSON.parse(localStorage.getItem('forums') || '[]');
    
    setStats({
      totalPosts: posts.length,
      totalUsers: users.length,
      totalForums: forums.length,
      onlineUsers: Math.floor(Math.random() * users.length * 0.3) + 5
    });

    const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    setRecentPosts(sortedPosts);

    const recommendations = JSON.parse(localStorage.getItem('productRecommendations') || '[]');
    setProductRecommendations(recommendations);
  }, []);

  const rankDetails = getRankDetails(user?.rank);

  return (
    <>
      <Helmet>
        <title>{translations.dashboard} - RedDrak ID</title>
        <meta name="description" content="RedDrak ID Dashboard" />
      </Helmet>
      
      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect p-6 rounded-lg neon-border"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={user?.avatar} 
                alt={user?.username}
                className="w-16 h-16 rounded-full border-2 border-red-500"
              />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black border-2 border-red-500 flex items-center justify-center ${rankDetails.color}`}>
                <i className={`fas ${rankDetails.icon} text-xs`}></i>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, <span className="gradient-text">{user?.username}</span>!
              </h1>
              <p className="text-gray-400">
                Pangkat: <span className={`${rankDetails.color} font-semibold`}>{translations.ranks[user?.rank]}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {productRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect p-4 rounded-lg overflow-hidden"
          >
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-star text-yellow-500"></i>
              <span className="text-red-400 font-semibold">Rekomendasi Produk</span>
            </div>
            <div className="overflow-hidden">
              <motion.div
                animate={{ x: ['0%', '-100%'] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="flex space-x-8 whitespace-nowrap"
              >
                {productRecommendations.map((product, index) => (
                  <span key={index} className="text-gray-300">
                    🔥 {product.name} - {product.description}
                  </span>
                ))}
                 {productRecommendations.map((product, index) => (
                  <span key={`clone-${index}`} className="text-gray-300">
                    🔥 {product.name} - {product.description}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: 'fa-file-alt', label: 'Total Postingan', value: stats.totalPosts, color: 'text-blue-400' },
            { icon: 'fa-users', label: 'Total Pengguna', value: stats.totalUsers, color: 'text-green-400' },
            { icon: 'fa-comments', label: 'Forum', value: stats.totalForums, color: 'text-purple-400' },
            { icon: 'fa-circle', label: 'Online', value: stats.onlineUsers, color: 'text-red-400' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect p-4 rounded-lg text-center"
            >
              <i className={`fas ${stat.icon} text-2xl ${stat.color} mb-2`}></i>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect p-6 rounded-lg"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <i className="fas fa-clock text-red-400 mr-2"></i>
            Postingan Terbaru
          </h2>
          
          {recentPosts.length > 0 ? (
            <div className="space-y-3">
              {recentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{post.title}</h3>
                    <p className="text-gray-400 text-sm">
                      by {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                    {post.category}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <i className="fas fa-inbox text-4xl mb-4"></i>
              <p>Belum ada postingan. Jadilah yang pertama!</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: 'fa-plus', label: 'Postingan Baru', path: '/new-post' },
            { icon: 'fa-comments', label: 'Jelajahi Forum', path: '/forum' },
            { icon: 'fa-envelope', label: 'Pesan', path: '/messages' },
            { icon: 'fa-user-edit', label: 'Edit Profil', path: '/profile' }
          ].map((action, index) => (
            <motion.button
              key={index}
              onClick={() => navigate(action.path)}
              className="glass-effect p-4 rounded-lg text-center hover:bg-red-500/10 transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className={`fas ${action.icon} text-2xl text-red-400 mb-2 group-hover:text-red-300`}></i>
              <div className="text-sm text-gray-300 group-hover:text-white">{action.label}</div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;