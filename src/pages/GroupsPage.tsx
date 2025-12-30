import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, MessageCircle, Search } from 'lucide-react';
import { GroupChatRoom } from '../components/GroupChatRoom';
import { mockGroups } from '../utils/mockGroups';
import { Group } from '../types';
export function GroupsPage() {
  const [groups] = useState(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
    setChatOpen(true);
  };
  const filteredGroups = groups.filter(group => group.name.toLowerCase().includes(searchQuery.toLowerCase()) || group.description.toLowerCase().includes(searchQuery.toLowerCase()));
  const formatLastMessage = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) {
      return date.toLocaleTimeString('en-NG', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric'
    });
  };
  return <>
      <div className="min-h-screen bg-bg-secondary pb-20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
                  Agent Groups
                </h1>
                <p className="text-text-secondary">
                  Connect and collaborate with fellow agents
                </p>
              </div>
              <button className="px-4 py-3 bg-gradient-gold hover:opacity-90 text-black rounded-xl font-bold transition-all gold-glow flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Create Group</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search groups..." className="w-full pl-12 pr-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors" />
            </div>
          </motion.div>

          {/* Groups List */}
          <div className="space-y-3">
            {filteredGroups.map((group, index) => <motion.button key={group.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.05
          }} onClick={() => handleGroupClick(group)} className="w-full bg-bg-primary hover:bg-bg-tertiary border border-border-color rounded-xl p-4 transition-all text-left group">
                <div className="flex items-center gap-4">
                  {/* Group Avatar */}
                  <div className="relative flex-shrink-0">
                    {group.avatar ? <img src={group.avatar} alt={group.name} className="w-14 h-14 rounded-full border-2 border-primary/30" /> : <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center">
                        <Users className="w-7 h-7 text-black" />
                      </div>}
                    {group.unreadCount > 0 && <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-black">
                          {group.unreadCount}
                        </span>
                      </div>}
                  </div>

                  {/* Group Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display font-bold text-text-primary truncate group-hover:text-primary transition-colors">
                        {group.name}
                      </h3>
                      <span className="text-xs text-text-tertiary flex-shrink-0 ml-2">
                        {formatLastMessage(group.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary truncate mb-2">
                      {group.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-text-tertiary" />
                      <span className="text-xs text-text-tertiary">
                        {group.members.length} members
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <MessageCircle className="w-5 h-5 text-text-tertiary group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </motion.button>)}
          </div>

          {filteredGroups.length === 0 && <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} className="text-center py-16">
              <Users className="w-20 h-20 text-text-tertiary mx-auto mb-4 opacity-50" />
              <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
                No groups found
              </h3>
              <p className="text-text-secondary mb-6">
                Create a new group to start collaborating with other agents
              </p>
              <button className="px-6 py-3 bg-gradient-gold hover:opacity-90 text-black rounded-xl font-bold transition-all gold-glow">
                Create Your First Group
              </button>
            </motion.div>}
        </div>
      </div>

      {/* Group Chat */}
      {selectedGroup && <GroupChatRoom isOpen={chatOpen} onClose={() => setChatOpen(false)} group={selectedGroup} currentUserId="agent-1" />}
    </>;
}