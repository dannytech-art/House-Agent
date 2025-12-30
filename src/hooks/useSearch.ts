import { useState, useCallback, useEffect } from 'react';
import { Property, PropertyType } from '../types';
import { mockProperties } from '../utils/mockData';
export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: PropertyType | 'all';
  location?: string;
  amenities?: string[];
}
export function useSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    propertyType: 'all'
  });
  const [results, setResults] = useState<Property[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from local storage
  useEffect(() => {
    const saved = localStorage.getItem('vilanow_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);
  const parseQuery = (input: string): Partial<SearchFilters> => {
    const parsed: Partial<SearchFilters> = {};
    const lowerInput = input.toLowerCase();

    // Mock natural language parsing
    if (lowerInput.includes('bedroom') || lowerInput.includes('bed')) {
      const match = lowerInput.match(/(\d+)\s*(?:bedroom|bed)/);
      if (match) parsed.bedrooms = parseInt(match[1]);
    }
    if (lowerInput.includes('apartment')) parsed.propertyType = 'apartment';
    if (lowerInput.includes('house')) parsed.propertyType = 'house';
    if (lowerInput.includes('duplex')) parsed.propertyType = 'duplex';
    if (lowerInput.includes('land')) parsed.propertyType = 'land';
    if (lowerInput.includes('lekki')) parsed.location = 'Lekki';
    if (lowerInput.includes('ikate')) parsed.location = 'Ikate';
    if (lowerInput.includes('ajah')) parsed.location = 'Ajah';
    return parsed;
  };
  const search = useCallback(async (searchQuery: string, activeFilters: SearchFilters = filters) => {
    setIsSearching(true);
    setQuery(searchQuery);

    // Save to history
    if (searchQuery.trim()) {
      setRecentSearches(prev => {
        const newHistory = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5);
        localStorage.setItem('vilanow_recent_searches', JSON.stringify(newHistory));
        return newHistory;
      });
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const parsedQuery = parseQuery(searchQuery);
    const effectiveFilters = {
      ...activeFilters,
      ...parsedQuery
    };
    const filtered = mockProperties.filter(property => {
      // Text match
      if (searchQuery && !property.title.toLowerCase().includes(searchQuery.toLowerCase()) && !property.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Filter matches
      if (effectiveFilters.propertyType !== 'all' && effectiveFilters.propertyType && property.type !== effectiveFilters.propertyType) return false;
      if (effectiveFilters.minPrice && property.price < effectiveFilters.minPrice) return false;
      if (effectiveFilters.maxPrice && property.price > effectiveFilters.maxPrice) return false;
      if (effectiveFilters.bedrooms && (property.bedrooms || 0) < effectiveFilters.bedrooms) return false;
      if (effectiveFilters.location && !property.location.toLowerCase().includes(effectiveFilters.location.toLowerCase())) return false;
      return true;
    });
    setResults(filtered);
    setIsSearching(false);
  }, [filters]);
  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('vilanow_recent_searches');
  };
  return {
    query,
    filters,
    results,
    isSearching,
    recentSearches,
    setFilters,
    search,
    clearHistory
  };
}