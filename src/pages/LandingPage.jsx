
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const LandingPage = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage, translations } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Helmet>
        <title>RedDrak ID - {translations.hackerForum}</title>
        <meta name="description" content={translations.forumDescription} />
      </Helmet>
      
      <div className="min-h-screen hacker-bg relative overflow-hidden">
        {/* Matrix Rain Effect */}
        <div className="matrix-rain">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="matrix-char"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {String.fromCharCode(0x30A0 + Math.random() * 96)}
            </div>
          ))}
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 right-0 p-4 z-10">
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

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div 
            className="text-center space-y-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <img 
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/9c787284-7e6e-4715-85e1-97ef9b5e8b32/f2208a44311dd451c805151e8bd9c15c.webp" 
                alt="RedDrak ID" 
                className="w-24 h-24 glow-red rounded-full"
              />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-6xl md:text-8xl font-black gradient-text text-shadow">
                RedDrak ID
              </h1>
              <div className="typing-animation text-2xl md:text-3xl text-red-400 font-semibold">
                {translations.hackerForum}
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              {translations.forumDescription}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-lg font-semibold neon-border"
              >
                <i className="fas fa-user-plus mr-2"></i>
                {translations.joinCommunity}
              </Button>
              
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500/10 px-8 py-3 text-lg font-semibold"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                {translations.login}
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            >
              {[
                { icon: 'fa-shield-alt', title: 'Security Focus', desc: 'Advanced security discussions' },
                { icon: 'fa-users', title: 'Community', desc: 'Connect with experts' },
                { icon: 'fa-code', title: 'Tools & Scripts', desc: 'Share and discover tools' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="glass-effect p-6 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <i className={`fas ${feature.icon} text-3xl text-red-500 mb-4`}></i>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
