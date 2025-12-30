import React from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, MessageCircle, Clock, MapPin, ChevronRight, Home } from 'lucide-react';
import { Property } from '../types';
import { DashboardStats } from '../components/DashboardStats';
import { PropertyCard } from '../components/PropertyCard';
interface SeekerDashboardPageProps {
  onNavigate: (page: string) => void;
  onStartSwipe: () => void;
  savedProperties: Property[];
}
export function SeekerDashboardPage({
  onNavigate,
  onStartSwipe,
  savedProperties
}: SeekerDashboardPageProps) {
  const stats = [{
    title: 'Saved Homes',
    value: savedProperties.length,
    icon: Heart,
    color: 'danger' as const
  }, {
    title: 'Active Chats',
    value: 3,
    icon: MessageCircle,
    color: 'primary' as const
  }, {
    title: 'Viewings',
    value: 1,
    icon: Clock,
    color: 'warning' as const
  }, {
    title: 'Requests',
    value: 2,
    icon: Search,
    color: 'success' as const
  }];
  return <div className="min-h-screen bg-bg-secondary pb-24">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
            Find your dream home 🏡
          </h1>
          <p className="text-text-secondary">
            Continue your search where you left off.
          </p>
        </div>

        {/* Stats */}
        <DashboardStats stats={stats} />

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} onClick={onStartSwipe} className="p-8 bg-gradient-gold rounded-2xl shadow-lg text-left relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-display text-2xl font-bold text-black mb-2">
                Start Swiping
              </h3>
              <p className="text-black/70 font-medium">
                Discover homes tailored to your taste with our AI matcher.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
              <Home className="w-48 h-48 text-black" />
            </div>
          </motion.button>

          <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} onClick={() => onNavigate('requests')} className="p-8 bg-bg-primary border border-border-color rounded-2xl shadow-sm text-left relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
                Post a Request
              </h3>
              <p className="text-text-secondary">
                Tell agents exactly what you're looking for and let them come to
                you.
              </p>
            </div>
          </motion.button>
        </div>

        {/* Saved Properties Preview */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-xl font-bold text-text-primary">
              Saved Properties
            </h2>
            <button onClick={() => onNavigate('watchlist')} className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {savedProperties.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.slice(0, 3).map(property => <div key={property.id} className="h-[400px] relative">
                  <PropertyCard property={property} onSwipeLeft={() => {}} onSwipeRight={() => {}} onSwipeUp={() => {}} onTap={() => {}} style={{
              position: 'relative'
            }} />
                </div>)}
            </div> : <div className="text-center py-12 bg-bg-primary rounded-2xl border border-border-color border-dashed">
              <Heart className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
              <p className="text-text-secondary">
                You haven't saved any properties yet.
              </p>
              <button onClick={onStartSwipe} className="mt-4 text-primary font-bold hover:underline">
                Start Exploring
              </button>
            </div>}
        </section>
      </div>
    </div>;
}