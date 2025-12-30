import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification } from '../hooks/useRealTime';
interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}
export function NotificationToast({
  notifications,
  onDismiss
}: NotificationToastProps) {
  return <div className="fixed top-24 right-4 z-[80] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.filter(n => !n.read).slice(0, 3).map(notification => <motion.div key={notification.id} initial={{
        opacity: 0,
        x: 50,
        scale: 0.9
      }} animate={{
        opacity: 1,
        x: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        x: 50,
        scale: 0.9
      }} layout className="pointer-events-auto w-80 bg-bg-secondary/95 backdrop-blur-md border-l-4 border-primary shadow-2xl rounded-lg overflow-hidden flex">
              <div className="flex-1 p-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${notification.type === 'success' ? 'text-success' : notification.type === 'warning' ? 'text-warning' : notification.type === 'error' ? 'text-danger' : 'text-primary'}`}>
                    {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : notification.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary text-sm">
                      {notification.title}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
              <button onClick={() => onDismiss(notification.id)} className="px-3 hover:bg-bg-tertiary transition-colors flex items-center justify-center border-l border-border-color">
                <X className="w-4 h-4 text-text-tertiary" />
              </button>
            </motion.div>)}
      </AnimatePresence>
    </div>;
}