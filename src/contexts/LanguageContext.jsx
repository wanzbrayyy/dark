import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [availableLanguages, setAvailableLanguages] = useState([]);

  useEffect(() => {
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

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage: i18n.language,
      availableLanguages,
      changeLanguage,
      t: i18n.t
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