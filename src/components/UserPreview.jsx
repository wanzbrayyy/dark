import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const UserPreview = ({ user, onClose }) => {
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-effect rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            <i className="fas fa-user mr-2"></i>
            {t('user_preview')}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <i className="fas fa-times"></i>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <i className="fas fa-user-secret text-2xl text-white"></i>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user.username}</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserPreview;
