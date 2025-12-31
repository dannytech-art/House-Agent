import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, RefreshCw, Activity, User, MapPin, Home, DollarSign, Loader2 } from 'lucide-react';
import apiClient from '../lib/api-client';

interface SeekerRequest {
  id: string;
  seekerId: string;
  seekerName?: string;
  seekerAvatar?: string;
  type: string;
  location: string;
  minBudget: number;
  maxBudget: number;
  bedrooms?: number;
  description?: string;
  status: string;
  createdAt: string;
}

export function PropertyTicker() {
  const [requests, setRequests] = useState<SeekerRequest[]>([]);
  const [displayedRequests, setDisplayedRequests] = useState<SeekerRequest[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeListings: 0,
    totalAgents: 0,
    totalValue: 0
  });

  // Fetch seeker requests from API
  const fetchRequests = useCallback(async () => {
    try {
      const data = await apiClient.getProperties({ limit: 20 });
      const requestsData = Array.isArray(data) ? data : [];
      
      // Transform to seeker request format with fallback data
      const transformedRequests: SeekerRequest[] = requestsData.map((item: any) => ({
        id: item.id,
        seekerId: item.agentId || item.seekerId || 'unknown',
        seekerName: item.agentName || item.seekerName || 'Anonymous',
        seekerAvatar: item.agentAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.agentName || 'User'}&backgroundColor=D4AF37`,
        type: item.type || 'apartment',
        location: item.location || 'Lagos',
        minBudget: item.minBudget || item.price || 0,
        maxBudget: item.maxBudget || item.price || 0,
        bedrooms: item.bedrooms,
        description: item.description,
        status: item.status || 'active',
        createdAt: item.createdAt || item.postedAt || new Date().toISOString()
      }));
      
      setRequests(transformedRequests);
      
      // Update stats
      const totalValue = transformedRequests.reduce((sum, r) => sum + (r.maxBudget || 0), 0);
      setStats({
        totalRequests: transformedRequests.length,
        activeListings: transformedRequests.filter(r => r.status === 'active').length,
        totalAgents: new Set(transformedRequests.map(r => r.seekerId)).size,
        totalValue
      });
      
      // Set initial displayed requests (first 3)
      if (transformedRequests.length > 0) {
        setDisplayedRequests(transformedRequests.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Rotate displayed requests every 5 seconds
  useEffect(() => {
    if (!isLive || requests.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = (prev + 3) % requests.length;
        const endIndex = Math.min(nextIndex + 3, requests.length);
        
        // If we don't have enough for 3, wrap around
        let newDisplayed = requests.slice(nextIndex, endIndex);
        if (newDisplayed.length < 3 && requests.length >= 3) {
          newDisplayed = [...newDisplayed, ...requests.slice(0, 3 - newDisplayed.length)];
        }
        
        setDisplayedRequests(newDisplayed);
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive, requests]);

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `₦${(price / 1000000000).toFixed(1)}B`;
    }
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `₦${(price / 1000).toFixed(0)}K`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const getStatusBadge = (status: string, createdAt: string) => {
    const hoursSinceCreated = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceCreated < 24) {
      return { status: 'New', color: 'bg-success text-white' };
    }
    if (status === 'active') {
      return { status: 'Hot', color: 'bg-danger text-white' };
    }
    return { status: 'Active', color: 'bg-warning text-black' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="relative bg-bg-secondary border-y border-primary/30">
        <div className="max-w-7xl mx-auto px-4 py-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-text-secondary">Loading live listings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-bg-secondary border-y border-primary/30">
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
          <button
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-gold-subtle hover:bg-gradient-gold/20 border border-primary/40 rounded-lg text-sm font-bold text-primary transition-all gold-glow"
          >
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
            {displayedRequests.length > 0 ? (
              displayedRequests.map((request, index) => {
                const { status, color } = getStatusBadge(request.status, request.createdAt);
                const firstName = (request.seekerName || 'User').split(' ')[0];
                
                return (
                  <motion.div
                    key={`${request.id}-${index}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="hidden md:grid grid-cols-12 gap-4 px-5 py-4 bg-bg-primary/50 border-x border-b border-primary/20 hover:bg-bg-tertiary/50 hover:border-primary/40 transition-all cursor-pointer last:rounded-b-xl group"
                  >
                    <div className="col-span-2 flex items-center gap-2">
                      <img
                        src={request.seekerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}&backgroundColor=D4AF37`}
                        alt={firstName}
                        className="w-8 h-8 rounded-full border-2 border-primary/30"
                      />
                      <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {firstName}
                      </span>
                    </div>
                    <div className="col-span-2 text-text-secondary group-hover:text-text-primary transition-colors">
                      {request.location}
                    </div>
                    <div className="col-span-2 font-bold text-gradient-gold">
                      {formatPrice(request.maxBudget || request.minBudget)}
                    </div>
                    <div className="col-span-1 text-text-secondary group-hover:text-text-primary transition-colors">
                      {request.bedrooms ? `${request.bedrooms} BR` : '-'}
                    </div>
                    <div className="col-span-2 text-primary font-semibold capitalize">
                      {request.type}
                    </div>
                    <div className="col-span-2 text-text-tertiary text-sm group-hover:text-text-secondary transition-colors">
                      {formatDate(request.createdAt)}
                    </div>
                    <div className="col-span-1">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
                        {status}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="hidden md:flex items-center justify-center py-10 bg-bg-primary/50 border-x border-b border-primary/20 rounded-b-xl">
                <p className="text-text-tertiary">No listings available yet</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile View - Scrolling Cards */}
        <div className="md:hidden overflow-x-auto -mx-4 px-4">
          <div className="flex gap-4 py-3">
            <AnimatePresence mode="popLayout">
              {displayedRequests.map((request, index) => {
                const { status, color } = getStatusBadge(request.status, request.createdAt);
                const firstName = (request.seekerName || 'User').split(' ')[0];
                
                return (
                  <motion.div
                    key={`mobile-${request.id}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex-shrink-0 w-72 bg-bg-tertiary/50 backdrop-blur-sm rounded-xl p-4 border border-primary/30 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={request.seekerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}&backgroundColor=D4AF37`}
                        alt={firstName}
                        className="w-8 h-8 rounded-full border-2 border-primary/30"
                      />
                      <span className="text-sm font-semibold text-text-primary">
                        {firstName}
                      </span>
                    </div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-gradient-gold text-lg mb-1">
                          {formatPrice(request.maxBudget || request.minBudget)}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {request.location}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-tertiary capitalize">
                        {request.bedrooms ? `${request.bedrooms} BR • ` : ''}{request.type}
                      </span>
                      <span className="text-primary text-xs font-semibold">
                        {formatDate(request.createdAt)}
                      </span>
                    </div>
                  </motion.div>
                );
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
            <p className="text-4xl font-bold text-danger">{stats.activeListings || 0}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">
                Total Realtors
              </span>
            </div>
            <p className="text-4xl font-bold text-success">{stats.totalAgents || 0}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs text-text-tertiary font-bold uppercase tracking-wider">
                Total Value
              </span>
            </div>
            <p className="text-4xl font-bold text-gradient-gold">{formatPrice(stats.totalValue)}</p>
          </div>
        </div>

        {/* Update Notice */}
        <p className="text-center text-xs text-text-tertiary mt-6 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse-gold"></span>
          Live data • {displayedRequests.length} active listings • Powered by VilaNow AI Engine
        </p>
      </div>
    </div>
  );
}
