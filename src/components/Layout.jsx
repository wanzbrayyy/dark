import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import TopBar from '@/components/TopBar';
import { motion } from 'framer-motion';

const Layout = () => {
  return (
    <div className="min-h-screen hacker-bg">
      <TopBar />
      
      <main className="pb-20 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;