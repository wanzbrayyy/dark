
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const NotFound = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found - RedDrak ID</title>
        <meta name="description" content="Page not found on RedDrak ID" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center hacker-bg p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          {/* Animated 404 */}
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-4"
          >
            <div className="text-8xl md:text-9xl font-black gradient-text text-shadow">
              404
            </div>
            <div className="text-2xl md:text-3xl text-red-400 font-semibold">
              Page Not Found
            </div>
          </motion.div>

          {/* Lottie-style animation placeholder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-32 h-32 border-4 border-red-500/30 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-4xl text-red-500 animate-bounce"></i>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-y-4"
          >
            <p className="text-lg text-gray-300 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-gray-400">
              Let's get you back to the action!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-lg font-semibold neon-border"
            >
              <i className="fas fa-home mr-2"></i>
              Go Home
            </Button>
            
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500/10 px-8 py-3 text-lg font-semibold"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Go Back
            </Button>
          </motion.div>

          {/* Matrix Rain Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-red-500/20 font-mono text-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, 100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                404
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
