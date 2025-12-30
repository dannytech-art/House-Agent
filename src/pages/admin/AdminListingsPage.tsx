import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, CheckCircle, XCircle, Eye, Flag, X, MapPin, Home, Bed, Bath, Star, Calendar, User, AlertCircle, Star as StarIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { mockProperties } from '../../utils/mockData';
import { Property } from '../../types';

interface ListingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Property | null;
  onAction: (action: string, listingId: string) => void;
}

function ListingDetailModal({ isOpen, onClose, listing, onAction }: ListingDetailModalProps) {
  if (!listing || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-bg-secondary rounded-2xl border-2 border-primary/30 max-w-4xl w-full p-6 gold-glow max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-text-primary mb-1">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-text-tertiary flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {listing.location}
                  </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              {/* Images */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {listing.images.slice(0, 4).map((img, idx) => (
                  <img key={idx} src={img} alt={`${listing.title} ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-text-tertiary uppercase mb-2 block">Property Details</label>
                    <div className="bg-bg-tertiary rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Price</span>
                        <span className="text-lg font-bold text-primary">₦{listing.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary flex items-center gap-1">
                          <Home className="w-4 h-4" />
                          Type
                        </span>
                        <span className="text-sm font-medium text-text-primary capitalize">{listing.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          Bedrooms
                        </span>
                        <span className="text-sm font-medium text-text-primary">{listing.bedrooms}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          Bathrooms
                        </span>
                        <span className="text-sm font-medium text-text-primary">{listing.bathrooms}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Posted
                        </span>
                        <span className="text-sm font-medium text-text-primary">
                          {new Date(listing.postedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {listing.aiPriceAnalysis && (
                    <div>
                      <label className="text-xs font-semibold text-text-tertiary uppercase mb-2 block">AI Price Analysis</label>
                      <div className="bg-bg-tertiary rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-text-secondary">Market Analysis</span>
                          <span className={`text-sm font-medium ${listing.aiPriceAnalysis.label === 'fair' || listing.aiPriceAnalysis.label === 'great-deal' || listing.aiPriceAnalysis.label === 'below-market' ? 'text-success' : 'text-warning'}`}>
                            {listing.aiPriceAnalysis.label.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">Market Average</span>
                          <span className="text-sm font-medium text-text-primary">₦{listing.aiPriceAnalysis.marketAverage.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">Difference</span>
                          <span className={`text-sm font-medium flex items-center gap-1 ${listing.aiPriceAnalysis.difference > 0 ? 'text-danger' : 'text-success'}`}>
                            {listing.aiPriceAnalysis.difference > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(listing.aiPriceAnalysis.difference).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-text-tertiary uppercase mb-2 block">Agent Information</label>
                    <div className="bg-bg-tertiary rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{listing.agentName}</p>
                          <p className="text-xs text-text-tertiary capitalize">{listing.agentType} agent</p>
                        </div>
                        {listing.agentVerified && (
                          <span className="ml-auto px-2 py-1 bg-success/20 text-success text-xs rounded-full flex items-center gap-1">
                            <StarIcon className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-tertiary uppercase mb-2 block">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {listing.amenities.map((amenity, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {listing.isDuplicate && (
                    <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-warning mb-1">Potential Duplicate</p>
                          <p className="text-xs text-text-secondary">This listing may be a duplicate of another property.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {listing.description && (
                <div className="mb-6">
                  <label className="text-xs font-semibold text-text-tertiary uppercase mb-2 block">Description</label>
                  <p className="text-sm text-text-secondary bg-bg-tertiary rounded-xl p-4">{listing.description}</p>
                </div>
              )}

              <div className="border-t border-border-color pt-4 flex gap-3">
                {listing.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        onAction('approve', listing.id);
                        onClose();
                      }}
                      className="flex-1 px-4 py-2 bg-success/20 hover:bg-success/30 text-success rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        onAction('reject', listing.id);
                        onClose();
                      }}
                      className="flex-1 px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    onAction('feature', listing.id);
                  }}
                  className={`px-4 py-2 ${listing.featured ? 'bg-primary/30' : 'bg-primary/20 hover:bg-primary/30'} text-primary rounded-lg font-medium transition-colors flex items-center gap-2`}
                >
                  <Star className="w-4 h-4" />
                  {listing.featured ? 'Unfeature' : 'Feature'}
                </button>
                <button
                  onClick={() => {
                    onAction('flag', listing.id);
                  }}
                  className="px-4 py-2 bg-warning/20 hover:bg-warning/30 text-warning rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Flag
                </button>
                <button
                  onClick={() => {
                    onAction('delete', listing.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function AdminListingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'pending' | 'sold'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<Property | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredListings = mockProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.agentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    const matchesLocation = locationFilter === 'all' || property.area === locationFilter;
    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const uniqueLocations = Array.from(new Set(mockProperties.map(p => p.area)));
  const uniqueTypes = Array.from(new Set(mockProperties.map(p => p.type)));

  const handleViewListing = (listing: Property) => {
    setSelectedListing(listing);
    setIsDetailModalOpen(true);
  };

  const handleListingAction = (action: string, listingId: string) => {
    alert(`${action} action performed on listing ${listingId}`);
    // In a real app, this would call an API
  };

  const stats = [
    { label: 'Total Listings', value: mockProperties.length, color: 'text-primary' },
    { label: 'Available', value: mockProperties.filter(p => p.status === 'available').length, color: 'text-success' },
    { label: 'Pending Review', value: mockProperties.filter(p => p.status === 'pending').length, color: 'text-warning' },
    { label: 'Sold', value: mockProperties.filter(p => p.status === 'sold').length, color: 'text-text-tertiary' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-bg-secondary border border-border-color rounded-xl p-4"
          >
            <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div className="text-xs text-text-tertiary">
            Showing {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 gap-4">
        {paginatedListings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-bg-secondary border border-border-color rounded-xl p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex gap-4">
              <img src={listing.images[0]} alt={listing.title} className="w-32 h-32 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-text-primary">{listing.title}</h3>
                      {listing.featured && (
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">Featured</span>
                      )}
                      {listing.isDuplicate && (
                        <span className="px-2 py-0.5 bg-warning/20 text-warning text-xs rounded-full">Duplicate</span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary">
                      ₦{listing.price.toLocaleString()} • {listing.location}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      listing.status === 'available'
                        ? 'bg-success/20 text-success'
                        : listing.status === 'pending'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-text-tertiary/20 text-text-tertiary'
                    }`}
                  >
                    {listing.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-tertiary mb-3">
                  <span className="flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    {listing.bedrooms}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3 h-3" />
                    {listing.bathrooms}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {listing.agentName}
                  </span>
                  <span>•</span>
                  <span>{new Date(listing.postedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleViewListing(listing)}
                    className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {listing.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleListingAction('approve', listing.id)}
                        className="px-3 py-1.5 bg-success/20 hover:bg-success/30 text-success text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleListingAction('reject', listing.id)}
                        className="px-3 py-1.5 bg-danger/20 hover:bg-danger/30 text-danger text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredListings.length)} of {filteredListings.length} listings
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-bg-tertiary hover:bg-bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-text-primary rounded-lg text-sm transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-bg-tertiary hover:bg-bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-text-primary rounded-lg text-sm transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ListingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedListing(null);
        }}
        listing={selectedListing}
        onAction={handleListingAction}
      />
    </div>
  );
}