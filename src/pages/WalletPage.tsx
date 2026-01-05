import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Plus, History, Loader2 } from 'lucide-react';
import { CreditBundle } from '../components/CreditBundle';
import { PaymentModal } from '../components/PaymentModal';
import { PaymentHistory } from '../components/PaymentHistory';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../lib/api-client';
import { CreditBundle as CreditBundleType, Transaction } from '../types';

// Default bundles if API fails
const DEFAULT_BUNDLES: CreditBundleType[] = [
  { id: 'bundle-1', credits: 50, price: 2500, bonus: 0 },
  { id: 'bundle-2', credits: 100, price: 4500, bonus: 10, popular: true },
  { id: 'bundle-3', credits: 250, price: 10000, bonus: 50 },
  { id: 'bundle-4', credits: 500, price: 18000, bonus: 150 },
];

export function WalletPage() {
  const {
    user
  } = useAuth();
  const [balance, setBalance] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<CreditBundleType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bundles, setBundles] = useState<CreditBundleType[]>(DEFAULT_BUNDLES);
  const [loading, setLoading] = useState(true);

  // Load balance and bundles
  useEffect(() => {
    const loadData = async () => {
      try {
        const [balanceData, bundlesData, transactionsData] = await Promise.all([
          apiClient.getCreditBalance().catch(() => ({ credits: 0 })),
          apiClient.getCreditBundles().catch(() => null),
          apiClient.getTransactions().catch(() => []),
        ]);
        
        setBalance(balanceData?.credits || balanceData?.balance || 0);
        // Only update bundles if API returned data
        if (bundlesData && Array.isArray(bundlesData) && bundlesData.length > 0) {
          setBundles(bundlesData);
        }
        setTransactions(transactionsData || []);
      } catch (error) {
        console.error('Error loading wallet data:', error);
        // Keep default bundles
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  const handleBuyCredits = (bundle: CreditBundleType) => {
    setSelectedBundle(bundle);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (reference: string) => {
    try {
      // Payment was already verified in PaymentModal, just refresh data
      const [balanceData, transactionsData] = await Promise.all([
        apiClient.getCreditBalance().catch(() => null),
        apiClient.getTransactions().catch(() => []),
      ]);
      
      if (balanceData) {
        setBalance(balanceData.credits || balanceData.balance || 0);
      }
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error refreshing data after payment:', error);
      // Suggest refresh
      alert('Payment successful! Please refresh to see updated balance.');
    }
  };
  return <div className="min-h-screen bg-bg-secondary pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
            My Wallet
          </h1>
          <p className="text-text-secondary">
            Manage your credits and transactions
          </p>
        </motion.div>

        {/* Balance Card */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }} className="bg-gradient-gold rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-32 h-32 text-black" />
          </div>

          <div className="relative z-10">
            <p className="text-black/70 font-medium mb-1">Available Balance</p>
            <h2 className="text-4xl font-bold text-black mb-4">
              {balance.toLocaleString()} Credits
            </h2>

            <div className="flex gap-3">
              <button onClick={() => document.getElementById('bundles')?.scrollIntoView({
              behavior: 'smooth'
            })} className="px-4 py-2 bg-black/10 hover:bg-black/20 text-black rounded-lg font-semibold transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Top Up
              </button>
              <button className="px-4 py-2 bg-black/10 hover:bg-black/20 text-black rounded-lg font-semibold transition-colors flex items-center gap-2">
                <History className="w-4 h-4" />
                History
              </button>
            </div>
          </div>
        </motion.div>

        {/* Credit Bundles */}
        <div id="bundles" className="mb-12">
          <h3 className="font-display text-xl font-bold text-text-primary mb-4">
            Buy Credits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bundles.map((bundle, index) => <motion.div key={bundle.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2 + index * 0.1
          }}>
                <CreditBundle bundle={bundle} onBuy={() => handleBuyCredits(bundle)} />
              </motion.div>)}
          </div>
        </div>

        {/* Transaction History */}
        <PaymentHistory transactions={transactions} />
      </div>

      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} bundle={selectedBundle} onSuccess={handlePaymentSuccess} />
    </div>;
}