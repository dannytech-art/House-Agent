import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { Toast, ToastType, Toaster } from '../components/Toast';

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastId}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message: string, title?: string) => {
    addToast({ type: 'success', message, title });
  }, [addToast]);

  const error = useCallback((message: string, title?: string) => {
    addToast({ type: 'error', message, title });
  }, [addToast]);

  const info = useCallback((message: string, title?: string) => {
    addToast({ type: 'info', message, title });
  }, [addToast]);

  const warning = useCallback((message: string, title?: string) => {
    addToast({ type: 'warning', message, title });
  }, [addToast]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }), [toasts, addToast, removeToast, success, error, info, warning]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={removeToast} position="top-center" />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Helper to extract user-friendly error messages from API errors
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) {
    // Common API error messages - make them more user-friendly
    const msg = error.message;
    
    // Already user-friendly messages from backend
    if (msg.includes('already expressed interest')) {
      return "You've already expressed interest in this property!";
    }
    if (msg.includes('must be in the future')) {
      return 'Please select a future date for your inspection.';
    }
    if (msg.includes('Unauthorized') || msg.includes('401')) {
      return 'Please log in to continue.';
    }
    if (msg.includes('not found') || msg.includes('404')) {
      return 'The requested resource was not found.';
    }
    if (msg.includes('Payment service not configured')) {
      return 'Payment service is currently unavailable. Please try again later.';
    }
    if (msg.includes('Insufficient credits')) {
      return "You don't have enough credits. Please top up your wallet.";
    }
    if (msg.includes('Network') || msg.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    return msg;
  }
  return 'Something went wrong. Please try again.';
}

