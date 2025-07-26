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

  const login = async (username, password) => {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      const { password: _, ...userWithoutPassword } = data.data;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      toast({
        title: 'Login berhasil!',
        description: `Selamat datang kembali, ${data.data.username}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Login gagal',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      const { password: _, ...userWithoutPassword } = data.data;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      toast({
        title: 'Registrasi berhasil!',
        description: 'Akun Anda telah dibuat. Selamat datang!',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Registrasi gagal',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
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