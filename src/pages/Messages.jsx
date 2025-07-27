
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';

const Messages = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { translations } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Load users
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(allUsers.filter(u => u.id !== user.id));

    // Load conversations
    const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const userConversations = allConversations.filter(conv => 
      conv.participants.includes(user.id)
    );
    setConversations(userConversations);

    // Check if user was passed from UserProfile
    if (location.state?.selectedUser) {
      const targetUser = location.state.selectedUser;
      let conversation = userConversations.find(conv => 
        conv.participants.includes(targetUser.id)
      );

      if (!conversation) {
        // Create new conversation
        conversation = {
          id: `conv-${Date.now()}`,
          participants: [user.id, targetUser.id],
          lastMessage: '',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0
        };
        
        const updatedConversations = [...allConversations, conversation];
        localStorage.setItem('conversations', JSON.stringify(updatedConversations));
        setConversations([...userConversations, conversation]);
      }

      setSelectedConversation(conversation);
      loadMessages(conversation.id);
    }
  }, [user.id, location.state]);

  const loadMessages = (conversationId) => {
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const conversationMessages = allMessages.filter(msg => msg.conversationId === conversationId);
    setMessages(conversationMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: user.id,
      content: newMessage,
      createdAt: new Date().toISOString(),
      read: false
    };

    // Save message
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    allMessages.push(message);
    localStorage.setItem('messages', JSON.stringify(allMessages));

    // Update conversation
    const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const convIndex = allConversations.findIndex(conv => conv.id === selectedConversation.id);
    if (convIndex !== -1) {
      allConversations[convIndex].lastMessage = newMessage;
      allConversations[convIndex].lastMessageTime = new Date().toISOString();
      localStorage.setItem('conversations', JSON.stringify(allConversations));
    }

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate real-time with Socket.IO (mock)
    toast({
      title: "Message Sent",
      description: "🚧 Real-time messaging with Socket.IO isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const startNewConversation = (targetUser) => {
    let conversation = conversations.find(conv => 
      conv.participants.includes(targetUser.id)
    );

    if (!conversation) {
      conversation = {
        id: `conv-${Date.now()}`,
        participants: [user.id, targetUser.id],
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0
      };
      
      const allConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
      allConversations.push(conversation);
      localStorage.setItem('conversations', JSON.stringify(allConversations));
      setConversations(prev => [...prev, conversation]);
    }

    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  const getOtherParticipant = (conversation) => {
    const otherUserId = conversation.participants.find(id => id !== user.id);
    return users.find(u => u.id === otherUserId);
  };

  return (
    <>
      <Helmet>
        <title>{translations.messages} - RedDrak ID</title>
        <meta name="description" content="Private messages on RedDrak ID" />
      </Helmet>
      
      <div className="p-4 h-[calc(100vh-8rem)] flex gap-4">
        {/* Conversations List */}
        <div className="w-1/3 glass-effect rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              <i className="fas fa-envelope text-red-400 mr-2"></i>
              {translations.messages}
            </h2>
          </div>

          {/* New Conversation */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-red-400 mb-2">Start New Chat</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-hide">
              {users.slice(0, 5).map(targetUser => (
                <button
                  key={targetUser.id}
                  onClick={() => startNewConversation(targetUser)}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-red-500/10 transition-colors text-left"
                >
                  <img 
                    src={targetUser.avatar} 
                    alt={targetUser.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-white text-sm">{targetUser.username}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
            {conversations.map(conversation => {
              const otherUser = getOtherParticipant(conversation);
              if (!otherUser) return null;

              return (
                <motion.button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    loadMessages(conversation.id);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                    selectedConversation?.id === conversation.id 
                      ? 'bg-red-500/20 border border-red-500/30' 
                      : 'hover:bg-red-500/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img 
                    src={otherUser.avatar} 
                    alt={otherUser.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white truncate">
                        {otherUser.username}
                      </span>
                      {conversation.lastMessageTime && (
                        <span className="text-xs text-gray-400">
                          {new Date(conversation.lastMessageTime).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass-effect rounded-lg flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-red-500/20">
                {(() => {
                  const otherUser = getOtherParticipant(selectedConversation);
                  return otherUser ? (
                    <div className="flex items-center space-x-3">
                      <img 
                        src={otherUser.avatar} 
                        alt={otherUser.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-white">{otherUser.username}</h3>
                        <p className="text-sm text-gray-400">
                          {otherUser.rank} • Online
                        </p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto scrollbar-hide space-y-4">
                {messages.map(message => {
                  const isOwn = message.senderId === user.id;
                  const sender = isOwn ? user : getOtherParticipant(selectedConversation);

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-xs ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <img 
                          src={sender?.avatar} 
                          alt={sender?.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className={`p-3 rounded-lg ${
                          isOwn 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-700 text-gray-100'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-red-500/20">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-black/50 border-red-500/30 text-white focus:border-red-500"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-comments text-6xl text-gray-400 mb-4"></i>
                <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
                <p className="text-gray-400">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;
