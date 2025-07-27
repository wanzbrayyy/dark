import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const NewPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translations } = useLanguage();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    forum_id: location.state?.forumId || '',
  });
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchForums = async () => {
      const { data, error } = await supabase.from('forums').select('id, name');
      if (error) {
        toast({ title: "Error", description: "Failed to fetch forums.", variant: "destructive" });
      } else {
        setForums(data);
        if (data.length > 0 && !formData.forum_id) {
          setFormData(prev => ({ ...prev, forum_id: data[0].id }));
        }
      }
    };
    fetchForums();
  }, [formData.forum_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ title: "Error", description: "Judul dan konten harus diisi", variant: "destructive" });
      return;
    }
    if (!formData.forum_id) {
      toast({ title: "Error", description: "Silakan pilih forum", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to post.", variant: "destructive" });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('posts')
      .insert({
        ...formData,
        author_id: user.id,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Postingan Dibuat", description: "Postingan Anda telah berhasil dibuat!" });
      navigate(`/post/${data.id}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>{translations.newPost} - RedDrak ID</title>
        <meta name="description" content="Create a new post on RedDrak ID" />
      </Helmet>
      
      <div className="p-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold gradient-text">{translations.newPost}</h1>
            <p className="text-gray-400 mt-2">Bagikan pengetahuan Anda dengan komunitas</p>
          </div>

          <div className="glass-effect p-6 rounded-lg neon-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="forum_id" className="text-red-400">Pilih Forum *</Label>
                <select id="forum_id" name="forum_id" value={formData.forum_id} onChange={handleChange} required className="w-full p-3 bg-black/50 border border-red-500/30 text-white rounded-md focus:border-red-500">
                  <option value="">Pilih forum...</option>
                  {forums.map(forum => <option key={forum.id} value={forum.id}>{forum.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-red-400">{translations.title} *</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Masukkan judul postingan..." required className="bg-black/50 border-red-500/30 text-white focus:border-red-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-red-400">{translations.description} *</Label>
                <Textarea id="content" name="content" value={formData.content} onChange={handleChange} placeholder="Tulis konten postingan Anda..." required rows={8} className="bg-black/50 border-red-500/30 text-white focus:border-red-500" />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3">
                  {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-paper-plane mr-2"></i>}
                  Buat Postingan
                </Button>
                <Button type="button" onClick={() => navigate(-1)} variant="outline" className="border-gray-500 text-gray-400 hover:bg-gray-500/10">{translations.cancel}</Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NewPost;