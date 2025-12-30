import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search, Loader2 } from 'lucide-react';
import { MarketplaceOfferCard } from '../components/MarketplaceOfferCard';
import { CreateOfferModal } from '../components/CreateOfferModal';
import { MarketplaceOfferDetails } from '../components/MarketplaceOfferDetails';
import { apiClient } from '../lib/api-client';
import { MarketplaceOffer } from '../types';
interface AgentMarketplacePageProps {
  currentUserId: string;
  currentCredits: number;
  onBack: () => void;
}
export function AgentMarketplacePage({
  currentUserId,
  currentCredits,
  onBack
}: AgentMarketplacePageProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<MarketplaceOffer | null>(null);
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [credits, setCredits] = useState(currentCredits);

  // Load offers and credits
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [offersData, balanceData] = await Promise.all([
          apiClient.getMarketplaceOffers(),
          apiClient.getCreditBalance(),
        ]);
        
        setOffers(offersData || []);
        setCredits(balanceData.credits || 0);
      } catch (error) {
        console.error('Error loading marketplace data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleCreateOffer = async (newOffer: any) => {
    try {
      const response = await apiClient.createMarketplaceOffer({
        type: newOffer.type,
        title: newOffer.title || newOffer.description?.substring(0, 50),
        description: newOffer.description,
        price: newOffer.price,
        propertyId: newOffer.propertyId,
      });

      if (response.success) {
        setOffers([response, ...offers]);
        setIsCreateModalOpen(false);
      } else {
        alert(`Error: ${response.error || 'Failed to create offer'}`);
      }
    } catch (error: any) {
      console.error('Error creating offer:', error);
      alert(`Failed to create offer: ${error.message || 'Please try again'}`);
    }
  };

  const handlePurchase = async (offer: MarketplaceOffer) => {
    if (credits < offer.price) {
      alert('Insufficient credits!');
      return;
    }
    
    if (!window.confirm(`Purchase this ${offer.type} for ${offer.price} credits?`)) {
      return;
    }

    setPurchasing(offer.id);
    
    try {
      const response = await apiClient.purchaseOffer(offer.id);
      
      if (response.success) {
        setCredits(response.newBalance);
        alert('Purchase successful! Contact details unlocked.');
        setSelectedOffer(null);
        // Refresh offers
        const offersData = await apiClient.getMarketplaceOffers();
        setOffers(offersData || []);
      } else {
        alert(`Error: ${response.error || 'Failed to purchase offer'}`);
      }
    } catch (error: any) {
      console.error('Error purchasing offer:', error);
      alert(`Failed to purchase offer: ${error.message || 'Please try again'}`);
    } finally {
      setPurchasing(null);
    }
  };
  const filteredOffers = offers.filter(offer => {
    if (activeTab === 'sell') return offer.agentId === currentUserId;
    return offer.agentId !== currentUserId;
  });
  return <div className="min-h-screen bg-bg-secondary pb-24">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
              Agent Marketplace
            </h1>
            <p className="text-text-secondary">
              Buy and sell leads, co-broking opportunities, and access.
            </p>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className="px-6 py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 gold-glow">
            <Plus className="w-5 h-5" />
            Create Offer
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex bg-bg-primary p-1 rounded-xl border border-border-color w-fit">
            <button onClick={() => setActiveTab('buy')} className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'buy' ? 'bg-primary text-black' : 'text-text-secondary hover:text-text-primary'}`}>
              Buy Opportunities
            </button>
            <button onClick={() => setActiveTab('sell')} className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'sell' ? 'bg-primary text-black' : 'text-text-secondary hover:text-text-primary'}`}>
              My Offers
            </button>
          </div>

          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input type="text" placeholder="Search offers..." className="w-full pl-10 pr-4 py-3 bg-bg-primary border border-border-color rounded-xl text-text-primary focus:outline-none focus:border-primary" />
            </div>
            <button className="p-3 bg-bg-primary border border-border-color rounded-xl hover:border-primary/50 transition-colors">
              <Filter className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-text-secondary">Loading offers...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer, index) => <motion.div key={offer.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }}>
                <MarketplaceOfferCard offer={offer} onPurchase={() => setSelectedOffer(offer)} />
              </motion.div>)}
          </div>
        )}

        {filteredOffers.length === 0 && <div className="text-center py-20">
            <p className="text-text-secondary">
              No offers found in this category.
            </p>
          </div>}
      </div>

      <CreateOfferModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreateOffer={handleCreateOffer} currentCredits={currentCredits} />

      <MarketplaceOfferDetails 
        isOpen={!!selectedOffer} 
        onClose={() => setSelectedOffer(null)} 
        offer={selectedOffer} 
        onPurchase={handlePurchase}
      />
    </div>;
}