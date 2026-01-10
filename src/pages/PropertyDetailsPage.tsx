import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Bed, Bath, Square, Heart, Share2, Calendar, CheckCircle, Star, MessageSquare, Loader2, Clock, ChevronLeft, ChevronRight, X, LogIn } from 'lucide-react';
import { Property } from '../types';
import apiClient from '../lib/api-client';
import { useToast, getErrorMessage } from '../contexts/ToastContext';

interface PropertyDetailsPageProps {
  property: Property;
  onBack: () => void;
  onExpressInterest: () => void;
  onLoginRequired?: () => void;
}

export function PropertyDetailsPage({
  property,
  onBack,
  onExpressInterest,
  onLoginRequired
}: PropertyDetailsPageProps) {
  const toast = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interestId, setInterestId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Check if user is authenticated
  const isAuthenticated = !!apiClient.getToken();
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [inspectionNotes, setInspectionNotes] = useState('');

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    return date < today;
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Handle express interest with optional inspection scheduling
  const handleExpressInterestWithSchedule = async () => {
    if (!interestMessage.trim()) {
      setInterestMessage("I'm interested in this property!");
    }
    
    setIsSubmitting(true);
    try {
      // First, create the interest
      const response = await apiClient.createInterest({
        propertyId: property.id,
        message: interestMessage || "I'm interested in this property!",
      });
      
      const newInterestId = response?.interest?.id || response?.id;
      setInterestId(newInterestId);
      
      // If date and time selected, also schedule inspection
      if (selectedDate && selectedTime && newInterestId) {
        const dateStr = selectedDate.toISOString().split('T')[0];
        try {
          await apiClient.scheduleInspection({
            interestId: newInterestId,
            scheduledDate: dateStr,
            scheduledTime: selectedTime,
            notes: inspectionNotes,
          });
          setSuccessMessage('Interest expressed and inspection scheduled! The agent will be notified.');
          toast.success('Interest expressed and inspection scheduled!', 'Success');
        } catch (inspectionErr: any) {
          // Interest was created but inspection failed
          toast.warning(getErrorMessage(inspectionErr), 'Inspection Scheduling Failed');
          setSuccessMessage('Interest expressed! However, the inspection could not be scheduled.');
        }
      } else {
        setSuccessMessage('Interest expressed successfully! The agent will be notified.');
        toast.success('Interest expressed successfully!', 'Success');
      }
      
      setShowInterestModal(false);
      onExpressInterest();
    } catch (err: any) {
      console.error('Error expressing interest:', err);
      toast.error(getErrorMessage(err), 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };
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

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-success/10 border border-success/30 rounded-xl"
          >
            <p className="text-success font-medium">{successMessage}</p>
          </motion.div>
        )}

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
          {interestId ? (
            <>
              <div className="flex-1 px-6 py-4 bg-success/20 text-success rounded-xl font-medium flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Interest Sent
              </div>
              <button 
                onClick={() => setShowInterestModal(true)}
                className="flex-1 px-6 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Schedule Again
              </button>
            </>
          ) : (
            <button 
              onClick={() => {
                if (isAuthenticated) {
                  setShowInterestModal(true);
                } else {
                  setShowLoginPrompt(true);
                }
              }}
              className="w-full px-6 py-4 bg-gradient-gold hover:opacity-90 text-black rounded-xl font-bold transition-all flex items-center justify-center gap-2 gold-glow"
            >
              <MessageSquare className="w-5 h-5" />
              Express Interest & Schedule Viewing
            </button>
          )}
        </motion.div>
      </div>

      {/* Express Interest Modal with Calendar */}
      {showInterestModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowInterestModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-primary border border-border-color rounded-2xl w-full max-w-lg my-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-bg-primary border-b border-border-color p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-text-primary">
                    Express Interest
                  </h2>
                  <p className="text-xs text-text-secondary">
                    {property.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInterestModal(false)}
                className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Message Section */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Your Message
                </label>
                <textarea
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  placeholder="Hi, I'm interested in this property..."
                  className="w-full px-4 py-3 bg-bg-secondary border border-border-color rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary resize-none"
                  rows={3}
                />
              </div>

              {/* Calendar Section */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Schedule Inspection Date (Optional)
                </label>
                <div className="bg-bg-secondary rounded-xl p-3">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                      className="p-1.5 hover:bg-bg-tertiary rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-text-secondary" />
                    </button>
                    <h3 className="font-semibold text-text-primary text-sm">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                      className="p-1.5 hover:bg-bg-tertiary rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-text-secondary" />
                    </button>
                  </div>

                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {dayNames.map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-text-tertiary py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((date, index) => (
                      <button
                        key={index}
                        disabled={isDateDisabled(date)}
                        onClick={() => date && setSelectedDate(date)}
                        className={`
                          aspect-square flex items-center justify-center text-xs rounded-lg transition-all
                          ${!date ? 'invisible' : ''}
                          ${isDateDisabled(date) ? 'text-text-tertiary cursor-not-allowed opacity-40' : 'hover:bg-bg-tertiary'}
                          ${isDateSelected(date) ? 'bg-primary text-white font-bold' : 'text-text-primary'}
                          ${date && date.toDateString() === today.toDateString() && !isDateSelected(date) ? 'ring-1 ring-primary/50' : ''}
                        `}
                      >
                        {date?.getDate()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Date Display */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 p-2 bg-primary/10 border border-primary/30 rounded-lg"
                  >
                    <p className="text-xs text-primary font-medium">
                      📅 {selectedDate.toLocaleDateString('en-NG', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Time Slots - Only show if date is selected */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Select Time
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          py-2 px-1 rounded-lg text-xs font-medium transition-all
                          ${selectedTime === time 
                            ? 'bg-primary text-white' 
                            : 'bg-bg-secondary hover:bg-bg-tertiary text-text-primary border border-border-color'
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Inspection Notes - Only show if time is selected */}
              {selectedTime && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Notes for Agent (Optional)
                  </label>
                  <input
                    type="text"
                    value={inspectionNotes}
                    onChange={(e) => setInspectionNotes(e.target.value)}
                    placeholder="E.g., Please call 30 mins before..."
                    className="w-full px-4 py-2 bg-bg-secondary border border-border-color rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary text-sm"
                  />
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-bg-primary border-t border-border-color p-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInterestModal(false)}
                  className="flex-1 px-4 py-3 bg-bg-secondary hover:bg-bg-tertiary text-text-primary rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExpressInterestWithSchedule}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-gradient-gold hover:opacity-90 text-black rounded-xl font-bold transition-all flex items-center justify-center gap-2 gold-glow"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : selectedDate && selectedTime ? (
                    <>
                      <Calendar className="w-4 h-4" />
                      Send & Schedule
                    </>
                  ) : (
                    'Send Interest'
                  )}
                </button>
              </div>
              {selectedDate && selectedTime && (
                <p className="text-xs text-text-tertiary text-center mt-2">
                  Interest + Inspection on {selectedDate.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })} at {selectedTime}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Login Required Prompt */}
      {showLoginPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowLoginPrompt(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-primary border border-border-color rounded-2xl w-full max-w-sm p-6 text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold text-text-primary mb-2">
              Login Required
            </h2>
            <p className="text-text-secondary mb-6">
              Please login or create an account to express interest in this property and schedule viewings.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 px-4 py-3 bg-bg-secondary hover:bg-bg-tertiary text-text-primary rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  onLoginRequired?.();
                }}
                className="flex-1 px-4 py-3 bg-gradient-gold hover:opacity-90 text-black rounded-xl font-bold transition-all gold-glow"
              >
                Login
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>;
}