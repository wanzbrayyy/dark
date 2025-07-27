
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';
import { getRankDetails } from '@/lib/rankSystem';
import { supabase } from '@/lib/supabaseClient';

const Reply = ({ reply, onReply, onLike, level = 0, allReplies }) => {
  const { translations } = useLanguage();
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
  const subReplies = allReplies.filter(r => r.parent_id === reply.id);
  const rankDetails = getRankDetails(reply.author?.rank || 0);

  const handleReplySubmit = () => {
    onReply(replyContent, reply.id);
    setReplyContent('');
    setShowReplyForm(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-effect p-4 rounded-lg ${level > 0 ? 'ml-4 mt-4 border-l-2 border-red-500/20' : ''}`}
    >
      <div className="flex items-start space-x-3">
        {reply.author && (
          <img src={reply.author.avatar_url || `https://api.dicebear.com/6.x/bottts/svg?seed=${reply.author.username}`} alt={reply.author.username} className="w-10 h-10 rounded-full" />
        )}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Link to={`/user/${reply.author.username}`} className={`font-semibold hover:underline ${rankDetails?.color}`}>{reply.author.username}</Link>
            <span className="text-xs text-gray-500">{new Date(reply.created_at).toLocaleString()}</span>
          </div>
          <p className="text-gray-300 mt-1">{reply.content}</p>
          <div className="flex items-center space-x-4 text-sm mt-2 text-gray-400">
            <button onClick={() => onLike(reply.id)} className="hover:text-red-400">
              <i className="fas fa-heart mr-1"></i>{translations.like} ({reply.likes || 0})
            </button>
            <button onClick={() => setShowReplyForm(!showReplyForm)} className="hover:text-red-400">
              <i className="fas fa-reply mr-1"></i>{translations.reply}
            </button>
          </div>
        </div>
      </div>
      {showReplyForm && user && (
        <div className="ml-12 mt-4 space-y-2">
          <Textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder={`Balas ke ${reply.author.username}...`} className="bg-black/50 border-red-500/30 text-white" rows={2}/>
          <Button onClick={handleReplySubmit} size="sm">Kirim Balasan</Button>
        </div>
      )}
      {subReplies.length > 0 && (
        <div className="mt-2">
            {subReplies.map(subReply => <Reply key={subReply.id} reply={subReply} onReply={onReply} onLike={onLike} level={level + 1} allReplies={allReplies} />)}
        </div>
      )}
    </motion.div>
  );
};

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');

  const fetchPostAndReplies = useCallback(async () => {
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select('*, author:users(*)')
      .eq('id', postId)
      .single();

    if (postError || !postData) {
      toast({ title: "Error", description: "Post not found.", variant: "destructive" });
      navigate('/forum');
      return;
    }
    setPost(postData);

    const { data: repliesData, error: repliesError } = await supabase
      .from('post_details')
      .select('*, author:users(*)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (repliesError) {
      toast({ title: "Error", description: "Failed to fetch replies.", variant: "destructive" });
    } else {
      setReplies(repliesData);
    }
  }, [postId, navigate]);

  useEffect(() => {
    fetchPostAndReplies();
    const channel = supabase.channel(`post-details-${postId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_details', filter: `post_id=eq.${postId}` }, payload => {
        console.log('Reply change received!', payload);
        fetchPostAndReplies();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPostAndReplies, postId]);

  const handleReply = async (content, parentId = null) => {
    if (!content.trim() || !user) return;
    
    const { error } = await supabase.from('post_details').insert({
      content,
      post_id: postId,
      author_id: user.id,
      parent_id: parentId,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setNewReply('');
      toast({ title: "Balasan Terkirim", description: "Balasan Anda telah berhasil dikirim!" });
    }
  };

  const handleLikePost = () => { /* ... (to be implemented) ... */ };
  const handleLikeReply = () => { /* ... (to be implemented) ... */ };

  if (!post) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-red-400">{translations.loading}</p>
      </div>
    );
  }

  const authorRankDetails = getRankDetails(post.author?.rank || 0);
  const topLevelReplies = replies.filter(r => !r.parent_id);

  return (
    <>
      <Helmet>
        <title>{post.title} - RedDrak ID</title>
        <meta name="description" content={post.content.substring(0, 160)} />
      </Helmet>
      
      <div className="p-4 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect p-6 rounded-lg neon-border">
          {post.author && (
            <div className="flex items-center space-x-4 mb-4">
              <img src={post.author.avatar_url || `https://api.dicebear.com/6.x/bottts/svg?seed=${post.author.username}`} alt={post.author.username} className="w-12 h-12 rounded-full"/>
              <div>
                  <Link to={`/user/${post.author.username}`} className={`text-lg font-bold hover:underline ${authorRankDetails.color}`}>{post.author.username}</Link>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span><i className="fas fa-calendar mr-1"></i>{new Date(post.created_at).toLocaleString()}</span>
                  </div>
              </div>
            </div>
          )}
          <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
          <div className="text-gray-300 whitespace-pre-wrap mb-6">{post.content}</div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleLikePost} variant="ghost" className="text-gray-400 hover:text-red-400"><i className="fas fa-heart mr-2"></i>{translations.like} ({post.likes || 0})</Button>
            <Button onClick={() => navigator.clipboard.writeText(window.location.href)} variant="ghost" className="text-gray-400 hover:text-red-400"><i className="fas fa-share mr-2"></i>{translations.share}</Button>
          </div>
        </motion.div>

        {user && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-effect p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4"><i className="fas fa-reply mr-2 text-red-400"></i>{translations.reply}</h2>
            <div className="space-y-4">
              <Textarea value={newReply} onChange={(e) => setNewReply(e.target.value)} placeholder="Tulis balasan Anda..." className="bg-black/50 border-red-500/30 text-white focus:border-red-500" rows={4} />
              <Button onClick={() => handleReply(newReply)} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"><i className="fas fa-paper-plane mr-2"></i>Kirim Balasan</Button>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <h2 className="text-xl font-bold text-white"><i className="fas fa-comments mr-2 text-red-400"></i>Balasan ({topLevelReplies.length})</h2>
          {topLevelReplies.length > 0 ? (
            <div className="space-y-4">
              {topLevelReplies.map((reply) => (
                <Reply key={reply.id} reply={reply} onReply={handleReply} onLike={handleLikeReply} allReplies={replies} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400"><i className="fas fa-comment-slash text-4xl mb-4"></i><p>Belum ada balasan. Jadilah yang pertama!</p></div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default PostDetail;
