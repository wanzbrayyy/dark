
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { translations } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    const success = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      bio: formData.bio
    });
    
    if (success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <Helmet>
        <title>{translations.register} - RedDrak ID</title>
        <meta name="description" content={`${translations.register} for RedDrak ID`} />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center hacker-bg p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass-effect p-8 rounded-lg neon-border">
            <div className="text-center mb-8">
              <img 
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/9c787284-7e6e-4715-85e1-97ef9b5e8b32/f2208a44311dd451c805151e8bd9c15c.webp" 
                alt="RedDrak ID" 
                className="w-16 h-16 mx-auto mb-4 glow-red rounded-full"
              />
              <h1 className="text-3xl font-bold gradient-text">{translations.register}</h1>
              <p className="text-gray-400 mt-2">Join the RedDrak ID community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-red-400">
                  {translations.username}
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-black/50 border-red-500/30 text-white focus:border-red-500"
                  placeholder="Choose a username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-red-400">
                  {translations.email}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-black/50 border-red-500/30 text-white focus:border-red-500"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-red-400">
                  {translations.password}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-black/50 border-red-500/30 text-white focus:border-red-500"
                  placeholder="Create a password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-red-400">
                  {translations.confirmPassword}
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-black/50 border-red-500/30 text-white focus:border-red-500"
                  placeholder="Confirm your password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-red-400">
                  {translations.bio} (Optional)
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="bg-black/50 border-red-500/30 text-white focus:border-red-500"
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3"
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-user-plus mr-2"></i>
                )}
                {translations.register}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {translations.alreadyHaveAccount}{' '}
                <Link to="/login" className="text-red-400 hover:text-red-300 font-semibold">
                  {translations.login}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;
