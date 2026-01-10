import React, { useEffect } from 'react';
import { ChatList } from '../components/ChatList';
import { ChatInterface } from '../components/ChatInterface';
import { useChat } from '../hooks/useChat';
import { MessageCircle, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';

export function ChatsPage() {
  const toast = useToast();
  const {
    chats,
    activeChatId,
    setActiveChatId,
    activeChat,
    loading,
    error,
    refreshChats,
  } = useChat();

  // Show toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error, 'Chat Error');
    }
  }, [error, toast]);

  // Get participant info for the active chat
  const getParticipant = () => {
    if (!activeChat) return { name: 'User', isOnline: false };
    
    // First try otherParticipant from API
    if ((activeChat as any).otherParticipant) {
      return {
        name: (activeChat as any).otherParticipant.name,
        avatar: (activeChat as any).otherParticipant.avatar,
        isOnline: true,
      };
    }
    
    // Then try extended fields
    if ((activeChat as any).participantName) {
      return {
        name: (activeChat as any).participantName,
        avatar: (activeChat as any).participantAvatar,
        isOnline: true,
      };
    }
    
    // Fallback: Find the other participant from messages
    const otherMessage = activeChat.messages.find(m => m.senderId !== 'user-1');
    
    return {
      name: otherMessage?.senderName || 'User',
      avatar: otherMessage?.senderAvatar,
      isOnline: true,
    };
  };

  const participant = getParticipant();

  return (
    <div className="h-[calc(100vh-128px)] bg-[#111b21] flex">
      {/* Sidebar List - Hidden on mobile when chat is active */}
      <div className={`w-full md:w-80 lg:w-96 h-full border-r border-[#2a373f] ${activeChatId ? 'hidden md:block' : 'block'}`}>
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-[#8696a0]">Loading chats...</p>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <p className="text-[#8696a0] text-center mb-3">{error}</p>
            <button
              onClick={refreshChats}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        ) : (
          <ChatList
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
          />
        )}
      </div>

      {/* Chat Area */}
      <div className={`flex-1 h-full relative bg-[#0b141a] ${!activeChatId ? 'hidden md:block' : 'block'}`}>
        {activeChatId ? (
          <ChatInterface
            isOpen={true}
            onClose={() => setActiveChatId(null)}
            participant={participant}
            isFullPage={true}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-[#8696a0]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-[#1f2c34] rounded-full flex items-center justify-center mb-6 mx-auto">
                <MessageCircle className="w-12 h-12 text-[#8696a0]" />
              </div>
              <h2 className="text-2xl font-light text-[#e9edef] mb-2">
                Vilanow Chat
              </h2>
              <p className="text-sm max-w-sm">
                Send and receive messages about properties. 
                <br />
                Select a conversation to get started.
              </p>
              {chats.length === 0 && !loading && (
                <p className="text-xs text-[#667781] mt-4">
                  No conversations yet. Express interest in a property to start chatting!
                </p>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
