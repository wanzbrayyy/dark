
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Helmet } from 'react-helmet';
    import { Button } from '@/components/ui/button';
    import { useToast } from "@/components/ui/use-toast";
    import { ArrowLeft } from 'lucide-react';
    import { useNavigate } from 'react-router-dom';

    const Register = () => {
      const { toast } = useToast();
      const navigate = useNavigate();

      const handleRegister = (e) => {
        e.preventDefault();
        toast({
          title: "🚧 Fitur Belum Tersedia 🚧",
          description: "Pendaftaran dengan Supabase belum diimplementasikan. Minta saya untuk mengintegrasikannya! 🚀",
          variant: "destructive",
        });
      };

      return (
        <>
          <Helmet>
            <title>Daftar - redDrak ID</title>
          </Helmet>
          <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <Button variant="ghost" onClick={() => navigate(-1)} className="absolute top-4 left-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
              </Button>
              <div className="bg-background/80 backdrop-blur-sm border border-red-500/20 rounded-xl p-8 shadow-lg shadow-red-500/10">
                <h1 className="text-3xl font-bold text-center text-red-500 mb-2">Buat Akun</h1>
                <p className="text-center text-muted-foreground mb-8">Bergabunglah dengan komunitas.</p>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-muted-foreground" htmlFor="username">Username</label>
                    <input id="username" type="text" className="mt-2 w-full bg-background border border-muted-foreground/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="username_unik" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-muted-foreground" htmlFor="email">Email</label>
                    <input id="email" type="email" className="mt-2 w-full bg-background border border-muted-foreground/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="email@contoh.com" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-muted-foreground" htmlFor="password">Password</label>
                    <input id="password" type="password" className="mt-2 w-full bg-background border border-muted-foreground/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="••••••••" />
                  </div>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3">
                    Daftar
                  </Button>
                </form>
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Sudah punya akun? <a href="/login" className="text-red-500 hover:underline">Masuk di sini</a>
                </p>
              </div>
            </motion.div>
          </div>
        </>
      );
    };

    export default Register;
  