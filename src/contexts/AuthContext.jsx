import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (username, password) => {
    // Admin login
    if (username === 'wanzofc' && password === 'wanz01') {
      const adminUser = {
        id: 'admin',
        username: 'wanzofc',
        email: 'admin@reddark.id',
        role: 'admin',
        rank: 'Owner',
        points: 9000000999,
        btcBalance: 0,
        avatar: null,
        joinDate: new Date().toISOString(),
        totalPosts: 0,
        totalTransactions: 0
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      toast({
        title: "Login berhasil!",
        description: "Selamat datang kembali, Admin!"
      });
      return true;
    }

    // Regular user login
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      toast({
        title: "Login berhasil!",
        description: `Selamat datang kembali, ${foundUser.username}!`
      });
      return true;
    }
    
    toast({
      title: "Login gagal",
      description: "Username atau password salah",
      variant: "destructive"
    });
    return false;
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username exists
    if (users.find(u => u.username === userData.username)) {
      toast({
        title: "Registrasi gagal",
        description: "Username sudah digunakan",
        variant: "destructive"
      });
      return false;
    }

    // Check if email exists
    if (users.find(u => u.email === userData.email)) {
      toast({
        title: "Registrasi gagal",
        description: "Email sudah digunakan",
        variant: "destructive"
      });
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: 'user',
      rank: 'Newbie',
      points: 1, // Starting point for new users
      btcBalance: 0,
      avatar: null,
      joinDate: new Date().toISOString(),
      totalPosts: 0,
      totalTransactions: 0
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    toast({
      title: "Registrasi berhasil!",
      description: "Akun Anda telah dibuat. Selamat datang!"
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logout berhasil",
      description: "Sampai jumpa lagi!"
    });
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const getRankInfo = (points) => {
    if (points >= 1000000) return { name: 'Legend', color: 'rank-legend' };
    if (points >= 500000) return { name: 'Mythic', color: 'rank-mythic' };
    if (points >= 100000) return { name: 'Grandmaster', color: 'rank-grandmaster' };
    if (points >= 10000) return { name: 'Elite', color: 'rank-elite' };
    if (points >= 1000) return { name: 'Exclusive', color: 'rank-exclusive' };
    if (points >= 500) return { name: 'Master', color: 'rank-master' };
    if (points >= 100) return { name: 'Gold', color: 'rank-gold' };
    if (points >= 25) return { name: 'Silver', color: 'rank-silver' };
    return { name: 'Newbie', color: 'rank-newbie' };
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      getRankInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};