import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('id');
  const [translations, setTranslations] = useState({});
  const [availableLanguages, setAvailableLanguages] = useState([]);

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

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const res = await fetch(`/locales/${currentLanguage}.json`);
        const data = await res.json();
        setTranslations(data);
      } catch (error) {
        console.error(`Could not load translations for ${currentLanguage}`, error);
      }
    };

    fetchTranslations();
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('language', languageCode);
  };

  const t = (key) => {
    return translations[key] || key;
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
