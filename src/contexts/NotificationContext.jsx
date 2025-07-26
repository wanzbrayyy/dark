import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket && user) {
      socket.emit('join', user._id);

      // fetch initial notifications
      // axios.get(`/api/notifications/${user._id}`).then(res => {
      //   setNotifications(res.data);
      //   setUnreadCount(res.data.filter(n => !n.read).length);
      // });

      socket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        socket.off('notification');
      };
    }
  }, [socket, user]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
    // Here you would also send a request to your API to mark the notification as read
    // axios.post(`/api/notifications/${id}/read`);
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};