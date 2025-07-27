
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Helmet } from 'react-helmet';
    import { Button } from '@/components/ui/button';
    import { useNavigate } from 'react-router-dom';

    const Home = () => {
      const navigate = useNavigate();
      return (
        <>
          <Helmet>
            <title>Beranda - redDrak ID</title>
            <meta name="description" content="Welcome to redDrak ID. A platform for cybersecurity activists.." />
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center flex flex-col items-center justify-center h-full"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tighter mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="text-red-500">redDrak</span> ID
            </motion.h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
              Welcome to a home for ethical hackers, developers, and tech enthusiasts. Join the discussion, share your knowledge, and improve your skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => navigate('/register')} size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                Mulai Sekarang
              </Button>
              <Button onClick={() => navigate('/forum')} size="lg" variant="outline">
                Jelajahi Forum
              </Button>
            </div>
          </motion.div>
        </>
      );
    };

    export default Home;
  