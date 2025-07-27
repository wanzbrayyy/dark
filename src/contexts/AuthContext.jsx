
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { rankSystem, checkRankUp } from '@/lib/rankSystem';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initDefaultData = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const defaultUsers = [
        {
          id: 'admin-1',
          username: 'wanz',
          email: 'admin@reddrak.id',
          password: 'wanz2',
          role: 'admin',
          rank: 'admin',
          reputation: 1000,
          avatar: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/9c787284-7e6e-4715-85e1-97ef9b5e8b32/f2208a44311dd451c805151e8bd9c15c.webp',
          bio: 'RedDrak ID Administrator',
          joinedAt: new Date().toISOString(),
          postsCount: 0,
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  };

  useEffect(() => {
    initDefaultData();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    setLoading(false);
  }, []);

  const updateUserInStorage = (updatedUser) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const login = async (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.username}!`,
      });
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.username === userData.username)) {
      toast({ title: "Registration Failed", description: "Username already exists", variant: "destructive" });
      return false;
    }
    
    if (users.some(u => u.email === userData.email)) {
      toast({ title: "Registration Failed", description: "Email already exists", variant: "destructive" });
      return false;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      role: 'user',
      rank: 'newbie',
      reputation: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      joinedAt: new Date().toISOString(),
      postsCount: 0,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('isNewUser', 'true'); // Flag for tour
    
    toast({ title: "Registration Successful", description: `Welcome to RedDrak ID, ${newUser.username}!` });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rankUp');
    toast({ title: "Logged Out", description: "You have been logged out successfully" });
  };
  
  const updateUser = (updatedData) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    updateUserInStorage(updatedUser);
  };

  const addReputation = (amount) => {
    if (!user) return;
    const newReputation = (user.reputation || 0) + amount;
    const oldRank = user.rank;
    const newRank = checkRankUp(oldRank, newReputation);

    const updatedUser = { ...user, reputation: newReputation };

    if (newRank && newRank !== oldRank) {
      updatedUser.rank = newRank;
      const rankData = rankSystem.find(r => r.id === newRank);
      localStorage.setItem('rankUp', JSON.stringify({ rank: rankData.name, icon: rankData.icon }));
    }
    
    updateUserInStorage(updatedUser);
  };
  
  const incrementPostsCount = () => {
    if (!user) return;
    const updatedUser = { ...user, postsCount: (user.postsCount || 0) + 1 };
    updateUserInStorage(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUser,
      addReputation,
      incrementPostsCount,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
