import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Eye, Plus, Loader2, Home, RefreshCw, Users, MessageCircle, ChevronDown, ChevronUp, Calendar, Clock, Check, X as XIcon } from 'lucide-react';
import { Property } from '../types';
import { EditListingModal } from '../components/EditListingModal';
import { ListingAnalytics } from '../components/ListingAnalytics';
import apiClient from '../lib/api-client';

interface MyListingsPageProps {
  onNavigate?: (page: string) => void;
}

interface Inspection {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  agentNotes?: string;
}

interface InterestedSeeker {
  id: string;
  seekerId: string;
  seekerName: string;
  seekerAvatar: string;
  seekerPhone?: string;
  seekerEmail?: string;
  message: string;
  seriousnessScore: number;
  status: string;
  createdAt: string;
  unlocked: boolean;
  chatSessionId?: string;
  inspection?: Inspection;
}

export function MyListingsPage({ onNavigate }: MyListingsPageProps) {
  const [listings, setListings] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [expandedListing, setExpandedListing] = useState<string | null>(null);
  const [interestedSeekers, setInterestedSeekers] = useState<Record<string, InterestedSeeker[]>>({});
  const [loadingSeekers, setLoadingSeekers] = useState<string | null>(null);

  // Fetch listings from API
  const fetchListings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.getMyListings();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load your listings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch interested seekers for a property using the new endpoint
  const fetchInterestedSeekers = async (propertyId: string) => {
    if (interestedSeekers[propertyId]) {
      return; // Already fetched
    }
    
    setLoadingSeekers(propertyId);
    try {
      // Use the new property-specific seekers endpoint
      const response = await apiClient.getPropertySeekers(propertyId);
      const seekersData = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
      
      // Transform to InterestedSeeker format with inspection data
      const transformedSeekers: InterestedSeeker[] = seekersData.map((interest: any) => ({
        id: interest.id,
        seekerId: interest.seeker?.id || interest.seekerId,
        seekerName: interest.seeker?.name || interest.seekerName || 'Anonymous Seeker',
        seekerAvatar: interest.seeker?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${interest.seeker?.id || interest.seekerId}&backgroundColor=D4AF37`,
        seekerPhone: interest.seeker?.phone || interest.seekerPhone,
        seekerEmail: interest.seeker?.email || interest.seekerEmail,
        message: interest.message || 'Interested in this property',
        seriousnessScore: interest.seriousnessScore || 50,
        status: interest.status || 'pending',
        createdAt: interest.createdAt || new Date().toISOString(),
        unlocked: interest.unlocked || false,
        chatSessionId: interest.chatSessionId,
        inspection: interest.inspection ? {
          id: interest.inspection.id,
          scheduledDate: interest.inspection.scheduledDate,
          scheduledTime: interest.inspection.scheduledTime,
          status: interest.inspection.status,
          notes: interest.inspection.notes,
          agentNotes: interest.inspection.agentNotes
        } : undefined
      }));
      
      setInterestedSeekers(prev => ({
        ...prev,
        [propertyId]: transformedSeekers
      }));
    } catch (err) {
      console.error('Error fetching interested seekers:', err);
      // Fallback to old endpoint
      try {
        const interests = await apiClient.getInterests({ propertyId });
        const seekersData = Array.isArray(interests) ? interests : [];
        
        const transformedSeekers: InterestedSeeker[] = seekersData.map((interest: any) => ({
          id: interest.id,
          seekerId: interest.seekerId,
          seekerName: interest.seekerName || 'Anonymous Seeker',
          seekerAvatar: interest.seekerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${interest.seekerId}&backgroundColor=D4AF37`,
          seekerPhone: interest.seekerPhone,
          seekerEmail: interest.seekerEmail,
          message: interest.message || 'Interested in this property',
          seriousnessScore: interest.seriousnessScore || 50,
          status: interest.status || 'pending',
          createdAt: interest.createdAt || new Date().toISOString(),
          unlocked: interest.unlocked || false
        }));
        
        setInterestedSeekers(prev => ({
          ...prev,
          [propertyId]: transformedSeekers
        }));
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setLoadingSeekers(null);
    }
  };

  // Toggle expanded listing
  const toggleExpanded = async (propertyId: string) => {
    if (expandedListing === propertyId) {
      setExpandedListing(null);
    } else {
      setExpandedListing(propertyId);
      await fetchInterestedSeekers(propertyId);
    }
  };

  // Initiate chat with seeker
  const handleInitiateChat = async (seeker: InterestedSeeker) => {
    try {
      // Create a chat session with the seeker
      await apiClient.createChatSession(seeker.seekerId, undefined, `Hi ${seeker.seekerName}, I noticed you're interested in my property. How can I help you?`);
      
      // Navigate to chats page
      onNavigate?.('chats');
    } catch (err) {
      console.error('Error initiating chat:', err);
      alert('Failed to start chat. Please try again.');
    }
  };

  // Unlock seeker contact
  const handleUnlockSeeker = async (interestId: string, propertyId: string) => {
    try {
      await apiClient.unlockInterest(interestId);
      
      // Update local state
      setInterestedSeekers(prev => ({
        ...prev,
        [propertyId]: prev[propertyId]?.map(s => 
          s.id === interestId ? { ...s, unlocked: true } : s
        ) || []
      }));
    } catch (err) {
      console.error('Error unlocking seeker:', err);
      alert('Failed to unlock contact. Please try again.');
    }
  };

  // Confirm inspection
  const handleConfirmInspection = async (inspectionId: string, propertyId: string) => {
    try {
      await apiClient.updateInspection(inspectionId, { status: 'confirmed' });
      
      // Update local state
      setInterestedSeekers(prev => ({
        ...prev,
        [propertyId]: prev[propertyId]?.map(s => 
          s.inspection?.id === inspectionId 
            ? { ...s, inspection: { ...s.inspection!, status: 'confirmed' as const } }
            : s
        ) || []
      }));
    } catch (err) {
      console.error('Error confirming inspection:', err);
      alert('Failed to confirm inspection. Please try again.');
    }
  };

  // Format inspection date
  const formatInspectionDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-NG', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-success/20 text-success';
      case 'pending': return 'bg-warning/20 text-warning';
      case 'completed': return 'bg-primary/20 text-primary';
      case 'cancelled': return 'bg-danger/20 text-danger';
      case 'rescheduled': return 'bg-info/20 text-info';
      default: return 'bg-bg-tertiary text-text-secondary';
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    
    setIsDeleting(id);
    try {
      await apiClient.deleteProperty(id);
      setListings(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Failed to delete listing. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSave = async (updatedProperty: Property) => {
    try {
      await apiClient.updateProperty(updatedProperty.id, updatedProperty);
      setListings(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
      setEditingProperty(null);
    } catch (err) {
      console.error('Error updating listing:', err);
      alert('Failed to update listing. Please try again.');
    }
  };

  const getSeriousnessColor = (score: number) => {
    if (score >= 80) return 'text-success bg-success/10';
    if (score >= 50) return 'text-warning bg-warning/10';
    return 'text-text-tertiary bg-bg-tertiary';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary pb-24">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
                My Listings
              </h1>
              <p className="text-text-secondary">Manage your active properties</p>
            </div>
          </div>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-text-secondary">Loading your listings...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-bg-secondary pb-24">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
                My Listings
              </h1>
              <p className="text-text-secondary">Manage your active properties</p>
            </div>
          </div>
          <div className="text-center py-20">
            <p className="text-danger mb-4">{error}</p>
            <button
              onClick={fetchListings}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary pb-24">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
              My Listings
            </h1>
            <p className="text-text-secondary">
              {listings.length} active {listings.length === 1 ? 'property' : 'properties'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchListings}
              className="p-3 bg-bg-primary border border-border-color rounded-xl hover:border-primary/50 transition-colors"
              title="Refresh listings"
            >
              <RefreshCw className="w-5 h-5 text-text-secondary" />
            </button>
            <button
              onClick={() => onNavigate?.('add-listing')}
              className="px-6 py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center gap-2 gold-glow"
            >
              <Plus className="w-5 h-5" />
              Add New Listing
            </button>
          </div>
        </div>

        {/* Empty state */}
        {listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-primary border border-border-color rounded-2xl p-12 text-center"
          >
            <Home className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-text-primary mb-2">
              No Listings Yet
            </h2>
            <p className="text-text-secondary mb-6">
              You haven't added any property listings. Start by creating your first listing!
            </p>
            <button
              onClick={() => onNavigate?.('add-listing')}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors"
            >
              Add Your First Listing
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {listings.map((property, index) => {
              const seekers = interestedSeekers[property.id] || [];
              const isExpanded = expandedListing === property.id;
              
              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-bg-primary border border-border-color rounded-2xl overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-64 h-48 md:h-auto relative">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-bg-tertiary flex items-center justify-center">
                          <Home className="w-12 h-12 text-text-tertiary" />
                        </div>
                      )}
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
                          <button
                            onClick={() => toggleExpanded(property.id)}
                            className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                              isExpanded
                                ? 'bg-primary/20 text-primary'
                                : 'hover:bg-bg-tertiary text-text-tertiary'
                            }`}
                            title="View Interested Seekers"
                          >
                            <Users className="w-5 h-5" />
                            <span className="text-xs font-semibold">
                              {seekers.length || '?'}
                            </span>
                          </button>
                          <button
                            onClick={() => setShowAnalytics(showAnalytics === property.id ? null : property.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              showAnalytics === property.id
                                ? 'bg-primary/20 text-primary'
                                : 'hover:bg-bg-tertiary text-text-tertiary'
                            }`}
                            title="View Analytics"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingProperty(property)}
                            className="p-2 hover:bg-bg-tertiary text-text-tertiary rounded-lg transition-colors"
                            title="Edit Listing"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            disabled={isDeleting === property.id}
                            className="p-2 hover:bg-danger/10 text-text-tertiary hover:text-danger rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Listing"
                          >
                            {isDeleting === property.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-text-secondary mb-4">
                        <span>₦{property.price?.toLocaleString() || 'N/A'}</span>
                        {property.bedrooms && <span>{property.bedrooms} Beds</span>}
                        {property.bathrooms && <span>{property.bathrooms} Baths</span>}
                        <span className="capitalize">{property.type}</span>
                      </div>

                      {property.description && (
                        <p className="text-sm text-text-tertiary line-clamp-2 mb-4">
                          {property.description}
                        </p>
                      )}

                      {/* Toggle button for interested seekers */}
                      <button
                        onClick={() => toggleExpanded(property.id)}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Hide interested seekers
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Show interested seekers
                          </>
                        )}
                      </button>

                      {showAnalytics === property.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="border-t border-border-color pt-4 mt-4">
                            <ListingAnalytics views={1250} clicks={450} inquiries={seekers.length || 12} />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Interested Seekers Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border-color"
                      >
                        <div className="p-6 bg-bg-secondary">
                          <h4 className="font-display text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Interested Seekers ({seekers.length})
                          </h4>

                          {loadingSeekers === property.id ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="w-6 h-6 text-primary animate-spin" />
                              <span className="ml-2 text-text-secondary">Loading seekers...</span>
                            </div>
                          ) : seekers.length === 0 ? (
                            <div className="text-center py-8">
                              <Users className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                              <p className="text-text-secondary">No seekers have expressed interest yet</p>
                            </div>
                          ) : (
                            <div className="grid gap-4">
                              {seekers.map((seeker) => (
                                <motion.div
                                  key={seeker.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="p-4 bg-bg-primary rounded-xl border border-border-color"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <img
                                        src={seeker.seekerAvatar}
                                        alt={seeker.seekerName}
                                        className="w-12 h-12 rounded-full border-2 border-primary/30"
                                      />
                                      <div>
                                        <h5 className="font-semibold text-text-primary">
                                          {seeker.seekerName}
                                        </h5>
                                        <p className="text-sm text-text-secondary line-clamp-1">
                                          {seeker.message}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1">
                                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeriousnessColor(seeker.seriousnessScore)}`}>
                                            {seeker.seriousnessScore}% Serious
                                          </span>
                                          <span className="text-xs text-text-tertiary">
                                            {new Date(seeker.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {seeker.unlocked ? (
                                        <button
                                          onClick={() => handleInitiateChat(seeker)}
                                          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                        >
                                          <MessageCircle className="w-4 h-4" />
                                          Chat
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleUnlockSeeker(seeker.id, property.id)}
                                          className="px-4 py-2 bg-gradient-gold hover:opacity-90 text-black rounded-lg font-medium transition-colors flex items-center gap-2 gold-glow"
                                        >
                                          Unlock (5 credits)
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Inspection Details */}
                                  {seeker.inspection && (
                                    <div className="mt-4 pt-4 border-t border-border-color">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                          <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span className="text-text-primary font-medium">
                                              {formatInspectionDate(seeker.inspection.scheduledDate)}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span className="text-text-primary font-medium">
                                              {seeker.inspection.scheduledTime}
                                            </span>
                                          </div>
                                          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusColor(seeker.inspection.status)}`}>
                                            {seeker.inspection.status}
                                          </span>
                                        </div>
                                        
                                        {seeker.inspection.status === 'pending' && (
                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={() => handleConfirmInspection(seeker.inspection!.id, property.id)}
                                              className="px-3 py-1.5 bg-success/20 hover:bg-success/30 text-success rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                            >
                                              <Check className="w-4 h-4" />
                                              Confirm
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {seeker.inspection.notes && (
                                        <p className="mt-2 text-sm text-text-secondary italic">
                                          "{seeker.inspection.notes}"
                                        </p>
                                      )}
                                    </div>
                                  )}

                                  {/* No inspection scheduled */}
                                  {!seeker.inspection && seeker.unlocked && (
                                    <div className="mt-4 pt-4 border-t border-border-color">
                                      <p className="text-sm text-text-tertiary flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        No inspection scheduled yet
                                      </p>
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {editingProperty && (
        <EditListingModal
          isOpen={!!editingProperty}
          onClose={() => setEditingProperty(null)}
          property={editingProperty}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
