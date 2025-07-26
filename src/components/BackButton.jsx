import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const BackButton = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Pages where the back button should not be displayed
  const noBackButtonPaths = ['/', '/forum', '/auth', '/maintenance'];

  if (noBackButtonPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`fixed top-4 left-4 z-40 ${className}`}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="glass-effect text-white hover:bg-white/20 border border-white/20"
      >
        <i className="fas fa-arrow-left mr-2"></i>
        Kembali
      </Button>
    </motion.div>
  );
};

export default BackButton;