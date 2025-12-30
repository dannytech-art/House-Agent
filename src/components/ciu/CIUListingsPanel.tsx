import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Tag,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Eye,
  Star,
  Pause,
  Play,
  Flag,
  DollarSign,
  MapPin,
} from 'lucide-react';
import { mockProperties } from '../../utils/mockData';
import { generateListingIntelligence } from '../../utils/mockCIUData';
import { ListingIntelligence } from '../../utils/mockCIUData';

export function CIUListingsPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'heatmap'>('table');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const listings = generateListingIntelligence(mockProperties);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || listing.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(listings.flatMap((l) => l.tags)));

  const handleAction = (action: string, listingId: string) => {
    alert(`${action} action performed on listing ${listingId}`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary text-black'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'heatmap'
                  ? 'bg-primary text-black'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              }`}
            >
              Heatmap
            </button>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      {viewMode === 'table' && (
        <div className="bg-bg-secondary border border-border-color rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-tertiary border-b border-border-color">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Listing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Interests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Tags</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-bg-primary transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-text-primary text-sm">{listing.title}</p>
                          <p className="text-xs text-text-tertiary">{listing.agentName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{listing.location}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary">₦{listing.price.toLocaleString()}</span>
                        {listing.statusFlags.overpriced && (
                          <span className="px-2 py-0.5 bg-danger/20 text-danger text-xs rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            High
                          </span>
                        )}
                        {listing.statusFlags.underpriced && (
                          <span className="px-2 py-0.5 bg-success/20 text-success text-xs rounded-full flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-text-tertiary" />
                        {listing.listingAge}d
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          listing.interestCount > 10
                            ? 'bg-success/20 text-success'
                            : listing.interestCount > 5
                            ? 'bg-warning/20 text-warning'
                            : 'bg-text-tertiary/20 text-text-tertiary'
                        }`}
                      >
                        {listing.interestCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {listing.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              tag === 'overpriced'
                                ? 'bg-danger/20 text-danger'
                                : tag === 'underpriced'
                                ? 'bg-success/20 text-success'
                                : tag === 'high-interest'
                                ? 'bg-primary/20 text-primary'
                                : 'bg-warning/20 text-warning'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction('flag', listing.id)}
                          className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                          title="Flag"
                        >
                          <Flag className="w-4 h-4 text-text-secondary" />
                        </button>
                        <button
                          onClick={() => handleAction('promote', listing.id)}
                          className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                          title="Promote"
                        >
                          <Star className="w-4 h-4 text-text-secondary" />
                        </button>
                        <button
                          onClick={() => handleAction('freeze', listing.id)}
                          className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                          title="Freeze/Unfreeze"
                        >
                          <Pause className="w-4 h-4 text-text-secondary" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Heatmap View */}
      {viewMode === 'heatmap' && (
        <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
          <p className="text-text-secondary text-sm mb-4">Heatmap view coming soon...</p>
          <div className="grid grid-cols-4 gap-4">
            {listings.slice(0, 12).map((listing) => (
              <div
                key={listing.id}
                className={`p-4 rounded-lg border-2 ${
                  listing.interestCount > 10
                    ? 'bg-success/20 border-success/50'
                    : listing.interestCount > 5
                    ? 'bg-warning/20 border-warning/50'
                    : 'bg-bg-tertiary border-border-color'
                }`}
              >
                <p className="text-sm font-medium text-text-primary mb-1 truncate">{listing.title}</p>
                <p className="text-xs text-text-tertiary">{listing.interestCount} interests</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

