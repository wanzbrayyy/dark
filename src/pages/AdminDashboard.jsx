
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { translations } = useLanguage();
  const [stats, setStats] = useState({});
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceStart, setMaintenanceStart] = useState('');
  const [maintenanceEnd, setMaintenanceEnd] = useState('');
  const [productRecommendations, setProductRecommendations] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '' });

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const forums = JSON.parse(localStorage.getItem('forums') || '[]');
    
    setStats({
      totalPosts: posts.length,
      totalUsers: users.length,
      totalForums: forums.length,
      onlineUsers: Math.floor(Math.random() * 50) + 10
    });

    const maintenance = localStorage.getItem('maintenanceMode') === 'true';
    setMaintenanceMode(maintenance);
    setMaintenanceStart(localStorage.getItem('maintenanceStart') || '');
    setMaintenanceEnd(localStorage.getItem('maintenanceEnd') || '');
    
    const recommendations = JSON.parse(localStorage.getItem('productRecommendations') || '[]');
    setProductRecommendations(recommendations);
  }, [user]);

  const handleMaintenanceSettings = () => {
    localStorage.setItem('maintenanceMode', maintenanceMode.toString());
    if (maintenanceMode) {
      localStorage.setItem('maintenanceStart', maintenanceStart);
      localStorage.setItem('maintenanceEnd', maintenanceEnd);
    } else {
      localStorage.removeItem('maintenanceStart');
      localStorage.removeItem('maintenanceEnd');
    }

    toast({
      title: "Maintenance Settings Updated",
      description: `Mode: ${maintenanceMode ? 'Enabled' : 'Disabled'}`,
    });
  };

  const addProductRecommendation = () => {
    if (!newProduct.name.trim()) {
      toast({ title: "Error", description: "Product name is required", variant: "destructive" });
      return;
    }

    const product = { id: `product-${Date.now()}`, ...newProduct };
    const updatedProducts = [...productRecommendations, product];
    setProductRecommendations(updatedProducts);
    localStorage.setItem('productRecommendations', JSON.stringify(updatedProducts));
    setNewProduct({ name: '', description: '' });
    toast({ title: "Product Added", description: "Product recommendation has been added." });
  };

  const removeProductRecommendation = (productId) => {
    const updatedProducts = productRecommendations.filter(p => p.id !== productId);
    setProductRecommendations(updatedProducts);
    localStorage.setItem('productRecommendations', JSON.stringify(updatedProducts));
    toast({ title: "Product Removed", description: "Product recommendation has been removed." });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-4 text-center">
        <div className="glass-effect p-8 rounded-lg">
          <i className="fas fa-lock text-4xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - RedDrak ID</title>
        <meta name="description" content="RedDrak ID Admin Dashboard" />
      </Helmet>
      
      <div className="p-4 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect p-6 rounded-lg neon-border">
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage RedDrak ID system and content</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: 'fa-file-alt', label: 'Total Posts', value: stats.totalPosts, color: 'text-blue-400' },
            { icon: 'fa-users', label: 'Total Users', value: stats.totalUsers, color: 'text-green-400' },
            { icon: 'fa-comments', label: 'Forums', value: stats.totalForums, color: 'text-purple-400' },
            { icon: 'fa-circle', label: 'Online', value: stats.onlineUsers, color: 'text-red-400' }
          ].map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className="glass-effect p-4 rounded-lg text-center">
              <i className={`fas ${stat.icon} text-2xl ${stat.color} mb-2`}></i>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-effect p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4"><i className="fas fa-tools text-red-400 mr-2"></i>Maintenance Mode</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} id="maintenance-switch" />
              <Label htmlFor="maintenance-switch" className="text-white font-medium">Enable Maintenance Mode</Label>
            </div>
            {maintenanceMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="maintenanceStart" className="text-red-400">Start Time</Label><Input id="maintenanceStart" type="datetime-local" value={maintenanceStart} onChange={(e) => setMaintenanceStart(e.target.value)} className="bg-black/50 border-red-500/30 text-white"/></div>
                <div><Label htmlFor="maintenanceEnd" className="text-red-400">End Time</Label><Input id="maintenanceEnd" type="datetime-local" value={maintenanceEnd} onChange={(e) => setMaintenanceEnd(e.target.value)} className="bg-black/50 border-red-500/30 text-white"/></div>
              </div>
            )}
            <Button onClick={handleMaintenanceSettings}>Save Maintenance Settings</Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-effect p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4"><i className="fas fa-star text-yellow-400 mr-2"></i>Product Recommendations</h2>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor="productName" className="text-red-400">Product Name</Label><Input id="productName" value={newProduct.name} onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter product name" className="bg-black/50 border-red-500/30 text-white"/></div>
              <div><Label htmlFor="productDescription" className="text-red-400">Description</Label><Input id="productDescription" value={newProduct.description} onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))} placeholder="Enter product description" className="bg-black/50 border-red-500/30 text-white"/></div>
            </div>
            <Button onClick={addProductRecommendation} className="bg-green-600 hover:bg-green-700"><i className="fas fa-plus mr-2"></i>Add Product</Button>
          </div>
          <div className="space-y-2">
            {productRecommendations.map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">{product.name}</h3><p className="text-gray-400 text-sm">{product.description}</p>
                </div>
                <Button onClick={() => removeProductRecommendation(product.id)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><i className="fas fa-trash"></i></Button>
              </motion.div>
            ))}
            {productRecommendations.length === 0 && (<div className="text-center py-8 text-gray-400"><i className="fas fa-box-open text-4xl mb-4"></i><p>No product recommendations yet.</p></div>)}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminDashboard;
