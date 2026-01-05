import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, ChatSession } from '../types';
import { apiClient } from '../lib/api-client';
import { useAuth } from './useAuth';

export function useChat() {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId);
  const currentUserId = user?.id || 'user-1';

  // Fetch all chats
  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getChats();
      
      // Transform API response to match our ChatSession type
      const transformedChats: ChatSession[] = (response || []).map((chat: any) => ({
        id: chat.id || chat._id,
        participantIds: chat.participantIds || [chat.seekerId, chat.agentId],
        propertyId: chat.propertyId,
        interestId: chat.interestId,
        messages: (chat.messages || []).map((msg: any) => ({
          id: msg.id || msg._id,
          senderId: msg.senderId,
          senderName: msg.senderName || 'User',
          senderAvatar: msg.senderAvatar,
          message: msg.message || msg.content,
          timestamp: msg.timestamp || msg.createdAt,
          type: msg.type || 'text',
          metadata: msg.metadata,
        })),
        createdAt: chat.createdAt,
        lastMessageAt: chat.lastMessageAt || chat.lastMessage?.timestamp || chat.updatedAt,
        // New API fields
        isUnlocked: chat.isUnlocked !== undefined ? chat.isUnlocked : true,
        canSendMessage: chat.canSendMessage !== undefined ? chat.canSendMessage : true,
        lastMessage: chat.lastMessage,
        unreadCount: chat.unreadCount || 0,
        property: chat.property,
        otherParticipant: chat.otherParticipant,
        // For display - use otherParticipant if available
        participantName: chat.otherParticipant?.name || chat.participantName,
        participantAvatar: chat.otherParticipant?.avatar || chat.participantAvatar,
        propertyTitle: chat.property?.title || chat.propertyTitle,
      }));
      
      setChats(transformedChats);
    } catch (err: any) {
      console.error('Error fetching chats:', err);
      setError(err.message || 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for active chat
  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      const response = await apiClient.getChatMessages(chatId);
      
      const messages: ChatMessage[] = (response || []).map((msg: any) => ({
        id: msg.id || msg._id,
        senderId: msg.senderId,
        senderName: msg.senderName || 'User',
        senderAvatar: msg.senderAvatar,
        message: msg.message || msg.content,
        timestamp: msg.timestamp || msg.createdAt,
        type: msg.type || 'text',
        metadata: msg.metadata,
      }));
      
      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, messages };
        }
        return chat;
      }));
    } catch (err: any) {
      console.error('Error fetching messages:', err);
    }
  }, []);

  // Initial fetch - always try to fetch if we have a token
  useEffect(() => {
    const token = apiClient.getToken();
    if (user || token) {
      fetchChats();
    } else {
      setLoading(false);
    }
  }, [user, fetchChats]);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
    }
  }, [activeChatId, fetchMessages]);

  // Send message
  const sendMessage = useCallback(async (
    text: string, 
    type: ChatMessage['type'] = 'text', 
    metadata?: any
  ) => {
    if (!activeChatId || !text.trim()) return;

    // Optimistically add message
    const tempId = `temp-${Date.now()}`;
    const newMessage: ChatMessage = {
      id: tempId,
      senderId: currentUserId,
      senderName: user?.name || 'Me',
      senderAvatar: user?.avatar,
      message: text,
      timestamp: new Date().toISOString(),
      type,
      metadata,
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessageAt: newMessage.timestamp,
        };
      }
      return chat;
    }));

    try {
      setSending(true);
      // Send to API
      const response = await apiClient.sendChatMessage(activeChatId, text);
      
      // Update with real message ID from server
      if (response?.id || response?._id) {
        setChats(prev => prev.map(chat => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: chat.messages.map(msg => 
                msg.id === tempId 
                  ? { ...msg, id: response.id || response._id }
                  : msg
              ),
            };
          }
          return chat;
        }));
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      // Remove optimistic message on error
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: chat.messages.filter(msg => msg.id !== tempId),
          };
        }
        return chat;
      }));
      throw err;
    } finally {
      setSending(false);
    }
  }, [activeChatId, currentUserId, user]);

  // Create new chat
  const createChat = useCallback(async (participantId: string, propertyId?: string, initialMessage?: string) => {
    // Check if chat exists
    const existing = chats.find(c => 
      c.participantIds.includes(participantId) && 
      (!propertyId || c.propertyId === propertyId)
    );
    
    if (existing) {
      setActiveChatId(existing.id);
      return existing.id;
    }

    try {
      const response = await apiClient.createChatSession(participantId, propertyId, initialMessage);
      
      const newChat: ChatSession = {
        id: response.id || response._id,
        participantIds: [currentUserId, participantId],
        propertyId,
        messages: [],
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
      };
      
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      
      // Refresh to get full chat data
      fetchChats();
      
      return newChat.id;
    } catch (err: any) {
      console.error('Error creating chat:', err);
      throw err;
    }
  }, [chats, currentUserId, fetchChats]);

  return {
    chats,
    activeChat,
    activeChatId,
    isTyping,
    loading,
    error,
    sending,
    currentUserId,
    setActiveChatId,
    sendMessage,
    createChat,
    refreshChats: fetchChats,
  };
}
