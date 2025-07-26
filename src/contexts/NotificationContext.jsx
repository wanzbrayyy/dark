import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    } else {
      setNotifications([]);
    }
  }, [user]);

  const addNotification = (notification) => {
    // This is a simplified notification system. In a real app, this would be handled by a server.
    // We'll store notifications for all users in one place for this demo.
    const allNotifications = JSON.parse(localStorage.getItem('all_notifications') || '[]');
    
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      createdAt: new Date().toISOString(),
      read: false,
    };

    allNotifications.push(newNotification);
    localStorage.setItem('all_notifications', JSON.stringify(allNotifications));

    // If the notification is for the current user, update the state
    if (user && notification.recipient === user.username) {
      const updatedNotifications = [newNotification, ...notifications];
      setNotifications(updatedNotifications);
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
    }
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
    }
  };

  // On login, load the user's notifications
  useEffect(() => {
    if (user) {
      const allNotifications = JSON.parse(localStorage.getItem('all_notifications') || '[]');
      const userNotifications = allNotifications.filter(n => n.recipient === user.username).reverse();
      setNotifications(userNotifications);
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(userNotifications));
    }
  }, [user]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};