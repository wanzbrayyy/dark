
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import BackButton from '@/components/BackButton';
import LanguageSelector from '@/components/LanguageSelector';const WithdrawPage = () => {
  const [amount, setAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();

  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Masukkan jumlah yang valid",
        variant: "destructive"
      });
      return;
    }

    if (!withdrawAddress) {
      toast({
        title: "Error",
        description: "Masukkan alamat Bitcoin tujuan",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(amount) > user.btcBalance) {
      toast({
        title: "Error",
        description: "Saldo tidak mencukupi",
        variant: "destructive"
      });
      return;
    }

    setIsConfirming(true);
  };

  const confirmWithdraw = () => {
    // Simulate withdrawal process
    const withdrawAmount = parseFloat(amount);
    const newBalance = user.btcBalance - withdrawAmount;
    
    updateUser({ btcBalance: newBalance });
    
    toast({
      title: "Withdrawal berhasil!",
      description: `₿${withdrawAmount} telah dikirim ke ${withdrawAddress.substring(0, 10)}...`
    });
    
    setAmount('');
    setWithdrawAddress('');
    setIsConfirming(false);
  };

  const cancelWithdraw = () => {
    setIsConfirming(false);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Withdraw Bitcoin - RedDark.id</title>
        <meta name="description" content="Withdraw Bitcoin dari akun RedDark.id Anda dengan aman dan cepat" />
      </Helmet>

      <BackButton />

      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">
              <i className="fas fa-money-bill-wave mr-2"></i>
              {t('withdraw')} Bitcoin
            </h1>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Withdraw Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dark-card rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              <i className="fas fa-arrow-up mr-2"></i>
              Withdraw Bitcoin
            </h2>

            <div className="space-y-6">
              {/* Current Balance */}
              <div className="glass-effect rounded-lg p-4">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">Saldo Tersedia</div>
                  <div className="text-2xl font-bold bitcoin-glow">
                    ₿{user.btcBalance.toFixed(6)}
                  </div>
                </div>
              </div>

              {/* Withdraw Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <i className="fas fa-wallet mr-2"></i>
                  Alamat Bitcoin Tujuan
                </label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <i className="fab fa-bitcoin mr-2"></i>
                  Jumlah Withdraw (BTC)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  min="0.000001"
                  max={user.btcBalance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.001000"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-400">Minimum: ₿0.000001</span>
                  <button
                    onClick={() => setAmount(user.btcBalance.toString())}
                    className="text-orange-400 hover:text-orange-300"
                  >
                    Max: ₿{user.btcBalance.toFixed(6)}
                  </button>
                </div>
              </div>

              {/* Network Fee Info */}
              <div className="glass-effect rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Network Fee:</span>
                  <span className="text-white">₿0.00001</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400">You'll Receive:</span>
                  <span className="text-orange-400 font-bold">
                    ₿{amount ? (parseFloat(amount) - 0.00001).toFixed(6) : '0.000000'}
                  </span>
                </div>
              </div>

              {/* Withdraw Button */}
              <Button
                onClick={handleWithdraw}
                disabled={!amount || !withdrawAddress || parseFloat(amount) <= 0}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
              >
                <i className="fas fa-paper-plane mr-2"></i>
                Withdraw Bitcoin
              </Button>
            </div>
          </motion.div>

          {/* Transaction Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="dark-card rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              <i className="fas fa-info-circle mr-2"></i>
              Informasi Withdraw
            </h2>

            <div className="space-y-4">
              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3">
                  <i className="fas fa-clock mr-2"></i>
                  Waktu Pemrosesan:
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Pemrosesan otomatis: 5-15 menit</li>
                  <li>• Konfirmasi network: 10-60 menit</li>
                  <li>• Total waktu: 15-75 menit</li>
                </ul>
              </div>

              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3">
                  <i className="fas fa-shield-alt mr-2"></i>
                  Keamanan:
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Verifikasi alamat otomatis</li>
                  <li>• Enkripsi end-to-end</li>
                  <li>• Multi-signature security</li>
                  <li>• Cold storage protection</li>
                </ul>
              </div>

              <div className="glass-effect rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3">
                  <i className="fas fa-calculator mr-2"></i>
                  Biaya & Limit:
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Network fee: ₿0.00001</li>
                  <li>• Minimum withdraw: ₿0.000001</li>
                  <li>• Maximum per hari: ₿1.0</li>
                  <li>• Tidak ada biaya platform</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="dark-card rounded-lg p-6 mt-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">
            <i className="fas fa-history mr-2"></i>
            Riwayat Withdraw
          </h2>

          <div className="text-center py-8">
            <i className="fas fa-inbox text-4xl text-gray-600 mb-4"></i>
            <p className="text-gray-400">Belum ada riwayat withdraw</p>
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg"
        >
          <h3 className="text-red-400 font-semibold mb-2">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Peringatan Penting:
          </h3>
          <ul className="text-red-300 text-sm space-y-1">
            <li>• Pastikan alamat Bitcoin tujuan benar dan valid</li>
            <li>• Transaksi Bitcoin tidak dapat dibatalkan</li>
            <li>• Jangan kirim ke alamat exchange yang tidak mendukung deposit</li>
            <li>• Simpan TXID untuk tracking transaksi</li>
            <li>• Hubungi support jika ada masalah</li>
          </ul>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center blur-overlay">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-effect rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              <i className="fas fa-exclamation-triangle mr-2 text-yellow-400"></i>
              Konfirmasi Withdraw
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Jumlah:</span>
                <span className="text-white font-bold">₿{amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network Fee:</span>
                <span className="text-white">₿0.00001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Debit:</span>
                <span className="text-orange-400 font-bold">₿{(parseFloat(amount) + 0.00001).toFixed(6)}</span>
              </div>
              <div className="border-t border-white/20 pt-2">
                <div className="text-gray-400 text-sm">Alamat Tujuan:</div>
                <div className="text-white text-sm break-all">{withdrawAddress}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={cancelWithdraw}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-600/20"
              >
                Batal
              </Button>
              <Button
                onClick={confirmWithdraw}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                <i className="fas fa-check mr-2"></i>
                Konfirmasi
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WithdrawPage;
