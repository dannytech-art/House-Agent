import React from 'react';
import { ChatList } from '../components/ChatList';
import { ChatInterface } from '../components/ChatInterface';
import { useChat } from '../hooks/useChat';
import { MessageCircle } from 'lucide-react';
export function ChatsPage() {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    activeChat
  } = useChat();
  return <div className="h-[calc(100vh-64px)] bg-bg-primary flex">
      {/* Sidebar List - Hidden on mobile when chat is active */}
      <div className={`w-full md:w-80 h-full border-r border-border-color ${activeChatId ? 'hidden md:block' : 'block'}`}>
        <ChatList chats={chats} activeChatId={activeChatId} onSelectChat={setActiveChatId} />
      </div>

      {/* Chat Area */}
      <div className={`flex-1 h-full relative ${!activeChatId ? 'hidden md:block' : 'block'}`}>
        {activeChatId && activeChat ? <ChatInterface isOpen={true} onClose={() => setActiveChatId(null)} participant={{
        name: activeChat.messages.find(m => m.senderId !== 'user-1')?.senderName || 'User',
        avatar: activeChat.messages.find(m => m.senderId !== 'user-1')?.senderAvatar
      }} isFullPage={true} /> : <div className="h-full flex flex-col items-center justify-center text-text-tertiary">
            <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10" />
            </div>
            <p className="text-lg font-medium">
              Select a conversation to start chatting
            </p>
          </div>}
      </div>
    </div>;
}