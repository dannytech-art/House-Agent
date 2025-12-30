import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Home, TrendingUp, Award, MapPin, Heart, MessageCircle, Phone, Mail, CheckCircle } from 'lucide-react';
import { Agent, Property } from '../types';
import { mockProperties } from '../utils/mockData';
interface PublicAgentProfilePageProps {
  agentId: string;
  onBack: () => void;
  onExpressInterest: (property: Property) => void;
}
export function PublicAgentProfilePage({
  agentId,
  onBack,
  onExpressInterest
}: PublicAgentProfilePageProps) {
  // Mock agent data - in production, fetch by agentId
  const agent: Agent = {
    id: agentId,
    name: 'Chidi Okafor',
    email: 'chidi@vilanow.com',
    phone: '+234 803 456 7890',
    role: 'agent',
    agentType: 'direct',
    verified: true,
    level: 12,
    xp: 2450,
    credits: 150,
    walletBalance: 45000,
    streak: 7,
    totalListings: 24,
    totalInterests: 156,
    responseTime: 2,
    rating: 4.8,
    joinedDate: '2023-06-15T10:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi&backgroundColor=D4AF37'
  };
  // Mock agent's listings - in production, fetch by agentId
  const agentListings = mockProperties.filter(p => p.agentId === agentId).slice(0, 6);
  const formatPrice = (price: number) => {
    return `₦${(price / 1000000).toFixed(1)}M`;
  };
  const stats = [{
    icon: Home,
    label: 'Active Listings',
    value: agent.totalListings,
    color: 'text-primary'
  }, {
    icon: TrendingUp,
    label: 'Total Interests',
    value: agent.totalInterests,
    color: 'text-success'
  }, {
    icon: Award,
    label: 'Agent Level',
    value: agent.level,
    color: 'text-warning'
  }, {
    icon: Star,
    label: 'Rating',
    value: agent.rating.toFixed(1),
    color: 'text-primary'
  }];
  return <div className="min-h-screen bg-bg-secondary pb-20">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-bg-primary/80 backdrop-blur-lg border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Agent Profile Card */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <img src={agent.avatar} alt={agent.name} className="w-32 h-32 rounded-full border-4 border-primary" />
              {agent.verified && <div className="absolute bottom-0 right-0 w-10 h-10 bg-success rounded-full border-4 border-bg-primary flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold text-text-primary">
                  {agent.name}
                </h1>
                {agent.verified && <span className="px-3 py-1 bg-success/20 text-success text-sm font-semibold rounded-full">
                    Verified
                  </span>}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full">
                  {agent.agentType === 'direct' ? 'Direct Agent' : 'Semi-Direct Agent'}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="font-semibold text-text-primary">
                    {agent.rating}
                  </span>
                  <span className="text-sm text-text-tertiary">
                    ({agent.totalInterests} reviews)
                  </span>
                </div>
              </div>

              <p className="text-text-secondary mb-6 max-w-2xl">
                Professional real estate agent specializing in premium
                properties across Lagos. Committed to helping you find your
                dream home with personalized service and expert guidance.
              </p>

              {/* Contact Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a href={`tel:${agent.phone}`} className="px-6 py-3 bg-gradient-gold hover:opacity-90 text-black rounded-xl font-semibold transition-all gold-glow flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
                <a href={`mailto:${agent.email}`} className="px-6 py-3 bg-bg-primary hover:bg-bg-tertiary border border-border-color text-text-primary rounded-xl font-semibold transition-all flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email
                </a>
                <a href={`https://wa.me/${agent.phone.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-success hover:opacity-90 text-white rounded-xl font-semibold transition-all flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-primary/20">
            {stats.map((stat, index) => {
            const Icon = stat.icon;
            return <motion.div key={index} initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              delay: 0.1 + index * 0.05
            }} className="text-center">
                  <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                  <p className="text-2xl font-bold text-text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-text-tertiary">{stat.label}</p>
                </motion.div>;
          })}
          </div>
        </motion.div>

        {/* Listings Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }}>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
            Available Properties ({agentListings.length})
          </h2>

          {agentListings.length > 0 ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentListings.map((property, index) => <motion.div key={property.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2 + index * 0.1
          }} className="bg-bg-primary rounded-xl border border-border-color overflow-hidden hover:border-primary/30 transition-all group">
                  <div className="relative h-48">
                    <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {property.featured && <div className="absolute top-3 left-3 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full">
                        <span className="text-xs font-bold text-black">
                          Featured
                        </span>
                      </div>}
                  </div>

                  <div className="p-4">
                    <h3 className="font-display font-bold text-text-primary mb-2 line-clamp-1">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-1 text-sm text-text-tertiary mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{property.location}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xl font-bold text-gradient-gold">
                        {formatPrice(property.price)}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-text-tertiary">
                        <span>{property.bedrooms} bed</span>
                        <span>{property.bathrooms} bath</span>
                      </div>
                    </div>

                    <button onClick={() => onExpressInterest(property)} className="w-full px-4 py-3 bg-gradient-gold hover:opacity-90 text-black rounded-xl font-semibold transition-all gold-glow flex items-center justify-center gap-2">
                      <Heart className="w-5 h-5" />
                      Express Interest
                    </button>
                  </div>
                </motion.div>)}
            </div> : <div className="text-center py-16 bg-bg-primary rounded-xl border border-border-color">
              <Home className="w-20 h-20 text-text-tertiary mx-auto mb-4 opacity-50" />
              <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
                No listings yet
              </h3>
              <p className="text-text-secondary">
                This agent hasn't posted any properties yet. Check back soon!
              </p>
            </div>}
        </motion.div>
      </div>
    </div>;
}