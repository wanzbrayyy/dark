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

const NewPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { translations } = useLanguage();
  const { user, addReputation, incrementPostsCount } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    forumId: location.state?.forumId || '',
    image: ''
  });
  const [forums, setForums] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = Object.entries(translations.categories).map(([value, label]) => ({ value, label }));

  useEffect(() => {
    const allForums = JSON.parse(localStorage.getItem('forums') || '[]');
    setForums(allForums);
    if (allForums.length > 0 && !formData.forumId) {
      setFormData(prev => ({ ...prev, forumId: allForums[0].id }));
    }
  }, [formData.forumId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'image' && value) setImagePreview(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ title: "Error", description: "Judul dan konten harus diisi", variant: "destructive" });
      return;
    }
    if (!formData.forumId) {
      toast({ title: "Error", description: "Silakan pilih forum", variant: "destructive" });
      return;
    }

    setLoading(true);

    const post = {
      id: `post-${Date.now()}`,
      ...formData,
      author: user.username,
      authorId: user.id,
      createdAt: new Date().toISOString(),
      likes: 0,
      repliesCount: 0
    };

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));

    const allForums = JSON.parse(localStorage.getItem('forums') || '[]');
    const forumIndex = allForums.findIndex(f => f.id === formData.forumId);
    if (forumIndex !== -1) {
      allForums[forumIndex].postsCount = (allForums[forumIndex].postsCount || 0) + 1;
      localStorage.setItem('forums', JSON.stringify(allForums));
    }
    
    incrementPostsCount();
    addReputation(10); // +10 reputasi untuk setiap postingan

    toast({ title: "Postingan Dibuat", description: "Postingan Anda telah berhasil dibuat!" });
    navigate(`/post/${post.id}`);
    setLoading(false);
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
                <Label htmlFor="forumId" className="text-red-400">Pilih Forum *</Label>
                <select id="forumId" name="forumId" value={formData.forumId} onChange={handleChange} required className="w-full p-3 bg-black/50 border border-red-500/30 text-white rounded-md focus:border-red-500">
                  <option value="">Pilih forum...</option>
                  {forums.map(forum => <option key={forum.id} value={forum.id}>{forum.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-red-400">{translations.title} *</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Masukkan judul postingan..." required className="bg-black/50 border-red-500/30 text-white focus:border-red-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-red-400">{translations.category}</Label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-black/50 border border-red-500/30 text-white rounded-md focus:border-red-500">
                  {categories.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-red-400">{translations.description} *</Label>
                <Textarea id="content" name="content" value={formData.content} onChange={handleChange} placeholder="Tulis konten postingan Anda..." required rows={8} className="bg-black/50 border-red-500/30 text-white focus:border-red-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-red-400">URL Gambar (Opsional)</Label>
                <Input id="image" name="image" type="url" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" className="bg-black/50 border-red-500/30 text-white focus:border-red-500" />
              </div>
              {imagePreview && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
                  <Label className="text-red-400">Pratinjau</Label>
                  <div className="border border-red-500/30 rounded-lg p-4">
                    <img src={imagePreview} alt="Preview" className="max-w-full h-auto max-h-64 rounded-lg" onError={() => setImagePreview('')} />
                  </div>
                </motion.div>
              )}
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