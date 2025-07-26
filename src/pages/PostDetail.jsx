import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useForum } from '@/contexts/ForumContext';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/use-toast';
import BackButton from '@/components/BackButton';
import LanguageSelector from '@/components/LanguageSelector';
import UserPreview from '@/components/UserPreview';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, votePost, addComment, incrementDownloadCount } = useForum();
  const { t } = useTranslation();
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [showUserPreview, setShowUserPreview] = useState(false);
  const [previewUser, setPreviewUser] = useState(null);

  const post = posts.find(p => p.id === id);

  if (!post) {
    navigate('/forum');
    return null;
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleVote = (voteType) => {
    votePost(post.id, voteType);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      content: commentText,
      author: user.username,
      replyTo: replyTo,
    };

    addComment(post.id, newComment);

    const mentionedUsers = commentText.match(/@(\w+)/g);
    if (mentionedUsers) {
      mentionedUsers.forEach(async (mention) => {
        const username = mention.substring(1);
        // In a real app, you'd get the user ID from the username
        const userId = 'some-user-id'; // Replace with actual user ID
        await axios.post('/api/notifications', {
          user: userId,
          message: `${user.username} mentioned you in a comment.`,
        });
      });
    }

    setCommentText('');
    setReplyTo(null);
  };

  const handleDownload = () => {
    if (!post.fileUrl) return;
    
    incrementDownloadCount(post.id);

    const link = document.createElement('a');
    link.href = post.fileUrl;
    link.setAttribute('download', post.fileName || 'download');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download dimulai!",
      description: `Mengunduh ${post.fileName || 'file'}...`
    });
  };

  const handleReport = () => {
    toast({
      title: "Postingan dilaporkan!",
      description: "Terima kasih atas laporan Anda. Tim kami akan meninjaunya."
    });
  };

  const handleReply = (commentAuthor) => {
    setReplyTo(commentAuthor);
    setCommentText(prev => `@${commentAuthor} ${prev.replace(/@\w+\s/, '')}`);
  };

  const handleTag = (username) => {
    setCommentText(prev => `${prev}${prev ? ' ' : ''}@${username} `);
  };

  const handleUserPreview = (username) => {
    // In a real app, you'd fetch the user data here
    const userToPreview = {
      username: username,
      email: `${username}@example.com`,
      avatar: null,
    };
    setPreviewUser(userToPreview);
    setShowUserPreview(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>{post.title} - RedDark.id</title>
        <meta name="description" content={post.content.substring(0, 160)} />
      </Helmet>

      {showUserPreview && (
        <UserPreview
          user={previewUser}
          onClose={() => setShowUserPreview(false)}
        />
      )}

      <BackButton />

      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold gradient-text">Post Detail</h1>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dark-card rounded-lg p-6 mb-6"
        >
          {/* Post Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  post.category === 'tools' ? 'bg-blue-600/20 text-blue-400' :
                  post.category === 'accounts' ? 'bg-green-600/20 text-green-400' :
                  post.category === 'scripts' ? 'bg-purple-600/20 text-purple-400' :
                  post.category === 'services' ? 'bg-orange-600/20 text-orange-400' :
                  'bg-gray-600/20 text-gray-400'
                }`}>
                  {t(post.category)}
                </span>
                {post.status === 'verified' && (
                  <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-medium">
                    <i className="fas fa-check-circle mr-1"></i>
                    Verified
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <span
                  className="cursor-pointer hover:text-white"
                  onClick={() => handleUserPreview(post.author)}
                >
                  <i className="fas fa-user mr-2"></i>
                  {post.author}
                </span>
                <span>
                  <i className="fas fa-clock mr-2"></i>
                  {new Date(post.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            {post.price > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-400">₿{post.price}</div>
                <div className="text-gray-400 text-sm">Bitcoin</div>
              </div>
            )}
          </div>

          {/* Image Preview */}
          {post.imageUrl && (
            <div className="mb-6">
              <img src={post.imageUrl} alt="Post preview" className="rounded-lg max-h-96 w-auto mx-auto" />
            </div>
          )}

          {/* Post Content */}
          <div className="prose prose-invert max-w-none mb-6">
            <p className="text-gray-300 text-lg leading-relaxed">{post.content}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleVote('up')}
                variant="ghost"
                size="sm"
                className="text-green-400 hover:bg-green-600/20"
              >
                <i className="fas fa-thumbs-up mr-2"></i>
                {post.votes.up}
              </Button>
              <Button
                onClick={() => handleVote('down')}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:bg-red-600/20"
              >
                <i className="fas fa-thumbs-down mr-2"></i>
                {post.votes.down}
              </Button>
            </div>
            
            {post.fileUrl && (
              <Button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <i className="fas fa-download mr-2"></i>
                {t('download')}
              </Button>
            )}
            
            <Button
              onClick={handleReport}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600/20"
            >
              <i className="fas fa-flag mr-2"></i>
              {t('report')}
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-400 border-t border-white/10 pt-4">
            <span>
              <i className="fas fa-download mr-2 text-blue-400"></i>
              {post.downloads} downloads
            </span>
            <span>
              <i className="fas fa-comments mr-2 text-purple-400"></i>
              {post.comments.length} {t('comments')}
            </span>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="dark-card rounded-lg p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">
            <i className="fas fa-comments mr-2"></i>
            {t('comments')} ({post.comments.length})
          </h2>

          {/* Add Comment Form */}
          <form onSubmit={handleComment} className="mb-6">
            {replyTo && (
              <div className="text-sm text-gray-400 mb-2">
                Membalas <span className="font-semibold text-blue-400">@{replyTo}</span>
                <button onClick={() => setReplyTo(null)} className="ml-2 text-red-400">[Batal]</button>
              </div>
            )}
            <div className="mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Tulis komentar Anda... Gunakan @ untuk mention user."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={!commentText.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Kirim Komentar
            </Button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-effect rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{comment.author}</span>
                    <span className="text-gray-400 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleReply(comment.author)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:bg-blue-600/20"
                    >
                      <i className="fas fa-reply mr-1"></i>
                      Balas
                    </Button>
                  </div>
                </div>
                <p className="text-gray-300">
                  {comment.replyTo && <span className="text-blue-400 mr-1">@{comment.replyTo}</span>}
                  {comment.content.replace(`@${comment.replyTo} `, '')}
                </p>
              </motion.div>
            ))}

            {post.comments.length === 0 && (
              <div className="text-center py-8">
                <i className="fas fa-comments text-4xl text-gray-600 mb-4"></i>
                <p className="text-gray-400">Belum ada komentar. Jadilah yang pertama!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PostDetail;