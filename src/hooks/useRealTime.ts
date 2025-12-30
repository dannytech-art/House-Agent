import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase-client';
import { useAuth } from './useAuth';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export function useRealTime() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    return newNotification;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? {
      ...n,
      read: true
    } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({
      ...n,
      read: true
    })));
    setUnreadCount(0);
  };

  // Supabase Realtime subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase || !user?.id) {
      // Fallback to simulated events if Supabase not configured
      const events = [{
        title: 'New Listing Match',
        message: 'A new 3-bed in Lekki matches your criteria',
        type: 'success' as const
      }, {
        title: 'Price Drop Alert',
        message: 'The Duplex in Ajah dropped by 5%',
        type: 'info' as const
      }, {
        title: 'New Message',
        message: 'Chidi sent you a message',
        type: 'info' as const
      }];

      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          const event = events[Math.floor(Math.random() * events.length)];
          addNotification(event);
        }
      }, 30000);
      return () => clearInterval(interval);
    }

    // Set up Supabase Realtime subscriptions
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `target_user_id=eq.${user.id}`,
        },
        (payload) => {
          const notification = payload.new as any;
          addNotification({
            title: notification.title,
            message: notification.message,
            type: (notification.type || 'info') as 'info' | 'success' | 'warning' | 'error',
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const message = payload.new as any;
          // Only show notification if message is for this user
          if (message.chat_session_id) {
            // Check if user is in this chat session
            supabase
              .from('chat_sessions')
              .select('participant_ids')
              .eq('id', message.chat_session_id)
              .single()
              .then(({ data }) => {
                if (data && data.participant_ids?.includes(user.id) && message.sender_id !== user.id) {
                  addNotification({
                    title: 'New Message',
                    message: `${message.sender_name} sent you a message`,
                    type: 'info',
                  });
                }
              });
          }
        }
      )
      .subscribe();

    // Load existing notifications
    supabase
      .from('notifications')
      .select('*')
      .eq('target_user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data) {
          const formatted = data.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: (n.type || 'info') as 'info' | 'success' | 'warning' | 'error',
            timestamp: new Date(n.created_at),
            read: n.read,
          }));
          setNotifications(formatted);
          setUnreadCount(formatted.filter((n: Notification) => !n.read).length);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead
  };
}
