import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter, Map, Search } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { FilterModal } from '../components/FilterModal';
import { Property } from '../types';
import { useSearch } from '../hooks/useSearch';
interface SearchResultsPageProps {
  properties: Property[]; // Initial properties passed from App
  onBack: () => void;
  onPropertyClick: (property: Property) => void;
  onSaveProperty: (property: Property) => void;
}
export function SearchResultsPage({
  properties: initialProperties,
  onBack,
  onPropertyClick,
  onSaveProperty
}: SearchResultsPageProps) {
  const {
    results,
    isSearching,
    search,
    filters,
    setFilters
  } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  // Initial search on mount if properties provided
  useEffect(() => {
    if (initialProperties.length > 0 && results.length === 0) {
      search(''); // Load all or use passed props
    }
  }, []);
  // Use results from hook if available, otherwise fallback to props
  const displayProperties = results.length > 0 || isSearching ? results : initialProperties;
  return <div className="min-h-screen bg-bg-secondary pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-bg-secondary/95 backdrop-blur-sm border-b border-border-color px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-bg-tertiary rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input type="text" placeholder="Search location, type..." className="w-full pl-9 pr-4 py-2 bg-bg-tertiary border border-border-color rounded-full text-sm text-text-primary focus:outline-none focus:border-primary" onKeyDown={e => e.key === 'Enter' && search(e.currentTarget.value)} />
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <button className="p-2 hover:bg-bg-tertiary rounded-full transition-colors">
              <Map className="w-5 h-5 text-text-primary" />
            </button>
            <button onClick={() => setShowFilters(true)} className="p-2 hover:bg-bg-tertiary rounded-full transition-colors relative">
              <Filter className="w-5 h-5 text-text-primary" />
              {Object.keys(filters).length > 1 && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />}
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="max-w-7xl mx-auto mt-2 px-1">
          <p className="text-xs text-text-tertiary">
            {isSearching ? 'Searching...' : `${displayProperties.length} properties found`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isSearching ? <LoadingSkeleton variant="card" count={6} /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProperties.length > 0 ? displayProperties.map((property, index) => <motion.div key={property.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} className="h-[450px] relative">
                  <PropertyCard property={property} onSwipeLeft={() => {}} onSwipeRight={() => onSaveProperty(property)} onSwipeUp={() => onPropertyClick(property)} onTap={() => onPropertyClick(property)} style={{
            position: 'relative'
          }} />
                </motion.div>) : <div className="col-span-full text-center py-20">
                <p className="text-text-secondary">
                  No properties found matching your criteria.
                </p>
                <button onClick={() => {
            setFilters({
              propertyType: 'all'
            });
            search('');
          }} className="mt-4 text-primary hover:underline">
                  Clear Filters
                </button>
              </div>}
          </div>}
      </div>

      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} filters={filters} onApply={newFilters => {
      setFilters(newFilters);
      search('', newFilters);
    }} />
    </div>;
}