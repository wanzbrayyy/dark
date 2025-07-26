import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useForum } from '@/contexts/ForumContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import BackButton from '@/components/BackButton';
import LanguageSelector from '@/components/LanguageSelector';

const NewPostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [price, setPrice] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [toolFile, setToolFile] = useState(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPost, categories } = useForum();
  const { t } = useLanguage();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setToolFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Judul dan isi postingan tidak boleh kosong.",
        variant: "destructive"
      });
      return;
    }

    const newPost = createPost({
      title,
      content,
      category,
      price: parseFloat(price) || 0,
      author: user.username,
      imageUrl: imagePreview,
      fileUrl: toolFile ? URL.createObjectURL(toolFile) : null,
      fileName: toolFile ? toolFile.name : null,
    });

    navigate(`/post/${newPost.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Post Baru - RedDark.id</title>
        <meta name="description" content="Buat postingan baru di forum RedDark.id" />
      </Helmet>

      <BackButton />

      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold gradient-text">
              <i className="fas fa-plus-circle mr-2"></i>
              {t('newPost')}
            </h1>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dark-card rounded-lg p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Judul Postingan
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan judul yang menarik"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-800 text-white">
                    {t(cat)}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Isi Postingan
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Tuliskan detail postingan Anda di sini..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Gambar (Opsional)
              </label>
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => imageInputRef.current.click()}
                className="w-full border-dashed border-white/30 text-white hover:bg-white/10"
              >
                <i className="fas fa-image mr-2"></i>
                Pilih Gambar
              </Button>
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Preview" className="rounded-lg max-h-60 w-auto mx-auto" />
                </div>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload File/Tools (Opsional)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current.click()}
                className="w-full border-dashed border-white/30 text-white hover:bg-white/10"
              >
                <i className="fas fa-upload mr-2"></i>
                Pilih File
              </Button>
              {toolFile && (
                <div className="mt-4 text-center text-green-400">
                  <i className="fas fa-check-circle mr-2"></i>
                  {toolFile.name}
                </div>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Harga (BTC) - Opsional
              </label>
              <input
                type="number"
                step="0.000001"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Contoh: 0.005"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg hover-glow"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Publikasikan Postingan
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default NewPostPage;