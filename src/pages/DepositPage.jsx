import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/use-toast';
import BackButton from '@/components/BackButton';
import LanguageSelector from '@/components/LanguageSelector';

const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const [btcAddress, setBtcAddress] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();

  const generateBtcAddress = () => {
    const mockAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    setBtcAddress(mockAddress);
    
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${mockAddress}`;
    setQrCode(qrUrl);
    
    toast({
      title: "Alamat Bitcoin berhasil dibuat!",
      description: "Silakan transfer Bitcoin ke alamat yang telah dibuat."
    });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(btcAddress);
    toast({
      title: "Alamat disalin!",
      description: "Alamat Bitcoin telah disalin ke clipboard."
    });
  };

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Masukkan jumlah yang valid",
        variant: "destructive"
      });
      return;
    }
    if (!btcAddress) {
      toast({
        title: "Error",
        description: "Generate alamat Bitcoin terlebih dahulu",
        variant: "destructive"
      });
      return;
    }
    setIsConfirming(true);
  };

  const confirmDeposit = () => {
    const depositAmount = parseFloat(amount);
    const newBalance = user.btcBalance + depositAmount;
    
    updateUser({ btcBalance: newBalance });
    
    toast({
      title: "Deposit berhasil!",
      description: `Saldo Anda telah ditambahkan sebesar ₿${depositAmount}.`
    });
    
    setAmount('');
    setBtcAddress('');
    setQrCode('');
    setIsConfirming(false);
  };

  const cancelDeposit = () => {
    setIsConfirming(false);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Deposit Bitcoin - RedDark.id</title>
        <meta name="description" content="Deposit Bitcoin ke akun RedDark.id Anda dengan aman dan mudah" />
      </Helmet>

      <BackButton />

      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">
              <i className="fab fa-bitcoin mr-2"></i>
              {t('deposit')} Bitcoin
            </h1>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Deposit Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dark-card rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              <i className="fas fa-plus-circle mr-2"></i>
              Deposit Bitcoin
            </h2>

            <div className="space-y-6">
              {/* Current Balance */}
              <div className="glass-effect rounded-lg p-4">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">Saldo Saat Ini</div>
                  <div className="text-2xl font-bold bitcoin-glow">
                    ₿{user.btcBalance.toFixed(6)}
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <i className="fab fa-bitcoin mr-2"></i>
                  {t('amount')} (BTC)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  min="0.000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.001000"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-gray-400 text-sm mt-2">
                  Minimum deposit: ₿0.000001
                </p>
              </div>

              {/* Generate Address Button */}
              <Button
                onClick={handleCreateInvoice}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <i className="fas fa-qrcode mr-2"></i>
                {t('generateQR')}
              </Button>
            </div>
          </motion.div>

          {/* Bitcoin Address & QR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="dark-card rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              <i className="fas fa-wallet mr-2"></i>
              {t('btcAddress')}
            </h2>

            {invoice ? (
              <div className="space-y-6">
                {/* QR Code */}
                <div className="text-center">
                  <div className="inline-block p-4 bg-white rounded-lg">
                    <QRCode value={invoice.pay_address} size={192} />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Alamat Bitcoin:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={invoice.pay_address}
                      readOnly
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none"
                    />
                    <Button
                      onClick={copyAddress}
                      variant="outline"
                      className="border-orange-600 text-orange-400 hover:bg-orange-600/20"
                    >
                      <i className="fas fa-copy"></i>
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="glass-effect rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">
                    <i className="fas fa-info-circle mr-2"></i>
                    Instruksi Deposit:
                  </h3>
                  <ol className="text-gray-300 text-sm space-y-2">
                    <li>1. Salin alamat Bitcoin di atas atau scan QR code</li>
                    <li>2. Transfer Bitcoin dari wallet Anda ke alamat tersebut</li>
                    <li>3. Tunggu konfirmasi network (biasanya 10-30 menit)</li>
                    <li>4. Saldo akan otomatis bertambah setelah konfirmasi</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fab fa-bitcoin text-6xl text-gray-600 mb-4"></i>
                <p className="text-gray-400">
                  Masukkan jumlah dan klik "Generate QR Code" untuk membuat faktur deposit.
                </p>
              </div>
            )}
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
            Riwayat Deposit
          </h2>

          <div className="text-center py-8">
            <i className="fas fa-inbox text-4xl text-gray-600 mb-4"></i>
            <p className="text-gray-400">Belum ada riwayat deposit</p>
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg"
        >
          <h3 className="text-yellow-400 font-semibold mb-2">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Penting untuk Diperhatikan:
          </h3>
          <ul className="text-yellow-300 text-sm space-y-1">
            <li>• Hanya kirim Bitcoin (BTC) ke alamat ini</li>
            <li>• Minimum deposit ₿0.000001</li>
            <li>• Alamat deposit berlaku selama 24 jam</li>
            <li>• Konfirmasi membutuhkan minimal 1 konfirmasi network</li>
            <li>• Jangan kirim dari exchange yang tidak mendukung withdrawal</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default DepositPage;