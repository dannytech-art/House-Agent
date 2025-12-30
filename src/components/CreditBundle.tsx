import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';
import { CreditBundle as CreditBundleType } from '../types';
interface CreditBundleProps {
  bundle: CreditBundleType;
  onSelect: (bundle: CreditBundleType) => void;
}
export function CreditBundle({
  bundle,
  onSelect
}: CreditBundleProps) {
  const totalCredits = bundle.credits + bundle.bonus;
  const hasBonus = bundle.bonus > 0;
  return <motion.button whileHover={{
    scale: 1.02
  }} whileTap={{
    scale: 0.98
  }} onClick={() => onSelect(bundle)} className={`relative w-full text-left p-6 rounded-2xl border-2 transition-all ${bundle.popular ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-border-color bg-bg-primary hover:border-primary/50'}`}>
      {bundle.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
          MOST POPULAR
        </div>}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bundle.popular ? 'bg-primary' : 'bg-warning/10'}`}>
            <Zap className={`w-6 h-6 ${bundle.popular ? 'text-white' : 'text-warning'}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">
              {bundle.credits}
            </p>
            <p className="text-sm text-text-tertiary">Credits</p>
          </div>
        </div>

        {hasBonus && <div className="flex items-center gap-1 px-2 py-1 bg-success/10 rounded-full">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-xs font-bold text-success">
              +{bundle.bonus}
            </span>
          </div>}
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-bold text-text-primary">
            ₦{bundle.price.toLocaleString()}
          </span>
          {hasBonus && <p className="text-sm text-success mt-1">
              Total: {totalCredits} credits
            </p>}
        </div>
        <div className="text-right">
          <p className="text-sm text-text-tertiary">
            ₦{Math.round(bundle.price / totalCredits)} per credit
          </p>
        </div>
      </div>
    </motion.button>;
}