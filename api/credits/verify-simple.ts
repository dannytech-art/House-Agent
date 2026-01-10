import { success, errorResponse } from '../_lib/utils';
import { getItem, getAllItems } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

interface Transaction {
  id: string;
  user_id: string;
  payment_reference?: string;
  status?: string;
  credits?: number;
  timestamp?: string;
  type?: string;
  [key: string]: any;
}

interface User {
  id: string;
  credits?: number;
  wallet_balance?: number;
  [key: string]: any;
}

export default async function handler(request: Request) {
  if (request.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    // Get reference from query parameter - this is the Paystack reference
    const url = new URL(request.url);
    const reference = url.searchParams.get('reference') || url.searchParams.get('ref');

    if (!reference) {
      // If no reference provided, just return current balance
      const user = await getItem<User>('users', auth.userId);
      return success({
        status: 'completed',
        credits: 0,
        newBalance: user?.credits || 0,
        walletBalance: user?.wallet_balance || 0,
        transaction: null,
      });
    }

    // Get all transactions for this user
    const allTransactions = await getAllItems<Transaction>('transactions', { 
      user_id: auth.userId 
    });

    // Get current user balance
    const user = await getItem<User>('users', auth.userId);

    // If no transactions, return current balance (payment was already processed)
    if (!allTransactions || allTransactions.length === 0) {
      return success({
        status: 'completed',
        credits: 0,
        newBalance: user?.credits || 0,
        walletBalance: user?.wallet_balance || 0,
        transaction: null,
      });
    }

    // Sort by timestamp descending (newest first)
    const sorted = [...allTransactions].sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA;
    });

    // Find transaction by payment_reference or ID
    let transaction = sorted.find(t => 
      t.payment_reference === reference || 
      t.id === reference ||
      (t.type === 'credit_purchase' && t.status === 'completed')
    );

    // If found, return it
    if (transaction) {
      return success({
        status: transaction.status || 'completed',
        credits: transaction.credits || 0,
        newBalance: user?.credits || 0,
        walletBalance: user?.wallet_balance || 0,
        transaction,
      });
    }

    // Fallback: Return the most recent transaction
    const recentTransaction = sorted[0];
    
    return success({
      status: recentTransaction?.status || 'completed',
      credits: recentTransaction?.credits || 0,
      newBalance: user?.credits || 0,
      walletBalance: user?.wallet_balance || 0,
      transaction: recentTransaction || null,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify payment';
    return errorResponse(errorMessage, 500);
  }
}
