
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';
import { getRankDetails } from '@/lib/rankSystem';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { translations } = useLanguage();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.username === username);
    
    if (!foundUser) {
      navigate('/forum');
      return;
    }
    
    setUser(foundUser);

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const userPostsList = posts.filter(post => post.authorId === foundUser.id);
    setUserPosts(userPostsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, [username, navigate]);

  const handleSendMessage = () => {
    navigate('/messages', { state: { selectedUser: user } });
  };

  const handleFeatureClick = () => {
    toast({
      title: "Feature Coming Soon",
      description: translations.featureNotImplemented,
    });
  };

  const rankDetails = user ? getRankDetails(user.rank) : null;

  if (!user || !rankDetails) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-red-400">{translations.loading}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{user.username} - RedDrak ID</title>
        <meta name="description" content={`${user.username}'s profile on RedDrak ID`} />
      </Helmet>
      
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect p-6 rounded-lg neon-border">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full border-4 border-red-500 glow-red" />
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-black border-2 border-red-500 flex items-center justify-center ${rankDetails.color}`}>
                <i className={`fas ${rankDetails.icon} text-sm`}></i>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold gradient-text">{user.username}</h1>
              <p className={`text-lg font-semibold ${rankDetails.color} mb-2`}>
                <i className={`fas ${rankDetails.icon} mr-2`}></i>{translations.ranks[user.rank]}
              </p>
              <p className="text-gray-400">{user.bio || 'Bio belum tersedia'}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm text-gray-400">
                <span><i className="fas fa-calendar mr-1"></i>Bergabung {new Date(user.joinedAt).toLocaleDateString()}</span>
                <span><i className="fas fa-file-alt mr-1"></i>{userPosts.length || 0} postingan</span>
                <span><i className="fas fa-trophy mr-1"></i>{user.reputation || 0} reputasi</span>
              </div>
            </div>
            
            {currentUser?.id !== user.id && (
              <div className="flex space-x-2">
                <Button onClick={handleSendMessage} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"><i className="fas fa-envelope mr-2"></i>Kirim Pesan</Button>
                <Button onClick={handleFeatureClick} variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10"><i className="fas fa-user-plus mr-2"></i>Ikuti</Button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-effect p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4"><i className="fas fa-file-alt text-red-400 mr-2"></i>Postingan Terbaru ({userPosts.length})</h2>
          {userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.slice(0, 5).map((post, index) => (
                <motion.div key={post.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="p-4 bg-black/30 rounded-lg hover:bg-black/50 transition-colors cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                    <h3 className="text-white font-medium hover:text-red-400 transition-colors">{post.title}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span><i className="fas fa-calendar mr-1"></i>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">{post.category}</span>
                    </div>
                </motion.div>
              ))}
              {userPosts.length > 5 && (<Button onClick={handleFeatureClick} variant="ghost" className="w-full text-red-400 hover:text-red-300">Lihat Semua Postingan ({userPosts.length})</Button>)}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400"><i className="fas fa-inbox text-4xl mb-4"></i><p>Pengguna ini belum memiliki postingan.</p></div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default UserProfile;
