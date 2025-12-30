import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Zap, Wallet } from 'lucide-react';
import { Transaction } from '../types';
interface TransactionItemProps {
  transaction: Transaction;
  index: number;
}
export function TransactionItem({
  transaction,
  index
}: TransactionItemProps) {
  const isCredit = transaction.type === 'credit_purchase' || transaction.type === 'wallet_load';
  const Icon = transaction.credits ? Zap : Wallet;
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  return <motion.div initial={{
    opacity: 0,
    x: -20
  }} animate={{
    opacity: 1,
    x: 0
  }} transition={{
    delay: index * 0.05
  }} className="flex items-center justify-between p-4 bg-bg-primary rounded-xl border border-border-color">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-success/10' : 'bg-danger/10'}`}>
          {isCredit ? <ArrowDownRight className="w-5 h-5 text-success" /> : <ArrowUpRight className="w-5 h-5 text-danger" />}
        </div>
        <div>
          <p className="font-medium text-text-primary">
            {transaction.description}
          </p>
          <p className="text-sm text-text-tertiary">
            {formatDate(transaction.timestamp)}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className={`font-bold ${isCredit ? 'text-success' : 'text-danger'}`}>
          {isCredit ? '+' : '-'}₦{transaction.amount.toLocaleString()}
        </p>
        {transaction.credits && <div className="flex items-center gap-1 justify-end">
            <Zap className="w-3 h-3 text-warning" />
            <span className="text-sm text-text-tertiary">
              {isCredit ? '+' : '-'}
              {transaction.credits}
            </span>
          </div>}
      </div>
    </motion.div>;
}