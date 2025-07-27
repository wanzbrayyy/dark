import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getRankDetails } from '@/lib/rankSystem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { translations } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  const rankDetails = getRankDetails(user?.rank);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    toast({ title: "Profil Diperbarui", description: "Profil Anda telah berhasil diperbarui!" });
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '', email: user?.email || '', bio: user?.bio || '', avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  return (
    <>
      <Helmet>
        <title>{translations.profile} - RedDrak ID</title>
        <meta name="description" content="Kelola profil RedDrak ID Anda" />
      </Helmet>
      
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect p-6 rounded-lg neon-border">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img src={isEditing ? formData.avatar : user?.avatar} alt={user?.username} className="w-24 h-24 rounded-full border-4 border-red-500 glow-red" />
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-black border-2 border-red-500 flex items-center justify-center ${rankDetails.color}`}>
                <i className={`fas ${rankDetails.icon} text-sm`}></i>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold gradient-text">{isEditing ? formData.username : user?.username}</h1>
              <p className={`text-lg font-semibold ${rankDetails.color} mb-2`}>
                <i className={`fas ${rankDetails.icon} mr-2`}></i>{translations.ranks[user?.rank]}
              </p>
              <p className="text-gray-400">{isEditing ? formData.bio : user?.bio || 'Bio belum tersedia'}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm text-gray-400">
                <span><i className="fas fa-calendar mr-1"></i>Bergabung {new Date(user?.joinedAt).toLocaleDateString()}</span>
                <span><i className="fas fa-file-alt mr-1"></i>{user?.postsCount || 0} postingan</span>
                <span><i className="fas fa-trophy mr-1"></i>{user?.reputation || 0} reputasi</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {!isEditing ? (
                <>
                  <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"><i className="fas fa-edit mr-2"></i>{translations.edit}</Button>
                  <Button onClick={logout} variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10"><i className="fas fa-sign-out-alt mr-2"></i>{translations.logout}</Button>
                </>
              ) : (
                <>
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700"><i className="fas fa-save mr-2"></i>{translations.save}</Button>
                  <Button onClick={handleCancel} variant="outline" className="border-gray-500 text-gray-400 hover:bg-gray-500/10"><i className="fas fa-times mr-2"></i>{translations.cancel}</Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {isEditing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-effect p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-6">Edit Profil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label htmlFor="username" className="text-red-400">{translations.username}</Label><Input id="username" name="username" value={formData.username} onChange={handleChange} className="bg-black/50 border-red-500/30 text-white focus:border-red-500" /></div>
              <div className="space-y-2"><Label htmlFor="email" className="text-red-400">{translations.email}</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="bg-black/50 border-red-500/30 text-white focus:border-red-500" /></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="avatar" className="text-red-400">URL Avatar</Label><Input id="avatar" name="avatar" type="url" value={formData.avatar} onChange={handleChange} placeholder="https://example.com/avatar.jpg" className="bg-black/50 border-red-500/30 text-white focus:border-red-500" /></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="bio" className="text-red-400">{translations.bio}</Label><Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Ceritakan tentang diri Anda..." rows={4} className="bg-black/50 border-red-500/30 text-white focus:border-red-500" /></div>
            </div>
          </motion.div>
        )}

      </div>
    </>
  );
};

export default Profile;