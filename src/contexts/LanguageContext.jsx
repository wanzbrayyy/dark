
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    forum: 'Forum',
    newPost: 'New Post',
    profile: 'Profile',
    messages: 'Messages',
    admin: 'Admin',
    logout: 'Logout',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    reply: 'Reply',
    like: 'Like',
    share: 'Share',
    copy: 'Copy',
    search: 'Search',
    
    // Landing Page
    welcomeToRedDrak: 'Welcome to RedDrak ID',
    hackerForum: 'Hacker Community Forum',
    forumDescription: 'Join the ultimate hacker community. Share knowledge, discuss tools, and connect with fellow security enthusiasts.',
    joinCommunity: 'Join Community',
    learnMore: 'Learn More',
    
    // Auth
    login: 'Login',
    register: 'Register',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    bio: 'Bio',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    
    // Posts
    title: 'Title',
    description: 'Description',
    category: 'Category',
    categories: {
      general: 'General',
      tools: 'Tools',
      malware: 'Malware',
      learn: 'Learn',
      ransomware: 'Ransomware'
    },
    
    // User Ranks
    ranks: {
      newbie: 'Newbie',
      member: 'Member',
      advanced: 'Advanced',
      expert: 'Expert',
      moderator: 'Moderator',
      admin: 'Admin'
    },
    
    // Maintenance
    maintenanceMode: 'Maintenance Mode',
    maintenanceModeActive: 'System is under maintenance',
    
    // Notifications
    featureNotImplemented: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀'
  },
  id: {
    // Navigation
    dashboard: 'Dashboard',
    forum: 'Forum',
    newPost: 'Post Baru',
    profile: 'Profil',
    messages: 'Pesan',
    admin: 'Admin',
    logout: 'Keluar',
    
    // Common
    loading: 'Memuat...',
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Edit',
    reply: 'Balas',
    like: 'Suka',
    share: 'Bagikan',
    copy: 'Salin',
    search: 'Cari',
    
    // Landing Page
    welcomeToRedDrak: 'Selamat Datang di RedDrak ID',
    hackerForum: 'Forum Komunitas Hacker',
    forumDescription: 'Bergabunglah dengan komunitas hacker terbaik. Berbagi pengetahuan, diskusi tools, dan terhubung dengan sesama enthusiast keamanan.',
    joinCommunity: 'Gabung Komunitas',
    learnMore: 'Pelajari Lebih Lanjut',
    
    // Auth
    login: 'Masuk',
    register: 'Daftar',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Konfirmasi Password',
    bio: 'Bio',
    alreadyHaveAccount: 'Sudah punya akun?',
    dontHaveAccount: 'Belum punya akun?',
    
    // Posts
    title: 'Judul',
    description: 'Deskripsi',
    category: 'Kategori',
    categories: {
      general: 'Umum',
      tools: 'Tools',
      malware: 'Malware',
      learn: 'Belajar',
      ransomware: 'Ransomware'
    },
    
    // User Ranks
    ranks: {
      newbie: 'Pemula',
      member: 'Member',
      advanced: 'Lanjutan',
      expert: 'Ahli',
      moderator: 'Moderator',
      admin: 'Admin'
    },
    
    // Maintenance
    maintenanceMode: 'Mode Maintenance',
    maintenanceModeActive: 'Sistem sedang dalam pemeliharaan',
    
    // Notifications
    featureNotImplemented: '🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀'
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'id';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'id' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      toggleLanguage, 
      translations: translations[language] 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
