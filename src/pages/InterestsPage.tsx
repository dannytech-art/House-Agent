import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Filter, TrendingUp, MessageCircle } from 'lucide-react';
import { InterestCard } from '../components/InterestCard';
import { ChatInterface } from '../components/ChatInterface';
import { EmptyState } from '../components/EmptyState';
import { mockInterests, mockProperties } from '../utils/mockData';
import { Interest } from '../types';
export function InterestsPage() {
  const [interests, setInterests] = useState(mockInterests);
  const [filter, setFilter] = useState<'all' | 'pending' | 'contacted'>('all');
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null);
  const handleUnlock = (interest: Interest) => {
    const confirmed = window.confirm(`Unlock contact details for this buyer?\n\nCost: 10 credits\nSeriousness Score: ${interest.seriousnessScore}%`);
    if (confirmed) {
      setInterests(prev => prev.map(i => i.id === interest.id ? {
        ...i,
        unlocked: true,
        seekerName: 'Oluwaseun Adeyemi',
        seekerPhone: '+234 805 987 6543',
        status: 'contacted' as const
      } : i));
    }
  };
  const handleStartChat = (interest: Interest) => {
    setSelectedInterest(interest);
    setChatOpen(true);
  };
  const filteredInterests = interests.filter(interest => {
    if (filter === 'all') return true;
    return interest.status === filter;
  });
  const stats = {
    total: interests.length,
    pending: interests.filter(i => i.status === 'pending').length,
    unlocked: interests.filter(i => i.unlocked).length
  };
  // Get property for chat
  const selectedProperty = selectedInterest ? mockProperties.find(p => p.id === selectedInterest.propertyId) : undefined;
  return <>
      <div className="min-h-screen bg-bg-secondary pb-24">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="mb-6">
            <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
              Buyer Interests
            </h1>
            <p className="text-text-secondary">
              Manage and respond to property inquiries
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-bg-primary rounded-xl p-4 border border-border-color text-center">
              <Heart className="w-6 h-6 text-danger mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {stats.total}
              </p>
              <p className="text-sm text-text-tertiary">Total</p>
            </div>
            <div className="bg-bg-primary rounded-xl p-4 border border-border-color text-center">
              <TrendingUp className="w-6 h-6 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {stats.pending}
              </p>
              <p className="text-sm text-text-tertiary">Pending</p>
            </div>
            <div className="bg-bg-primary rounded-xl p-4 border border-border-color text-center">
              <Filter className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {stats.unlocked}
              </p>
              <p className="text-sm text-text-tertiary">Unlocked</p>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="flex gap-2 mb-6 bg-bg-primary rounded-xl p-1 border border-border-color w-fit">
            {[{
            id: 'all',
            label: 'All'
          }, {
            id: 'pending',
            label: 'Pending'
          }, {
            id: 'contacted',
            label: 'Contacted'
          }].map(tab => <button key={tab.id} onClick={() => setFilter(tab.id as typeof filter)} className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${filter === tab.id ? 'text-primary bg-primary/10' : 'text-text-tertiary hover:text-text-secondary'}`}>
                {tab.label}
              </button>)}
          </motion.div>

          {/* Interests List */}
          <div className="space-y-4">
            {filteredInterests.length > 0 ? filteredInterests.map((interest, index) => <InterestCard key={interest.id} interest={interest} onUnlock={handleUnlock} onStartChat={handleStartChat} index={index} />) : <EmptyState icon={MessageCircle} title="No interests found" description={filter === 'all' ? "You haven't received any inquiries yet." : `No ${filter} interests found.`} />}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {selectedInterest && <ChatInterface isOpen={chatOpen} onClose={() => setChatOpen(false)} participant={{
      name: selectedInterest.seekerName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedInterest.seekerName}`
    }} property={selectedProperty} interest={selectedInterest} />}
    </>;
}