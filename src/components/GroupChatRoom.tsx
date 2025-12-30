import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Users, Info, Plus } from 'lucide-react';
import { Group, GroupMessage } from '../types';
import { mockGroupMessages } from '../utils/mockGroups';
interface GroupChatRoomProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  currentUserId: string;
}
export function GroupChatRoom({
  isOpen,
  onClose,
  group,
  currentUserId
}: GroupChatRoomProps) {
  const [messages, setMessages] = useState<GroupMessage[]>(mockGroupMessages[group.id] || []);
  const [inputMessage, setInputMessage] = useState('');
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSend = () => {
    if (!inputMessage.trim()) return;
    const currentUser = group.members.find(m => m.id === currentUserId);
    const newMessage: GroupMessage = {
      id: Date.now().toString(),
      groupId: group.id,
      senderId: currentUserId,
      senderName: currentUser?.name || 'You',
      senderAvatar: currentUser?.avatar,
      message: inputMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');
  };
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit'
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
        month: 'short',
        day: 'numeric'
      });
    }
  };
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

          {/* Chat Window */}
          <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.95
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300
      }} className="fixed inset-4 md:inset-auto md:right-4 md:top-4 md:bottom-4 md:w-full md:max-w-2xl z-50 bg-bg-primary border border-primary/30 rounded-2xl flex flex-col overflow-hidden gold-glow">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-color bg-bg-secondary">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {group.avatar ? <img src={group.avatar} alt={group.name} className="w-12 h-12 rounded-full border-2 border-primary/30 flex-shrink-0" /> : <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-black" />
                  </div>}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-text-primary truncate">
                    {group.name}
                  </h3>
                  <p className="text-xs text-text-tertiary truncate">
                    {group.members.length} members
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowGroupInfo(!showGroupInfo)} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
                  <Info className="w-5 h-5 text-text-tertiary" />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>
            </div>

            {/* Group Info Sidebar */}
            <AnimatePresence>
              {showGroupInfo && <motion.div initial={{
            x: 300,
            opacity: 0
          }} animate={{
            x: 0,
            opacity: 1
          }} exit={{
            x: 300,
            opacity: 0
          }} className="absolute right-0 top-16 bottom-0 w-80 bg-bg-secondary border-l border-border-color p-4 overflow-y-auto z-10">
                  <h4 className="font-display font-bold text-text-primary mb-4">
                    Group Info
                  </h4>

                  <div className="mb-6">
                    <p className="text-sm text-text-tertiary mb-2">
                      Description
                    </p>
                    <p className="text-sm text-text-secondary">
                      {group.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-text-primary">
                        {group.members.length} Members
                      </p>
                    </div>
                    <div className="space-y-2">
                      {group.members.map(member => <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
                          {member.avatar ? <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border-2 border-primary/30" /> : <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                              <span className="font-bold text-black">
                                {member.name.charAt(0)}
                              </span>
                            </div>}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">
                              {member.name}
                            </p>
                            {member.role === 'admin' && <p className="text-xs text-primary">Admin</p>}
                          </div>
                        </div>)}
                    </div>
                  </div>
                </motion.div>}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
            const isMe = message.senderId === currentUserId;
            const showDate = index === 0 || formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
            return <div key={message.id}>
                    {showDate && <div className="flex items-center justify-center my-4">
                        <span className="px-3 py-1 bg-bg-secondary text-xs text-text-tertiary rounded-full">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>}

                    <motion.div initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isMe && message.senderAvatar && <img src={message.senderAvatar} alt={message.senderName} className="w-8 h-8 rounded-full border-2 border-primary/30 flex-shrink-0" />}
                      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        {!isMe && <span className="text-xs font-semibold text-primary mb-1">
                            {message.senderName}
                          </span>}
                        <div className={`rounded-2xl px-4 py-2 ${isMe ? 'bg-gradient-gold text-black' : 'bg-bg-secondary text-text-primary'}`}>
                          <p className="text-sm break-words">
                            {message.message}
                          </p>
                          <p className={`text-xs mt-1 ${isMe ? 'text-black/60' : 'text-text-tertiary'}`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>;
          })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border-color bg-bg-secondary">
              <div className="flex items-center gap-2">
                <input type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 px-4 py-3 bg-bg-tertiary border border-border-color rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors" />
                <button onClick={handleSend} disabled={!inputMessage.trim()} className="p-3 bg-gradient-gold hover:opacity-90 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed gold-glow">
                  <Send className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}