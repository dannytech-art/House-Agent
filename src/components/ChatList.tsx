import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MessageCircle, Lock, CheckCheck, Check } from 'lucide-react';
import { ChatSession } from '../types';

interface ExtendedChatSession extends ChatSession {
  participantName?: string;
  participantAvatar?: string;
  propertyTitle?: string;
  unreadCount?: number;
  isUnlocked?: boolean;
  canSendMessage?: boolean;
  lastMessage?: {
    message: string;
    timestamp: string;
  };
  otherParticipant?: {
    id: string;
    name: string;
    avatar?: string;
    role: 'seeker' | 'agent';
  };
  property?: {
    id: string;
    title: string;
    images: string[];
  };
}

interface ChatListProps {
  chats: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export function ChatList({
  chats,
  activeChatId,
  onSelectChat
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-NG', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-NG', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-NG', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getParticipantInfo = (chat: ExtendedChatSession) => {
    // First try the otherParticipant from API
    if (chat.otherParticipant) {
      return {
        name: chat.otherParticipant.name,
        avatar: chat.otherParticipant.avatar,
      };
    }
    
    // Then try the extended fields
    if (chat.participantName) {
      return {
        name: chat.participantName,
        avatar: chat.participantAvatar,
      };
    }
    
    // Fallback to getting from messages
    const participant = chat.messages.find(m => m.senderId !== 'user-1');
    return {
      name: participant?.senderName || 'Unknown User',
      avatar: participant?.senderAvatar,
    };
  };

  const filteredChats = chats.filter(chat => {
    const extChat = chat as ExtendedChatSession;
    const { name } = getParticipantInfo(extChat);
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = name.toLowerCase().includes(query);
      const matchesProperty = extChat.propertyTitle?.toLowerCase().includes(query);
      const matchesMessage = chat.messages.some(m => 
        m.message.toLowerCase().includes(query)
      );
      if (!matchesName && !matchesProperty && !matchesMessage) {
        return false;
      }
    }
    
    // Unread filter
    if (filter === 'unread') {
      return (extChat.unreadCount || 0) > 0;
    }
    
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#111b21] w-full">
      {/* Header */}
      <div className="px-4 py-3 bg-[#1f2c34] border-b border-[#2a373f]">
        <h2 className="font-semibold text-xl text-[#e9edef] mb-3">
          Chats
        </h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8696a0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-2 bg-[#2a373f] rounded-lg text-[14px] text-[#e9edef] placeholder:text-[#8696a0] focus:outline-none"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              filter === 'all'
                ? 'bg-[#00a884] text-[#111b21]'
                : 'bg-[#2a373f] text-[#8696a0] hover:bg-[#3a474f]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              filter === 'unread'
                ? 'bg-[#00a884] text-[#111b21]'
                : 'bg-[#2a373f] text-[#8696a0] hover:bg-[#3a474f]'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MessageCircle className="w-12 h-12 text-[#3a474f] mb-3" />
            <p className="text-[#8696a0]">
              {searchQuery ? 'No chats found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const extChat = chat as ExtendedChatSession;
            // Use API's lastMessage or fallback to messages array
            const lastMessageFromApi = extChat.lastMessage;
            const lastMessageFromArray = chat.messages[chat.messages.length - 1];
            const lastMessageText = lastMessageFromApi?.message || lastMessageFromArray?.message || '';
            const lastMessageTime = lastMessageFromApi?.timestamp || lastMessageFromArray?.timestamp || chat.lastMessageAt;
            const { name, avatar } = getParticipantInfo(extChat);
            const unreadCount = extChat.unreadCount || 0;
            const isLocked = extChat.isUnlocked === false;
            const isActive = activeChatId === chat.id;
            const isMyLastMessage = lastMessageFromArray?.senderId === 'user-1';

            return (
              <motion.button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full px-3 py-3 flex items-center gap-3 hover:bg-[#2a373f] transition-colors border-b border-[#2a373f]/50 ${
                  isActive ? 'bg-[#2a373f]' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#6b7c85] flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {isLocked && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#ffcb45] rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-[#111b21]" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-medium text-[#e9edef] truncate text-[16px]">
                      {name}
                    </h3>
                    <span className={`text-[12px] whitespace-nowrap ml-2 ${
                      unreadCount > 0 ? 'text-[#00a884]' : 'text-[#8696a0]'
                    }`}>
                      {lastMessageTime ? formatTime(lastMessageTime) : ''}
                    </span>
                  </div>
                  
                  {/* Last Message Preview */}
                  <div className="flex items-center gap-1">
                    {isMyLastMessage && (
                      <span className="text-[#53bdeb] flex-shrink-0">
                        <CheckCheck className="w-4 h-4" />
                      </span>
                    )}
                    <p className="text-[14px] text-[#8696a0] truncate flex-1">
                      {lastMessageText || 'No messages yet'}
                    </p>
                    {unreadCount > 0 && (
                      <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-[#00a884] text-[#111b21] text-[11px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Property Title */}
                  {(extChat.property?.title || extChat.propertyTitle) && (
                    <p className="text-[11px] text-[#667781] truncate mt-0.5">
                      🏠 {extChat.property?.title || extChat.propertyTitle}
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
