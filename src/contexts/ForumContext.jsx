import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';

const ForumContext = createContext();

export const ForumProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories] = useState(['tools', 'accounts', 'scripts', 'services', 'general']);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const savedPosts = localStorage.getItem('forumPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with sample posts
      const samplePosts = [
        {
          id: '1',
          title: 'Premium Netflix Account Generator',
          content: 'Tool untuk generate akun Netflix premium gratis. Sudah tested dan working 100%.',
          author: 'darktools',
          category: 'tools',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          votes: { up: 15, down: 2 },
          comments: [],
          downloads: 45,
          price: 0.001,
          fileUrl: '#',
          fileName: 'netflix-generator.zip',
          imageUrl: 'https://images.unsplash.com/photo-1616469829935-c2f334623b83',
          status: 'verified'
        },
        {
          id: '2',
          title: 'Jasa Pembuatan Bot Telegram',
          content: 'Menerima jasa pembuatan bot Telegram custom sesuai kebutuhan. Harga mulai 0.005 BTC.',
          author: 'botmaster',
          category: 'services',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          votes: { up: 8, down: 0 },
          comments: [],
          downloads: 0,
          price: 0.005,
          fileUrl: null,
          fileName: null,
          imageUrl: null,
          status: 'active'
        }
      ];
      setPosts(samplePosts);
      localStorage.setItem('forumPosts', JSON.stringify(samplePosts));
    }
  }, []);

  const createPost = (postData) => {
    const newPost = {
      id: Date.now().toString(),
      ...postData,
      createdAt: new Date().toISOString(),
      votes: { up: 0, down: 0 },
      comments: [],
      downloads: 0,
      status: 'active'
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
    
    toast({
      title: "Post berhasil dibuat!",
      description: "Post Anda telah dipublikasikan di forum."
    });
    
    return newPost;
  };

  const votePost = (postId, voteType) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newVotes = { ...post.votes };
        if (voteType === 'up') {
          newVotes.up += 1;
        } else {
          newVotes.down += 1;
        }
        return { ...post, votes: newVotes };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
    
    toast({
      title: "Vote berhasil!",
      description: `Anda telah memberikan ${voteType === 'up' ? 'upvote' : 'downvote'}.`
    });
  };

  const addComment = (postId, comment) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now().toString(),
          ...comment,
          createdAt: new Date().toISOString(),
          votes: { up: 0, down: 0 }
        };

        // Handle notifications for tags and replies
        const taggedUsers = newComment.content.match(/@(\w+)/g);
        if (taggedUsers) {
          taggedUsers.forEach(tag => {
            const username = tag.substring(1);
            if (username !== newComment.author) {
              addNotification({
                type: 'tag',
                message: `${newComment.author} menyebut Anda di komentar pada post "${post.title}"`,
                link: `/post/${postId}`,
                recipient: username
              });
            }
          });
        }

        if (newComment.replyTo && newComment.replyTo !== newComment.author) {
          addNotification({
            type: 'reply',
            message: `${newComment.author} membalas komentar Anda pada post "${post.title}"`,
            link: `/post/${postId}`,
            recipient: newComment.replyTo
          });
        }

        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
    
    toast({
      title: "Komentar berhasil ditambahkan!",
      description: "Komentar Anda telah dipublikasikan."
    });
  };

  const incrementDownloadCount = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, downloads: post.downloads + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
  };

  const getPostsByCategory = (category) => {
    if (!category || category === 'all') return posts;
    return posts.filter(post => post.category === category);
  };

  const searchPosts = (query) => {
    if (!query) return posts;
    return posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <ForumContext.Provider value={{
      posts,
      categories,
      createPost,
      votePost,
      addComment,
      incrementDownloadCount,
      getPostsByCategory,
      searchPosts
    }}>
      {children}
    </ForumContext.Provider>
  );
};

export const useForum = () => {
  const context = useContext(ForumContext);
  if (!context) {
    throw new Error('useForum must be used within a ForumProvider');
  }
  return context;
};