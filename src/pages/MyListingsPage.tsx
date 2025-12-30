import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, MoreVertical, Eye, Plus } from 'lucide-react';
import { mockProperties } from '../utils/mockData';
import { Property } from '../types';
import { EditListingModal } from '../components/EditListingModal';
import { ListingAnalytics } from '../components/ListingAnalytics';
export function MyListingsPage() {
  const [listings, setListings] = useState<Property[]>(mockProperties.slice(0, 3));
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<string | null>(null);
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setListings(prev => prev.filter(p => p.id !== id));
    }
  };
  const handleSave = (updatedProperty: Property) => {
    setListings(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
  };
  return <div className="min-h-screen bg-bg-secondary pb-24">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
              My Listings
            </h1>
            <p className="text-text-secondary">Manage your active properties</p>
          </div>
          <button className="px-6 py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center gap-2 gold-glow">
            <Plus className="w-5 h-5" />
            Add New Listing
          </button>
        </div>

        <div className="space-y-6">
          {listings.map((property, index) => <motion.div key={property.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} className="bg-bg-primary border border-border-color rounded-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-64 h-48 md:h-auto relative">
                  <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-3 py-1 bg-success text-white text-xs font-bold rounded-full">
                    Active
                  </div>
                </div>

                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-display text-xl font-bold text-text-primary mb-1">
                        {property.title}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        {property.location}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowAnalytics(showAnalytics === property.id ? null : property.id)} className={`p-2 rounded-lg transition-colors ${showAnalytics === property.id ? 'bg-primary/20 text-primary' : 'hover:bg-bg-tertiary text-text-tertiary'}`} title="View Analytics">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button onClick={() => setEditingProperty(property)} className="p-2 hover:bg-bg-tertiary text-text-tertiary rounded-lg transition-colors" title="Edit Listing">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(property.id)} className="p-2 hover:bg-danger/10 text-text-tertiary hover:text-danger rounded-lg transition-colors" title="Delete Listing">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-text-secondary mb-4">
                    <span>₦{property.price.toLocaleString()}</span>
                    <span>{property.bedrooms} Beds</span>
                    <span>{property.bathrooms} Baths</span>
                  </div>

                  {showAnalytics === property.id && <motion.div initial={{
                opacity: 0,
                height: 0
              }} animate={{
                opacity: 1,
                height: 'auto'
              }} exit={{
                opacity: 0,
                height: 0
              }}>
                      <div className="border-t border-border-color pt-4 mt-4">
                        <ListingAnalytics views={1250} clicks={450} inquiries={12} />
                      </div>
                    </motion.div>}
                </div>
              </div>
            </motion.div>)}
        </div>
      </div>

      {editingProperty && <EditListingModal isOpen={!!editingProperty} onClose={() => setEditingProperty(null)} property={editingProperty} onSave={handleSave} />}
    </div>;
}