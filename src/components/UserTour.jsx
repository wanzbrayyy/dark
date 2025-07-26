
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const UserTour = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  const tourSteps = [
    {
      title: "Selamat Datang di RedDark.id! 🎉",
      content: "Ini adalah forum underground Indonesia dengan sistem Bitcoin. Mari kita mulai tur singkat!",
      target: null
    },
    {
      title: "Navigasi Forum 🧭",
      content: "Gunakan menu navigasi untuk menjelajahi berbagai kategori forum seperti Tools, Akun, Script, dan Jasa.",
      target: ".navigation-menu"
    },
    {
      title: "Sistem Ranking 🏆",
      content: "Anda memulai sebagai Newbie dengan 1 poin. Posting dan berinteraksi untuk naik pangkat ke Silver, Gold, Master, hingga Exclusive!",
      target: ".user-rank"
    },
    {
      title: "Bitcoin Wallet 💰",
      content: "Kelola saldo Bitcoin Anda untuk transaksi di forum. Gunakan fitur Deposit dan Withdraw dengan aman.",
      target: ".btc-balance"
    },
    {
      title: "Siap Memulai! 🚀",
      content: "Sekarang Anda siap menjelajahi RedDark.id. Selamat berinteraksi dan jaga keamanan akun Anda!",
      target: null
    }
  ];

  useEffect(() => {
    if (user && !localStorage.getItem(`tour_completed_${user.id}`)) {
      setIsVisible(true);
    }
  }, [user]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const skipTour = () => {
    completeTour();
  };

  const completeTour = () => {
    setIsVisible(false);
    if (user) {
      localStorage.setItem(`tour_completed_${user.id}`, 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center blur-overlay"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-effect rounded-lg p-6 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              {tourSteps[currentStep].title}
            </h3>
            <p className="text-gray-300 mb-6">
              {tourSteps[currentStep].content}
            </p>
            
            <div className="flex items-center justify-center mb-4">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={skipTour}
                className="text-gray-400 hover:text-white"
              >
                Lewati
              </Button>
              <Button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {currentStep === tourSteps.length - 1 ? 'Selesai' : 'Lanjut'}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserTour;
