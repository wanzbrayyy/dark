
    import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Sun, Moon, Globe } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useToast } from "@/components/ui/use-toast";

    const Header = ({ toggleTheme, currentTheme }) => {
      const { toast } = useToast();
      const [language, setLanguage] = useState('ID');

      const handleLanguageSwitch = () => {
        const newLang = language === 'ID' ? 'EN' : 'ID';
        setLanguage(newLang);
        toast({
          title: "Bahasa Diubah!",
          description: `Bahasa telah diubah ke ${newLang === 'ID' ? 'Indonesia' : 'English'}.`,
        });
      };
      
      const handleFeatureClick = () => {
        toast({
          title: "🚧 Fitur Belum Tersedia 🚧",
          description: "segera hadir",
          variant: "destructive",
        });
      };

      return (
        <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b border-red-500/20 z-50">
          <div className="container mx-auto px-4 h-16 flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-red-500 tracking-widest"
            >
              redDrak<span className="text-foreground">ID</span>
            </motion.div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleFeatureClick}>
                <Globe className="h-5 w-5" />
                <span className="ml-2 text-xs font-bold">{language}</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {currentTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </header>
      );
    };

    export default Header;
  