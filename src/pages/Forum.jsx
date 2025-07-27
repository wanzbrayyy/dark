import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

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
  });

  useEffect(() => {
    fetchForums();
    const channel = supabase.channel('public:forums')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forums' }, payload => {
        console.log('Change received!', payload)
        fetchForums();
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel);
    }
  }, []);

  const fetchForums = async () => {
    const { data, error } = await supabase
      .from('forums')
      .select(`
        *,
        creator:users(username)
      `);
    if (error) {
      toast({ title: "Error", description: "Failed to fetch forums", variant: "destructive" });
    } else {
      setForums(data);
    }
  };

  const handleCreateForum = async () => {
    if (!newForum.name.trim()) {
      toast({ title: "Error", description: "Forum name is required", variant: "destructive" });
      return;
    }

    const { data, error } = await supabase
      .from('forums')
      .insert([
        { name: newForum.name, description: newForum.description, creator_id: user.id },
      ]);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Forum Created", description: `Forum "${newForum.name}" has been created successfully!` });
      setNewForum({ name: '', description: '' });
      setShowCreateForm(false);
    }
  };

  const copyForumUrl = (id) => {
    const url = `${window.location.origin}/forum/${id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "URL Copied", description: "Forum URL has been copied to clipboard" });
  };

  const filteredForums = forums.filter(forum =>
    forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (forum.description && forum.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
          
          {user && (
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              <i className="fas fa-plus mr-2"></i>
              Buat Forum
            </Button>
          )}
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
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); copyForumUrl(forum.id); }} className="text-gray-400 hover:text-red-400"><i className="fas fa-copy"></i></Button>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  {/* Member and post counts can be added later */}
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">Dibuat oleh {forum.creator?.username || 'Unknown'} • {new Date(forum.created_at).toLocaleDateString()}</div>
            </motion.div>
          ))}
        </div>
        {filteredForums.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-400">Memuat forum atau belum ada forum.</p>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Forum;