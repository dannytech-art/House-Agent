import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, ShieldCheck, Loader2, Smartphone } from 'lucide-react';
import { CreditBundle } from '../types';
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bundle: CreditBundle | null;
  onSuccess: (transactionId: string) => void;
}
export function PaymentModal({
  isOpen,
  onClose,
  bundle,
  onSuccess
}: PaymentModalProps) {
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  useEffect(() => {
    if (isOpen) {
      setStep('method');
    }
  }, [isOpen]);
  const handlePayment = async () => {
    setStep('processing');
    try {
      // TODO: Integrate with Paystack payment gateway
      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call success callback with transaction ID
      const transactionId = `txn_${Date.now()}`;
      onSuccess(transactionId);
      
      setStep('success');
      
      // Close modal after showing success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setStep('method');
    }
  };
  if (!bundle) return null;
  return <AnimatePresence>
      {isOpen && <>
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
          <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-bg-secondary w-full max-w-md rounded-2xl border border-primary/30 shadow-2xl overflow-hidden pointer-events-auto gold-glow">
              {step === 'method' && <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="font-display text-xl font-bold text-text-primary">
                        Secure Payment
                      </h2>
                      <p className="text-sm text-text-secondary">
                        Purchasing {bundle.credits} Credits
                      </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-full transition-colors">
                      <X className="w-5 h-5 text-text-tertiary" />
                    </button>
                  </div>

                  <div className="mb-6 p-4 bg-bg-primary rounded-xl border border-border-color">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-text-secondary">Amount to Pay</span>
                      <span className="text-xl font-bold text-text-primary">
                        ₦{bundle.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-success bg-success/10 px-2 py-1 rounded w-fit">
                      <ShieldCheck className="w-3 h-3" />
                      Secured by Paystack
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-sm font-medium text-text-secondary">
                      Select Payment Method
                    </p>

                    <button onClick={() => setPaymentMethod('card')} className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border-color hover:border-primary/50'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'card' ? 'bg-primary text-black' : 'bg-bg-tertiary text-text-secondary'}`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-text-primary">
                          Pay with Card
                        </p>
                        <p className="text-xs text-text-tertiary">
                          Visa, Mastercard, Verve
                        </p>
                      </div>
                    </button>

                    <button onClick={() => setPaymentMethod('transfer')} className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${paymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-border-color hover:border-primary/50'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'transfer' ? 'bg-primary text-black' : 'bg-bg-tertiary text-text-secondary'}`}>
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-text-primary">
                          Bank Transfer
                        </p>
                        <p className="text-xs text-text-tertiary">
                          Instant transfer to virtual account
                        </p>
                      </div>
                    </button>
                  </div>

                  <button onClick={handlePayment} className="w-full py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 gold-glow">
                    <Lock className="w-4 h-4" />
                    Pay ₦{bundle.price.toLocaleString()}
                  </button>
                </div>}

              {step === 'processing' && <div className="p-12 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-bg-tertiary rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    <Lock className="absolute inset-0 m-auto w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    Processing Payment
                  </h3>
                  <p className="text-text-secondary">
                    Please do not close this window...
                  </p>
                </div>}

              {step === 'success' && <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10 text-success" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-text-secondary">
                    Your credits have been added to your wallet.
                  </p>
                </div>}
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}