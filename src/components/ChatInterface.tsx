import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, Calendar, Home, ArrowLeft, Check, CheckCheck, Lock, Mic, Smile, MoreVertical, Phone, Video } from 'lucide-react';
import { ChatMessage, Property, Interest } from '../types';
import { useChat } from '../hooks/useChat';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  participant: {
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
  property?: Property;
  interest?: Interest;
  isFullPage?: boolean;
}

export function ChatInterface({
  isOpen,
  onClose,
  participant,
  property,
  interest,
  isFullPage = false,
}: ChatInterfaceProps) {
  const {
    activeChat,
    sendMessage,
    isTyping,
    sending,
    currentUserId,
  } = useChat();
  
  const [inputMessage, setInputMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const messages = activeChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputMessage.trim() || sending) return;
    
    const message = inputMessage;
    setInputMessage('');
    
    try {
      await sendMessage(message);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      // Show the message back in input for retry
      setInputMessage(message);
      alert(error?.message || 'Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-NG', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatPrice = (price: number) => {
    return `₦${(price / 1000000).toFixed(1)}M`;
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: ChatMessage[] }[] = [];
  let currentDate = '';
  
  messages.forEach((message) => {
    const messageDate = new Date(message.timestamp).toDateString();
    if (messageDate !== currentDate) {
      currentDate = messageDate;
      groupedMessages.push({
        date: formatDate(message.timestamp),
        messages: [message],
      });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(message);
    }
  });

  const isMyMessage = (senderId: string) => {
    return senderId === currentUserId || senderId === 'user-1';
  };

  const containerClasses = isFullPage
    ? 'absolute inset-0 bg-[#0b141a] flex flex-col'
    : 'fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#0b141a] border-l border-primary/30 flex flex-col shadow-2xl';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {!isFullPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        />
      )}

      <motion.div
        initial={!isFullPage ? { x: '100%' } : { opacity: 0 }}
        animate={!isFullPage ? { x: 0 } : { opacity: 1 }}
        exit={!isFullPage ? { x: '100%' } : { opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={containerClasses}
      >
        {/* WhatsApp-style Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1f2c34] border-b border-[#2a373f]">
          <div className="flex items-center gap-3">
            {isFullPage && (
              <button
                onClick={onClose}
                className="p-2 -ml-2 hover:bg-[#2a373f] rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#aebac1]" />
              </button>
            )}
            
            <div className="relative">
              {participant.avatar ? (
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#6b7c85] flex items-center justify-center">
                  <span className="font-semibold text-white text-lg">
                    {participant.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {participant.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] rounded-full border-2 border-[#1f2c34]" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#e9edef] truncate">
                {participant.name}
              </h3>
              <p className="text-xs text-[#8696a0]">
                {isTyping ? (
                  <span className="text-[#25d366]">typing...</span>
                ) : participant.isOnline ? (
                  'online'
                ) : (
                  'last seen recently'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-[#2a373f] rounded-full transition-colors">
              <Video className="w-5 h-5 text-[#aebac1]" />
            </button>
            <button className="p-2 hover:bg-[#2a373f] rounded-full transition-colors">
              <Phone className="w-5 h-5 text-[#aebac1]" />
            </button>
            <button className="p-2 hover:bg-[#2a373f] rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-[#aebac1]" />
            </button>
            {!isFullPage && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#2a373f] rounded-full transition-colors ml-1"
              >
                <X className="w-5 h-5 text-[#aebac1]" />
              </button>
            )}
          </div>
        </div>

        {/* Property Context Bar */}
        {property && (
          <div className="px-4 py-2 bg-[#1f2c34] border-b border-[#2a373f]">
            <div className="flex items-center gap-3">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#e9edef] truncate">
                  {property.title}
                </p>
                <p className="text-xs text-primary font-semibold">
                  {formatPrice(property.price)}
                </p>
              </div>
              <button className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors">
                View
              </button>
            </div>
          </div>
        )}

        {/* Messages Area - WhatsApp style background */}
        <div 
          className="flex-1 overflow-y-auto px-4 py-2"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23182229' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundColor: '#0b141a',
          }}
        >
          {/* Encryption Notice */}
          <div className="flex justify-center my-4">
            <div className="bg-[#182229] px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Lock className="w-3 h-3 text-[#ffcb45]" />
              <span className="text-[11px] text-[#8696a0]">
                Messages are end-to-end encrypted
              </span>
            </div>
          </div>

          {/* Grouped Messages */}
          {groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date Divider */}
              <div className="flex justify-center my-3">
                <span className="bg-[#182229] text-[#8696a0] text-[11px] px-3 py-1 rounded-lg">
                  {group.date}
                </span>
              </div>

              {/* Messages */}
              {group.messages.map((message, msgIndex) => {
                const isMine = isMyMessage(message.senderId);
                const showTail = msgIndex === 0 || 
                  isMyMessage(group.messages[msgIndex - 1]?.senderId) !== isMine;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex mb-1 ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`relative max-w-[75%] px-3 py-1.5 ${
                        isMine
                          ? 'bg-[#005c4b] text-[#e9edef]'
                          : 'bg-[#1f2c34] text-[#e9edef]'
                      } ${
                        showTail
                          ? isMine
                            ? 'rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-lg'
                            : 'rounded-tl-sm rounded-tr-lg rounded-br-lg rounded-bl-lg'
                          : 'rounded-lg'
                      }`}
                    >
                      {/* Tail */}
                      {showTail && (
                        <div
                          className={`absolute top-0 w-3 h-3 ${
                            isMine
                              ? 'right-0 -mr-1.5 bg-[#005c4b]'
                              : 'left-0 -ml-1.5 bg-[#1f2c34]'
                          }`}
                          style={{
                            clipPath: isMine
                              ? 'polygon(100% 0, 0 0, 100% 100%)'
                              : 'polygon(0 0, 100% 0, 0 100%)',
                          }}
                        />
                      )}

                      {/* Property Brief Message Type */}
                      {message.type === 'property-brief' && property ? (
                        <div className="mb-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Home className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold text-primary">
                              Property Shared
                            </span>
                          </div>
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                          />
                          <h4 className="font-bold text-sm mb-1">
                            {property.title}
                          </h4>
                          <p className="text-primary font-bold text-sm">
                            {formatPrice(property.price)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[14px] leading-[19px] whitespace-pre-wrap break-words">
                          {message.message}
                        </p>
                      )}

                      {/* Time & Read Status */}
                      <div className={`flex items-center justify-end gap-1 mt-0.5 ${
                        isMine ? '-mr-1' : ''
                      }`}>
                        <span className="text-[11px] text-[#8696a0]">
                          {formatTime(message.timestamp)}
                        </span>
                        {isMine && (
                          <span className="text-[#53bdeb]">
                            <CheckCheck className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start mb-2"
            >
              <div className="bg-[#1f2c34] rounded-lg rounded-tl-sm px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - WhatsApp style - Always visible */}
        <div className="px-2 py-2 bg-[#1f2c34] border-t border-[#2a373f]">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#2a373f] rounded-full transition-colors">
              <Smile className="w-6 h-6 text-[#8696a0]" />
            </button>
            
            <button className="p-2 hover:bg-[#2a373f] rounded-full transition-colors">
              <Paperclip className="w-6 h-6 text-[#8696a0]" />
            </button>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message"
                className="w-full px-4 py-2.5 bg-[#2a373f] rounded-lg text-[#e9edef] placeholder:text-[#8696a0] focus:outline-none text-[15px]"
              />
            </div>

            {inputMessage.trim() ? (
              <button
                onClick={handleSend}
                disabled={sending}
                className="p-2.5 bg-[#00a884] hover:bg-[#00a884]/90 rounded-full transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5 text-[#111b21]" />
              </button>
            ) : (
              <button className="p-2.5 hover:bg-[#2a373f] rounded-full transition-colors">
                <Mic className="w-6 h-6 text-[#8696a0]" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
