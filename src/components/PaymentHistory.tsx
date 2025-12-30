import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { Transaction } from '../types';
interface PaymentHistoryProps {
  transactions: Transaction[];
}
export function PaymentHistory({
  transactions
}: PaymentHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <div className="space-y-4">
      <h3 className="font-display text-xl font-bold text-text-primary mb-4">
        Transaction History
      </h3>

      {transactions.length === 0 ? <div className="text-center py-8 bg-bg-primary rounded-xl border border-border-color border-dashed">
          <Clock className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
          <p className="text-text-secondary">No transactions yet</p>
        </div> : <div className="space-y-3">
          {transactions.map(txn => <motion.div key={txn.id} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} className="flex items-center justify-between p-4 bg-bg-primary border border-border-color rounded-xl hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === 'credit_purchase' || txn.type === 'wallet_load' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  {txn.type === 'credit_purchase' || txn.type === 'wallet_load' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">
                    {txn.description}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {formatDate(txn.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${txn.type === 'credit_purchase' || txn.type === 'wallet_load' ? 'text-success' : 'text-text-primary'}`}>
                  {txn.type === 'credit_purchase' || txn.type === 'wallet_load' ? '+' : '-'}
                  {txn.amount > 0 ? `₦${txn.amount.toLocaleString()}` : `${txn.credits} Credits`}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${txn.status === 'completed' ? 'bg-success/10 text-success' : txn.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>
                  {txn.status}
                </span>
              </div>
            </motion.div>)}
        </div>}
    </div>;
}