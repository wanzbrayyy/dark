import React, { createContext, useContext, useState, useEffect } from 'react';
import { translateText } from '../lib/translate';

const LanguageContext = createContext();

const translations = {
  id: {
    // Navigation
    home: 'Beranda',
    forum: 'Forum',
    profile: 'Profil',
    login: 'Masuk',
    register: 'Daftar',
    logout: 'Keluar',
    deposit: 'Deposit',
    withdraw: 'Tarik',
    notifications: 'Notifikasi',
    
    // Landing Page
    welcome: 'Selamat Datang di RedDark.id',
    subtitle: 'Forum Underground Indonesia dengan Sistem Bitcoin',
    viewForum: 'Lihat Forum',
    joinNow: 'Gabung Sekarang',
    
    // Forum
    categories: 'Kategori',
    tools: 'Tools',
    accounts: 'Akun',
    scripts: 'Script',
    services: 'Jasa',
    general: 'Umum',
    search: 'Cari...',
    newPost: 'Post Baru',
    
    // Post
    comments: 'Komentar',
    download: 'Download',
    report: 'Laporkan',
    vote: 'Vote',
    
    // Profile
    balance: 'Saldo',
    transactions: 'Transaksi',
    posts: 'Postingan',
    rank: 'Pangkat',
    
    // Maintenance
    maintenance: 'Sedang Dalam Pemeliharaan',
    maintenanceDesc: 'Situs sedang dalam pemeliharaan. Silakan kembali lagi nanti.',
    backToHome: 'Kembali ke Beranda',
    
    // Admin
    adminPanel: 'Panel Admin',
    maintenanceMode: 'Mode Pemeliharaan',
    settings: 'Pengaturan',
    
    // Bitcoin
    btcAddress: 'Alamat Bitcoin',
    amount: 'Jumlah',
    generateQR: 'Generate QR Code',
    
    // Ranks
    Newbie: 'Newbie',
    Silver: 'Silver',
    Gold: 'Gold',
    Master: 'Master',
    Exclusive: 'Exclusive',
    Elite: 'Elite',
    Grandmaster: 'Grandmaster',
    Mythic: 'Mythic',
    Legend: 'Legend',
    Owner: 'Owner',
  },
  en: {
    // Navigation
    home: 'Home',
    forum: 'Forum',
    profile: 'Profile',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    notifications: 'Notifications',
    
    // Landing Page
    welcome: 'Welcome to RedDark.id',
    subtitle: 'Indonesian Underground Forum with Bitcoin System',
    viewForum: 'View Forum',
    joinNow: 'Join Now',
    
    // Forum
    categories: 'Categories',
    tools: 'Tools',
    accounts: 'Accounts',
    scripts: 'Scripts',
    services: 'Services',
    general: 'General',
    search: 'Search...',
    newPost: 'New Post',
    
    // Post
    comments: 'Comments',
    download: 'Download',
    report: 'Report',
    vote: 'Vote',
    
    // Profile
    balance: 'Balance',
    transactions: 'Transactions',
    posts: 'Posts',
    rank: 'Rank',
    
    // Maintenance
    maintenance: 'Under Maintenance',
    maintenanceDesc: 'Site is under maintenance. Please come back later.',
    backToHome: 'Back to Home',
    
    // Admin
    adminPanel: 'Admin Panel',
    maintenanceMode: 'Maintenance Mode',
    settings: 'Settings',
    
    // Bitcoin
    btcAddress: 'Bitcoin Address',
    amount: 'Amount',
    generateQR: 'Generate QR Code',
    
    // Ranks
    Newbie: 'Newbie',
    Silver: 'Silver',
    Gold: 'Gold',
    Master: 'Master',
    Exclusive: 'Exclusive',
    Elite: 'Elite',
    Grandmaster: 'Grandmaster',
    Mythic: 'Mythic',
    Legend: 'Legend',
    Owner: 'Owner',
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('id');
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [translatedContent, setTranslatedContent] = useState({});

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'id';
    setCurrentLanguage(savedLanguage);
    
    setAvailableLanguages([
      { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
      { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
      { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
    ]);
  }, []);

  const changeLanguage = async (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('language', languageCode);

    if (languageCode === 'id') {
      setTranslatedContent({});
      return;
    }

    const newTranslations = {};
    for (const key in translations.id) {
      const text = translations.id[key];
      const translatedText = await translateText(text, languageCode);
      newTranslations[key] = translatedText;
    }
    setTranslatedContent(newTranslations);
  };

  const t = (key) => {
    if (currentLanguage === 'id') {
      return translations.id[key] || key;
    }
    return translatedContent[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      availableLanguages,
      changeLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
