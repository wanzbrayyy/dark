
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const TopBar = () => {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-red-500/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <img 
            src="https://storage.googleapis.com/hostinger-horizons-assets-prod/9c787284-7e6e-4715-85e1-97ef9b5e8b32/f2208a44311dd451c805151e8bd9c15c.webp" 
            alt="RedDrak ID" 
            className="w-8 h-8"
          />
          <h1 className="text-xl font-bold gradient-text">RedDrak ID</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs font-medium"
          >
            {language.toUpperCase()}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TopBar;
