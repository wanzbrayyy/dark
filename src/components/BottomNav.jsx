
    import React from 'react';
    import { NavLink } from 'react-router-dom';
    import { Home, MessageSquare, PlusSquare, User } from 'lucide-react';
    import { motion } from 'framer-motion';

    const navItems = [
      { path: '/', icon: Home, label: 'Beranda' },
      { path: '/forum', icon: MessageSquare, label: 'Forum' },
      { path: '/new-post', icon: PlusSquare, label: 'Post' },
      { path: '/profile', icon: User, label: 'Profil' },
    ];

    const BottomNav = () => {
      return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-red-500/20 z-50">
          <div className="container mx-auto px-4 h-16 flex justify-around items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center w-1/4 transition-colors duration-300 ${
                    isActive ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <motion.div className="relative flex flex-col items-center">
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs mt-1">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-2 h-1 w-8 bg-red-500 rounded-full"
                        layoutId="active-indicator"
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      );
    };

    export default BottomNav;
  