
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';
import { getRankDetails } from '@/lib/rankSystem';

const Reply = ({ reply, onReply, onLike, level = 0 }) => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [subReplies, setSubReplies] = useState([]);
  const [authorDetails, setAuthorDetails] = useState(null);

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const author = allUsers.find(u => u.id === reply.authorId);
    setAuthorDetails(author);

    const allReplies = JSON.parse(localStorage.getItem('replies') || '[]');
    const repliesForThis = allReplies.filter(r => r.parentId === reply.id);
    setSubReplies(repliesForThis);
  }, [reply.id, reply.authorId]);
  
  const handleReplySubmit = () => {
    onReply(replyContent, reply.id);
    setReplyContent('');
    setShowReplyForm(false);
  };
  
  const rankDetails = authorDetails ? getRankDetails(authorDetails.rank) : null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-effect p-4 rounded-lg ${level > 0 ? 'ml-4 mt-4 border-l-2 border-red-500/20' : ''}`}
    >
      <div className="flex items-start space-x-3">
        {authorDetails && (
          <img src={authorDetails.avatar} alt={authorDetails.username} className="w-10 h-10 rounded-full" />
        )}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Link to={`/user/${reply.author}`} className={`font-semibold hover:underline ${rankDetails?.color}`}>{reply.author}</Link>
            <span className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-gray-300 mt-1">{reply.content}</p>
          <div className="flex items-center space-x-4 text-sm mt-2 text-gray-400">
            <button onClick={() => onLike(reply.id)} className="hover:text-red-400">
              <i className="fas fa-heart mr-1"></i>{translations.like} ({reply.likes.length || 0})
            </button>
            <button onClick={() => setShowReplyForm(!showReplyForm)} className="hover:text-red-400">
              <i className="fas fa-reply mr-1"></i>{translations.reply}
            </button>
          </div>
        </div>
      </div>
      {showReplyForm && (
        <div className="ml-12 mt-4 space-y-2">
          <Textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder={`Balas ke ${reply.author}...`} className="bg-black/50 border-red-500/30 text-white" rows={2}/>
          <Button onClick={handleReplySubmit} size="sm">Kirim Balasan</Button>
        </div>
      )}
      {subReplies.length > 0 && (
        <div className="mt-2">
            {subReplies.map(subReply => <Reply key={subReply.id} reply={subReply} onReply={onReply} onLike={onLike} level={level + 1} />)}
        </div>
      )}
    </motion.div>
  );
};


const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const { user, addReputation } = useAuth();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [authorDetails, setAuthorDetails] = useState(null);

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const foundPost = posts.find(p => p.id === postId);
    
    if (!foundPost) {
      navigate('/forum');
      return;
    }
    
    setPost(p => ({ ...p, ...foundPost, likes: Array.isArray(foundPost.likes) ? foundPost.likes : [] }));
    
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setAuthorDetails(allUsers.find(u => u.id === foundPost.authorId));

    const allReplies = JSON.parse(localStorage.getItem('replies') || '[]');
    const postReplies = allReplies.filter(reply => reply.postId === postId && !reply.parentId);
    setReplies(postReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, [postId, navigate]);

  const handleReply = (content, parentId = null) => {
    if (!content.trim()) {
      toast({ title: "Error", description: "Isi balasan tidak boleh kosong", variant: "destructive" });
      return;
    }

    const reply = {
      id: `reply-${Date.now()}`, postId: postId, parentId, content, author: user.username, authorId: user.id, createdAt: new Date().toISOString(), likes: []
    };

    const allReplies = JSON.parse(localStorage.getItem('replies') || '[]');
    allReplies.push(reply);
    localStorage.setItem('replies', JSON.stringify(allReplies));

    if (parentId) {
        // This is a nested reply. We don't add it to the top-level state. The component will re-render and find it.
        // To trigger a re-render of the parent, we can just update a dummy state or reload replies.
        const postReplies = allReplies.filter(r => r.postId === postId && !r.parentId);
        setReplies(postReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } else {
        setReplies(prev => [reply, ...prev]);
        setNewReply('');
    }

    addReputation(5);
    toast({ title: "Balasan Terkirim", description: "Balasan Anda telah berhasil dikirim!" });
  };

  const handleLikePost = () => {
    if (!user) return;
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = allPosts.findIndex(p => p.id === postId);
    if(postIndex === -1) return;
    
    const postToUpdate = allPosts[postIndex];
    postToUpdate.likes = Array.isArray(postToUpdate.likes) ? postToUpdate.likes : [];

    const userLikeIndex = postToUpdate.likes.indexOf(user.id);

    if (userLikeIndex !== -1) {
      postToUpdate.likes.splice(userLikeIndex, 1);
      toast({ title: "Post Unliked", description: "You've unliked this post." });
    } else {
      postToUpdate.likes.push(user.id);
      addReputation(2);
      toast({ title: "Post Liked", description: "You've liked this post." });
    }
    
    setPost(postToUpdate);
    allPosts[postIndex] = postToUpdate;
    localStorage.setItem('posts', JSON.stringify(allPosts));
  };
  
  const handleLikeReply = (replyId) => {
    if (!user) return;
    const allReplies = JSON.parse(localStorage.getItem('replies') || '[]');
    const replyIndex = allReplies.findIndex(r => r.id === replyId);
    if (replyIndex === -1) return;

    const replyToUpdate = allReplies[replyIndex];
    replyToUpdate.likes = Array.isArray(replyToUpdate.likes) ? replyToUpdate.likes : [];
    
    const userLikeIndex = replyToUpdate.likes.indexOf(user.id);
    if (userLikeIndex !== -1) {
        replyToUpdate.likes.splice(userLikeIndex, 1);
    } else {
        replyToUpdate.likes.push(user.id);
    }
    
    allReplies[replyIndex] = replyToUpdate;
    localStorage.setItem('replies', JSON.stringify(allReplies));
    
    // Force re-render of replies
    const postReplies = allReplies.filter(reply => reply.postId === postId && !reply.parentId);
    setReplies(postReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  if (!post || !authorDetails) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-red-400">{translations.loading}</p>
      </div>
    );
  }

  const authorRankDetails = getRankDetails(authorDetails.rank);

  return (
    <>
      <Helmet>
        <title>{post.title} - RedDrak ID</title>
        <meta name="description" content={post.content.substring(0, 160)} />
      </Helmet>
      
      <div className="p-4 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect p-6 rounded-lg neon-border">
          <div className="flex items-center space-x-4 mb-4">
             <img src={authorDetails.avatar} alt={authorDetails.username} className="w-12 h-12 rounded-full"/>
             <div>
                <Link to={`/user/${authorDetails.username}`} className={`text-lg font-bold hover:underline ${authorRankDetails.color}`}>{post.author}</Link>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span><i className="fas fa-calendar mr-1"></i>{new Date(post.createdAt).toLocaleString()}</span>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">{post.category}</span>
                </div>
             </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
          {post.image && <div className="mb-4"><img src={post.image} alt={post.title} className="w-full max-w-md rounded-lg" /></div>}
          <div className="text-gray-300 whitespace-pre-wrap mb-6">{post.content}</div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleLikePost} variant="ghost" className="text-gray-400 hover:text-red-400"><i className="fas fa-heart mr-2"></i>{translations.like} ({post.likes.length || 0})</Button>
            <Button onClick={() => navigator.clipboard.writeText(window.location.href)} variant="ghost" className="text-gray-400 hover:text-red-400"><i className="fas fa-share mr-2"></i>{translations.share}</Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-effect p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4"><i className="fas fa-reply mr-2 text-red-400"></i>{translations.reply}</h2>
          <div className="space-y-4">
            <Textarea value={newReply} onChange={(e) => setNewReply(e.target.value)} placeholder="Tulis balasan Anda..." className="bg-black/50 border-red-500/30 text-white focus:border-red-500" rows={4} />
            <Button onClick={() => handleReply(newReply)} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"><i className="fas fa-paper-plane mr-2"></i>Kirim Balasan</Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <h2 className="text-xl font-bold text-white"><i className="fas fa-comments mr-2 text-red-400"></i>Balasan ({replies.length})</h2>
          {replies.length > 0 ? (
            <div className="space-y-4">
              {replies.map((reply) => (
                <Reply key={reply.id} reply={reply} onReply={handleReply} onLike={handleLikeReply}/>
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
