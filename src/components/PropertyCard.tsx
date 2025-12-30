import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { Heart, X, MapPin, Bed, Bath, Maximize, Sparkles, RotateCw } from 'lucide-react';
import { Property } from '../types';
import { AIMatchBadge } from './AIMatchBadge';
import { AIPriceBadge } from './AIPriceBadge';
import { DemandSignalBadge } from './DemandSignalBadge';
import { DuplicateDetectionBadge } from './DuplicateDetectionBadge';
interface PropertyCardProps {
  property: Property;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onTap: () => void;
  style?: any;
  swipeMode?: boolean; // Enable swipe mode with relaxed drag constraints
}
const roomLabels = ['Exterior View', 'Living Room', 'Bedroom', 'Kitchen'];
export function PropertyCard({
  property,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onTap,
  style = {},
  swipeMode = false
}: PropertyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateZ = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  // 3D perspective transforms
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);
  // Hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  // Auto-rotate through images
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % Math.min(property.images.length, 4));
    }, 2500);
    return () => clearInterval(interval);
  }, [autoRotate, property.images.length]);
  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 100;
    const swipeUpThreshold = -100;
    if (info.offset.y < swipeUpThreshold) {
      onSwipeUp();
    } else if (info.offset.x > swipeThreshold) {
      onSwipeRight();
    } else if (info.offset.x < -swipeThreshold) {
      onSwipeLeft();
    }
  };
  const handleCardTap = (e: any) => {
    // Check if tap is on the rotate button
    if (e.target.closest('.rotate-button')) {
      setIsFlipped(!isFlipped);
      setAutoRotate(!autoRotate);
      setShowHint(false);
      return;
    }
    onTap();
  };
  const formatPrice = (price: number) => {
    return `₦${(price / 1000000).toFixed(1)}M`;
  };
  const currentImage = property.images[currentImageIndex] || property.images[0];
  const currentRoomLabel = roomLabels[currentImageIndex] || roomLabels[0];
  return <motion.div drag dragConstraints={swipeMode ? undefined : {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }} dragElastic={swipeMode ? 0.7 : 0} onDragEnd={handleDragEnd} style={{
    x,
    y,
    rotateZ,
    opacity,
    ...style,
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: 'grab',
    perspective: 1000
  }} whileTap={{
    cursor: 'grabbing'
  }} className="touch-none">
      <motion.div onClick={handleCardTap} style={{
      rotateX: isFlipped ? 0 : rotateX,
      rotateY: isFlipped ? 180 : rotateY,
      transformStyle: 'preserve-3d'
    }} animate={{
      rotateY: isFlipped ? 180 : 0
    }} transition={{
      type: 'spring',
      stiffness: 200,
      damping: 25
    }} className="relative bg-bg-primary rounded-2xl shadow-2xl overflow-hidden h-full border-2 border-border-color hover:border-primary/30 transition-colors">
        {/* Front of Card */}
        <div className="absolute inset-0" style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}>
          {/* Image Section with 3D Effect */}
          <div className="relative h-[60%] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img key={currentImageIndex} src={currentImage} alt={property.title} initial={{
              opacity: 0,
              scale: 1.1
            }} animate={{
              opacity: 1,
              scale: 1
            }} exit={{
              opacity: 0,
              scale: 0.9
            }} transition={{
              duration: 0.5
            }} className="w-full h-full object-cover" draggable={false} />
            </AnimatePresence>

            {/* 3D Depth Shadow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

            {/* Room Label with 3D Effect */}
            {autoRotate && <motion.div initial={{
            opacity: 0,
            y: -10
          }} animate={{
            opacity: 1,
            y: 0
          }} className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-primary/30">
                <span className="text-sm font-bold text-white">
                  {currentRoomLabel}
                </span>
              </motion.div>}

            {/* AI Badges Overlay */}
            <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2 z-10">
              {property.featured && <motion.div initial={{
              scale: 0.8,
              opacity: 0
            }} animate={{
              scale: 1,
              opacity: 1
            }} className="px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-bold text-black">Featured</span>
                </motion.div>}

              {property.aiMatchScore && <AIMatchBadge matchScore={property.aiMatchScore} compact />}

              {property.aiPriceAnalysis && <AIPriceBadge priceAnalysis={property.aiPriceAnalysis} compact />}

              {property.demandSignal && property.demandSignal.urgency === 'high' && <DemandSignalBadge demandSignal={property.demandSignal} compact />}

              {property.isDuplicate && <DuplicateDetectionBadge isDuplicate={property.isDuplicate} isDirectAgent={property.agentId === property.directAgentId} compact />}
            </div>

            {/* 3D Rotate Button with Enhanced Visibility */}
            <motion.button className="rotate-button absolute bottom-3 right-3 w-14 h-14 bg-gradient-gold backdrop-blur-md rounded-full flex items-center justify-center border-2 border-primary shadow-2xl z-10" whileHover={{
            scale: 1.15
          }} whileTap={{
            scale: 0.95
          }} animate={{
            rotate: autoRotate ? 360 : 0,
            boxShadow: autoRotate ? '0 0 30px rgba(212, 175, 55, 0.6)' : '0 10px 30px rgba(0, 0, 0, 0.3)'
          }} transition={{
            rotate: {
              duration: 2,
              repeat: autoRotate ? Infinity : 0,
              ease: 'linear'
            }
          }}>
              <RotateCw className="w-6 h-6 text-black" />
            </motion.button>

            {/* Hint Tooltip - Shows on first card */}
            <AnimatePresence>
              {showHint && !autoRotate && <motion.div initial={{
              opacity: 0,
              scale: 0.8,
              y: 10
            }} animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }} exit={{
              opacity: 0,
              scale: 0.8,
              y: 10
            }} className="absolute bottom-20 right-3 z-20 pointer-events-none">
                  <div className="relative">
                    <div className="bg-black/90 backdrop-blur-md px-4 py-2 rounded-lg border border-primary/30 whitespace-nowrap">
                      <p className="text-xs font-bold text-white">
                        🏠 Tap to see rooms!
                      </p>
                    </div>
                    {/* Arrow pointing down */}
                    <div className="absolute -bottom-1 right-4 w-2 h-2 bg-black/90 rotate-45 border-r border-b border-primary/30" />
                  </div>
                </motion.div>}
            </AnimatePresence>

            {/* Image Progress Indicators */}
            {autoRotate && <div className="absolute bottom-3 left-3 flex gap-1.5">
                {roomLabels.slice(0, Math.min(property.images.length, 4)).map((_, index) => <motion.div key={index} className={`h-1 rounded-full transition-all ${index === currentImageIndex ? 'w-8 bg-primary' : 'w-1 bg-white/40'}`} layoutId={`indicator-${index}`} />)}
              </div>}

            {/* Swipe Indicators */}
            <motion.div style={{
            opacity: useTransform(x, [-100, 0], [1, 0])
          }} className="absolute inset-0 bg-danger/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 bg-danger rounded-full flex items-center justify-center shadow-2xl">
                <X className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <motion.div style={{
            opacity: useTransform(x, [0, 100], [0, 1])
          }} className="absolute inset-0 bg-success/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center shadow-2xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <motion.div style={{
            opacity: useTransform(y, [-100, 0], [1, 0])
          }} className="absolute inset-0 bg-warning/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 bg-warning rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-4xl">⭐</span>
              </div>
            </motion.div>
          </div>

          {/* Content Section with 3D Depth */}
          <div className="p-5 h-[40%] overflow-y-auto relative">
            {/* Subtle 3D depth effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/50 to-bg-primary pointer-events-none" />

            <div className="relative z-10">
              {/* Title and Price */}
              <h3 className="font-display text-xl font-bold text-text-primary mb-2 line-clamp-2">
                {property.title}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <p className="text-2xl font-bold text-gradient-gold">
                  {formatPrice(property.price)}
                </p>
                {property.aiPriceAnalysis && property.aiPriceAnalysis.label === 'great-deal' && <motion.span initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} className="text-xs font-bold text-success">
                      Save{' '}
                      {Math.abs(property.aiPriceAnalysis.difference).toFixed(0)}
                      %
                    </motion.span>}
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-text-secondary mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{property.location}</span>
              </div>

              {/* Property Details */}
              <div className="flex items-center gap-4 text-sm text-text-tertiary mb-4">
                {property.bedrooms && <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.bedrooms} bed</span>
                  </div>}
                {property.bathrooms && <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.bathrooms} bath</span>
                  </div>}
                {property.area && <div className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    <span>{property.area}</span>
                  </div>}
              </div>

              {/* AI Match Explanation */}
              {property.aiMatchScore && property.aiMatchScore.score >= 80 && <motion.div initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} className="bg-primary/5 border border-primary/20 rounded-lg p-2 mb-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-text-secondary">
                      <span className="font-semibold text-primary">
                        Why this matches:
                      </span>{' '}
                      {property.aiMatchScore.explanation}
                    </p>
                  </div>
                </motion.div>}

              {/* Agent Info */}
              <div className="flex items-center justify-between pt-3 border-t border-border-color">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black">
                      {property.agentName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      {property.agentName}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {property.agentType === 'direct' ? 'Direct Agent' : 'Semi-Direct'}
                    </p>
                  </div>
                </div>
                {property.agentVerified && <span className="text-xs px-2 py-1 bg-success/20 text-success rounded-full">
                    Verified
                  </span>}
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card (Flipped View) */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-2xl p-6 flex flex-col justify-center items-center" style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)'
      }}>
          <motion.div initial={{
          scale: 0.8,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          delay: 0.2
        }} className="text-center">
            <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <RotateCw className="w-10 h-10 text-black" />
            </div>
            <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
              3D View Active
            </h3>
            <p className="text-text-secondary mb-6">
              Automatically cycling through property rooms
            </p>
            <div className="space-y-2">
              {roomLabels.slice(0, Math.min(property.images.length, 4)).map((label, index) => <motion.div key={label} initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: 0.3 + index * 0.1
            }} className={`px-4 py-2 rounded-lg ${index === currentImageIndex ? 'bg-primary text-black font-bold' : 'bg-bg-primary text-text-secondary'}`}>
                    {label}
                  </motion.div>)}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>;
}