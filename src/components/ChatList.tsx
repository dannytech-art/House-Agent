import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { ChatSession } from '../types';
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
    } else {
      return date.toLocaleDateString('en-NG', {
        month: 'short',
        day: 'numeric'
      });
    }
  };
  return <div className="flex flex-col h-full bg-bg-secondary border-r border-border-color w-full md:w-80">
      <div className="p-4 border-b border-border-color">
        <h2 className="font-display text-xl font-bold text-text-primary mb-4">
          Messages
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input type="text" placeholder="Search chats..." className="w-full pl-9 pr-4 py-2 bg-bg-tertiary border border-border-color rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => {
        const lastMessage = chat.messages[chat.messages.length - 1];
        const otherParticipant = chat.messages.find(m => m.senderId !== 'user-1'); // Hacky way to get other user info
        const avatar = otherParticipant?.senderAvatar;
        const name = otherParticipant?.senderName || 'Unknown User';
        return <button key={chat.id} onClick={() => onSelectChat(chat.id)} className={`w-full p-4 flex items-start gap-3 hover:bg-bg-tertiary transition-colors border-b border-border-color/50 ${activeChatId === chat.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}>
              <div className="relative">
                {avatar ? <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-black font-bold">
                    {name.charAt(0)}
                  </div>}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-bg-secondary"></span>
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-text-primary truncate">
                    {name}
                  </h3>
                  <span className="text-xs text-text-tertiary whitespace-nowrap">
                    {lastMessage ? formatTime(lastMessage.timestamp) : ''}
                  </span>
                </div>
                <p className="text-sm text-text-secondary truncate">
                  {lastMessage?.message || 'No messages yet'}
                </p>
              </div>
            </button>;
      })}
      </div>
    </div>;
}