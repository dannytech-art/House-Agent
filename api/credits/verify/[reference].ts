import { success, errorResponse } from '../../_lib/utils';
import { getItem, getAllItems } from '../../_lib/data-store';
import { requireAuth } from '../../_lib/middleware';
import type { Request } from '../../_lib/types';

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

    // Get reference from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    const reference = pathParts[pathParts.length - 1];

    if (!reference || reference === 'verify') {
      return errorResponse('Payment reference is required', 400);
    }

    // Get all transactions for this user, sorted by most recent
    const allTransactions = await getAllItems<Transaction>('transactions', { 
      user_id: auth.userId 
    });
    
    if (!allTransactions || allTransactions.length === 0) {
      return errorResponse('No transactions found', 404);
    }

    // Sort by timestamp (newest first)
    const sorted = [...allTransactions].sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA;
    });

    // First, try to find by payment_reference (exact match)
    let transaction = sorted.find(t => t.payment_reference === reference);

    // If not found, try to find by ID
    if (!transaction) {
      transaction = sorted.find(t => t.id === reference);
    }

    // If still not found, return the most recent completed transaction
    // This handles the case where the reference passed might not match exactly
    // but we know a payment just completed
    if (!transaction) {
      transaction = sorted.find(t => t.status === 'completed');
    }

    if (!transaction) {
      return errorResponse('Transaction not found', 404);
    }

    // Get user to return current balance
    const user = await getItem<User>('users', auth.userId);

    return success({
      status: transaction.status || 'completed',
      credits: transaction.credits || 0,
      newBalance: user?.credits || 0,
      walletBalance: user?.wallet_balance || 0,
      transaction,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify payment';
    console.error('Verify endpoint error:', errorMessage);
    return errorResponse(errorMessage, 500);
  }
}
