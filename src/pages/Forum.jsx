import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';

const Forum = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const { user } = useAuth();
  const [forums, setForums] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newForum, setNewForum] = useState({
    name: '',
    description: '',
    theme: 'dark'
  });

  useEffect(() => {
    const existingForums = JSON.parse(localStorage.getItem('forums') || '[]');
    if (existingForums.length === 0) {
      const defaultForums = [
        {
          id: 'general-discussion', name: 'General Discussion', description: 'General hacker discussions and topics', theme: 'dark', createdBy: 'wanz', createdAt: new Date().toISOString(), members: 1, postsCount: 0, url: `${window.location.origin}/forum/general-discussion`
        },
        {
          id: 'tools-scripts', name: 'Tools & Scripts', description: 'Share and discuss hacking tools and scripts', theme: 'red', createdBy: 'wanz', createdAt: new Date().toISOString(), members: 1, postsCount: 0, url: `${window.location.origin}/forum/tools-scripts`
        },
        {
          id: 'learning-hub', name: 'Learning Hub', description: 'Educational content and tutorials', theme: 'blue', createdBy: 'wanz', createdAt: new Date().toISOString(), members: 1, postsCount: 0, url: `${window.location.origin}/forum/learning-hub`
        }
      ];
      localStorage.setItem('forums', JSON.stringify(defaultForums));
      setForums(defaultForums);
    } else {
      setForums(existingForums);
    }
  }, []);

  const handleCreateForum = () => {
    if (!newForum.name.trim()) {
      toast({ title: "Error", description: "Forum name is required", variant: "destructive" });
      return;
    }

    const forumId = newForum.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const forum = {
      id: forumId, name: newForum.name, description: newForum.description, theme: newForum.theme, createdBy: user.username, createdAt: new Date().toISOString(), members: 1, postsCount: 0, url: `${window.location.origin}/forum/${forumId}`
    };

    const updatedForums = [...forums, forum];
    setForums(updatedForums);
    localStorage.setItem('forums', JSON.stringify(updatedForums));
    setNewForum({ name: '', description: '', theme: 'dark' });
    setShowCreateForm(false);
    toast({ title: "Forum Created", description: `Forum "${forum.name}" has been created successfully!` });
  };

  const copyForumUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL Copied", description: "Forum URL has been copied to clipboard" });
  };

  const filteredForums = forums.filter(forum =>
    forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    forum.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>{translations.forum} - RedDrak ID</title>
        <meta name="description" content="Browse RedDrak ID Forums" />
      </Helmet>
      
      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text">{translations.forum}</h1>
            <p className="text-gray-400">Jelajahi komunitas dan diskusi</p>
          </div>
          
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            <i className="fas fa-plus mr-2"></i>
            Buat Forum
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Input
            placeholder={`${translations.search} forum...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/50 border-red-500/30 text-white focus:border-red-500"
          />
        </motion.div>

        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-effect p-6 rounded-lg neon-border"
          >
            <h2 className="text-xl font-bold text-white mb-4">Buat Forum Baru</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-red-400 mb-2">Nama Forum</label>
                <Input value={newForum.name} onChange={(e) => setNewForum(prev => ({ ...prev, name: e.target.value }))} placeholder="Masukkan nama forum" className="bg-black/50 border-red-500/30 text-white focus:border-red-500" />
              </div>
              <div>
                <label className="block text-red-400 mb-2">Deskripsi</label>
                <Input value={newForum.description} onChange={(e) => setNewForum(prev => ({ ...prev, description: e.target.value }))} placeholder="Masukkan deskripsi forum" className="bg-black/50 border-red-500/30 text-white focus:border-red-500" />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCreateForum} className="bg-green-600 hover:bg-green-700">Buat Forum</Button>
                <Button onClick={() => setShowCreateForm(false)} variant="outline" className="border-gray-500 text-gray-400 hover:bg-gray-500/10">Batal</Button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForums.map((forum, index) => (
            <motion.div
              key={forum.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect p-6 rounded-lg hover:bg-red-500/5 transition-colors group cursor-pointer"
              onClick={() => navigate(`/forum/${forum.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{forum.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{forum.description}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); copyForumUrl(forum.url); }} className="text-gray-400 hover:text-red-400"><i className="fas fa-copy"></i></Button>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  <span><i className="fas fa-users mr-1"></i>{forum.members} anggota</span>
                  <span><i className="fas fa-file-alt mr-1"></i>{forum.postsCount} postingan</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">Dibuat oleh {forum.createdBy} • {new Date(forum.createdAt).toLocaleDateString()}</div>
            </motion.div>
          ))}
        </div>
        {filteredForums.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-400">Tidak ada forum yang cocok dengan pencarian Anda.</p>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Forum;