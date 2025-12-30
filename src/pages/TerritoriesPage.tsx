import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, DollarSign, Lock, Info, Plus, Loader2 } from 'lucide-react';
import { TerritoryCard } from '../components/TerritoryCard';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../lib/api-client';
import { AgentTerritory } from '../types';
export function TerritoriesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'my-territories' | 'available'>('my-territories');
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [myTerritories, setMyTerritories] = useState<AgentTerritory[]>([]);
  
  const availableTerritories = [{
    area: 'Victoria Island',
    cost: 200,
    popularity: 'High',
    potential: 150
  }, {
    area: 'Banana Island',
    cost: 250,
    popularity: 'Very High',
    potential: 200
  }, {
    area: 'Ajah',
    cost: 50,
    popularity: 'Medium',
    potential: 80
  }, {
    area: 'Sangotedo',
    cost: 50,
    popularity: 'Medium',
    potential: 70
  }, {
    area: 'Maryland',
    cost: 80,
    popularity: 'Medium',
    potential: 90
  }, {
    area: 'Ikeja GRA',
    cost: 150,
    popularity: 'High',
    potential: 120
  }];

  // Load credits and territories
  useEffect(() => {
    const loadData = async () => {
      try {
        const [balanceData] = await Promise.all([
          apiClient.getCreditBalance(),
        ]);
        setCredits(balanceData.credits || 0);
        // TODO: Load user territories from API
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    if (user) {
      loadData();
    }
  }, [user]);

  const handleClaim = async (territory: (typeof availableTerritories)[0]) => {
    if (credits < territory.cost) {
      alert(`Insufficient credits! You need ${territory.cost} credits to claim ${territory.area}.`);
      return;
    }
    
    const confirmed = window.confirm(`Claim ${territory.area} for ${territory.cost} credits?\n\nThis will unlock analytics and passive income potential for this area.`);
    if (!confirmed) return;

    setClaiming(territory.area);
    setLoading(true);

    try {
      const response = await apiClient.claimTerritory(
        territory.area,
        territory.cost,
        'Lagos',
        territory.potential
      );

      if (response.success) {
        setCredits(response.newBalance);
        alert(`Successfully claimed ${territory.area}! 🎉\n\nStart listing properties here to build dominance.`);
        // Refresh territories list
        // TODO: Reload territories from API
      } else {
        alert(`Error: ${response.error || 'Failed to claim territory'}`);
      }
    } catch (error: any) {
      console.error('Error claiming territory:', error);
      alert(`Failed to claim territory: ${error.message || 'Please try again'}`);
    } finally {
      setLoading(false);
      setClaiming(null);
    }
  };
  return <div className="min-h-screen bg-bg-secondary pb-20">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
                Territory Management 🗺️
              </h1>
              <p className="text-text-secondary">
                Control areas, earn passive income, and dominate the market
              </p>
            </div>

            <div className="flex items-center gap-4 bg-bg-primary p-4 rounded-xl border border-border-color">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-text-tertiary">
                  Daily Passive Income
                </p>
                <p className="text-xl font-bold text-success">+15 Credits</p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="relative w-full h-64 bg-bg-primary rounded-2xl border border-border-color overflow-hidden mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />

            {/* Map Grid Pattern */}
            <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            opacity: 0.1
          }} />

            {/* Map Pins */}
            <div className="absolute top-1/4 left-1/4 animate-bounce" style={{
            animationDuration: '2s'
          }}>
              <MapPin className="w-8 h-8 text-primary drop-shadow-lg" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]" />
            </div>
            <div className="absolute top-1/2 right-1/3 animate-bounce" style={{
            animationDuration: '2.5s',
            animationDelay: '0.5s'
          }}>
              <MapPin className="w-8 h-8 text-success drop-shadow-lg" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-bg-primary/90 backdrop-blur-md px-6 py-3 rounded-full border border-primary/30 shadow-xl">
                <p className="font-semibold text-text-primary flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Interactive Map View
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-border-color">
            <button onClick={() => setActiveTab('my-territories')} className={`pb-3 px-2 font-semibold transition-colors relative ${activeTab === 'my-territories' ? 'text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}>
              My Territories
              {activeTab === 'my-territories' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <button onClick={() => setActiveTab('available')} className={`pb-3 px-2 font-semibold transition-colors relative ${activeTab === 'available' ? 'text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}>
              Available to Claim
              {activeTab === 'available' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          </div>

          {/* Content */}
          {activeTab === 'my-territories' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTerritories.length > 0 ? (
                <>
                  {myTerritories.map((territory, index) => (
                    <motion.div 
                      key={territory.area} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TerritoryCard territory={territory} />
                    </motion.div>
                  ))}
                  
                  {/* Add New Card */}
                  <motion.button 
                    onClick={() => setActiveTab('available')} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="h-full min-h-[200px] bg-bg-primary/50 border-2 border-dashed border-border-color hover:border-primary/50 rounded-xl flex flex-col items-center justify-center gap-3 group transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-text-tertiary group-hover:text-primary" />
                    </div>
                    <p className="font-semibold text-text-tertiary group-hover:text-primary">
                      Claim New Territory
                    </p>
                  </motion.button>
                </>
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-text-secondary">You haven't claimed any territories yet.</p>
                  <p className="text-sm text-text-tertiary mt-2">Claim a territory to start earning passive income!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTerritories.map((territory, index) => {
                return (
                  <motion.div 
                    key={territory.area} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-bg-primary border border-border-color rounded-xl p-6 hover:border-primary/30 transition-all"
                  >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-text-primary">
                        {territory.area}
                      </h3>
                      <p className="text-sm text-text-tertiary">
                        {territory.popularity} Demand
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-primary/10 rounded-full">
                      <span className="text-sm font-bold text-primary">
                        {territory.cost} Credits
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">
                        Earning Potential
                      </span>
                      <span className="font-semibold text-success">
                        Up to {territory.potential}/day
                      </span>
                    </div>
                    <div className="w-full bg-bg-tertiary h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-success h-full rounded-full" 
                        style={{ width: `${territory.potential / 200 * 100}%` }}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => handleClaim(territory)} 
                    disabled={loading || claiming === territory.area || credits < territory.cost}
                    className="w-full py-3 bg-bg-secondary hover:bg-primary hover:text-white border border-primary/30 text-primary rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {claiming === territory.area ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Claiming...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Unlock Territory
                      </>
                    )}
                  </button>
                </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>;
}