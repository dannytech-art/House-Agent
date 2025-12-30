import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, RefreshCw, Activity } from 'lucide-react';
import { Property } from '../types';
import { mockProperties, agentAvatars } from '../utils/mockData';
export function PropertyTicker() {
  const [properties, setProperties] = useState(mockProperties.slice(0, 8));
  const [isLive, setIsLive] = useState(true);
  // Simulate live updates every 5 seconds
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setProperties(prev => {
        const newProperties = [...prev];
        const randomIndex = Math.floor(Math.random() * newProperties.length);
        const randomProperty = mockProperties[Math.floor(Math.random() * mockProperties.length)];
        newProperties[randomIndex] = {
          ...randomProperty,
          postedAt: new Date().toISOString()
        };
        return newProperties;
      });
    }, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [isLive]);
  const formatPrice = (price: number) => {
    return `₦${(price / 1000000).toFixed(1)}M`;
  };
  const getStatusBadge = (index: number) => {
    const statuses = ['Hot', 'New', 'New', 'Inspections', 'Inspections', 'Hot', 'New', 'Hot'];
    const colors = {
      Hot: 'bg-danger text-white',
      New: 'bg-success text-white',
      Inspections: 'bg-warning text-black'
    };
    const status = statuses[index];
    return {
      status,
      color: colors[status as keyof typeof colors]
    };
  };
  const getAgentAvatar = (agentName: string) => {
    const firstName = agentName.split(' ')[0];
    return agentAvatars[firstName] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}&backgroundColor=D4AF37`;
  };
  return <div className="relative bg-bg-secondary border-y border-primary/30">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="w-6 h-6 text-primary" />
              {isLive && <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full animate-pulse-gold"></span>}
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl text-gradient-gold">
                LIVE REAL-TIME LISTINGS
              </h3>
              <p className="text-xs text-text-tertiary">
                Updates every 5 seconds
              </p>
            </div>
          </div>
          <button onClick={() => setIsLive(!isLive)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-gold-subtle hover:bg-gradient-gold/20 border border-primary/40 rounded-lg text-sm font-bold text-primary transition-all gold-glow">
            <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-bg-tertiary/50 rounded-t-xl border border-primary/30 text-sm font-bold text-primary">
          <div className="col-span-2">Agent Name</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-2">Asking Price</div>
          <div className="col-span-1">BHK</div>
          <div className="col-span-2">House Type</div>
          <div className="col-span-2">Date Added</div>
          <div className="col-span-1">Status</div>
        </div>

        {/* Table Rows with Live Updates */}
        <div className="space-y-0">
          <AnimatePresence mode="popLayout">
            {properties.map((property, index) => {
            const {
              status,
              color
            } = getStatusBadge(index);
            const agentFirstName = property.agentName.split(' ')[0];
            const agentAvatar = getAgentAvatar(property.agentName);
            return <motion.div key={`${property.id}-${index}`} layout initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: 20
            }} transition={{
              duration: 0.3
            }} className="hidden md:grid grid-cols-12 gap-4 px-5 py-4 bg-bg-primary/50 border-x border-b border-primary/20 hover:bg-bg-tertiary/50 hover:border-primary/40 transition-all cursor-pointer last:rounded-b-xl group">
                  <div className="col-span-2 flex items-center gap-2">
                    <img src={agentAvatar} alt={agentFirstName} className="w-8 h-8 rounded-full border-2 border-primary/30" />
                    <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {agentFirstName}
                    </span>
                  </div>
                  <div className="col-span-2 text-text-secondary group-hover:text-text-primary transition-colors">
                    {property.location}
                  </div>
                  <div className="col-span-2 font-bold text-gradient-gold">
                    {formatPrice(property.price)}
                  </div>
                  <div className="col-span-1 text-text-secondary group-hover:text-text-primary transition-colors">
                    {property.bedrooms} BR
                  </div>
                  <div className="col-span-2 text-primary font-semibold">
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </div>
                  <div className="col-span-2 text-text-tertiary text-sm group-hover:text-text-secondary transition-colors">
                    {new Date(property.postedAt).toLocaleDateString('en-NG', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}
                  </div>
                  <div className="col-span-1">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
                      {status}
                    </span>
                  </div>
                </motion.div>;
          })}
          </AnimatePresence>
        </div>

        {/* Mobile View - Scrolling Cards */}
        <div className="md:hidden overflow-x-auto -mx-4 px-4">
          <div className="flex gap-4 py-3">
            <AnimatePresence mode="popLayout">
              {properties.map((property, index) => {
              const {
                status,
                color
              } = getStatusBadge(index);
              const agentFirstName = property.agentName.split(' ')[0];
              const agentAvatar = getAgentAvatar(property.agentName);
              return <motion.div key={`${property.id}-${index}`} layout initial={{
                opacity: 0,
                scale: 0.9
              }} animate={{
                opacity: 1,
                scale: 1
              }} exit={{
                opacity: 0,
                scale: 0.9
              }} className="flex-shrink-0 w-72 bg-bg-tertiary/50 backdrop-blur-sm rounded-xl p-4 border border-primary/30 hover:border-primary/50 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <img src={agentAvatar} alt={agentFirstName} className="w-8 h-8 rounded-full border-2 border-primary/30" />
                      <span className="text-sm font-semibold text-text-primary">
                        {agentFirstName}
                      </span>
                    </div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-gradient-gold text-lg mb-1">
                          {formatPrice(property.price)}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {property.location}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-tertiary">
                        {property.bedrooms} BR • {property.type}
                      </span>
                      <span className="text-primary text-xs font-semibold">
                        Just now
                      </span>
                    </div>
                  </motion.div>;
            })}
            </AnimatePresence>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-primary/30">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">
                Live Visits
              </span>
            </div>
            <p className="text-4xl font-bold text-gradient-gold">98.87K</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">
                Total Listings
              </span>
            </div>
            <p className="text-4xl font-bold text-danger">2,119</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">
                Total Realtors
              </span>
            </div>
            <p className="text-4xl font-bold text-success">576</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">
                Total Value
              </span>
            </div>
            <p className="text-4xl font-bold text-gradient-gold">₦1.5B</p>
          </div>
        </div>

        {/* Update Notice */}
        <p className="text-center text-xs text-text-tertiary mt-6 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse-gold"></span>
          Live data • 8 active listings • Powered by VilaNow AI Engine
        </p>
      </div>
    </div>;
}