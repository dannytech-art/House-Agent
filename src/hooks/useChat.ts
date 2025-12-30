import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, ChatSession, User } from '../types';

// Mock initial data
const initialChats: ChatSession[] = [{
  id: 'chat-1',
  participantIds: ['user-1', 'agent-1'],
  messages: [{
    id: 'msg-1',
    senderId: 'agent-1',
    senderName: 'Chidi Okafor',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi&backgroundColor=D4AF37',
    message: 'Hello! Are you still interested in the apartment in Ikate?',
    timestamp: '2024-01-20T10:30:00Z',
    type: 'text'
  }],
  createdAt: '2024-01-20T10:00:00Z',
  lastMessageAt: '2024-01-20T10:30:00Z'
}, {
  id: 'chat-2',
  participantIds: ['user-1', 'agent-2'],
  messages: [{
    id: 'msg-2',
    senderId: 'user-1',
    senderName: 'Me',
    message: 'Is the price negotiable?',
    timestamp: '2024-01-19T15:45:00Z',
    type: 'text'
  }, {
    id: 'msg-3',
    senderId: 'agent-2',
    senderName: 'Fatima Ibrahim',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima&backgroundColor=D4AF37',
    message: 'Yes, the owner is open to reasonable offers.',
    timestamp: '2024-01-19T15:50:00Z',
    type: 'text'
  }],
  createdAt: '2024-01-19T15:00:00Z',
  lastMessageAt: '2024-01-19T15:50:00Z'
}];
export function useChat() {
  const [chats, setChats] = useState<ChatSession[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const activeChat = chats.find(c => c.id === activeChatId);
  const sendMessage = useCallback((text: string, type: ChatMessage['type'] = 'text', metadata?: any) => {
    if (!activeChatId) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-1',
      // Current user ID
      senderName: 'Me',
      message: text,
      timestamp: new Date().toISOString(),
      type,
      metadata
    };
    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessageAt: newMessage.timestamp
        };
      }
      return chat;
    }));

    // Simulate reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          senderId: 'other',
          senderName: 'Agent',
          message: 'Thanks for your message! I will get back to you shortly.',
          timestamp: new Date().toISOString(),
          type: 'text'
        };
        setChats(prev => prev.map(chat => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: [...chat.messages, reply],
              lastMessageAt: reply.timestamp
            };
          }
          return chat;
        }));
        setIsTyping(false);
      }, 2000);
    }, 1000);
  }, [activeChatId]);
  const createChat = (participantId: string) => {
    // Check if chat exists
    const existing = chats.find(c => c.participantIds.includes(participantId));
    if (existing) {
      setActiveChatId(existing.id);
      return existing.id;
    }
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      participantIds: ['user-1', participantId],
      messages: [],
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat.id;
  };
  return {
    chats,
    activeChat,
    activeChatId,
    isTyping,
    setActiveChatId,
    sendMessage,
    createChat
  };
}