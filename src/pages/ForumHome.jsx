import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useForum } from '@/contexts/ForumContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import UserTour from '@/components/UserTour';

const ForumHome = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, getRankInfo } = useAuth();
  const { posts, categories, getPostsByCategory, searchPosts } = useForum();
  const { t } = useLanguage();

  const filteredPosts = searchQuery 
    ? searchPosts(searchQuery)
    : getPostsByCategory(selectedCategory);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  const rankInfo = getRankInfo(user.points);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Forum - RedDark.id</title>
        <meta name="description" content="Forum diskusi underground Indonesia dengan berbagai kategori tools, akun, script, dan jasa" />
      </Helmet>

      <UserTour />

      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white hover:text-blue-400"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
              <h1 className="text-xl font-bold gradient-text hidden sm:block">RedDark.id</h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* User Info & Language */}
            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageSelector />
              
              {/* User Menu */}
              <div className="flex items-center gap-2">
                <div className="user-rank text-right hidden sm:block">
                  <div className="text-white font-medium">{user.username}</div>
                  <div className={`text-xs ${rankInfo.color}`}>
                    {t(rankInfo.name)} ({user.points} pts)
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-white hover:bg-white/10"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside 
              initial={{ x: -256, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -256, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-64 space-y-6"
            >
              {/* Navigation Menu */}
              <div className="navigation-menu glass-effect rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  <i className="fas fa-list mr-2"></i>
                  {t('categories')}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      selectedCategory === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <i className="fas fa-globe mr-2"></i>
                    Semua
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedCategory === category 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <i className={`fas ${
                        category === 'tools' ? 'fa-wrench' :
                        category === 'accounts' ? 'fa-user-circle' :
                        category === 'scripts' ? 'fa-code' :
                        category === 'services' ? 'fa-handshake' :
                        'fa-comments'
                      } mr-2`}></i>
                      {t(category)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="glass-effect rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  <i className="fas fa-trophy mr-2"></i>
                  Leaderboard
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400">🥇</span>
                    <span className="text-white">wanzofc</span>
                    <span className="ml-auto text-gray-400">9999 pts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300">🥈</span>
                    <span className="text-white">darktools</span>
                    <span className="ml-auto text-gray-400">500 pts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-400">🥉</span>
                    <span className="text-white">botmaster</span>
                    <span className="ml-auto text-gray-400">250 pts</span>
                  </div>
                </div>
                <Button
                  variant="link"
                  onClick={() => navigate('/leaderboard')}
                  className="text-blue-400 mt-3 w-full"
                >
                  Lihat Semua
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1">
          {/* Posts Grid */}
          <div className="grid gap-6">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="dark-card rounded-lg p-6 hover-glow cursor-pointer"
                onClick={() => handlePostClick(post.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.category === 'tools' ? 'bg-blue-600/20 text-blue-400' :
                        post.category === 'accounts' ? 'bg-green-600/20 text-green-400' :
                        post.category === 'scripts' ? 'bg-purple-600/20 text-purple-400' :
                        post.category === 'services' ? 'bg-orange-600/20 text-orange-400' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        {t(post.category)}
                      </span>
                      {post.status === 'verified' && (
                        <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-medium">
                          <i className="fas fa-check-circle mr-1"></i>
                          Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
                    <p className="text-gray-400 line-clamp-2">{post.content}</p>
                  </div>
                  {post.price > 0 && (
                    <div className="text-right">
                      <div className="text-orange-400 font-bold">₿{post.price}</div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <span>
                      <i className="fas fa-user mr-1"></i>
                      {post.author}
                    </span>
                    <span>
                      <i className="fas fa-clock mr-1"></i>
                      {new Date(post.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>
                      <i className="fas fa-thumbs-up mr-1 text-green-400"></i>
                      {post.votes.up}
                    </span>
                    <span>
                      <i className="fas fa-thumbs-down mr-1 text-red-400"></i>
                      {post.votes.down}
                    </span>
                    <span>
                      <i className="fas fa-download mr-1 text-blue-400"></i>
                      {post.downloads}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <lottie-player
                  src="https://assets9.lottiefiles.com/packages/lf20_wd1udlcz.json"
                  background="transparent"
                  speed="1"
                  style={{ width: '200px', height: '200px', margin: '0 auto' }}
                  loop
                  autoplay
                ></lottie-player>
                <h3 className="text-xl font-semibold text-white mb-2">Tidak ada postingan</h3>
                <p className="text-gray-400">Belum ada postingan di kategori ini.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ForumHome;