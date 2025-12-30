import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Bed, Bath, Square, Heart, Share2, Calendar, CheckCircle, Star } from 'lucide-react';
import { Property } from '../types';
interface PropertyDetailsPageProps {
  property: Property;
  onBack: () => void;
  onExpressInterest: () => void;
}
export function PropertyDetailsPage({
  property,
  onBack,
  onExpressInterest
}: PropertyDetailsPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const formatPrice = (price: number) => {
    return `₦${(price / 1000000).toFixed(1)}M`;
  };
  return <div className="min-h-screen bg-bg-primary pb-20">
      {/* Image Gallery */}
      <div className="relative h-96">
        <img src={property.images[currentImageIndex]} alt={property.title} className="w-full h-full object-cover" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

        {/* Back button */}
        <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 bg-bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setIsSaved(!isSaved)} className="w-10 h-10 bg-bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-danger text-danger' : 'text-text-primary'}`} />
          </button>
          <button className="w-10 h-10 bg-bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Share2 className="w-5 h-5 text-text-primary" />
          </button>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {property.images.map((_, index) => <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'}`} />)}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Price and Title */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
                {formatPrice(property.price)}
              </h1>
              <p className="text-xl text-text-secondary">{property.title}</p>
            </div>
            {property.matchScore && <div className="px-3 py-1.5 bg-success/10 rounded-full flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm font-bold text-success">
                  {property.matchScore}% Match
                </span>
              </div>}
          </div>

          <div className="flex items-center gap-2 text-text-tertiary">
            <MapPin className="w-4 h-4" />
            <span>
              {property.location}, {property.area}
            </span>
          </div>
        </motion.div>

        {/* Key Details */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }} className="grid grid-cols-3 gap-4 mb-6">
          {property.bedrooms && <div className="bg-bg-secondary rounded-xl p-4 text-center">
              <Bed className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {property.bedrooms}
              </p>
              <p className="text-sm text-text-tertiary">Bedrooms</p>
            </div>}
          {property.bathrooms && <div className="bg-bg-secondary rounded-xl p-4 text-center">
              <Bath className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">
                {property.bathrooms}
              </p>
              <p className="text-sm text-text-tertiary">Bathrooms</p>
            </div>}
          <div className="bg-bg-secondary rounded-xl p-4 text-center">
            <Square className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary">
              {property.type}
            </p>
            <p className="text-sm text-text-tertiary">Type</p>
          </div>
        </motion.div>

        {/* Agent Info */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="bg-bg-secondary rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {property.agentName.charAt(0)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-text-primary">
                    {property.agentName}
                  </p>
                  {property.agentVerified && <CheckCircle className="w-4 h-4 text-success" />}
                </div>
                <p className="text-sm text-text-tertiary">
                  {property.agentType === 'direct' ? 'Direct Agent' : 'Semi-Direct Agent'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-semibold text-text-primary">4.8</span>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="mb-6">
          <h2 className="font-display text-xl font-bold text-text-primary mb-3">
            Description
          </h2>
          <p className="text-text-secondary leading-relaxed">
            {property.description}
          </p>
        </motion.div>

        {/* Amenities */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="mb-6">
          <h2 className="font-display text-xl font-bold text-text-primary mb-3">
            Amenities
          </h2>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((amenity, index) => <div key={index} className="px-4 py-2 bg-bg-secondary rounded-full text-sm text-text-secondary">
                {amenity}
              </div>)}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="flex gap-4">
          <button className="flex-1 px-6 py-4 bg-bg-secondary hover:bg-bg-tertiary text-text-primary rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Viewing
          </button>
          <button onClick={onExpressInterest} className="flex-1 px-6 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors">
            Express Interest
          </button>
        </motion.div>
      </div>
    </div>;
}