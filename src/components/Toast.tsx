import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
};

const toastStyles: Record<ToastType, string> = {
  success: 'bg-success/10 border-success/30 text-success',
  error: 'bg-danger/10 border-danger/30 text-danger',
  info: 'bg-primary/10 border-primary/30 text-primary',
  warning: 'bg-warning/10 border-warning/30 text-warning',
};

const toastIconBg: Record<ToastType, string> = {
  success: 'bg-success/20',
  error: 'bg-danger/20',
  info: 'bg-primary/20',
  warning: 'bg-warning/20',
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  React.useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg max-w-sm ${toastStyles[toast.type]}`}
    >
      <div className={`p-1.5 rounded-full ${toastIconBg[toast.type]}`}>
        {toastIcons[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-semibold text-text-primary text-sm mb-0.5">
            {toast.title}
          </p>
        )}
        <p className="text-sm text-text-secondary leading-snug">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-bg-tertiary rounded-full transition-colors text-text-tertiary hover:text-text-primary"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

interface ToasterProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

const positionStyles: Record<string, string> = {
  'top-right': 'top-4 right-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-left': 'bottom-4 left-4',
};

export function Toaster({ toasts, onDismiss, position = 'top-center' }: ToasterProps) {
  return (
    <div className={`fixed z-[100] flex flex-col gap-2 pointer-events-none ${positionStyles[position]}`}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}






