
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const tourSteps = [
  {
    title: 'Selamat Datang di RedDrak ID!',
    text: 'Ini adalah tur singkat untuk membantu Anda memulai. Anda dapat melewatinya kapan saja.',
    targetId: 'top-bar-title' 
  },
  {
    title: 'Navigasi Utama',
    text: 'Gunakan bilah navigasi bawah ini untuk menjelajahi fitur-fitur utama seperti Dashboard, Forum, dan Profil Anda.',
    targetId: 'bottom-nav-forum' 
  },
  {
    title: 'Buat Postingan Pertama Anda',
    text: 'Bagikan pengetahuan Anda dengan mengklik tombol "+" untuk membuat postingan baru.',
    targetId: 'bottom-nav-new-post' 
  },
  {
    title: 'Kelola Profil Anda',
    text: 'Klik ikon profil untuk mengedit detail Anda, melihat reputasi, dan pangkat Anda.',
    targetId: 'bottom-nav-profile'
  },
  {
    title: 'Siap Menjelajah!',
    text: 'Anda sekarang siap untuk menjelajahi RedDrak ID. Selamat bersenang-senang dan tetap etis!',
    targetId: null
  }
];

const UserTour = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = tourSteps[stepIndex];
  const targetElement = currentStep.targetId ? document.getElementById(currentStep.targetId) : null;
  
  const getModalPosition = () => {
    if (!targetElement) {
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    const rect = targetElement.getBoundingClientRect();
    const top = rect.bottom + 20; // 20px below the element
    let left = rect.left + rect.width / 2;

    const modalWidth = 320; 
    
    if (left - (modalWidth/2) < 10) {
        left = (modalWidth/2) + 10;
    }
    if (left + (modalWidth/2) > window.innerWidth - 10) {
        left = window.innerWidth - (modalWidth/2) - 10;
    }

    return { top: `${top}px`, left: `${left}px`, transform: 'translateX(-50%)' };
  };

  const handleNext = () => {
    if (stepIndex < tourSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
      >
        {targetElement && (
            <div
                className="fixed bg-red-500/50 rounded-lg transition-all duration-300 pointer-events-none animate-pulse"
                style={{
                    top: targetElement.getBoundingClientRect().top - 5,
                    left: targetElement.getBoundingClientRect().left - 5,
                    width: targetElement.getBoundingClientRect().width + 10,
                    height: targetElement.getBoundingClientRect().height + 10,
                }}
            />
        )}
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed p-6 rounded-lg glass-effect neon-border w-80"
          style={getModalPosition()}
        >
          <div className="text-center">
            <h3 className="text-lg font-bold gradient-text mb-2">{currentStep.title}</h3>
            <p className="text-sm text-gray-300 mb-6">{currentStep.text}</p>
            <div className="flex justify-between items-center">
              <Button onClick={handleSkip} variant="ghost" size="sm" className="text-gray-400">Lewati</Button>
              <div className="text-xs text-gray-500">{stepIndex + 1} / {tourSteps.length}</div>
              <Button onClick={handleNext} size="sm" className="bg-gradient-to-r from-red-600 to-red-700">
                {stepIndex === tourSteps.length - 1 ? 'Selesai' : 'Lanjut'} <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserTour;
