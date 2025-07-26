
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
];

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLang = languages.find(lang => lang.code === i18n.language);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-white hover:bg-white/10"
      >
        <i className="fas fa-globe mr-2"></i>
        {currentLang?.flag} {currentLang?.code.toUpperCase()}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center blur-overlay"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-effect rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  <i className="fas fa-globe mr-2"></i>
                  Pilih Bahasa / Select Language
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>

              <div className="grid gap-2">
                {languages.map((language) => (
                  <motion.button
                    key={language.code}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => changeLanguage(language.code)}
                    className={`flex items-center p-3 rounded-lg transition-all ${
                      i18n.language === language.code
                        ? 'bg-blue-600/30 border border-blue-500'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl mr-3">{language.flag}</span>
                    <div className="text-left">
                      <div className="text-white font-medium">{language.name}</div>
                      <div className="text-gray-400 text-sm">{language.code.toUpperCase()}</div>
                    </div>
                    {i18n.language === language.code && (
                      <i className="fas fa-check ml-auto text-blue-400"></i>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LanguageSelector;
