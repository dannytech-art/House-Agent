import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Maximize, ArrowLeft } from 'lucide-react';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';

interface SwipePageProps {
  properties: Property[];
  onBack: () => void;
  onPropertyClick: (property: Property) => void;
  onSaveProperty: (property: Property) => void;
}

export function SwipePage({
  properties,
  onBack,
  onPropertyClick,
  onSaveProperty,
}: SwipePageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedProperties, setSwipedProperties] = useState<Set<string>>(new Set());
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentProperty = properties[currentIndex];
  const nextProperty = properties[currentIndex + 1];
  const hasMoreProperties = currentIndex < properties.length - 1;

  const handleSwipeLeft = () => {
    if (isAnimating || !currentProperty) return;
    setIsAnimating(true);
    setDirection('left');
    setSwipedProperties(prev => new Set(prev).add(currentProperty.id));
    
    setTimeout(() => {
      if (hasMoreProperties) {
        setCurrentIndex(prev => prev + 1);
      }
      setDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleSwipeRight = () => {
    if (isAnimating || !currentProperty) return;
    setIsAnimating(true);
    setDirection('right');
    onSaveProperty(currentProperty);
    setSwipedProperties(prev => new Set(prev).add(currentProperty.id));
    
    setTimeout(() => {
      if (hasMoreProperties) {
        setCurrentIndex(prev => prev + 1);
      }
      setDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleSwipeUp = () => {
    if (isAnimating || !currentProperty) return;
    onPropertyClick(currentProperty);
  };

  const handlePass = () => {
    handleSwipeLeft();
  };

  const handleLike = () => {
    handleSwipeRight();
  };

  const handleViewDetails = () => {
    handleSwipeUp();
  };

  // Reset when properties change
  useEffect(() => {
    setCurrentIndex(0);
    setSwipedProperties(new Set());
    setDirection(null);
    setIsAnimating(false);
  }, [properties]);

  if (!currentProperty) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center pb-20">
        <div className="text-center max-w-md px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6"
          >
            <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-text-primary mb-2">
              All Caught Up!
            </h2>
            <p className="text-text-secondary mb-6">
              You've seen all available properties. Check back later for new listings!
            </p>
          </motion.div>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg-secondary/95 backdrop-blur-sm border-b border-border-color">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-bg-primary rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div className="text-center">
            <h1 className="font-display text-lg font-bold text-text-primary">
              Discover Properties
            </h1>
            <p className="text-xs text-text-tertiary">
              {currentIndex + 1} of {properties.length}
            </p>
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Swipe Stack Container */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="relative h-[600px]">
          <AnimatePresence mode="wait">
            {/* Next Card (Background) */}
            {nextProperty && (
              <motion.div
                key={`next-${nextProperty.id}`}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ 
                  scale: currentIndex === properties.indexOf(nextProperty) - 1 ? 0.95 : 0.9,
                  opacity: currentIndex === properties.indexOf(nextProperty) - 1 ? 0.7 : 0.5
                }}
                className="absolute inset-0 z-0"
                style={{ pointerEvents: 'none' }}
              >
                <PropertyCard
                  property={nextProperty}
                  onSwipeLeft={() => {}}
                  onSwipeRight={() => {}}
                  onSwipeUp={() => {}}
                  onTap={() => {}}
                  style={{
                    position: 'relative',
                    transform: 'scale(0.95)',
                  }}
                />
              </motion.div>
            )}

            {/* Current Card (Foreground) */}
            {currentProperty && !swipedProperties.has(currentProperty.id) && (
              <motion.div
                key={currentProperty.id}
                initial={{ scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 }}
                animate={
                  direction === 'left'
                    ? { x: -500, opacity: 0, rotate: -30 }
                    : direction === 'right'
                    ? { x: 500, opacity: 0, rotate: 30 }
                    : direction === 'up'
                    ? { y: -500, opacity: 0 }
                    : { scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 }
                }
                exit={
                  direction === 'left'
                    ? { x: -500, opacity: 0, rotate: -30 }
                    : direction === 'right'
                    ? { x: 500, opacity: 0, rotate: 30 }
                    : { y: -500, opacity: 0 }
                }
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute inset-0 z-10"
              >
                <PropertyCard
                  property={currentProperty}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  onSwipeUp={handleSwipeUp}
                  onTap={handleViewDetails}
                  swipeMode={true}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swipe Indicators Overlay */}
          {currentProperty && !isAnimating && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 left-4 bg-danger/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-danger"
              >
                <X className="w-6 h-6 text-danger" />
                <span className="ml-2 text-danger font-bold">PASS</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-4 bg-success/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-success"
              >
                <Heart className="w-6 h-6 text-success" />
                <span className="ml-2 text-success font-bold">LIKE</span>
              </motion.div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePass}
            disabled={isAnimating}
            className="w-16 h-16 rounded-full bg-bg-primary border-2 border-border-color hover:border-danger hover:bg-danger/10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-8 h-8 text-danger" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleViewDetails}
            disabled={isAnimating}
            className="w-16 h-16 rounded-full bg-bg-primary border-2 border-border-color hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Maximize className="w-8 h-8 text-primary" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            disabled={isAnimating}
            className="w-16 h-16 rounded-full bg-bg-primary border-2 border-border-color hover:border-success hover:bg-success/10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart className="w-8 h-8 text-success" />
          </motion.button>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-tertiary">
            Swipe right to save • Swipe left to pass • Swipe up or tap for details
          </p>
        </div>
      </div>
    </div>
  );
}

