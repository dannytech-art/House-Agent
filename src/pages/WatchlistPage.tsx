import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { mockProperties } from '../utils/mockData'; // In real app, fetch saved properties
export function WatchlistPage() {
  const {
    user
  } = useAuth();
  // Mock saved properties
  const savedProperties = mockProperties.slice(0, 2);
  return <div className="min-h-screen bg-bg-secondary pb-24">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
            Saved Homes
          </h1>
          <p className="text-text-secondary">
            Properties you've bookmarked for later.
          </p>
        </div>

        {savedProperties.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property, index) => <motion.div key={property.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} className="h-[450px] relative">
                <PropertyCard property={property} onSwipeLeft={() => {}} onSwipeRight={() => {}} onSwipeUp={() => {}} onTap={() => {}} style={{
            position: 'relative'
          }} />
              </motion.div>)}
          </div> : <EmptyState icon={Heart} title="No saved properties" description="Start exploring and save homes you like to see them here." actionLabel="Start Exploring" onAction={() => window.location.href = '/search'} />}
      </div>
    </div>;
}