import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, Calendar, Home, ArrowLeft } from 'lucide-react';
import { ChatMessage, Property, Interest } from '../types';
import { useChat } from '../hooks/useChat';
interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  participant: {
    name: string;
    avatar?: string;
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
  isFullPage = false
}: ChatInterfaceProps) {
  const {
    activeChat,
    sendMessage,
    isTyping
  } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = activeChat?.messages || [];
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  const handleSend = () => {
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };
  const handleSharePropertyBrief = () => {
    if (!property) return;
    sendMessage('Property Details', 'property-brief', {
      propertyId: property.id
    });
  };
  const handleScheduleInspection = () => {
    sendMessage('Inspection Scheduled', 'inspection-schedule', {
      inspectionDate: '2024-01-25T10:00:00Z'
    });
  };
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const formatPrice = (price: number) => {
    return `₦${(price / 1000000).toFixed(1)}M`;
  };
  const containerClasses = isFullPage ? 'absolute inset-0 bg-bg-primary flex flex-col' : 'fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-bg-primary border-l border-primary/30 flex flex-col shadow-2xl';
  if (!isOpen) return null;
  return <AnimatePresence>
      {!isFullPage && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />}

      <motion.div initial={!isFullPage ? {
      x: '100%'
    } : {
      opacity: 0
    }} animate={!isFullPage ? {
      x: 0
    } : {
      opacity: 1
    }} exit={!isFullPage ? {
      x: '100%'
    } : {
      opacity: 0
    }} transition={{
      type: 'spring',
      damping: 25,
      stiffness: 300
    }} className={containerClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-color bg-bg-secondary">
          <div className="flex items-center gap-3">
            {isFullPage && <button onClick={onClose} className="md:hidden p-2 -ml-2 hover:bg-bg-tertiary rounded-full">
                <ArrowLeft className="w-5 h-5 text-text-primary" />
              </button>}
            {participant.avatar ? <img src={participant.avatar} alt={participant.name} className="w-10 h-10 rounded-full border-2 border-primary/30" /> : <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <span className="font-bold text-black">
                  {participant.name.charAt(0)}
                </span>
              </div>}
            <div>
              <h3 className="font-semibold text-text-primary">
                {participant.name}
              </h3>
              <p className="text-xs text-text-tertiary">Active now</p>
            </div>
          </div>
          {!isFullPage && <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
              <X className="w-5 h-5 text-text-tertiary" />
            </button>}
        </div>

        {/* Quick Actions */}
        {(property || interest) && <div className="p-3 border-b border-border-color bg-bg-secondary/50">
            <div className="flex gap-2">
              {property && <button onClick={handleSharePropertyBrief} className="flex-1 px-3 py-2 bg-gradient-gold-subtle hover:bg-gradient-gold/20 border border-primary/30 rounded-lg text-xs font-semibold text-primary transition-all flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  Share Brief
                </button>}
              <button onClick={handleScheduleInspection} className="flex-1 px-3 py-2 bg-gradient-gold-subtle hover:bg-gradient-gold/20 border border-primary/30 rounded-lg text-xs font-semibold text-primary transition-all flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule
              </button>
            </div>
          </div>}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-primary">
          {messages.map(message => <motion.div key={message.id} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className={`flex ${message.senderId === 'user-1' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'text' ? <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${message.senderId === 'user-1' ? 'bg-gradient-gold text-black rounded-tr-none' : 'bg-bg-secondary text-text-primary rounded-tl-none'}`}>
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-[10px] mt-1 text-right ${message.senderId === 'user-1' ? 'text-black/60' : 'text-text-tertiary'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div> : message.type === 'property-brief' && property ? <div className="max-w-[85%] bg-bg-secondary border border-primary/30 rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-primary">
                      Property Shared
                    </span>
                  </div>
                  <img src={property.images[0]} alt={property.title} className="w-full h-24 object-cover rounded-lg mb-2" />
                  <h4 className="font-bold text-text-primary text-sm mb-1">
                    {property.title}
                  </h4>
                  <p className="text-primary font-bold text-sm">
                    {formatPrice(property.price)}
                  </p>
                </div> : null}
            </motion.div>)}

          {isTyping && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="flex justify-start">
              <div className="bg-bg-secondary rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{
                animationDelay: '0.1s'
              }}></span>
                  <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{
                animationDelay: '0.2s'
              }}></span>
                </div>
              </div>
            </motion.div>}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border-color bg-bg-secondary">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
              <Paperclip className="w-5 h-5 text-text-tertiary" />
            </button>
            <input type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 px-4 py-2 bg-bg-tertiary border border-border-color rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors" />
            <button onClick={handleSend} disabled={!inputMessage.trim()} className="p-2 bg-gradient-gold hover:opacity-90 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>;
}