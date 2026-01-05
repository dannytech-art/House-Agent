import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface InspectionSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: string, time: string, notes: string) => void;
  propertyTitle?: string;
  isLoading?: boolean;
}

export function InspectionScheduler({
  isOpen,
  onClose,
  onSchedule,
  propertyTitle,
  isLoading = false
}: InspectionSchedulerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
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
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
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

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    return date < today;
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      onSchedule(dateStr, selectedTime, notes);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-bg-primary border border-border-color rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-color">
            <div>
              <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Schedule Inspection
              </h2>
              {propertyTitle && (
                <p className="text-sm text-text-secondary mt-1">
                  {propertyTitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Calendar */}
            <div className="bg-bg-secondary rounded-xl p-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-text-secondary" />
                </button>
                <h3 className="font-display font-semibold text-text-primary">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-text-tertiary py-2">
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
                      aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                      ${!date ? 'invisible' : ''}
                      ${isDateDisabled(date) ? 'text-text-tertiary cursor-not-allowed opacity-40' : 'hover:bg-bg-tertiary'}
                      ${isDateSelected(date) ? 'bg-primary text-white font-bold' : 'text-text-primary'}
                      ${date && date.toDateString() === today.toDateString() && !isDateSelected(date) ? 'ring-2 ring-primary/50' : ''}
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
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/10 border border-primary/30 rounded-xl p-4"
              >
                <p className="text-sm text-primary font-medium">
                  Selected Date: {selectedDate.toLocaleDateString('en-NG', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </motion.div>
            )}

            {/* Time Slots */}
            <div>
              <h4 className="font-display font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Select Time
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`
                      py-2 px-3 rounded-lg text-sm font-medium transition-all
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
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Please call me 30 minutes before arrival..."
                className="w-full px-4 py-3 bg-bg-secondary border border-border-color rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary resize-none"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime || isLoading}
              className={`
                w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                ${selectedDate && selectedTime && !isLoading
                  ? 'bg-gradient-gold hover:opacity-90 text-black gold-glow'
                  : 'bg-bg-tertiary text-text-tertiary cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Schedule Inspection
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}




