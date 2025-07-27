
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const ForumDetail = () => {
  const { forumId } = useParams();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const { user } = useAuth();
  const [forum, setForum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchForumAndPosts();
    const postsChannel = supabase.channel(`public:posts:forum_id=eq.${forumId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts', filter: `forum_id=eq.${forumId}` }, payload => {
        console.log('Post change received!', payload);
        fetchForumAndPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, [forumId, navigate]);

  const fetchForumAndPosts = async () => {
    // Fetch forum details
    const { data: forumData, error: forumError } = await supabase
      .from('forums')
      .select('*, creator:users(username)')
      .eq('id', forumId)
      .single();

    if (forumError || !forumData) {
      toast({ title: "Error", description: "Forum not found", variant: "destructive" });
      navigate('/forum');
      return;
    }
    setForum(forumData);

    // Fetch posts for this forum
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*, author:users(username)')
      .eq('forum_id', forumId)
      .order('created_at', { ascending: false });

    if (postsError) {
      toast({ title: "Error", description: "Failed to fetch posts", variant: "destructive" });
    } else {
      setPosts(postsData);
    }
  };

  const handleFeatureClick = () => {
    toast({
      title: "Feature Coming Soon",
      description: translations.featureNotImplemented,
    });
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!forum) {
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
        <title>{forum.name} - RedDrak ID</title>
        <meta name="description" content={forum.description} />
      </Helmet>
      
      <div className="p-4 space-y-6">
        {/* Forum Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect p-6 rounded-lg neon-border"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold gradient-text">{forum.name}</h1>
              <p className="text-gray-400 mt-2">{forum.description}</p>
            </div>
            
            {user && (
              <Button
                onClick={() => navigate('/new-post', { state: { forumId: forum.id } })}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                <i className="fas fa-plus mr-2"></i>
                {translations.newPost}
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <span>
              <i className="fas fa-file-alt mr-1"></i>
              {posts.length} posts
            </span>
            <span>
              <i className="fas fa-user mr-1"></i>
              Created by {forum.creator?.username || 'Unknown'}
            </span>
            <span>
              <i className="fas fa-calendar mr-1"></i>
              {new Date(forum.created_at).toLocaleDateString()}
            </span>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Input
            placeholder={`${translations.search} posts...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/50 border-red-500/30 text-white focus:border-red-500"
          />
        </motion.div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect p-6 rounded-lg hover:bg-red-500/5 transition-colors cursor-pointer"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white hover:text-red-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 mt-2 line-clamp-2">{post.content}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>
                      <i className="fas fa-user mr-1"></i>
                      {post.author?.username || 'Unknown'}
                    </span>
                    <span>
                      <i className="fas fa-calendar mr-1"></i>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    {/* Like and comment buttons can be implemented later */}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-400 mb-4">
                {searchTerm ? 'No posts found matching your search.' : 'No posts in this forum yet.'}
              </p>
              {!searchTerm && user && (
                <Button
                  onClick={() => navigate('/new-post', { state: { forumId: forum.id } })}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Create First Post
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForumDetail;
